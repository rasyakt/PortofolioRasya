-- Widen long string columns to TEXT for MySQL.
-- All statements are idempotent replays (safe to run on partially migrated DB).
ALTER TABLE `Project` MODIFY `description` TEXT NOT NULL;
ALTER TABLE `Project` MODIFY `longDesc` TEXT NULL;
ALTER TABLE `Project` MODIFY `problem` TEXT NULL;
ALTER TABLE `Project` MODIFY `solution` TEXT NULL;
ALTER TABLE `Project` MODIFY `architecture` TEXT NULL;
ALTER TABLE `Project` MODIFY `impact` TEXT NULL;
ALTER TABLE `Project` MODIFY `techStack` TEXT NOT NULL;
ALTER TABLE `Project` MODIFY `liveUrl` TEXT NULL;
ALTER TABLE `Project` MODIFY `githubUrl` TEXT NULL;
ALTER TABLE `Project` MODIFY `coverImage` TEXT NULL;
ALTER TABLE `Certification` MODIFY `credentialUrl` TEXT NULL;
ALTER TABLE `Certification` MODIFY `badgeImage` TEXT NULL;
ALTER TABLE `ProfileConfig` MODIFY `bio` TEXT NOT NULL;
ALTER TABLE `SiteEvent` MODIFY `path` TEXT NOT NULL;
