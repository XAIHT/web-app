import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  // Used to sign the session JWT. Keep stable — rotating logs everyone out.
  appSecret: required("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),

  // Google OAuth 2.0 — credentials from GCP Console > APIs & Services > Credentials
  googleClientId: required("GOOGLE_CLIENT_ID"),
  googleClientSecret: required("GOOGLE_CLIENT_SECRET"),

  // Public origin used to build redirect_uri (must match what's registered in GCP).
  // e.g. "https://xaiht.org". Falls back to the inbound request origin when empty.
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? "",

  // Google "sub" of the account that should auto-promote to admin on first sign-in.
  // Find it by signing in once and looking at the row inserted in the users table,
  // or by decoding any id_token from this account at https://jwt.io.
  // The DB column is called `unionId` for legacy reasons but stores the Google sub.
  ownerUnionId: process.env.OWNER_GOOGLE_SUB ?? "",
};
