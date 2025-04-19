/*
  Warnings:

  - You are about to drop the column `displayName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileImageUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "displayName",
DROP COLUMN "profileImageUrl",
ADD COLUMN     "displayname" VARCHAR(100),
ADD COLUMN     "profileimageurl" TEXT;
