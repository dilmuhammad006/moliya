/*
  Warnings:

  - Made the column `user_id` on table `category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `currency` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_user_id_fkey";

-- DropForeignKey
ALTER TABLE "currency" DROP CONSTRAINT "currency_user_id_fkey";

-- AlterTable
ALTER TABLE "category" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "currency" ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "currency" ADD CONSTRAINT "currency_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
