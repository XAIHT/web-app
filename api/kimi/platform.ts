// Google userinfo client. Folder named "kimi" for legacy reasons.
import type { GoogleUserProfile } from "./types";

const USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";

export async function fetchGoogleUserInfo(
  accessToken: string,
): Promise<GoogleUserProfile | null> {
  const resp = await fetch(USERINFO_ENDPOINT, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!resp.ok) {
    const text = await resp.text();
    console.warn(`[google] userinfo failed (${resp.status}): ${text}`);
    return null;
  }
  return resp.json() as Promise<GoogleUserProfile>;
}
