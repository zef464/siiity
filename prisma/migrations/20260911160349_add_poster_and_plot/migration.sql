/*
  Warnings:

  - You are about to drop the column `notes` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `poster` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "notes",
DROP COLUMN "poster";
