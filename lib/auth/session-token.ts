import { SignJWT, jwtVerify } from 'jose';

/**
 * The signed half of a login, kept deliberately free of any database or
 * Node-only import: `middleware.ts` runs on the Edge runtime and imports this
 * file to decide whether a request even looks signed in.
 *
 * The token carries nothing but two opaque ids. Role and churchId are NEVER
 * put in the cookie — they are read from the database on every request in
 * lib/auth/session.ts, so a role change or a revoked account takes effect
 * immediately instead of at the next login.
 */

export const SESSION_COOKIE = 'cepca_session';

/** Absolute lifetime of a login. There is no sliding refresh. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionTokenPayload {
  /** Session row id. */
  sid: string;
  /** User row id, cross-checked against the session row. */
  uid: string;
}

/**
 * HMAC key from the environment. Never hardcoded, never sent to the client
 * (the name has no NEXT_PUBLIC_ prefix, so Next will not inline it into the
 * browser bundle).
 */
function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET is missing or shorter than 32 characters. Generate one with:\n' +
        '  node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'base64url\'))"'
    );
  }

  return new TextEncoder().encode(secret);
}

/** Sign a session cookie value that expires with the session row. */
export async function signSessionToken(
  payload: SessionTokenPayload,
  expiresAt: Date
): Promise<string> {
  return new SignJWT({ sid: payload.sid })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(payload.uid)
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(secretKey());
}

/**
 * Verify signature and expiry. Returns null for anything that does not check
 * out — a forged token, a tampered payload, or one signed with a rotated
 * secret. Never throws at the call site, so a bad cookie reads as "signed out".
 */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<SessionTokenPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ['HS256'],
    });

    const sid = payload.sid;
    const uid = payload.sub;

    if (typeof sid !== 'string' || !sid) return null;
    if (typeof uid !== 'string' || !uid) return null;

    return { sid, uid };
  } catch {
    return null;
  }
}

/**
 * Cookie flags. `secure` only in production so the cookie still works over
 * plain http://localhost during development.
 */
export function sessionCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires,
  };
}
