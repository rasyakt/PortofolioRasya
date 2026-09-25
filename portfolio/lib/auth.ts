import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const SESSION_COOKIE = "rasya_admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "rasya-portfolio-secret-2026";

export async function verifyAdminCredentials(username: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  return valid ? user : null;
}

export async function createSession(userId: string) {
  const cookieStore = await cookies();
  const sessionToken = Buffer.from(`${userId}:${SESSION_SECRET}:${Date.now()}`).toString("base64");
  cookieStore.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return sessionToken;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [userId, secret] = decoded.split(":");
    if (secret !== SESSION_SECRET) return null;
    const user = await prisma.adminUser.findUnique({ where: { id: userId } });
    return user;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
