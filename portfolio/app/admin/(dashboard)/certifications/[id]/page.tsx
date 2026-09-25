import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CertificationForm from "@/components/admin/CertificationForm";

export default async function EditCertificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cert = await prisma.certification.findUnique({ where: { id } });
  if (!cert) notFound();
  return <CertificationForm cert={cert} />;
}
