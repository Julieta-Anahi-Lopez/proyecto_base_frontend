"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-blue-900 shadow-md relative z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* 🔥 Sección de logos (Klinner + Walker) */}
        <div className="flex items-center gap-6">
          {/* Logo Klinner */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logos/400px x 100 px KLINNER - ENCABEZADO - recortada.png"
              alt="Logo Klinner"
              width={160}
              height={80}
              priority={true}
              className="object-contain"
            />
          </Link>

          {/* 🔥 Logo Walker + Representante Oficial (centrado verticalmente) */}
          <div className="hidden lg:flex flex-col items-center">
            <Image
              src="/images/logos/400px x 100 px WALKER - ENCABEZADO - recortada.png"
              alt="Logo Walker"
              width={140}
              height={50}
              priority={true}
              className="object-contain"
            />
            <span className="text-white text-sm font-semibold">Representante Oficial Walker</span>
          </div>
        </div>

        {/* 🔥 Botón de Menú en móvil */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white text-2xl"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        {/* 🔥 Menú de navegación en pantallas grandes (centrado horizontalmente) */}
        <nav className="hidden lg:flex space-x-6 text-white text-lg">
          <Link href="/" className="hover:text-gray-300">Inicio</Link>
          <Link href="/productos" className="hover:text-gray-300">Catálogo</Link>
          <Link href="/contacto" className="hover:text-gray-300">Contacto</Link>
        </nav>
      </div>

      {/* 🔥 Menú desplegable en móvil */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-900 shadow-md py-4 flex flex-col items-center space-y-4 text-white text-lg lg:hidden">
          {/* 🔥 Logo Walker y Representante Oficial (ahora visible en móvil) */}
          <div className="flex flex-col items-center">
            <Image
              src="/images/logos/400px x 100 px WALKER - ENCABEZADO - recortada.png"
              alt="Logo Walker"
              width={140}
              height={50}
              className="object-contain"
            />
            <span className="text-white text-sm font-semibold">Representante Oficial Walker</span>
          </div>

          {/* 🔥 Links de navegación */}
          <Link href="/" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
          <Link href="/productos" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
          <Link href="/contacto" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
        </div>
      )}
    </header>
  )
}
