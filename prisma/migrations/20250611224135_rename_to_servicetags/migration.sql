/*
  Warnings:

  - You are about to drop the `service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userservice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `userservice` DROP FOREIGN KEY `userservice_serviceid_fkey`;

-- DropForeignKey
ALTER TABLE `userservice` DROP FOREIGN KEY `userservice_userid_fkey`;

-- DropTable
DROP TABLE `service`;

-- DropTable
DROP TABLE `userservice`;

-- CreateTable
CREATE TABLE `servicetag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `createdat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userservicetag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` INTEGER NOT NULL,
    `servicetagid` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userservicetag` ADD CONSTRAINT `userservicetag_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userservicetag` ADD CONSTRAINT `userservicetag_servicetagid_fkey` FOREIGN KEY (`servicetagid`) REFERENCES `servicetag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
