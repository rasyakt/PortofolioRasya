-- CreateTable
CREATE TABLE `CertificationImage` (
    `id` VARCHAR(191) NOT NULL,
    `certificationId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    INDEX `CertificationImage_certificationId_order_idx`(`certificationId`, `order`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CertificationImage` ADD CONSTRAINT `CertificationImage_certificationId_fkey` FOREIGN KEY (`certificationId`) REFERENCES `Certification`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
