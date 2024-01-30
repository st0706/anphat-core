-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "localCode" INTEGER;

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "group" TEXT,
    "species" TEXT,
    "deviceId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "codeDevice" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "Devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_deviceId_key" ON "Device"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_codeDevice_key" ON "Device"("codeDevice");
