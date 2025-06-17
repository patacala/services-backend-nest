/*
  Warnings:

  - You are about to drop the column `updatedat` on the `user` table. All the data in the column will be lost.
  - The primary key for the `userservice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `userservice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `userservice` DROP FOREIGN KEY `userservice_serviceid_fkey`;

-- DropForeignKey
ALTER TABLE `userservice` DROP FOREIGN KEY `userservice_userid_fkey`;

-- DropIndex
DROP INDEX `service_name_key` ON `service`;

-- DropIndex
DROP INDEX `userservice_serviceid_fkey` ON `userservice`;

-- AlterTable
ALTER TABLE `service` ADD COLUMN `createdat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` DROP COLUMN `updatedat`;

-- AlterTable
ALTER TABLE `userservice` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `otpcode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` INTEGER NOT NULL,
    `phonenumber` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `expiresat` DATETIME(3) NOT NULL,
    `createdat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userservice` ADD CONSTRAINT `userservice_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userservice` ADD CONSTRAINT `userservice_serviceid_fkey` FOREIGN KEY (`serviceid`) REFERENCES `service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otpcode` ADD CONSTRAINT `otpcode_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
