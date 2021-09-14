-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "Token" (
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expireAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "authFrom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "LOLAccountId" TEXT,
    "schoolId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "educationOffice" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "totalPoint" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "regionId" INTEGER NOT NULL,

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
CREATE TABLE "LOLChampion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TitleInSchool" (
    "id" SERIAL NOT NULL,
    "LOLSummaryElementId" INTEGER NOT NULL,
    "LOLChampionId" TEXT,
    "schoolId" TEXT NOT NULL,
    "titleholderUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TitleInSchoolLog" (
    "id" SERIAL NOT NULL,
    "titleInSchoolId" INTEGER NOT NULL,
    "titleholderUserId" INTEGER NOT NULL,
    "prevUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LOLRankInSchool" (
    "id" SERIAL NOT NULL,
    "prevRank" INTEGER,
    "userId" INTEGER NOT NULL,
    "schoolId" TEXT NOT NULL,
    "LOLSummaryPersonalId" INTEGER NOT NULL,
    "LOLSummaryElementId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LOLSummaryPersonal" (
    "id" SERIAL NOT NULL,
    "LOLAccountId" TEXT NOT NULL,
    "LOLSummaryElementId" INTEGER NOT NULL,
    "LOLChampionId" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "exposureValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LOLSummarySchool" (
    "id" SERIAL NOT NULL,
    "SchoolId" TEXT NOT NULL,
    "LOLSummaryElementId" INTEGER NOT NULL,
    "LOLChampionId" TEXT,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LOLSummaryElement" (
    "id" SERIAL NOT NULL,
    "LOLMatchFieldName" TEXT,
    "LOLMatchFieldCategory" TEXT,
    "LOLMatchFieldKoName" TEXT,
    "LOLMatchFieldDataType" TEXT DEFAULT E'Int',
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
    "LOLChampionId" TEXT NOT NULL,
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
    "metadata" JSONB NOT NULL,
    "info" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token.token_unique" ON "Token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_authFrom_email_uniqueConstraint" ON "User"("authFrom", "email");

-- CreateIndex
CREATE UNIQUE INDEX "User_LOLAccountId_unique" ON "User"("LOLAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Region.name_unique" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LOLChampion.name_unique" ON "LOLChampion"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LOLChampion.key_unique" ON "LOLChampion"("key");

-- CreateIndex
CREATE UNIQUE INDEX "LOLRankInSchool_LOLSummaryPersonalId_unique" ON "LOLRankInSchool"("LOLSummaryPersonalId");

-- CreateIndex
CREATE UNIQUE INDEX "LOLSummaryPersonal_LOLAccountId_LOLSummaryElementId_LOLChampionId_uniqueConstraint" ON "LOLSummaryPersonal"("LOLAccountId", "LOLSummaryElementId", "LOLChampionId");

-- CreateIndex
CREATE UNIQUE INDEX "LOLSummarySchool_SchoolId_LOLSummaryElementId_LOLChampionId_uniqueConstraint" ON "LOLSummarySchool"("SchoolId", "LOLSummaryElementId", "LOLChampionId");

-- CreateIndex
CREATE UNIQUE INDEX "LOLTier.LOLAccountId_unique" ON "LOLTier"("LOLAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "LOLChampionMastery_LOLChampionId_LOLAccountId_uniqueConstraint" ON "LOLChampionMastery"("LOLChampionId", "LOLAccountId");

-- AddForeignKey
ALTER TABLE "Token" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("LOLAccountId") REFERENCES "LOLAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleInSchool" ADD FOREIGN KEY ("LOLSummaryElementId") REFERENCES "LOLSummaryElement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleInSchool" ADD FOREIGN KEY ("LOLChampionId") REFERENCES "LOLChampion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleInSchool" ADD FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleInSchool" ADD FOREIGN KEY ("titleholderUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleInSchoolLog" ADD FOREIGN KEY ("titleInSchoolId") REFERENCES "TitleInSchool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleInSchoolLog" ADD FOREIGN KEY ("titleholderUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleInSchoolLog" ADD FOREIGN KEY ("prevUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLRankInSchool" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLRankInSchool" ADD FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLRankInSchool" ADD FOREIGN KEY ("LOLSummaryPersonalId") REFERENCES "LOLSummaryPersonal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLRankInSchool" ADD FOREIGN KEY ("LOLSummaryElementId") REFERENCES "LOLSummaryElement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLSummaryPersonal" ADD FOREIGN KEY ("LOLAccountId") REFERENCES "LOLAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLSummaryPersonal" ADD FOREIGN KEY ("LOLSummaryElementId") REFERENCES "LOLSummaryElement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLSummaryPersonal" ADD FOREIGN KEY ("LOLChampionId") REFERENCES "LOLChampion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLSummarySchool" ADD FOREIGN KEY ("SchoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLSummarySchool" ADD FOREIGN KEY ("LOLSummaryElementId") REFERENCES "LOLSummaryElement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLSummarySchool" ADD FOREIGN KEY ("LOLChampionId") REFERENCES "LOLChampion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLTier" ADD FOREIGN KEY ("LOLAccountId") REFERENCES "LOLAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLChampionMastery" ADD FOREIGN KEY ("LOLChampionId") REFERENCES "LOLChampion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOLChampionMastery" ADD FOREIGN KEY ("LOLAccountId") REFERENCES "LOLAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
