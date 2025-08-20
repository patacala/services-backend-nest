/*
  Warnings:

  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug_es]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug_en]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_en` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_es` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug_en` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug_es` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_slug_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
DROP COLUMN "slug",
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_es" TEXT NOT NULL,
ADD COLUMN     "slug_en" TEXT NOT NULL,
ADD COLUMN     "slug_es" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_es_key" ON "Category"("slug_es");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_en_key" ON "Category"("slug_en");
