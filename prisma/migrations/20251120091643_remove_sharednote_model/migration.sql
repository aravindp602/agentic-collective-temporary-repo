/*
  Warnings:

  - You are about to drop the `SharedNote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."SharedNote" DROP CONSTRAINT "SharedNote_userId_fkey";

-- DropTable
DROP TABLE "public"."SharedNote";
