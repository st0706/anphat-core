-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- DropIndex
DROP INDEX "Organization_name_key";

-- DropIndex
DROP INDEX "Organization_organizationId_key";

-- CreateTable
CREATE TABLE "OrganizationToStaff" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "OrganizationToStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "staffID" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "otherName" TEXT,
    "engName" TEXT,
    "gender" "Gender" NOT NULL,
    "dob" BIGINT NOT NULL,
    "country" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "CID" TEXT NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "issuedDay" BIGINT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "ethnicMinority" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "religion" TEXT,
    "culturalLevel" TEXT NOT NULL,
    "dojCYU" BIGINT,
    "dojCPV" BIGINT,
    "officalDojCPV" BIGINT,
    "avatar" TEXT,
    "habit" TEXT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_staffID_key" ON "Staff"("staffID");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_staffID_email_CID_key" ON "Staff"("staffID", "email", "CID");

-- AddForeignKey
ALTER TABLE "OrganizationToStaff" ADD CONSTRAINT "OrganizationToStaff_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationToStaff" ADD CONSTRAINT "OrganizationToStaff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("staffID") ON DELETE CASCADE ON UPDATE CASCADE;
