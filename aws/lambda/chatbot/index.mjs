/**
 * Chatbot Lambda — sits behind the API Gateway WebSocket API `chatBot`.
 *
 * Routes: $connect, $disconnect and $default, all pointing here. Questions
 * travel on $default: the client sends no `action`, so the route selection
 * expression ($request.body.action) finds no match and falls through to it.
 * `sendMessage` is still answered, for clients built before that change.
 *
 * $connect is the only authenticated step: the client opens
 *   wss://api.tobias.feliz.web.ufersa.dev.br?token=<Cognito access token>
 * (a browser WebSocket cannot set headers) and a token that fails
 * verifyAccessToken() is answered 401, which makes API Gateway refuse the
 * connection. Every later message rides the connection that passed it.
 *
 * Client → server:
 *   { "message": "...", "history": [{ "role": "user" | "model", "text": "..." }] }
 * Server → client, one socket message each:
 *   { "type": "start" } · { "type": "chunk", "message": "..." } · { "type": "end" }
 *   { "type": "error", "message": "..." }
 *
 * Environment variables (Lambda → Configuration → Environment variables):
 *   GEMINI_API_KEY        — from https://aistudio.google.com/apikey. Never in the front end.
 *   GEMINI_MODEL          — optional, defaults to gemini-3.5-flash-lite. Measured on
 *                           2026-10-19: ~0.9 s to the first token, steady; 3.8-flash
 *                           ranged from 2 s to 47 s under load. (2.5-flash is closed
 *                           to new projects and answers 404.)
 *   COGNITO_USER_POOL_ID  — same value as the front end's VITE_COGNITO_USER_POOL_ID.
 *   COGNITO_CLIENT_ID     — same value as the front end's VITE_COGNITO_CLIENT_ID.
 *
 * Runtime: Node.js 22.x · Role: LabRole · Timeout: 60 s.
 * Deploy: paste this file as index.mjs in the console editor and click Deploy.
 */
import { createPublicKey, verify } from "node:crypto";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`;

const REGION = process.env.AWS_REGION ?? "us-east-1";
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const ISSUER = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;

const HISTORY_LIMIT = 20;
const MAX_MESSAGE_LENGTH = 2000;

// The widget renders plain text, so markdown would show up as raw asterisks.
const SYSTEM_PROMPT = `Você é o assistente do AltoTech Manager, um sistema de gestão para empresas juniores
(metas anuais, funil comercial, projetos, lançamento de horas, fluxo de caixa e relatórios).
Responda sempre em português do Brasil, de forma curta e objetiva.
Escreva em texto simples: não use markdown, asteriscos, cerquilhas nem tabelas.
Para listas, use linhas começando com "- ".
Se não souber algo sobre os dados do usuário, diga que não tem acesso a eles.`;

/* Cognito token check ---------------------------------------------------- */

/**
 * The User Pool's public signing keys, by `kid`. Fetched once per warm
 * container: Cognito rotates them rarely, and a `kid` we have not seen yet
 * triggers one refetch before the token is rejected.
 */
let jwksCache = null;

const loadSigningKeys = async (force = false) => {
  if (jwksCache && !force) return jwksCache;
  const res = await fetch(`${ISSUER}/.well-known/jwks.json`);
  if (!res.ok) throw new Error(`JWKS ${res.status}`);
  const { keys } = await res.json();
  jwksCache = new Map(
    keys.map((jwk) => [jwk.kid, createPublicKey({ key: jwk, format: "jwk" })]),
  );
  return jwksCache;
};

const decodePart = (part) =>
  JSON.parse(Buffer.from(part, "base64url").toString("utf8"));

/**
 * Returns the token's claims when it is a live access token issued by our User
 * Pool to our app client — and throws, saying why, on anything else.
 */
const verifyAccessToken = async (token) => {
  const parts = String(token ?? "").split(".");
  if (parts.length !== 3) throw new Error("malformed token");
  const [headerPart, payloadPart, signaturePart] = parts;

  const header = decodePart(headerPart);
  if (header.alg !== "RS256") throw new Error(`unexpected alg ${header.alg}`);

  let key = (await loadSigningKeys()).get(header.kid);
  if (!key) key = (await loadSigningKeys(true)).get(header.kid);
  if (!key) throw new Error("unknown signing key");

  const signed = Buffer.from(`${headerPart}.${payloadPart}`);
  const signature = Buffer.from(signaturePart, "base64url");
  if (!verify("RSA-SHA256", signed, key, signature)) {
    throw new Error("bad signature");
  }

  const claims = decodePart(payloadPart);
  if (claims.iss !== ISSUER) throw new Error("wrong issuer");
  if (claims.token_use !== "access") throw new Error("not an access token");
  if (claims.client_id !== CLIENT_ID) throw new Error("wrong app client");
  if (claims.exp * 1000 <= Date.now()) throw new Error("expired");
  return claims;
};

/* Handler ---------------------------------------------------------------- */

export const handler = async (event) => {
  const { routeKey, connectionId, apiId, stage } = event.requestContext;

  if (routeKey === "$connect") {
    try {
      const claims = await verifyAccessToken(event.queryStringParameters?.token);
      console.log("connect ok", { connectionId, sub: claims.sub });
      return { statusCode: 200 };
    } catch (err) {
      console.warn("connect refused", { connectionId, reason: err.message });
      return { statusCode: 401 };
    }
  }

  if (routeKey === "$disconnect") {
    return { statusCode: 200 };
  }

  // Built from the API id, not requestContext.domainName: through the custom
  // domain that name is api.tobias.feliz…, where /{stage}/@connections does not
  // exist (the mapping has an empty path), and every reply would fail.
  const client = new ApiGatewayManagementApiClient({
    endpoint: `https://${apiId}.execute-api.${REGION}.amazonaws.com/${stage}`,
  });
  const send = (data) =>
    client.send(
      new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: JSON.stringify(data),
      }),
    );

  if (routeKey !== "$default" && routeKey !== "sendMessage") {
    await send({ type: "error", message: `Rota desconhecida: ${routeKey}` });
    return { statusCode: 200 };
  }

  let body;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    await send({ type: "error", message: "Mensagem inválida." });
    return { statusCode: 200 };
  }

  const message = String(body.message ?? "").trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!message) {
    await send({ type: "error", message: "Mensagem vazia." });
    return { statusCode: 200 };
  }

  const history = Array.isArray(body.history) ? body.history : [];
  const contents = [
    ...history
      .filter((m) => (m.role === "user" || m.role === "model") && m.text)
      .slice(-HISTORY_LIMIT)
      .map((m) => ({
        role: m.role,
        parts: [{ text: String(m.text).slice(0, MAX_MESSAGE_LENGTH) }],
      })),
    { role: "user", parts: [{ text: message }] },
  ];

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          // Thinking tokens count against this limit too: at the default level
          // a one-line answer spent ~400 of them, enough to cut longer replies.
          maxOutputTokens: 2048,
          thinkingConfig: { thinkingLevel: "low" },
        },
      }),
    });

    if (!res.ok) {
      console.error("Gemini error", res.status, await res.text());
      // 429 is our quota, 503 is Google overloaded — both pass if retried later.
      const busy = res.status === 429 || res.status === 503;
      await send({
        type: "error",
        message: busy
          ? "O assistente está sobrecarregado. Tente em alguns instantes."
          : "Falha ao consultar o modelo.",
      });
      return { statusCode: 200 };
    }

    await send({ type: "start" });

    // Gemini streams Server-Sent Events: lines of "data: {json}".
    const decoder = new TextDecoder();
    let buffer = "";
    for await (const chunk of res.body) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const json = JSON.parse(line.slice(6));
        const text = json.candidates?.[0]?.content?.parts
          ?.map((p) => p.text ?? "")
          .join("");
        if (text) await send({ type: "chunk", message: text });
      }
    }

    await send({ type: "end" });
    console.log("reply sent", { connectionId, route: routeKey, model: MODEL });
  } catch (err) {
    console.error(err);
    await send({ type: "error", message: "Erro interno no assistente." }).catch(
      () => {},
    );
  }

  return { statusCode: 200 };
};
