-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MatchParticipant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "localUser" TEXT,
    "matchId" INTEGER NOT NULL,
    "goals" INTEGER NOT NULL,
    "touches" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "MatchParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MatchParticipant_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MatchParticipant" ("goals", "id", "localUser", "matchId", "userId") SELECT "goals", "id", "localUser", "matchId", "userId" FROM "MatchParticipant";
DROP TABLE "MatchParticipant";
ALTER TABLE "new_MatchParticipant" RENAME TO "MatchParticipant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
