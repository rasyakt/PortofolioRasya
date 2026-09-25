import { getProjects } from "@/actions/projects";
import { getCertifications } from "@/actions/certifications";
import Hero from "@/components/Hero";
import ProjectBento from "@/components/ProjectBento";
import ProjectGallery from "@/components/ProjectGallery";
import CertificationsGrid from "@/components/CertificationsGrid";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default async function HomePage() {
  const [projects, certs] = await Promise.all([getProjects(), getCertifications()]);

  return (
    <main>
      <Navbar />
      <Hero />
      <ProjectBento />
      <ProjectGallery projects={projects} />
      <CertificationsGrid certs={certs} />
      <ExperienceTimeline />
      <Footer />
    </main>
  );
}
