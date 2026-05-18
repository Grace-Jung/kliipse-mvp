export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  exp: number;
}

/**
 * Parse user-token cookie value and return AuthUser or null.
 * Works on both server (passing cookie value) and client side.
 */
export function parseUserToken(tokenValue: string | undefined | null): AuthUser | null {
  if (!tokenValue) return null;

  try {
    const decoded = Buffer.from(tokenValue, "base64").toString("utf-8");
    const payload = JSON.parse(decoded) as AuthUser;

    // Check expiry
    if (payload.exp && payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Client-side helper: read user-token from document.cookie
 */
export function getUserFromClientCookie(): AuthUser | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.trim().split("=");
    if (key === "user-token") {
      const value = rest.join("=");
      try {
        const decoded = atob(value);
        const payload = JSON.parse(decoded) as AuthUser;
        if (payload.exp && payload.exp < Date.now()) {
          return null;
        }
        return payload;
      } catch {
        return null;
      }
    }
  }

  return null;
}
