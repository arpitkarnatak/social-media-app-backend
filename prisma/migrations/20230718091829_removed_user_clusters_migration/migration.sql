/*
  Warnings:

  - You are about to drop the column `googleUsername` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `UserCluster` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_id_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "googleUsername",
ADD COLUMN     "displayName" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "UserCluster";

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_key" ON "Profile"("id");
