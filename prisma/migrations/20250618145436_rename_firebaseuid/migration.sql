/*
  Warnings:

  - You are about to drop the column `firebaseUid` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[firebaseuid]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `user_firebaseUid_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `firebaseUid`,
    ADD COLUMN `firebaseuid` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_firebaseuid_key` ON `user`(`firebaseuid`);
