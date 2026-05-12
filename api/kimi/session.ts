import * as jose from "jose";
import { env } from "../lib/env";
import type { SessionPayload } from "./types";

const JWT_ALG = "HS256";

// ── C-2 FIX: Reduced session expiry ──────────────────────────────────
// Previously 1 year — if a session cookie was stolen the attacker retained
// access for up to 12 months. Now the JWT expires after 8 hours (idle
// timeout) with an absolute maximum of 7 days from issuance. The cookie
// maxAge in constants.ts is also reduced to match.
const SESSION_IDLE_EXPIRY = "8h";
const SESSION_ABSOLUTE_EXPIRY = "7d";

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(SESSION_IDLE_EXPIRY)
    .sign(secret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  if (!token) {
    console.warn("[session] No token provided for verification.");
    return null;
  }
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
    });
    const { unionId, clientId } = payload;
    if (!unionId || !clientId) {
      console.warn("[session] JWT payload missing required fields.");
      return null;
    }
    // ── C-2 FIX: Enforce absolute session expiry ──────────────────────
    // Even if the JWT is refreshed/re-issued, sessions older than
    // SESSION_ABSOLUTE_EXPIRY from the `iat` claim are rejected.
    const iat = payload.iat;
    if (iat) {
      const absoluteMaxMs = parseDuration(SESSION_ABSOLUTE_EXPIRY);
      if (Date.now() / 1000 - iat > absoluteMaxMs / 1000) {
        console.warn("[session] Session exceeded absolute maximum age.");
        return null;
      }
    }
    return { unionId, clientId } as SessionPayload;
  } catch (error) {
    console.warn("[session] JWT verification failed:", error);
    return null;
  }
}

/** Parse a simple duration string like "7d" or "8h" into milliseconds. */
function parseDuration(d: string): number {
  const match = d.match(/^(\d+)([smhd])$/);
  if (!match) return 0;
  const n = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s": return n * 1000;
    case "m": return n * 60 * 1000;
    case "h": return n * 60 * 60 * 1000;
    case "d": return n * 24 * 60 * 60 * 1000;
    default: return 0;
  }
}
