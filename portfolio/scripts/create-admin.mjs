// Creates the initial admin user inside the production container.
// Usage: docker compose exec app node scripts/create-admin.mjs <username> <password>
// Requires DATABASE_URL env (provided by docker compose automatically).
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

async function main() {
  const [username, password] = process.argv.slice(2);
  if (!username || !password || password.length < 8) {
    console.error("Usage: create-admin.mjs <username> <password(min 8 chars)>");
    process.exit(1);
  }
  const prisma = new PrismaClient();
  try {
    const existing = await prisma.adminUser.findUnique({ where: { username } });
    if (existing) {
      console.error(`User "${username}" already exists.`);
      process.exit(1);
    }
    const hash = await bcrypt.hash(password, 12);
    await prisma.adminUser.create({ data: { username, password: hash } });
    console.log(`Admin user "${username}" created.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
