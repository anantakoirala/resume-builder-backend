/*
  Warnings:

  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `provider` ENUM('email', 'github', 'google') NOT NULL;

-- CreateTable
CREATE TABLE `Secrets` (
    `id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `lastSignedIn` DATETIME(3) NULL,
    `verificationToken` VARCHAR(191) NULL,
    `twoFactorSecret` VARCHAR(191) NULL,
    `refreshToken` VARCHAR(191) NULL,
    `resetToken` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Secrets_resetToken_key`(`resetToken`),
    UNIQUE INDEX `Secrets_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resume` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `data` JSON NOT NULL,
    `visibility` ENUM('public', 'private') NOT NULL DEFAULT 'private',
    `locked` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Resume_userId_idx`(`userId`),
    UNIQUE INDEX `Resume_userId_id_key`(`userId`, `id`),
    UNIQUE INDEX `Resume_userId_slug_key`(`userId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Secrets` ADD CONSTRAINT `Secrets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resume` ADD CONSTRAINT `Resume_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
