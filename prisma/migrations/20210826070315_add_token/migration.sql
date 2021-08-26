/*
  Warnings:

  - A unique constraint covering the columns `[authFrom,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authFrom` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User.email_unique";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authFrom" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Token" (
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_authFrom_email_uniqueConstraint" ON "User"("authFrom", "email");

-- AddForeignKey
ALTER TABLE "Token" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
