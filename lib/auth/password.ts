import bcrypt from 'bcryptjs';

/**
 * Password hashing. `bcryptjs` is the pure-JS implementation on purpose: the
 * native `bcrypt` package needs a compiler and does not run on the serverless
 * host this site deploys to.
 *
 * Plaintext passwords are never stored, never logged, and never returned from
 * a server action.
 */

/** Work factor. 12 is the current floor for an admin login. */
const BCRYPT_COST = 12;

/**
 * bcrypt only considers the first 72 bytes of input; anything longer is
 * silently truncated, which would make two different long passwords
 * interchangeable. Rejected rather than truncated.
 */
export const MAX_PASSWORD_BYTES = 72;

/** Minimum length accepted when a password is set or changed. */
export const MIN_PASSWORD_LENGTH = 10;

/** null when acceptable, otherwise the reason to show the person. */
export function validatePasswordStrength(plain: string): string | null {
  if (plain.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  if (new TextEncoder().encode(plain).length > MAX_PASSWORD_BYTES) {
    return `Passwords are limited to ${MAX_PASSWORD_BYTES} bytes`;
  }
  return null;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_COST);
}

/**
 * Timing-safe comparison — bcrypt's own `compare` does the constant-time work.
 * Returns false rather than throwing on a malformed stored hash.
 */
export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  if (!plain || !hash) return false;

  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

/**
 * A hash of nothing anybody knows, compared against when the email does not
 * exist. Without it, "unknown email" would return in a millisecond while
 * "wrong password" took ~250ms, and the difference alone would tell an
 * attacker which addresses hold accounts.
 */
let dummyHash: string | null = null;

export async function burnPasswordComparison(plain: string): Promise<void> {
  try {
    // Built on first use, not at import time: hashing costs ~250ms and most
    // requests never reach the login path.
    if (!dummyHash) dummyHash = await hashPassword('cepca-no-such-account');
    await bcrypt.compare(plain || 'x', dummyHash);
  } catch {
    /* ignore — this call exists only to spend the same time */
  }
}

/**
 * A temporary password for an account the secretariat creates on someone's
 * behalf. Ambiguous characters are left out so it survives being read aloud
 * or copied off a screen.
 */
export function generateTemporaryPassword(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  let out = '';
  for (let i = 0; i < bytes.length; i += 1) {
    out += alphabet[bytes[i] % alphabet.length];
    if (i === 5 || i === 11) out += '-';
  }
  return out;
}
