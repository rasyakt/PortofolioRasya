import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/admin/ProfileForm";

export default async function AdminProfilePage() {
  const profile = await prisma.profileConfig.findFirst();
  if (!profile) return <p className="p-8" style={{ color: "var(--text-muted)" }}>Run seed first: npm run db:seed</p>;
  return <ProfileForm profile={profile} />;
}
