import {
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { env } from "@/config/env";
import { ROUTES } from "@/config/routes";
import type { Session } from "@/domain/types";
import { AuthError } from "./AuthError";
import { getPool, toDomainSession } from "./cognitoAuthService";
import { cognitoStorage } from "./cognitoStorage";

/**
 * "Entrar com Google" — Google as an identity provider federated into the
 * Cognito User Pool, not talked to directly.
 *
 * The Google client secret lives in the User Pool's identity provider
 * settings, on AWS's side: Cognito is the one that exchanges Google's code
 * for Google's tokens. This page only ever sees Cognito's own hosted
 * endpoints, with the same public app client the password sign-in uses, and
 * proves it started the flow with PKCE instead of a secret — so nothing in
 * the bundle needs protecting.
 *
 * The tokens Cognito returns are cached through the SDK exactly as an SRP
 * sign-in would cache them, so `restore`, refresh and `signOut` in
 * `cognitoAuthService` treat both kinds of session the same.
 */
const PENDING_KEY = "altotech:google-sign-in";

interface PendingSignIn {
  state: string;
  verifier: string;
  redirectTo: string;
}

interface TokenResponse {
  id_token: string;
  access_token: string;
  refresh_token: string;
}

function hostedUiUrl(path: string): string {
  const domain = env.cognito.domain
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  if (!domain) {
    throw new AuthError(
      "Login com Google indisponível: cadastre VITE_COGNITO_DOMAIN.",
    );
  }
  return `https://${domain}${path}`;
}

function callbackUrl(): string {
  return `${window.location.origin}${ROUTES.loginCallback}`;
}

function base64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomToken(): string {
  return base64Url(crypto.getRandomValues(new Uint8Array(32)));
}

async function challengeFor(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return base64Url(new Uint8Array(digest));
}

/** Read once and removed: a callback URL replayed later must not find it. */
function takePending(): PendingSignIn | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    sessionStorage.removeItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingSignIn) : null;
  } catch {
    return null;
  }
}

/** Leaves the app for Google's consent screen, by way of Cognito. */
async function startGoogleSignIn(redirectTo: string): Promise<void> {
  const authorizeUrl = hostedUiUrl("/oauth2/authorize");
  const clientId = getPool().getClientId();
  const pending: PendingSignIn = {
    state: randomToken(),
    verifier: randomToken(),
    redirectTo,
  };

  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch {
    throw new AuthError(
      "O navegador bloqueou o armazenamento da página; o login com Google precisa dele.",
    );
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: callbackUrl(),
    identity_provider: "Google",
    scope: "openid email profile",
    state: pending.state,
    code_challenge: await challengeFor(pending.verifier),
    code_challenge_method: "S256",
  });
  window.location.assign(`${authorizeUrl}?${params}`);
}

async function exchangeCode(search: string) {
  const params = new URLSearchParams(search);
  const pending = takePending();

  // Cancelling on Google's screen lands here too, as `error=access_denied`.
  if (params.get("error")) {
    throw new AuthError("O login com Google foi cancelado ou recusado.");
  }

  const code = params.get("code");
  if (!pending || !code || params.get("state") !== pending.state) {
    throw new AuthError(
      "O login com Google expirou ou foi interrompido. Tente de novo.",
    );
  }

  const response = await fetch(hostedUiUrl("/oauth2/token"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: getPool().getClientId(),
      code,
      redirect_uri: callbackUrl(),
      code_verifier: pending.verifier,
    }),
  });
  if (!response.ok) {
    throw new AuthError("Não foi possível concluir o login com Google.");
  }

  const tokens = (await response.json()) as TokenResponse;
  const cognitoSession = new CognitoUserSession({
    IdToken: new CognitoIdToken({ IdToken: tokens.id_token }),
    AccessToken: new CognitoAccessToken({ AccessToken: tokens.access_token }),
    RefreshToken: new CognitoRefreshToken({
      RefreshToken: tokens.refresh_token,
    }),
  });

  // Resolved before caching: an account with no cargo is refused without
  // leaving tokens behind for `restore` to find.
  const session = toDomainSession(cognitoSession);

  const username = cognitoSession.getAccessToken().decodePayload()[
    "username"
  ] as string;
  new CognitoUser({
    Username: username,
    Pool: getPool(),
    Storage: cognitoStorage,
  }).setSignInUserSession(cognitoSession);

  return { session, redirectTo: pending.redirectTo };
}

/**
 * One exchange per callback URL. A code is single-use, and Strict Mode runs
 * the callback page's effect twice in development — the second run gets the
 * first one's promise instead of spending the code again.
 */
let inFlight: {
  search: string;
  promise: Promise<{ session: Session; redirectTo: string }>;
} | null = null;

function completeGoogleSignIn(
  search: string,
): Promise<{ session: Session; redirectTo: string }> {
  if (inFlight?.search !== search) {
    inFlight = { search, promise: exchangeCode(search) };
  }
  return inFlight.promise;
}

export { startGoogleSignIn, completeGoogleSignIn };
