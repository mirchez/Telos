-- CreateTable
CREATE TABLE "Usage" (
    "key" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("key")
);
