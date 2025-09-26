/*
  Warnings:

  - A unique constraint covering the columns `[userId,botId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_botId_key" ON "public"."Review"("userId", "botId");
