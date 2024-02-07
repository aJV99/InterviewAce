-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('GENERAL', 'BEHAVIORAL', 'TECHNICAL', 'BUSINESS', 'SALARY_NEGOTIATION', 'CUSTOM');

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "context" TEXT,
ADD COLUMN     "customType" TEXT,
ADD COLUMN     "type" "InterviewType" NOT NULL DEFAULT 'GENERAL';
