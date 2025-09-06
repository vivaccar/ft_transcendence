/*
  Warnings:

  - You are about to drop the column `isLogged` on the `User` table. All the data in the column will be lost.

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
    "lastPing" DATETIME
);
INSERT INTO "new_User" ("avatar", "email", "has2fa", "id", "passwordHash", "secret2fa", "username") SELECT "avatar", "email", "has2fa", "id", "passwordHash", "secret2fa", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
