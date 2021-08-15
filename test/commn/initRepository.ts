import { Prisma, PrismaClient, PrismaPromise } from '@prisma/client';
import { prisma } from './prisma';

class InitRepository {
  private readonly prisma = prisma;

  async initPrisma(): Promise<void> {
    const schemaName = process.env.SCHEMA_NAME;
    for (const { tablename } of await this.prisma
      .$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname=${schemaName}`) {
      if (tablename !== '_prisma_migrations') {
        try {
          await this.prisma.$queryRaw(
            `TRUNCATE TABLE "${schemaName}"."${tablename}" CASCADE;`,
          );
        } catch (error) {
          console.log({ error });
        }
      }
    }
    await this.prisma.$queryRaw(
      `ALTER SEQUENCE  ${schemaName}."LOLChampionMastery_id_seq" RESTART WITH 1;`,
    );

    await this.prisma.$queryRaw(
      `ALTER SEQUENCE  ${schemaName}."LOLTier_id_seq" RESTART WITH 1;`,
    );
    await this.prisma.$queryRaw(
      `ALTER SEQUENCE  ${schemaName}."LOLSummaryElement_id_seq" RESTART WITH 1;`,
    );

    await this.prisma.$queryRaw(
      `ALTER SEQUENCE  ${schemaName}."School_id_seq" RESTART WITH 1;`,
    );
    await this.prisma.$queryRaw(
      `ALTER SEQUENCE  ${schemaName}."User_id_seq" RESTART WITH 1;`,
    );
  }
}

export const initRepository = new InitRepository();
