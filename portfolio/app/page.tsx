import { getProjects } from "@/actions/projects";
import { getCertifications } from "@/actions/certifications";
import { getExperiences } from "@/actions/experience";
import { getSkills } from "@/actions/skills";
import { getProfile } from "@/actions/profile";
import Hero from "@/components/Hero";
import ProjectBento from "@/components/ProjectBento";
import ProjectGallery from "@/components/ProjectGallery";
import CertificationsGrid from "@/components/CertificationsGrid";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SiteChrome from "@/components/SiteChrome";

function safeParseJsonArray(str?: string | null): string[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [projects, certs, profile, experiences, skills] = await Promise.all([
    getProjects(),
    getCertifications(),
    getProfile(),
    getExperiences(),
    getSkills(),
  ]);

  const areas = skills
    .filter((s) => s.kind === "area")
    .map((s) => ({ title: s.title, desc: s.desc ?? "" }));
  const tech = skills.filter((s) => s.kind !== "area").map((s) => s.title);
  const hkiCerts = certs.filter((c) => c.type === "hki");
  const timeline = experiences.map((e) => ({
    year: e.year,
    role: e.role,
    company: e.company,
    points: safeParseJsonArray(e.points),
  }));

  return (
    <main>
      <SiteChrome />
      <Navbar />
      <Hero
        profile={profile}
        projectCount={projects.length}
        hkiCount={hkiCerts.length}
        certCount={certs.length}
        hkiCerts={hkiCerts}
        tech={tech}
      />
      <ProjectBento areas={areas} tech={tech} />
      <ProjectGallery projects={projects} />
      <CertificationsGrid certs={certs} />
      <ExperienceTimeline items={timeline} />
      <Footer profile={profile} />
    </main>
  );
}
