/*
  Warnings:

  - You are about to alter the column `lastPing` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - Made the column `lastPing` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "has2fa" BOOLEAN NOT NULL DEFAULT false,
    "secret2fa" TEXT,
    "avatar" BLOB,
    "lastPing" INTEGER NOT NULL
);
INSERT INTO "new_User" ("avatar", "email", "has2fa", "id", "lastPing", "passwordHash", "secret2fa", "username") SELECT "avatar", "email", "has2fa", "id", "lastPing", "passwordHash", "secret2fa", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
