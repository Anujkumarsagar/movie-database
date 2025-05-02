-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user';
