-- CreateTable
CREATE TABLE "UserClusters" (
    "googleUserId" TEXT NOT NULL,
    "googleUsername" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "UserClusters_pkey" PRIMARY KEY ("googleUserId")
);
