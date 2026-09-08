/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `ingredients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_slug_key" ON "ingredients"("slug");
