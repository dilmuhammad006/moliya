-- AlterTable
ALTER TABLE "currency" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "currency" ADD CONSTRAINT "currency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
