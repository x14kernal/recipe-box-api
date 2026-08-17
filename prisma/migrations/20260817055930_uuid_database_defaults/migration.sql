/*
  Warnings:

  - The primary key for the `recipe_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `recipes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `recipes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `tags` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `recipe_id` on the `recipe_tags` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tag_id` on the `recipe_tags` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `created_at` on table `recipes` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `user_id` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "recipe_tags" DROP CONSTRAINT "recipe_tags_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_tags" DROP CONSTRAINT "recipe_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_user_id_fkey";

-- AlterTable
ALTER TABLE "recipe_tags" DROP CONSTRAINT "recipe_tags_pkey",
DROP COLUMN "recipe_id",
ADD COLUMN     "recipe_id" UUID NOT NULL,
DROP COLUMN "tag_id",
ADD COLUMN     "tag_id" UUID NOT NULL,
ADD CONSTRAINT "recipe_tags_pkey" PRIMARY KEY ("recipe_id", "tag_id");

-- AlterTable
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "created_at" SET NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "recipes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tags" DROP CONSTRAINT "tags_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "created_at" SET NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "recipes_user_id_idx" ON "recipes"("user_id");

-- AddForeignKey
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
