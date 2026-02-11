-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "size" INTEGER NOT NULL,
    "newFilename" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_newFilename_key" ON "File"("newFilename");
