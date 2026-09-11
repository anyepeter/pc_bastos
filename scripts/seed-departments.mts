/**
 * Insert the council's eight departments — and the drafts that go with them —
 * from lib/departments-seed.ts.
 *
 *   npm run seed-departments
 *
 * Safe to run again: a department whose slug already exists is skipped, and
 * so is every draft activity belonging to it, so nothing a department has
 * since written or deleted is touched. The same data is behind the "Import the
 * council's departments" button on /admin/departments.
 *
 * Like scripts/create-admin.mts, this talks to the database through
 * `prisma db execute` rather than the generated client, because that client is
 * emitted as TypeScript with extensionless imports which plain Node cannot
 * resolve. It creates no logins — those are issued from each department's edit
 * page.
 */
import 'dotenv/config';
import { spawn } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import {
  DEPARTMENT_ACTIVITY_SEEDS,
  DEPARTMENT_SEEDS,
  type DepartmentActivitySeed,
  type DepartmentSeed,
  type SeedText,
} from '../lib/departments-seed.ts';

function fail(message: string): never {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

/** Single-quote a value for SQL. */
function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

const sqlText = (value: string | undefined) => (value ? sqlString(value) : 'NULL');

/** A `{ en, fr }` Json column, trimmed the way the editor stores it. */
const sqlJson = (value: SeedText | undefined) =>
  value
    ? `${sqlString(JSON.stringify({ en: value.en.trim(), fr: value.fr.trim() }))}::jsonb`
    : 'NULL';

const sqlDate = (value: string | undefined) =>
  value ? `${sqlString(`${value}T00:00:00.000Z`)}::timestamp` : 'NULL';

/** Prisma generates cuids in the client, so the id columns have no default. */
const newId = () => `c${randomUUID().replace(/-/g, '')}${randomBytes(4).toString('hex')}`;

function activitySelect(activity: DepartmentActivitySeed): string {
  return `SELECT ${sqlString(newId())}, ${sqlString(activity.slug)}, "d"."id", ${sqlString(activity.kind)},
    ${sqlJson(activity.title)}, ${sqlJson(activity.summary)}, ${sqlJson(activity.body)}, ${sqlJson(activity.location)},
    ${sqlDate(activity.date)}, ${sqlDate(activity.endDate)}, NULL, NULL, ARRAY[]::text[],
    ${activity.published ? 'true' : 'false'}, NOW(), NOW()
  FROM "d"`;
}

/**
 * One statement per department. The activities hang off the department row
 * returned by the insert, so a department that already existed (and so
 * returned nothing) takes none of the drafts with it.
 */
function departmentStatement(department: DepartmentSeed): string {
  const activities = DEPARTMENT_ACTIVITY_SEEDS.filter(
    (activity) => activity.departmentSlug === department.slug
  );

  const insertDepartment = `INSERT INTO "Department" (
    "id", "slug", "acronym", "sortOrder",
    "name", "tagline", "summary", "vision", "mission", "objectives", "services",
    "structures", "keyFigures", "support", "coverage", "location", "headTitle",
    "headName", "headPhoto", "logo", "coverImage", "images",
    "phone", "email", "address", "website",
    "published", "createdAt", "updatedAt"
  ) VALUES (
    ${sqlString(newId())}, ${sqlString(department.slug)}, ${sqlString(department.acronym)}, ${department.sortOrder},
    ${sqlJson(department.name)}, ${sqlJson(department.tagline)}, ${sqlJson(department.summary)},
    ${sqlJson(department.vision)}, ${sqlJson(department.mission)}, ${sqlJson(department.objectives)},
    ${sqlJson(department.services)}, ${sqlJson(department.structures)}, ${sqlJson(department.keyFigures)},
    ${sqlJson(department.support)}, ${sqlJson(department.coverage)}, ${sqlJson(department.location)},
    ${sqlJson(department.headTitle)},
    ${sqlText(department.headName)}, NULL, NULL, NULL, ARRAY[]::text[],
    ${sqlText(department.phone)}, ${sqlText(department.email)}, ${sqlText(department.address)},
    ${sqlText(department.website)},
    ${department.published ? 'true' : 'false'}, NOW(), NOW()
  )
  ON CONFLICT ("slug") DO NOTHING`;

  if (activities.length === 0) return `${insertDepartment};`;

  return `WITH "d" AS (
  ${insertDepartment}
  RETURNING "id"
)
INSERT INTO "DepartmentActivity" (
  "id", "slug", "departmentId", "kind",
  "title", "summary", "body", "location",
  "date", "endDate", "time", "imageUrl", "images",
  "published", "createdAt", "updatedAt"
)
${activities.map(activitySelect).join('\nUNION ALL\n')}
ON CONFLICT ("slug") DO NOTHING;`;
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
  if (!process.env.DATABASE_URL) {
    fail('DATABASE_URL is not set. Check your .env.');
  }

  const orphans = DEPARTMENT_ACTIVITY_SEEDS.filter(
    (activity) => !DEPARTMENT_SEEDS.some((department) => department.slug === activity.departmentSlug)
  );
  if (orphans.length > 0) {
    fail(`Activities point at unknown departments: ${orphans.map((a) => a.slug).join(', ')}`);
  }

  // One transaction: either every missing department goes in, or none does.
  const sql = ['BEGIN;', ...DEPARTMENT_SEEDS.map(departmentStatement), 'COMMIT;'].join('\n\n');

  await runSql(sql);

  console.log(
    `\n  ✓ Checked ${DEPARTMENT_SEEDS.length} departments and ${DEPARTMENT_ACTIVITY_SEEDS.length} draft activities.`
  );
  console.log('    Any that were missing have been added; existing ones were left untouched.');
  console.log('    Review them at /admin/departments.\n');
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
