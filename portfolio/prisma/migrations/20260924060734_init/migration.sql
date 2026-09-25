-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDesc" TEXT,
    "problem" TEXT,
    "solution" TEXT,
    "architecture" TEXT,
    "impact" TEXT,
    "techStack" TEXT NOT NULL,
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "coverImage" TEXT,
    "hkiNumber" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issueDate" TEXT NOT NULL,
    "credentialUrl" TEXT,
    "badgeImage" TEXT,
    "type" TEXT NOT NULL DEFAULT 'cert',
    "regNumber" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProfileConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Rasya Syahreza Maulana Zen',
    "headline" TEXT NOT NULL DEFAULT 'Fullstack Mobile & Web Developer | AI Engineer | CTO at BotHax',
    "bio" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT 'Ciamis, West Java, Indonesia',
    "email" TEXT NOT NULL DEFAULT 'rasyasyahrezamaulanazen@gmail.com',
    "phone" TEXT NOT NULL DEFAULT '+62 838 4055 9238',
    "github" TEXT NOT NULL DEFAULT 'https://github.com/rasyakt',
    "linkedin" TEXT NOT NULL DEFAULT 'https://linkedin.com/in/rasya-syahreza',
    "portfolioUrl" TEXT NOT NULL DEFAULT 'https://gasela.my.id',
    "cvUrl" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "availabilityText" TEXT NOT NULL DEFAULT 'Open for Industrial Internship / Full-time roles',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
