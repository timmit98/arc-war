-- CreateEnum
CREATE TYPE "public"."InterestStatus" AS ENUM ('INTERESTED', 'NOT_INTERESTED', 'COMMITTED');

-- CreateTable
CREATE TABLE "public"."MissionInterest" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "missionId" UUID NOT NULL,
    "status" "public"."InterestStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MissionInterest_userId_missionId_key" ON "public"."MissionInterest"("userId", "missionId");

-- AddForeignKey
ALTER TABLE "public"."MissionInterest" ADD CONSTRAINT "MissionInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MissionInterest" ADD CONSTRAINT "MissionInterest_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "public"."Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
