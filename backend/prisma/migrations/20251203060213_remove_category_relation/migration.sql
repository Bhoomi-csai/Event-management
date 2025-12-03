/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_categoryId_fkey";

-- DropIndex
DROP INDEX "public"."Event_categoryId_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "categoryId",
ADD COLUMN     "category" TEXT;

-- DropTable
DROP TABLE "public"."Category";
