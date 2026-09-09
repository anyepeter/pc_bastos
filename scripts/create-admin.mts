/**
 * Create (or reset the password of) a council super-admin login.
 *
 *   ADMIN_EMAIL=you@cepca.org ADMIN_PASSWORD='…' \
 *     node --experimental-strip-types scripts/create-admin.mts
 *
 * or, if you accept that the password lands in your shell history:
 *
 *   node --experimental-strip-types scripts/create-admin.mts you@cepca.org 'the password'
 *
 * Nothing is hardcoded here: with no email and no password the script refuses
 * to run. Running it again for an address that already exists REPLACES that
 * account's password and signs it out everywhere — that is the password-reset
 * path for the secretariat's own logins.
 *
 * It talks to the database through `prisma db execute` rather than the
 * generated client, because that client is emitted as TypeScript with
 * extensionless imports which plain Node cannot resolve.
 */
import 'dotenv/config';
import { spawn } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';

const BCRYPT_COST = 12;
const MIN_PASSWORD_LENGTH = 10;

function fail(message: string): never {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

/** Single-quote a value for SQL. bcrypt hashes and emails never contain NULs. */
function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function runSql(sql: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'npx',
      ['prisma', 'db', 'execute', '--stdin', '--schema', 'prisma/schema.prisma'],
      { stdio: ['pipe', 'inherit', 'inherit'] }
    );

    child.on('error', reject);
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`prisma db execute exited ${code}`))
    );

    child.stdin.write(sql);
    child.stdin.end();
  });
}

async function main() {
  const [argEmail, argPassword] = process.argv.slice(2);

  const email = (process.env.ADMIN_EMAIL || argEmail || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || argPassword || '';

  if (!email) {
    fail('No email. Set ADMIN_EMAIL, or pass it as the first argument.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fail(`"${email}" does not look like an email address.`);
  }
  if (!password) {
    fail('No password. Set ADMIN_PASSWORD, or pass it as the second argument.');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    fail(`The password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  if (Buffer.byteLength(password, 'utf8') > 72) {
    fail('bcrypt ignores anything past 72 bytes — choose a shorter password.');
  }
  if (!process.env.DATABASE_URL) {
    fail('DATABASE_URL is not set. Check your .env.');
  }
  if (!process.env.SESSION_SECRET) {
    console.warn(
      '  ! SESSION_SECRET is not set. Logins will fail until it is. Generate one with:\n' +
        "    node -e \"console.log(require('crypto').randomBytes(48).toString('base64url'))\""
    );
  }

  // The plaintext never leaves this process: only the hash is sent anywhere.
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  // Prisma generates cuids in the client, so the column has no database
  // default and an id has to be supplied here.
  const id = `c${randomUUID().replace(/-/g, '')}${randomBytes(4).toString('hex')}`;

  const sql = `
INSERT INTO "User" (
  "id", "email", "passwordHash", "name", "role", "churchId",
  "mustChangePassword", "createdAt", "updatedAt"
) VALUES (
  ${sqlString(id)}, ${sqlString(email)}, ${sqlString(passwordHash)}, NULL,
  'super_admin', NULL, false, NOW(), NOW()
)
ON CONFLICT ("email") DO UPDATE SET
  "passwordHash" = EXCLUDED."passwordHash",
  "role" = 'super_admin',
  "churchId" = NULL,
  "mustChangePassword" = false,
  "updatedAt" = NOW();

-- A password change ends every session that account had open.
DELETE FROM "Session"
WHERE "userId" IN (SELECT "id" FROM "User" WHERE "email" = ${sqlString(email)});
`;

  await runSql(sql);

  console.log(`\n  ✓ Super admin ready: ${email}`);
  console.log('    Sign in at /sign-in. Run this script again to reset the password.\n');
}

main().catch((error) => {
  // Deliberately not dumping the whole error object — the SQL we built
  // contains the password hash and there is no reason to print it.
  fail(error instanceof Error ? error.message : String(error));
});
