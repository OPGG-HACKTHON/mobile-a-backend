-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "LOLAccountId" TEXT,
    "schoolId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LOLAccount" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profileIconId" INTEGER NOT NULL,
    "summonerLevel" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LOLSummaryPersonal" (
    "LOLAccountId" TEXT NOT NULL,
    "LOLSummaryElementId" INTEGER NOT NULL,
    "championId" INTEGER,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("LOLAccountId","LOLSummaryElementId")
);

-- CreateTable
CREATE TABLE "LOLSummarySchool" (
    "SchoolId" INTEGER NOT NULL,
    "LOLSummaryElementId" INTEGER NOT NULL,
    "championId" INTEGER,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("SchoolId","LOLSummaryElementId")
);

-- CreateTable
CREATE TABLE "LOLSummaryElement" (
    "id" SERIAL NOT NULL,
    "LOLMatchFieldName" TEXT,
    "valueDataType" TEXT NOT NULL DEFAULT E'Int',
    "calculateType" TEXT NOT NULL,
    "sortType" TEXT NOT NULL,
    "exposureName" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LOLTier" (
    "id" SERIAL NOT NULL,
    "tier" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "leaguePoints" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "LOLAccountId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LOLChampionMastery" (
    "id" SERIAL NOT NULL,
    "championId" INTEGER NOT NULL,
    "championPoints" INTEGER NOT NULL,
    "lastPlayTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "LOLAccountId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LOLMatch" (
    "id" TEXT NOT NULL,
    "resultResponse" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_LOLAccountId_unique" ON "User"("LOLAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "LOLTier.LOLAccountId_unique" ON "LOLTier"("LOLAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "LOLChampionMastery_LOLAccountId_unique" ON "LOLChampionMastery"("LOLAccountId");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("LOLAccountId") REFERENCES "LOLAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLSummaryPersonal" ADD FOREIGN KEY ("LOLAccountId") REFERENCES "LOLAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLSummaryPersonal" ADD FOREIGN KEY ("LOLSummaryElementId") REFERENCES "LOLSummaryElement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLSummarySchool" ADD FOREIGN KEY ("SchoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLSummarySchool" ADD FOREIGN KEY ("LOLSummaryElementId") REFERENCES "LOLSummaryElement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLTier" ADD FOREIGN KEY ("LOLAccountId") REFERENCES "LOLAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLChampionMastery" ADD FOREIGN KEY ("LOLAccountId") REFERENCES "LOLAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
