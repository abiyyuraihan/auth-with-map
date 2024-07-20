/*
  Warnings:

  - You are about to drop the column `category` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `category`,
    ADD COLUMN `alamat` VARCHAR(191) NULL;
