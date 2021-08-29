/*
  Warnings:

  - You are about to drop the column `championId` on the `LOLChampionMastery` table. All the data in the column will be lost.
  - The primary key for the `LOLSummaryPersonal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `championId` on the `LOLSummaryPersonal` table. All the data in the column will be lost.
  - The primary key for the `LOLSummarySchool` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `championId` on the `LOLSummarySchool` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[LOLAccountId,LOLSummaryElementId,LOLChampionId]` on the table `LOLSummaryPersonal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[SchoolId,LOLSummaryElementId,LOLChampionId]` on the table `LOLSummarySchool` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `LOLChampionId` to the `LOLChampionMastery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LOLChampionMastery" DROP COLUMN "championId",
ADD COLUMN     "LOLChampionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LOLSummaryPersonal" DROP CONSTRAINT "LOLSummaryPersonal_pkey",
DROP COLUMN "championId",
ADD COLUMN     "LOLChampionId" TEXT,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LOLSummarySchool" DROP CONSTRAINT "LOLSummarySchool_pkey",
DROP COLUMN "championId",
ADD COLUMN     "LOLChampionId" TEXT,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "LOLChampion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LOLChampion.name_unique" ON "LOLChampion"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LOLChampion.key_unique" ON "LOLChampion"("key");

-- CreateIndex
CREATE UNIQUE INDEX "LOLSummaryPersonal_LOLAccountId_LOLSummaryElementId_LOLChampionId_uniqueConstraint" ON "LOLSummaryPersonal"("LOLAccountId", "LOLSummaryElementId", "LOLChampionId");

-- CreateIndex
CREATE UNIQUE INDEX "LOLSummarySchool_SchoolId_LOLSummaryElementId_LOLChampionId_uniqueConstraint" ON "LOLSummarySchool"("SchoolId", "LOLSummaryElementId", "LOLChampionId");

-- AddForeignKey
ALTER TABLE "LOLSummaryPersonal" ADD FOREIGN KEY ("LOLChampionId") REFERENCES "LOLChampion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLSummarySchool" ADD FOREIGN KEY ("LOLChampionId") REFERENCES "LOLChampion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLChampionMastery" ADD FOREIGN KEY ("LOLChampionId") REFERENCES "LOLChampion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
