-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_category_id_fkey";

-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
