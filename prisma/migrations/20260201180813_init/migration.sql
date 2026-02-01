/*
  Warnings:

  - The values [TRANSFER] on the enum `CategoryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryType_new" AS ENUM ('INCOME', 'OUTCOME');
ALTER TABLE "category" ALTER COLUMN "category_type" TYPE "CategoryType_new" USING ("category_type"::text::"CategoryType_new");
ALTER TYPE "CategoryType" RENAME TO "CategoryType_old";
ALTER TYPE "CategoryType_new" RENAME TO "CategoryType";
DROP TYPE "public"."CategoryType_old";
COMMIT;

-- AlterTable
ALTER TABLE "currency_exchange" ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "currency_exchange" ADD CONSTRAINT "currency_exchange_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
