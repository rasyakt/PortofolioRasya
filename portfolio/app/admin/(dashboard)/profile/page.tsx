import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/admin/ProfileForm";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default async function AdminProfilePage() {
  const profile = await prisma.profileConfig.findFirst();
  if (!profile) return <p className="p-8" style={{ color: "var(--text-muted)" }}>Run seed first: npm run db:seed</p>;
  return (
    <div className="p-4 sm:p-8">
      <div className="[&>form]:p-0">
        <ProfileForm profile={profile} />
      </div>
      <ChangePasswordForm />
    </div>
  );
}
