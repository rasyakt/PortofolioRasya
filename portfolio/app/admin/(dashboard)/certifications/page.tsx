import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import CertList from "@/components/admin/CertList";

export default async function AdminCertificationsPage() {
  const certs = await prisma.certification.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label mb-1">CMS</p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Certifications
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {certs.length} records — HKI, Certificates, Awards
          </p>
        </div>
        <Link href="/admin/certifications/new" className="btn btn-primary">
          <Plus size={15} /> New Record
        </Link>
      </div>

      <CertList certs={certs} />
    </div>
  );
}
