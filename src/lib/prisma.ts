import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL or DIRECT_URL environment variable is not set');
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    },
    log: ['error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} 