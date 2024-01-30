/*
  Warnings:

  - Added the required column `chaptercode` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chaptername1` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chaptername2` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapternumber` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maingroupcode` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maingroupname1` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maingroupname2` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subgroupcode1` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subgroupcode2` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subgroupname1` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subgroupname11` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subgroupname2` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subgroupname22` to the `Disease` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Disease" ADD COLUMN     "chaptercode" TEXT NOT NULL,
ADD COLUMN     "chaptername1" TEXT NOT NULL,
ADD COLUMN     "chaptername2" TEXT NOT NULL,
ADD COLUMN     "chapternumber" TEXT NOT NULL,
ADD COLUMN     "maingroupcode" TEXT NOT NULL,
ADD COLUMN     "maingroupname1" TEXT NOT NULL,
ADD COLUMN     "maingroupname2" TEXT NOT NULL,
ADD COLUMN     "subgroupcode1" TEXT NOT NULL,
ADD COLUMN     "subgroupcode2" TEXT NOT NULL,
ADD COLUMN     "subgroupname1" TEXT NOT NULL,
ADD COLUMN     "subgroupname11" TEXT NOT NULL,
ADD COLUMN     "subgroupname2" TEXT NOT NULL,
ADD COLUMN     "subgroupname22" TEXT NOT NULL;
