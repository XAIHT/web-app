// OAuth provider types. The folder is named "kimi" for legacy reasons —
// the actual provider is now Google.

export type TokenResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token?: string;
  refresh_token?: string;
};

export type SessionPayload = {
  unionId: string; // legacy field name; stores the Google "sub" claim
  clientId: string;
};

// Shape of https://www.googleapis.com/oauth2/v3/userinfo
export type GoogleUserProfile = {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  locale?: string;
};
