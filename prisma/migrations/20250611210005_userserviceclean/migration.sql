/*
  Warnings:

  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - The primary key for the `userservice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serviceId` on the `userservice` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `userservice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phonenumber]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedat` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceid` to the `userservice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `userservice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `userservice` DROP FOREIGN KEY `UserService_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `userservice` DROP FOREIGN KEY `UserService_userId_fkey`;

-- DropIndex
DROP INDEX `User_phoneNumber_key` ON `user`;

-- DropIndex
DROP INDEX `UserService_serviceId_fkey` ON `userservice`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `createdAt`,
    DROP COLUMN `phoneNumber`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `createdat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `phonenumber` VARCHAR(191) NULL,
    ADD COLUMN `updatedat` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `userservice` DROP PRIMARY KEY,
    DROP COLUMN `serviceId`,
    DROP COLUMN `userId`,
    ADD COLUMN `serviceid` INTEGER NOT NULL,
    ADD COLUMN `userid` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userid`, `serviceid`);

-- CreateIndex
CREATE UNIQUE INDEX `user_phonenumber_key` ON `user`(`phonenumber`);

-- AddForeignKey
ALTER TABLE `userservice` ADD CONSTRAINT `userservice_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userservice` ADD CONSTRAINT `userservice_serviceid_fkey` FOREIGN KEY (`serviceid`) REFERENCES `service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `service` RENAME INDEX `Service_name_key` TO `service_name_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_key` TO `user_email_key`;
