/*
  Warnings:

  - You are about to drop the column `categoryId` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `currency_exchange` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_categoryId_fkey";

-- AlterTable
ALTER TABLE "account" ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "category" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "currency" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "currency_exchange" ADD COLUMN     "rate" INTEGER NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "categoryId",
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
