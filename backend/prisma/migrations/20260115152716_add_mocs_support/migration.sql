-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "isMOC" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "note_mocs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mocId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,

    CONSTRAINT "note_mocs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "note_mocs_mocId_idx" ON "note_mocs"("mocId");

-- CreateIndex
CREATE INDEX "note_mocs_noteId_idx" ON "note_mocs"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "note_mocs_mocId_noteId_key" ON "note_mocs"("mocId", "noteId");

-- CreateIndex
CREATE INDEX "notes_isMOC_idx" ON "notes"("isMOC");

-- AddForeignKey
ALTER TABLE "note_mocs" ADD CONSTRAINT "note_mocs_mocId_fkey" FOREIGN KEY ("mocId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_mocs" ADD CONSTRAINT "note_mocs_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
