/*
  Warnings:

  - You are about to drop the column `live_stream_id` on the `ChatRoom` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "LiveMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "payload" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "live_stream_id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "LiveMessage_live_stream_id_fkey" FOREIGN KEY ("live_stream_id") REFERENCES "LiveStream" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LiveMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_ChatRoom" ("created_at", "id", "updated_at") SELECT "created_at", "id", "updated_at" FROM "ChatRoom";
DROP TABLE "ChatRoom";
ALTER TABLE "new_ChatRoom" RENAME TO "ChatRoom";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
