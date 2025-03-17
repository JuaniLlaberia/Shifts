import { PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaEdgeClient } from '@prisma/client/edge';

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
  // eslint-disable-next-line no-var
  var cachedEdgePrisma: PrismaEdgeClient;
}

const isEdgeRuntime = process.env.NEXT_RUNTIME === 'edge';

let prisma: PrismaClient | PrismaEdgeClient;

if (isEdgeRuntime) {
  // Edge environment (middleware)
  if (!global.cachedEdgePrisma) {
    global.cachedEdgePrisma = new PrismaEdgeClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  prisma = global.cachedEdgePrisma;
} else {
  // Server environment
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!global.cachedPrisma) {
      global.cachedPrisma = new PrismaClient();
    }
    prisma = global.cachedPrisma;
  }
}

export const db = prisma;
