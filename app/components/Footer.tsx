// app/components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative">
      {/* Onda superior azul
      <div className="w-full h-16 bg-blue-700 -mb-1 rounded-b-[50%] transform scale-x-105"></div> */}
      
      {/* Contenido principal del footer */}
      <div className="bg-blue-900 text-white py-8 px-4">
        {/* Logo central */}
        <div className="relative flex justify-center mb-6">
          <div className="absolute -top-24 bg-blue-900 rounded-full p-3 w-32 h-32 flex items-center justify-center">
            <Image
              src="/images/logos/400px x 100 px KLINNER - ENCABEZADO - recortada.png"
              alt="Klinner"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
        </div>

        {/* Secciones del footer en 3 columnas */}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {/* Columna 1: Dónde encontrarnos */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Dónde encontrarnos</h3>
            <p className="mb-2">Libertad 1865, Bahía Blanca</p>
            <p className="mb-2">Tel: +54 9 2914732827</p>
            <p className="mb-2">Email:</p>
            <p>Klinnerdistribuidora@gmail.com</p>
          </div>

          {/* Columna 2: Marcas con las que trabajamos */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Marcas con las que trabajamos</h3>
            <ul className="space-y-2">
              <li>Walker</li>
              <li>Multimax</li>
              <li>Hecspi</li>
              <li>Algabo</li>
              <li>Seiq</li>
            </ul>
          </div>

          {/* Columna 3: Enlaces de interés */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Enlaces de interés</h3>
            <ul className="space-y-2">
              <li><Link href="/politica-privacidad" className="hover:underline">Política de privacidad</Link></li>
              <li><Link href="/terminos" className="hover:underline">Términos y condiciones</Link></li>
              <li><Link href="https://autogestion.produccion.gob.ar/consumidores"  target="_blank" className="hover:underline">Defensa al consumidor</Link></li>
            </ul>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="flex justify-center space-x-6 mt-8">
          <Link href="https://wa.me/5492914732827" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
            <MessageCircle size={24} />
          </Link>
          <Link href="https://instagram.com/klinner" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
            <Instagram size={24} />
          </Link>
          <Link href="https://facebook.com/klinner" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
            <Facebook size={24} />
          </Link>
        </div>


      </div>
    </footer>
  );
}