/*
  Warnings:

  - You are about to drop the column `setToDelete` on the `User` table. All the data in the column will be lost.

*/

-- AlterTable
ALTER TABLE "User" DROP COLUMN "setToDelete",
ADD COLUMN     "deleteOnDate" TIMESTAMP(3),
ADD COLUMN     "lastLogin" TIMESTAMP(3);
