// app/components/WaveSection.tsx (con SVG)
"use client";

import React from "react";

interface WaveSectionProps {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}

export default function WaveSection({ 
  children, 
  className = "", 
  bgColor = "bg-blue-900"
}: WaveSectionProps) {
  return (
    <section className={`relative ${bgColor} ${className} overflow-hidden`}>
      {/* SVG waves background - solo visible en lg y superior */}
      <div className="absolute inset-0 w-full h-full z-0 hidden lg:block">
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", position: "absolute" }}
        >
          <path
            fill="rgba(255, 255, 255, 0.1)"
            d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,218.7C672,245,768,267,864,250.7C960,235,1056,181,1152,170.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path
            fill="rgba(255, 255, 255, 0.15)"
            d="M0,96L48,128C96,160,192,224,288,218.7C384,213,480,139,576,122.7C672,107,768,149,864,181.3C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-10">
        {children}
      </div>
    </section>
  );
}