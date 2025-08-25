/*
  Warnings:

  - You are about to drop the `_UserFriends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UserFriends";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Friendship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "friendAId" INTEGER NOT NULL,
    "friendBId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Friendship_friendAId_fkey" FOREIGN KEY ("friendAId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Friendship_friendBId_fkey" FOREIGN KEY ("friendBId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_friendAId_friendBId_key" ON "Friendship"("friendAId", "friendBId");
