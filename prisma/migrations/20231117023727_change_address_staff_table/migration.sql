/*
  Warnings:

  - You are about to drop the column `country` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `permanentAddress` on the `Staff` table. All the data in the column will be lost.
  - Added the required column `addressPermanent` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityCountry` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityCurrent` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityPermanent` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `districtCountry` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `districtCurrent` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `districtPermanent` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wardCountry` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wardCurrent` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wardPermanent` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "country",
DROP COLUMN "permanentAddress",
ADD COLUMN     "addressPermanent" TEXT NOT NULL,
ADD COLUMN     "cityCountry" TEXT NOT NULL,
ADD COLUMN     "cityCurrent" TEXT NOT NULL,
ADD COLUMN     "cityPermanent" TEXT NOT NULL,
ADD COLUMN     "districtCountry" TEXT NOT NULL,
ADD COLUMN     "districtCurrent" TEXT NOT NULL,
ADD COLUMN     "districtPermanent" TEXT NOT NULL,
ADD COLUMN     "wardCountry" TEXT NOT NULL,
ADD COLUMN     "wardCurrent" TEXT NOT NULL,
ADD COLUMN     "wardPermanent" TEXT NOT NULL;
