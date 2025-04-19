/*
  Warnings:

  - You are about to drop the column `displayname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileimageurl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "displayname",
DROP COLUMN "profileimageurl",
ADD COLUMN     "displayName" VARCHAR(100),
ADD COLUMN     "profileImageUrl" TEXT;
