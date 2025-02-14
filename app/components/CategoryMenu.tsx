"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

interface SubRubro {
  nrorub: number
  codigo: number
  nombre: string
}

interface Rubro {
  codigo: number
  nombre: string
  subrubros: SubRubro[]
}

export default function CategoryMenu() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [rubros, setRubros] = useState<Rubro[]>([]) 

  function normalizeText(text: string) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  useEffect(() => {
    fetch("http://128.0.204.82:8001/tipo-rubros-con-subrubros/")
      .then((response) => response.json())
      .then((data) => setRubros(data))
      .catch((error) => console.error("Error al obtener categorías:", error))
  }, [])

  return (
    <>
      {/* 🔥 FAB flotante para abrir menú en móviles */}
      <button 
        className="md:hidden fixed bottom-4 left-4 z-50 bg-blue-900 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* 🔥 Menú lateral en pantallas grandes */}
      <div 
        className={`hidden md:flex flex-col bg-blue-900 p-4 transition-all duration-300 ease-in-out 
                    ${isOpen ? "w-64" : "w-16 overflow-hidden min-w-[16px]"}`}
      >
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="mb-4 flex items-center justify-between w-full text-white"
        >
          {isOpen ? <span className="text-lg font-semibold">Categorías</span> : null}
          <Menu className="w-5 h-5" />
        </button>

        <ul className={`${isOpen ? "block" : "hidden"}`}>
          {rubros.map((rubro) => (
            <li key={rubro.codigo} className="mb-2">
              <details>
                <summary className="cursor-pointer font-medium text-white text-lg">
                  {normalizeText(rubro.nombre)}
                </summary>
                {rubro.subrubros.length > 0 && (
                  <ul className="ml-4 mt-2">
                    {rubro.subrubros.map((subrubro) => (
                      <li key={`${subrubro.nrorub}-${subrubro.codigo}`} className="mb-1">
                        <a href="#" className="text-slate-300 hover:underline text-md">
                          {normalizeText(subrubro.nombre)}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </details>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔥 Menú modal en móviles (aparece desde la izquierda) */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex z-[9999]">
          <div className="bg-blue-800 w-64 h-full p-4">
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="mb-4 text-white flex justify-end"
            >
              <X className="w-6 h-6" />
            </button>
            <ul>
              {rubros.map((rubro) => (
                <li key={rubro.codigo} className="mb-2">
                  <details>
                    <summary className="cursor-pointer font-medium text-white text-lg">
                      {normalizeText(rubro.nombre)}
                    </summary>
                    {rubro.subrubros.length > 0 && (
                      <ul className="ml-4 mt-2">
                        {rubro.subrubros.map((subrubro) => (
                          <li key={`${subrubro.nrorub}-${subrubro.codigo}`} className="mb-1">
                            <a href="#" className="text-slate-300 hover:underline text-md">
                              {normalizeText(subrubro.nombre)}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
