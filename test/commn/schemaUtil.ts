import { PrismaClient } from '@prisma/client';

export const initSchema = async (prisma: PrismaClient) => {
  const schemaName = process.env.SCHEMA_NAME;
  for (const {
    tablename,
  } of await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname=${schemaName}`) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$queryRaw(
          `TRUNCATE TABLE "${schemaName}"."${tablename}" RESTART IDENTITY CASCADE;`,
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }
};
