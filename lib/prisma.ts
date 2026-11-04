import { PrismaClient, Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * True when a cached client knows every model in the current generated schema.
 *
 * In development the client is parked on `globalThis` so hot reloads do not
 * open a new connection pool each time. After a schema change and
 * `prisma generate`, the reload re-runs this module but finds the instance
 * built from the previous schema, so `prisma.<newModel>` stays undefined.
 * A client missing a model is replaced instead.
 *
 * (If the dev server never picked up the regenerated files at all, this cannot
 * help — restart it.)
 */
function isCurrent(client: PrismaClient): boolean {
  return Object.values(Prisma.ModelName).every(
    (model) => model.charAt(0).toLowerCase() + model.slice(1) in client
  );
}

const cached = globalForPrisma.prisma;
const reusable = cached && isCurrent(cached) ? cached : undefined;

// Release the outdated client's connections rather than leaving them open.
if (cached && !reusable) cached.$disconnect().catch(() => {});

export const prisma = reusable ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
