import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Smartphone frame for portrait app screenshots (mobile-category projects).
 * Bezel, notch, side buttons, home indicator + subtle screen glare.
 * Cycles through multiple shots with arrows + counter when provided.
 */
export default function PhoneMockup({
  images,
  index = 0,
  title,
  width = 270,
  onNavigate,
}: {
  images: string[];
  index?: number;
  title: string;
  width?: number;
  onNavigate?: (index: number) => void;
}) {
  const src = images.length > 0 ? images[index % images.length] : null;
  const multi = images.length > 1;
  const go = (dir: 1 | -1) => {
    if (!multi || !onNavigate) return;
    onNavigate((index + dir + images.length) % images.length);
  };

  return (
    <div className="mx-auto" style={{ width: `min(${width}px, 72vw)` }}>
      <div
        className="relative rounded-[2.6rem] p-[11px]"
        style={{
          background: "linear-gradient(145deg, #3a3a3e 0%, #101012 30%, #2b2b2e 70%, #0c0c0e 100%)",
          boxShadow: "0 30px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* Side buttons */}
        <span aria-hidden="true" className="absolute rounded-full" style={{ left: "-2.5px", top: "110px", width: "3px", height: "52px", background: "#3a3a3e" }} />
        <span aria-hidden="true" className="absolute rounded-full" style={{ left: "-2.5px", top: "172px", width: "3px", height: "84px", background: "#3a3a3e" }} />
        <span aria-hidden="true" className="absolute rounded-full" style={{ right: "-2.5px", top: "140px", width: "3px", height: "64px", background: "#3a3a3e" }} />

        {/* Screen */}
        <div
          className="relative overflow-hidden rounded-[2rem]"
          style={{ aspectRatio: "9 / 19", background: "#000" }}
        >
          {src && (
            <Image
              key={src}
              src={src}
              alt={title}
              fill
              sizes="280px"
              style={{ objectFit: "cover", objectPosition: "top center" }}
              unoptimized
            />
          )}
          {/* Notch */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{ top: "10px", width: "96px", height: "24px", background: "#000" }}
          />
          {/* Screen glare */}
          <span
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.14) 0%, transparent 28%)" }}
          />
          {/* Home indicator */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{ bottom: "7px", width: "104px", height: "4px", background: "rgba(255,255,255,0.75)" }}
          />
          {/* Shot nav */}
          {multi && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer"
                style={{ background: "rgba(0,0,0,0.55)", color: "#fff", border: "none" }}
                aria-label="Previous screenshot"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); go(1); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer"
                style={{ background: "rgba(0,0,0,0.55)", color: "#fff", border: "none" }}
                aria-label="Next screenshot"
              >
                <ChevronRight size={16} />
              </button>
              <span
                className="absolute bottom-2 right-2 badge"
                style={{ fontSize: "10px", background: "rgba(0,0,0,0.65)", color: "#fff", borderColor: "transparent" }}
              >
                {(index % images.length) + 1}/{images.length}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
