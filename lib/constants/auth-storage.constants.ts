// localStorage keys used to persist JWT tokens for Safari ITP compatibility.
// Safari blocks cross-origin httpOnly cookies, so the /callback page stores
// the tokens here after OAuth. All imports go through this file so the key
// strings are never duplicated across the codebase.
export const ACCESS_TOKEN_KEY = "auth_access_token";
export const REFRESH_TOKEN_KEY = "auth_refresh_token";
