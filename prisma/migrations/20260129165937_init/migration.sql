/*
  Warnings:

  - You are about to drop the column `userId` on the `currency` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "currency" DROP CONSTRAINT "currency_userId_fkey";

-- AlterTable
ALTER TABLE "currency" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "currency" ADD CONSTRAINT "currency_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
