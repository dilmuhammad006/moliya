-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_from_account_id_fkey";

-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "from_account_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_from_account_id_fkey" FOREIGN KEY ("from_account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
