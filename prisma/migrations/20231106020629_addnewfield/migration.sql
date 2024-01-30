/*
  Warnings:

  - Added the required column `organizationId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "VATBill" TEXT,
ADD COLUMN     "abbreviation" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "parentId" DROP NOT NULL;
