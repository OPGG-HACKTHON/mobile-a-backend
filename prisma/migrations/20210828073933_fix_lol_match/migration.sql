/*
  Warnings:

  - You are about to drop the column `resultResponse` on the `LOLMatch` table. All the data in the column will be lost.
  - Added the required column `info` to the `LOLMatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadata` to the `LOLMatch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LOLMatch" DROP COLUMN "resultResponse",
ADD COLUMN     "info" JSONB NOT NULL,
ADD COLUMN     "metadata" JSONB NOT NULL;
