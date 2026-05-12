// Google OAuth 2.0 flow + session cookie issuance.
// Folder named "kimi" for legacy reasons; provider is now Google.

import type { Context } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import * as cookie from "cookie";
import crypto from "node:crypto";
import { env } from "../lib/env";
import { getSessionCookieOptions } from "../lib/cookies";
import { Session, Paths } from "@contracts/constants";
import { Errors } from "@contracts/errors";
import { signSessionToken, verifySessionToken } from "./session";
import { fetchGoogleUserInfo } from "./platform";
import { findUserByUnionId, upsertUser } from "../queries/users";
import type { TokenResponse } from "./types";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

// ── C-1 FIX: Host Header Injection ──────────────────────────────────
// PUBLIC_BASE_URL is now REQUIRED in production. The fallback that derived
// the redirect URI from the inbound Host header has been removed because an
// attacker could spoof the Host header and capture the OAuth authorization
// code on their server.
function buildRedirectUri(_c: Context): string {
  if (!env.publicBaseUrl) {
    if (env.isProduction) {
      throw new Error(
        "PUBLIC_BASE_URL is required in production. Set it to your public origin (e.g. https://xaiht.org).",
      );
    }
    // Dev-only fallback: derive from the inbound request.
    const url = new URL(_c.req.url);
    return `${url.protocol}//${url.host}${Paths.oauthCallback}`;
  }
  return `${env.publicBaseUrl}${Paths.oauthCallback}`;
}

// ── C-3 FIX: OAuth state parameter (CSRF) ────────────────────────────
// Cookie name for the CSRF state nonce. Short-lived, httpOnly.
const OAUTH_STATE_COOKIE = "kimi_oauth_state";

function generateStateNonce(): string {
  return crypto.randomBytes(32).toString("base64url");
}

async function exchangeAuthCode(
  code: string,
  redirectUri: string,
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: env.googleClientId,
    client_secret: env.googleClientSecret,
    redirect_uri: redirectUri,
  });

  const resp = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Token exchange failed (${resp.status}): ${text}`);
  }

  return resp.json() as Promise<TokenResponse>;
}

export async function authenticateRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) {
    console.warn("[auth] No session cookie found in request.");
    throw Errors.forbidden("Invalid authentication token.");
  }
  const claim = await verifySessionToken(token);
  if (!claim) {
    throw Errors.forbidden("Invalid authentication token.");
  }
  const user = await findUserByUnionId(claim.unionId);
  if (!user) {
    throw Errors.forbidden("User not found. Please re-login.");
  }
  return user;
}

export function createOAuthStartHandler() {
  return (c: Context) => {
    const redirectUri = buildRedirectUri(c);

    // ── C-3 FIX: Generate a cryptographically random state nonce ──────
    // Store it in a short-lived httpOnly cookie so the callback can
    // verify it. This prevents CSRF attacks where an attacker injects
    // their own authorization code into a victim's session.
    const stateNonce = generateStateNonce();
    const cookieOpts = getSessionCookieOptions(c.req.raw.headers);
    setCookie(c, OAUTH_STATE_COOKIE, stateNonce, {
      ...cookieOpts,
      maxAge: 600, // 10 minutes — enough for the OAuth round-trip
      httpOnly: true,
    });

    // Encode both the nonce and the redirect URI in the state parameter
    // so the callback can verify the nonce and reuse the redirect URI.
    const statePayload = JSON.stringify({ nonce: stateNonce, redirectUri });
    const state = Buffer.from(statePayload).toString("base64url");

    const params = new URLSearchParams({
      client_id: env.googleClientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state,
      access_type: "online",
      prompt: "select_account",
    });
    return c.redirect(`${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`, 302);
  };
}

export function createOAuthCallbackHandler() {
  return async (c: Context) => {
    const code = c.req.query("code");
    const state = c.req.query("state");
    const error = c.req.query("error");
    const errorDescription = c.req.query("error_description");

    if (error) {
      if (error === "access_denied") {
        return c.redirect("/", 302);
      }
      return c.json({ error, error_description: errorDescription }, 400);
    }

    if (!code || !state) {
      return c.json({ error: "code and state are required" }, 400);
    }

    // ── C-3 FIX: Verify the state nonce against the cookie ───────────
    const savedNonce = getCookie(c, OAUTH_STATE_COOKIE);
    // Clear the state cookie immediately (one-time use)
    const cookieOpts = getSessionCookieOptions(c.req.raw.headers);
    setCookie(c, OAUTH_STATE_COOKIE, "", {
      ...cookieOpts,
      maxAge: 0,
      httpOnly: true,
    });

    let parsedState: { nonce: string; redirectUri: string };
    try {
      parsedState = JSON.parse(
        Buffer.from(state, "base64url").toString("utf-8"),
      );
    } catch {
      return c.json({ error: "Invalid state parameter" }, 400);
    }

    if (!parsedState.nonce || !savedNonce || parsedState.nonce !== savedNonce) {
      return c.json({ error: "State verification failed (possible CSRF)" }, 403);
    }

    try {
      const redirectUri = parsedState.redirectUri;
      const tokenResp = await exchangeAuthCode(code, redirectUri);
      const profile = await fetchGoogleUserInfo(tokenResp.access_token);
      if (!profile) {
        throw new Error("Failed to fetch Google user profile");
      }

      await upsertUser({
        unionId: profile.sub,
        name: profile.name ?? profile.email ?? "Google user",
        email: profile.email,
        avatar: profile.picture,
        lastSignInAt: new Date(),
      });

      const token = await signSessionToken({
        unionId: profile.sub,
        clientId: env.googleClientId,
      });

      const sessionCookieOpts = getSessionCookieOptions(c.req.raw.headers);
      setCookie(c, Session.cookieName, token, {
        ...sessionCookieOpts,
        maxAge: Session.maxAgeMs / 1000,
      });

      return c.redirect("/", 302);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      return c.json({ error: "OAuth callback failed" }, 500);
    }
  };
}

export { exchangeAuthCode };
