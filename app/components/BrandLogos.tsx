// app/components/BrandLogos.tsx
"use client";

import Image from "next/image";
import React from "react";

interface Brand {
  name: string;
  logoUrl: string;
  width: number;
}
export default function BrandLogos() {
  const brands: Brand[] = [
    { name: "MultiMax", logoUrl: "/images/logos/200px x 90 px MULTIMAX - ENCABEZADO.png", width: 140 },
    { name: "Seiq", logoUrl: "/images/logos/200px x 90 px SEIQ - ENCABEZADO.png", width: 120 },
    { name: "Walker", logoUrl: "/images/logos/200px x 90 px WALKER - ENCABEZADO.png", width: 140 },
    { name: "Algabo", logoUrl: "/images/logos/200px x 90 px ALGABO - ENCABEZADO.png", width: 130 },
    { name: "Hecspi", logoUrl: "/images/logos/200px x 90 px HECSPI - ENCABEZADO.png", width: 150 }
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
      {brands.map((brand) => (
        <div 
          key={brand.name} 
          className="relative h-16 transition-transform hover:scale-105"
          style={{ width: `${brand.width}px` }}
        >
          <Image
            src={brand.logoUrl}
            alt={`Logo ${brand.name}`}
            fill
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
}