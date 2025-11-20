/*
  Warnings:

  - Added the required column `botName` to the `SharedNote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SharedNote" ADD COLUMN     "botName" TEXT NOT NULL;
