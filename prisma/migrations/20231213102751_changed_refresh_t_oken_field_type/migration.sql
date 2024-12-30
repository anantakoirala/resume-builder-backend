/*
  Warnings:

  - Made the column `refreshToken` on table `Secrets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Secrets` MODIFY `refreshToken` TEXT NOT NULL;
