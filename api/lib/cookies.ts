import type { CookieOptions } from "hono/utils/cookie";

function isLocalhost(headers: Headers): boolean {
  const host = headers.get("host") || "";
  return host.startsWith("localhost:") || host.startsWith("127.0.0.1:");
}

export function getSessionCookieOptions(headers: Headers): CookieOptions {
  const localhost = isLocalhost(headers);

  // Lax is the right default: the cookie is sent on same-site requests AND on
  // top-level navigations (which is what an OAuth callback redirect is).
  // Avoid SameSite=None — Chrome's tracking protection now drops third-party-style
  // cookies aggressively, and a session cookie on our own domain has no need for it.
  return {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    secure: !localhost,
  };
}
