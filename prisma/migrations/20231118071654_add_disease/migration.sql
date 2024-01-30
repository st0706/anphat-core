-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "localCode" INTEGER;

-- CreateTable
CREATE TABLE "Disease" (
    "id" TEXT NOT NULL,
    "subgroup" TEXT NOT NULL,
    "typecode" TEXT NOT NULL,
    "typename1" TEXT NOT NULL,
    "typename2" TEXT NOT NULL,
    "diseasecode" TEXT NOT NULL,
    "name1" TEXT NOT NULL,
    "name2" TEXT NOT NULL,
    "teamcode" TEXT NOT NULL,
    "detailcode" TEXT NOT NULL,
    "description1" TEXT NOT NULL,
    "description2" TEXT NOT NULL,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);
