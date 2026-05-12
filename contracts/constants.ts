export const Session = {
  cookieName: "kimi_sid",
  // ── C-2 FIX: Reduced from 365 days to 7 days ───────────────────────
  // The JWT itself expires after 8h (idle timeout), but the cookie must
  // persist long enough for the absolute max (7 days) so the server can
  // reject expired tokens gracefully rather than losing the cookie.
  maxAgeMs: 7 * 24 * 60 * 60 * 1000,
} as const;

export const ErrorMessages = {
  unauthenticated: "Authentication required",
  insufficientRole: "Insufficient permissions",
} as const;

export const Paths = {
  login: "/login",
  oauthStart: "/api/oauth/start",
  oauthCallback: "/api/oauth/callback",
} as const;
