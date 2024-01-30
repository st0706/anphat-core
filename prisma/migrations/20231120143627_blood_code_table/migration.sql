/*
  Warnings:

  - Added the required column `cityName` to the `Districts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityName` to the `Wards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `districtName` to the `Wards` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Districts" DROP CONSTRAINT "Districts_cityId_fkey";

-- DropForeignKey
ALTER TABLE "Wards" DROP CONSTRAINT "Wards_cityId_fkey";

-- DropForeignKey
ALTER TABLE "Wards" DROP CONSTRAINT "Wards_districtId_fkey";

-- DropIndex
DROP INDEX "Wards_wardCode_key";

-- AlterTable
ALTER TABLE "Districts" ADD COLUMN     "cityName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Wards" ADD COLUMN     "cityName" TEXT NOT NULL,
ADD COLUMN     "districtName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ingredientCode" TEXT NOT NULL,
    "ingredient" TEXT NOT NULL,
    "ingredientRegistration" TEXT NOT NULL,
    "sugarCode" TEXT NOT NULL,
    "sugar" TEXT NOT NULL,
    "content" TEXT,
    "pack" TEXT NOT NULL,
    "manufacture" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT,
    "unit" TEXT,
    "signalCode" TEXT,
    "manufacturer" TEXT,
    "country" TEXT,
    "group" TEXT,
    "type" TEXT,
    "category" TEXT,
    "description" TEXT,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodCode" (
    "id" TEXT NOT NULL,
    "bloodCode" TEXT NOT NULL,
    "unitsPreparations" TEXT NOT NULL,
    "actualVolume" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BloodCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BloodCode_bloodCode_key" ON "BloodCode"("bloodCode");

-- AddForeignKey
ALTER TABLE "Districts" ADD CONSTRAINT "Districts_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "Cities"("cityCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wards" ADD CONSTRAINT "Wards_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "Cities"("cityCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wards" ADD CONSTRAINT "Wards_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "Districts"("districtCode") ON DELETE CASCADE ON UPDATE CASCADE;
