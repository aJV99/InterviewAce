/*
  Warnings:

  - Added the required column `title` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "userResponse" DROP NOT NULL,
ALTER COLUMN "feedback" DROP NOT NULL;
