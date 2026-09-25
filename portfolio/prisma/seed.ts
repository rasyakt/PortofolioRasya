import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PROJECTS = [
  {
    title: "CV. Gasela Group Official Portal",
    slug: "gasela-group-portal",
    category: "enterprise",
    description:
      "Multi-sector business showcase portal with integrated HRIS gateway for CV. Gasela Group — a diversified conglomerate spanning logistics, retail, and services.",
    longDesc:
      "Built a comprehensive corporate web portal that serves as the digital face of CV. Gasela Group. The platform integrates seamlessly with the GaselaPulse HRIS system, providing real-time data visibility for HR and management teams.",
    problem:
      "CV. Gasela Group lacked a unified digital presence and had no centralized gateway for their HR operations across multiple business units.",
    solution:
      "Designed and built a Next.js + NestJS monorepo platform with role-based access, REST API integration, and a clean corporate design system.",
    architecture:
      "Next.js 14 (frontend) + NestJS (backend API) + MySQL + Prisma ORM + Docker containerization + Nginx reverse proxy",
    impact:
      "Reduced HR administrative overhead by 40%. Unified 3 business units under one digital platform. Improved stakeholder visibility with real-time dashboards.",
    techStack: JSON.stringify(["Next.js", "NestJS", "TypeScript", "MySQL", "Prisma", "REST API", "Docker"]),
    liveUrl: "https://gasela.my.id",
    hkiNumber: null,
    featured: true,
    order: 1,
  },
  {
    title: "GaselaPulse HRIS",
    slug: "gaselaPulse-hris",
    category: "enterprise",
    description:
      "Full-featured Human Resource Information System with automated payroll computation, GPS attendance tracking, and performance analytics dashboard.",
    longDesc:
      "GaselaPulse is an enterprise-grade HRIS platform purpose-built for CV. Gasela Group's operational requirements. It handles the complete HR lifecycle from onboarding to payroll.",
    problem:
      "Manual attendance tracking and spreadsheet-based payroll were causing errors and consuming 20+ hours of HR time monthly.",
    solution:
      "Built an automated HRIS with GPS-based attendance, rule-based payroll engine, and real-time analytics — cutting payroll errors to zero.",
    architecture:
      "Next.js (App Router) + NestJS microservices + MySQL + Prisma + JWT Auth + REST API",
    impact:
      "Zero payroll errors post-deployment. 20+ hrs/month saved in HR processing. 100% attendance accuracy via GPS validation.",
    techStack: JSON.stringify(["Next.js", "NestJS", "MySQL", "Prisma", "TypeScript", "JWT"]),
    liveUrl: null,
    hkiNumber: null,
    featured: true,
    order: 2,
  },
  {
    title: "ARTIKA POS",
    slug: "artika-pos",
    category: "enterprise",
    description:
      "Kemenkumham HKI-registered retail point-of-sale ecosystem for minimarket management — featuring barcode scanning, inventory audit, and financial reporting.",
    longDesc:
      "ARTIKA POS is a comprehensive retail management system registered under Indonesian Intellectual Property Law (Kemenkumham). It handles the full retail cycle from inventory management to sales reporting.",
    problem:
      "A local minimarket chain was using manual ledgers for inventory and sales tracking, leading to stock discrepancies and revenue leakage.",
    solution:
      "Developed a full-featured POS system with barcode scan integration, automated stock alerts, and Chart.js-powered financial dashboards.",
    architecture:
      "Laravel 12 + MySQL + Bootstrap 5 + Tailwind CSS + Chart.js + Barcode.js + REST API",
    impact:
      "Eliminated stock discrepancies. Real-time inventory visibility. 3x faster checkout process. Registered Kemenkumham HKI No. 001416260.",
    techStack: JSON.stringify(["Laravel 12", "MySQL", "Bootstrap 5", "Tailwind CSS", "Chart.js", "PHP"]),
    liveUrl: null,
    hkiNumber: "001416260",
    featured: true,
    order: 3,
  },
  {
    title: "ETAMU-KCD Digital Guestbook",
    slug: "etamu-kcd",
    category: "systems",
    description:
      "HKI-registered digital guestbook system with Face Recognition API for KCD Area XIII Education Department — replacing paper-based visitor logs.",
    longDesc:
      "ETAMU-KCD modernizes the visitor management process at the West Java Regional Education Coordination Office (KCD Area XIII) using AI-powered face recognition for identity verification.",
    problem:
      "The Education Department used paper logbooks for thousands of monthly visitors, creating administrative bottlenecks and security gaps.",
    solution:
      "Built a digital guestbook with face recognition-based identity verification, real-time visitor tracking, and automated reporting for department heads.",
    architecture:
      "Laravel 12 + MySQL + Tailwind CSS + Filament Admin + Face Recognition API + RESTful endpoints",
    impact:
      "100% paperless visitor management. Face recognition accuracy >95%. Registered Kemenkumham HKI No. 001449497.",
    techStack: JSON.stringify(["Laravel 12", "MySQL", "Tailwind CSS", "Filament", "Face Recognition API", "PHP"]),
    liveUrl: null,
    hkiNumber: "001449497",
    featured: true,
    order: 4,
  },
  {
    title: "Calakan — Ramadan Activity Tracker",
    slug: "calakan",
    category: "systems",
    description:
      "Kemenkumham HKI-registered student daily religious activity tracking system with teacher validation workflows — built for Ramadan academic monitoring.",
    longDesc:
      "Calakan is a dedicated platform for tracking and validating students' daily Ramadan religious activities (ibadah) with a structured teacher approval workflow.",
    problem:
      "Schools had no systematic way to monitor and validate students' Ramadan religious activities, relying on easily-falsified paper submissions.",
    solution:
      "Built a structured digital tracking system where students log daily activities, and teachers validate submissions through a Filament admin panel with audit trails.",
    architecture:
      "Laravel 13 + MySQL + Tailwind CSS + Filament + PHP + Role-based Auth",
    impact:
      "Used by 500+ students. Zero falsification incidents. Teacher workload reduced by 60%. Registered Kemenkumham HKI No. 001448869.",
    techStack: JSON.stringify(["Laravel 13", "MySQL", "Tailwind CSS", "Filament", "PHP"]),
    liveUrl: null,
    hkiNumber: "001448869",
    featured: true,
    order: 5,
  },
  {
    title: "MAS-PKL Internship Tracker",
    slug: "mas-pkl",
    category: "systems",
    description:
      "Vocational internship management system with real-time geofencing location mapping — ensuring students actually attend their internship placements.",
    longDesc:
      "MAS-PKL digitizes the entire vocational internship (PKL) process from placement management to daily attendance verification using geolocation APIs.",
    problem:
      "Vocational schools had no way to verify that students were physically present at their internship sites, making attendance fraud trivially easy.",
    solution:
      "Built a geofenced check-in system where students can only log attendance when within a GPS-verified radius of their internship location.",
    architecture:
      "Laravel 13 + MySQL + Tailwind CSS + PHP + Geolocation API + Google Maps integration",
    impact:
      "100% attendance fraud elimination. Real-time teacher oversight. Used across multiple vocational classes.",
    techStack: JSON.stringify(["Laravel 13", "MySQL", "Tailwind CSS", "PHP", "Geolocation API"]),
    liveUrl: null,
    hkiNumber: null,
    featured: false,
    order: 6,
  },
  {
    title: "a-Sign Teacher Attendance",
    slug: "a-sign",
    category: "systems",
    description:
      "Teacher assembly geofencing attendance system with real-time analytics — ensuring accurate, fraud-proof assembly attendance at scale.",
    longDesc:
      "a-Sign provides schools with a reliable, geofence-enforced teacher attendance system that integrates with administrative dashboards for real-time reporting.",
    problem:
      "Traditional paper-based teacher roll-calls at school assemblies were slow, inaccurate, and provided no data for administrative analysis.",
    solution:
      "Deployed a geolocation-based attendance system where teachers check in via smartphone within the school geofence, with instant admin visibility.",
    architecture:
      "Laravel 13 + MySQL + Tailwind CSS + Geolocation API + Real-time analytics dashboard",
    impact:
      "Attendance processing time reduced from 15 min to 30 seconds. 100% data accuracy. Real-time analytics for administration.",
    techStack: JSON.stringify(["Laravel 13", "MySQL", "Tailwind CSS", "PHP", "Geolocation API"]),
    liveUrl: null,
    hkiNumber: null,
    featured: false,
    order: 7,
  },
  {
    title: "Whoosh Enterprise Portal",
    slug: "whoosh-enterprise",
    category: "enterprise",
    description:
      "High-speed rail operations management portal (Whoosh HSR) with companion native Android app — managing train operations, ticketing, and staff coordination.",
    longDesc:
      "Whoosh Enterprise is a full-stack operations platform for Indonesia's first high-speed rail network, complemented by a native Kotlin Android app for field staff.",
    problem:
      "Whoosh HSR needed a unified operations portal that could handle real-time train status, staff scheduling, and passenger management across their network.",
    solution:
      "Built a Laravel-based enterprise portal with Livewire real-time updates, SQL Server integration, and a companion Android app for mobile operations staff.",
    architecture:
      "Laravel 13 + SQL Server + Livewire + Tailwind CSS + REST API + Native Kotlin Android App",
    impact:
      "Unified operations dashboard across entire HSR network. Real-time status updates. Mobile-first field staff operations.",
    techStack: JSON.stringify(["Laravel 13", "SQL Server", "Livewire", "Tailwind CSS", "REST API", "Kotlin", "Android"]),
    liveUrl: null,
    hkiNumber: null,
    featured: true,
    order: 8,
  },
  {
    title: "Simantap Asset Manager",
    slug: "simantap",
    category: "systems",
    description:
      "QR code-based asset and inventory management system — enabling institutions to track physical assets from acquisition to disposal with full audit trails.",
    longDesc:
      "Simantap is a comprehensive asset lifecycle management system that uses QR code labels to track physical assets across organizational units.",
    problem:
      "Institutions were losing track of expensive assets due to manual ledgers and lacked an audit trail for asset transfers between departments.",
    solution:
      "Built a QR-code-first asset management system with scan-to-check-out functionality, depreciation tracking, and full transfer audit logs.",
    architecture:
      "Laravel 13 + MySQL + Tailwind CSS + Livewire + QR Code generation + PDF reporting",
    impact:
      "100% asset traceability. Zero lost asset incidents post-deployment. Complete audit trail for institutional compliance.",
    techStack: JSON.stringify(["Laravel 13", "MySQL", "Tailwind CSS", "Livewire", "PHP", "QR Code"]),
    liveUrl: null,
    hkiNumber: null,
    featured: false,
    order: 9,
  },
  {
    title: "Travix — Flight Booking Platform",
    slug: "travix",
    category: "fullstack",
    description:
      "Modern flight booking platform with real-time seat selection, dynamic pricing, and seamless checkout experience built on Laravel and PostgreSQL.",
    longDesc:
      "Travix is a consumer-facing flight booking platform with a focus on clean UX, real-time availability updates, and a streamlined 3-step booking flow.",
    problem:
      "Existing flight booking solutions were bloated and had poor mobile UX, leading to high cart abandonment rates.",
    solution:
      "Built a lightweight, mobile-first booking platform with Livewire-powered real-time seat maps and instant price updates.",
    architecture:
      "Laravel 13 + PostgreSQL + Livewire + Tailwind CSS + PHP + Payment gateway integration",
    impact:
      "Streamlined booking flow under 3 minutes. Mobile-first design with 100% responsive layouts.",
    techStack: JSON.stringify(["Laravel 13", "PostgreSQL", "Livewire", "Tailwind CSS", "PHP"]),
    liveUrl: null,
    hkiNumber: null,
    featured: false,
    order: 10,
  },
  {
    title: "LuxeDrive — Luxury Vehicle Booking",
    slug: "luxedrive",
    category: "fullstack",
    description:
      "Premium luxury vehicle rental platform with curated fleet management, real-time availability calendar, and driver assignment system.",
    longDesc:
      "LuxeDrive caters to the premium vehicle rental market with a sophisticated booking interface, fleet management backend, and automated driver assignment.",
    problem:
      "Luxury vehicle rental companies relied on phone bookings and WhatsApp, leading to double-bookings and poor customer experience.",
    solution:
      "Built a digital platform with real-time calendar-based availability, instant booking confirmation, and integrated fleet management.",
    architecture:
      "Laravel 13 + PostgreSQL + Livewire + Tailwind CSS + PHP + Calendar integration",
    impact:
      "Eliminated double-bookings entirely. 24/7 self-service bookings. Increased booking volume by 3x.",
    techStack: JSON.stringify(["Laravel 13", "PostgreSQL", "Livewire", "Tailwind CSS", "PHP"]),
    liveUrl: null,
    hkiNumber: null,
    featured: false,
    order: 11,
  },
  {
    title: "Hexaria — Multiplayer Math Puzzle Game",
    slug: "hexaria",
    category: "fullstack",
    description:
      "Real-time multiplayer math puzzle game with hexagonal grid mechanics, live leaderboards, and WebSocket-powered head-to-head competition.",
    longDesc:
      "Hexaria is an educational gaming platform that turns mathematical problem-solving into a competitive, real-time multiplayer experience.",
    problem:
      "Math education lacked engagement — students needed an incentive to practice. Traditional EdTech solutions were not compelling enough.",
    solution:
      "Designed a hexagonal-grid math puzzle game with real-time multiplayer capabilities, live scoring, and competitive leaderboards.",
    architecture:
      "Next.js + WebSocket (Socket.io) + Node.js + TypeScript + Canvas API + Real-time leaderboard",
    impact:
      "Significant engagement improvement in math practice sessions. Real-time competitive play with sub-100ms response times.",
    techStack: JSON.stringify(["Next.js", "TypeScript", "Node.js", "Socket.io", "Canvas API"]),
    liveUrl: null,
    hkiNumber: null,
    featured: false,
    order: 12,
  },
];

const CERTIFICATIONS = [
  {
    title: "ARTIKA-POS — Hak Cipta Kemenkumham RI",
    issuer: "Direktorat Jenderal Kekayaan Intelektual (DJKI) — Kemenkumham RI",
    issueDate: "Agustus 2026",
    type: "hki",
    regNumber: "001416260",
    order: 1,
  },
  {
    title: "ETAMU-KCD — Hak Cipta Kemenkumham RI",
    issuer: "Direktorat Jenderal Kekayaan Intelektual (DJKI) — Kemenkumham RI",
    issueDate: "Agustus 2026",
    type: "hki",
    regNumber: "001449497",
    order: 2,
  },
  {
    title: "Calakan — Hak Cipta Kemenkumham RI",
    issuer: "Direktorat Jenderal Kekayaan Intelektual (DJKI) — Kemenkumham RI",
    issueDate: "Agustus 2026",
    type: "hki",
    regNumber: "001448869",
    order: 3,
  },
  {
    title: "End-to-End Agentic AI Workflows",
    issuer: "IBM SkillsBuild & Hacktiv8 Indonesia",
    issueDate: "2025",
    type: "cert",
    regNumber: null,
    order: 4,
  },
  {
    title: "West Java LKS — Web Technologies Delegate",
    issuer: "Dinas Pendidikan & Olahraga Jawa Barat",
    issueDate: "2026",
    type: "award",
    regNumber: null,
    order: 5,
  },
  {
    title: "Microsoft Azure AI Fundamentals",
    issuer: "Microsoft",
    issueDate: "2025",
    type: "cert",
    regNumber: null,
    order: 6,
  },
  {
    title: "Belajar Membuat Aplikasi Back-End untuk Pemula",
    issuer: "Dicoding Indonesia",
    issueDate: "2024",
    type: "cert",
    regNumber: null,
    order: 7,
  },
  {
    title: "ASEAN Foundation Digital Literacy",
    issuer: "ASEAN Foundation",
    issueDate: "2025",
    type: "cert",
    regNumber: null,
    order: 8,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.project.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.profileConfig.deleteMany();
  await prisma.adminUser.deleteMany();

  // Seed projects
  for (const project of PROJECTS) {
    await prisma.project.create({ data: project });
  }
  console.log(`✅ Created ${PROJECTS.length} projects`);

  // Seed certifications
  for (const cert of CERTIFICATIONS) {
    await prisma.certification.create({ data: cert });
  }
  console.log(`✅ Created ${CERTIFICATIONS.length} certifications`);

  // Seed profile
  await prisma.profileConfig.create({
    data: {
      name: "Rasya Syahreza Maulana Zen",
      headline: "Fullstack Mobile & Web Developer | AI Engineer | CTO at BotHax",
      bio: "Saya adalah Fullstack Developer yang berspesialisasi dalam membangun sistem enterprise skala nyata — dari HRIS dan POS hingga platform AI Agentic. Sebagai CTO di BotHax dan LKS Delegate Jawa Barat 2026, saya membawa kombinasi teknis mendalam dengan kepemimpinan engineering yang terbuktikan. Memiliki 3 Hak Cipta terdaftar Kemenkumham RI dari karya nyata yang dipakai oleh institusi pendidikan dan bisnis.",
      location: "Ciamis, West Java, Indonesia",
      email: "rasyasyahrezamaulanazen@gmail.com",
      phone: "+62 838 4055 9238",
      github: "https://github.com/rasyakt",
      linkedin: "https://linkedin.com/in/rasya-syahreza-maulana-zen",
      portfolioUrl: "https://gasela.my.id",
      isAvailable: true,
      availabilityText: "Open for Industrial Internship / Full-time roles",
    },
  });
  console.log("✅ Created profile config");

  // Seed admin user (password: admin123)
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.create({
    data: {
      username: "rasya",
      password: hashedPassword,
    },
  });
  console.log("✅ Created admin user (username: rasya, password: admin123)");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
