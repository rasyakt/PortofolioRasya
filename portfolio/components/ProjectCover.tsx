import Image from "next/image";
import { Building2, Smartphone, BrainCircuit, Server, Layers } from "lucide-react";

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  enterprise: <Building2 size={72} strokeWidth={1} />,
  mobile: <Smartphone size={72} strokeWidth={1} />,
  ai: <BrainCircuit size={72} strokeWidth={1} />,
  systems: <Server size={72} strokeWidth={1} />,
  fullstack: <Layers size={72} strokeWidth={1} />,
};

interface ProjectCoverProps {
  title: string;
  category: string;
  coverImage?: string | null;
  height?: number;
}

/**
 * Project cover visual. Shows the real cover image when available,
 * otherwise a theme-aware monochrome pattern with a category mark.
 */
export default function ProjectCover({ title, category, coverImage, height = 148 }: ProjectCoverProps) {
  if (coverImage) {
    return (
      <div className="relative overflow-hidden" style={{ height }}>
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height,
        background: "var(--bg-elevated)",
        color: "var(--text-muted)",
      }}
    >
      {/* Dot pattern */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <pattern id={`dots-${category}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="currentColor" opacity="0.35" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${category})`} />
      </svg>
      {/* Accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: "3px", background: "var(--accent)", opacity: 0.7 }}
      />
      {/* Watermark icon */}
      <div
        className="absolute -right-3 -bottom-4"
        style={{ opacity: 0.16 }}
      >
        {CATEGORY_ICON[category] || CATEGORY_ICON.fullstack}
      </div>
    </div>
  );
}
