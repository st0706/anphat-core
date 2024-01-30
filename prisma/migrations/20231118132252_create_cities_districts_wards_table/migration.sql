-- AlterTable
-- ALTER TABLE "Team" ADD COLUMN     "localCode" INTEGER;

-- CreateTable
CREATE TABLE "Cities" (
    "id" TEXT NOT NULL,
    "cityCode" TEXT NOT NULL,
    "cityName" TEXT NOT NULL,

    CONSTRAINT "Cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Districts" (
    "id" TEXT NOT NULL,
    "districtCode" TEXT NOT NULL,
    "districtName" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,

    CONSTRAINT "Districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wards" (
    "id" TEXT NOT NULL,
    "wardCode" TEXT NOT NULL,
    "wardName" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "Wards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cities_cityCode_key" ON "Cities"("cityCode");

-- CreateIndex
CREATE UNIQUE INDEX "Districts_districtCode_key" ON "Districts"("districtCode");

-- CreateIndex
CREATE UNIQUE INDEX "Wards_wardCode_key" ON "Wards"("wardCode");

-- AddForeignKey
ALTER TABLE "Districts" ADD CONSTRAINT "Districts_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "Cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wards" ADD CONSTRAINT "Wards_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "Cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wards" ADD CONSTRAINT "Wards_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "Districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropAdDivisionInfo
DROP TABLE IF EXISTS "AdDivisionInfo";
