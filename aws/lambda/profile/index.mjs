/**
 * Profile Lambda — sits behind the HTTP API route /profile.
 *
 * Routes (both protected by the API's Cognito JWT authorizer, so every request
 * that reaches this code already carries a verified access token):
 *   GET /profile  → the signed-in user's profile, photo included as a data URL.
 *   PUT /profile  → updates the profile; an optional new photo goes to S3.
 *
 * PUT body (JSON):
 *   { "name": "...", "email": "...", "phone": "...", "course": "...",
 *     "bio": "...", "photo": "data:image/jpeg;base64,..." | null | undefined }
 *   `photo` undefined keeps the current picture; null removes it.
 *
 * Storage:
 *   DynamoDB table PROFILE_TABLE (partition key `userId`, the Cognito `sub`).
 *   S3 bucket PROFILE_BUCKET, key profiles/<sub>/avatar-<timestamp>.<ext>.
 *
 * The photo comes back as a data URL rather than an S3 link because the site's
 * CSP only allows `img-src 'self' data:` — and the bucket stays private.
 *
 * Environment variables: PROFILE_TABLE, PROFILE_BUCKET.
 * Runtime: Node.js 22.x · Role: LabRole · Timeout: 15 s.
 */
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE = process.env.PROFILE_TABLE;
const BUCKET = process.env.PROFILE_BUCKET;

const s3 = new S3Client({});
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const PHOTO_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const TEXT_LIMITS = { name: 120, email: 160, phone: 30, course: 120, bio: 600 };

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

class BadRequest extends Error {}

/* Photo helpers ---------------------------------------------------------- */

const parseDataUrl = (value) => {
  const match = /^data:([\w/+.-]+);base64,(.+)$/s.exec(String(value));
  if (!match) throw new BadRequest("A foto precisa ser uma imagem em base64.");
  const [, contentType, data] = match;
  const ext = PHOTO_TYPES[contentType];
  if (!ext) throw new BadRequest("Formato de foto não suportado (use JPEG, PNG ou WebP).");
  const bytes = Buffer.from(data, "base64");
  if (bytes.length === 0) throw new BadRequest("A foto está vazia.");
  if (bytes.length > MAX_PHOTO_BYTES) throw new BadRequest("A foto passa de 2 MB.");
  return { contentType, ext, bytes };
};

const readPhoto = async (key) => {
  if (!key) return null;
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    const bytes = Buffer.from(await res.Body.transformToByteArray());
    return `data:${res.ContentType ?? "image/jpeg"};base64,${bytes.toString("base64")}`;
  } catch (err) {
    console.warn("photo read failed", { key, reason: err.name });
    return null;
  }
};

/* Item helpers ----------------------------------------------------------- */

const toResponse = async (item) =>
  item
    ? {
        userId: item.userId,
        name: item.name ?? "",
        email: item.email ?? "",
        phone: item.phone ?? "",
        course: item.course ?? "",
        bio: item.bio ?? "",
        photoKey: item.photoKey ?? null,
        photo: await readPhoto(item.photoKey),
        updatedAt: item.updatedAt ?? null,
      }
    : null;

const cleanText = (body, field) => {
  const value = body[field];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") throw new BadRequest(`O campo ${field} precisa ser texto.`);
  const trimmed = value.trim();
  if (trimmed.length > TEXT_LIMITS[field]) {
    throw new BadRequest(`O campo ${field} passa de ${TEXT_LIMITS[field]} caracteres.`);
  }
  return trimmed;
};

/* Handlers --------------------------------------------------------------- */

const getProfile = async (userId) => {
  const { Item } = await db.send(new GetCommand({ TableName: TABLE, Key: { userId } }));
  const profile = await toResponse(Item);
  return profile ? json(200, profile) : json(404, { message: "Perfil ainda não cadastrado." });
};

const putProfile = async (userId, claims, rawBody, isBase64Encoded) => {
  let body;
  try {
    const text = isBase64Encoded
      ? Buffer.from(rawBody ?? "", "base64").toString("utf8")
      : rawBody ?? "";
    body = JSON.parse(text || "{}");
  } catch {
    throw new BadRequest("Corpo da requisição não é um JSON válido.");
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new BadRequest("Corpo da requisição precisa ser um objeto JSON.");
  }

  const { Item: current = {} } = await db.send(
    new GetCommand({ TableName: TABLE, Key: { userId } }),
  );

  const name = cleanText(body, "name");
  if (name !== undefined && !name) throw new BadRequest("O nome não pode ficar vazio.");

  let photoKey = current.photoKey ?? null;
  if (body.photo === null) {
    photoKey = null;
  } else if (body.photo !== undefined) {
    const { contentType, ext, bytes } = parseDataUrl(body.photo);
    photoKey = `profiles/${userId}/avatar-${Date.now()}.${ext}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: photoKey,
        Body: bytes,
        ContentType: contentType,
        Metadata: { "user-id": userId },
      }),
    );
  }

  const item = {
    ...current,
    userId,
    username: claims.username ?? current.username,
    name: name ?? current.name,
    email: cleanText(body, "email") ?? current.email,
    phone: cleanText(body, "phone") ?? current.phone,
    course: cleanText(body, "course") ?? current.course,
    bio: cleanText(body, "bio") ?? current.bio,
    photoKey: photoKey ?? undefined,
    createdAt: current.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (!photoKey) delete item.photoKey;

  await db.send(new PutCommand({ TableName: TABLE, Item: item }));

  // The previous picture is no longer referenced by anything.
  if (current.photoKey && current.photoKey !== photoKey) {
    await s3
      .send(new DeleteObjectCommand({ Bucket: BUCKET, Key: current.photoKey }))
      .catch((err) => console.warn("old photo delete failed", err.name));
  }

  return json(200, await toResponse(item));
};

export const handler = async (event) => {
  const claims = event.requestContext?.authorizer?.jwt?.claims ?? {};
  const userId = claims.sub;
  if (!userId) return json(401, { message: "Não autenticado." });

  const method = event.requestContext?.http?.method ?? event.httpMethod;

  try {
    if (method === "GET") return await getProfile(userId);
    if (method === "PUT") {
      return await putProfile(userId, claims, event.body, event.isBase64Encoded);
    }
    return json(405, { message: `Método ${method} não suportado em /profile.` });
  } catch (err) {
    if (err instanceof BadRequest) return json(400, { message: err.message });
    console.error("profile failure", err);
    return json(500, { message: "Erro ao processar o perfil." });
  }
};
