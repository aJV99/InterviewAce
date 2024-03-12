/*
  Warnings:

  - Made the column `overallScore` on table `Interview` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Interview" ALTER COLUMN "overallScore" SET NOT NULL,
ALTER COLUMN "overallScore" SET DEFAULT 0;
