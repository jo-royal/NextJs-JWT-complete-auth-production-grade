-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "account_is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;
