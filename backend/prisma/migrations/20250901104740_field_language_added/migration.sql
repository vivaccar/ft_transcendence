-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'PT',
    "passwordHash" TEXT,
    "has2fa" BOOLEAN NOT NULL DEFAULT false,
    "secret2fa" TEXT,
    "avatar" BLOB,
    "lastPing" BIGINT NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("avatar", "email", "has2fa", "id", "lastPing", "passwordHash", "secret2fa", "username") SELECT "avatar", "email", "has2fa", "id", "lastPing", "passwordHash", "secret2fa", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
