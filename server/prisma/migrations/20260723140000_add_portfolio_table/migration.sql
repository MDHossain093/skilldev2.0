-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "headline" TEXT,
    "about" TEXT,
    "template" TEXT NOT NULL DEFAULT 'modern',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "showAbout" BOOLEAN NOT NULL DEFAULT true,
    "showSkills" BOOLEAN NOT NULL DEFAULT true,
    "showProjects" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_username_key" ON "Portfolio"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_userId_key" ON "Portfolio"("userId");

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

