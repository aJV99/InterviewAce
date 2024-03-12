/*
  Warnings:

  - The values [SALARY_NEGOTIATION] on the enum `InterviewType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `feedback` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokenExpires` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InterviewType_new" AS ENUM ('GENERAL', 'BEHAVIORAL', 'TECHNICAL', 'BUSINESS', 'LEADERSHIP', 'CUSTOM');
ALTER TABLE "Interview" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Interview" ALTER COLUMN "type" TYPE "InterviewType_new" USING ("type"::text::"InterviewType_new");
ALTER TYPE "InterviewType" RENAME TO "InterviewType_old";
ALTER TYPE "InterviewType_new" RENAME TO "InterviewType";
DROP TYPE "InterviewType_old";
ALTER TABLE "Interview" ALTER COLUMN "type" SET DEFAULT 'GENERAL';
COMMIT;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "feedback",
ADD COLUMN     "exemplarAnswer" TEXT,
ADD COLUMN     "improvements" JSONB,
ADD COLUMN     "strengths" JSONB;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshToken",
DROP COLUMN "refreshTokenExpires";
