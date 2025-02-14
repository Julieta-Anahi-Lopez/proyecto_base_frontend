"use client"

import { useState, useEffect } from "react"

interface Marca {
  codigo: number
  nombre: string
  verweb: number
}

export default function FilterBar() {
  const [priceRange, setPriceRange] = useState(100)
  const [marcas, setMarcas] = useState<Marca[]>([]) // 🔥 Estado para guardar las marcas

  useEffect(() => {
    fetch("http://128.0.204.82:8001/tipo-marcas/")
      .then((response) => response.json())
      .then((data) => {
        // 🔥 Filtramos solo las marcas con verweb === 1
        const marcasFiltradas = data.filter((marca: Marca) => marca.verweb === 1)
        setMarcas(marcasFiltradas)
      })
      .catch((error) => console.error("Error al obtener las marcas:", error))
  }, [])

  return (
    <div className="bg-gray-100 p-3 md:p-4 shadow-md overflow-hidden">
      <div className="container max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full">
          
          {/* Código */}
          <input
            type="text"
            placeholder="Código"
            className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-40"
          />

          {/* Nombre */}
          <input
            type="text"
            placeholder="Nombre"
            className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-60"
          />

          {/* 🔥 Select de Marca con opciones dinámicas */}
          <select className="border text-gray-600 border-gray-300 rounded-md px-3 py-2 w-full md:w-48">
            <option value="">Seleccione una marca</option>
            {marcas.map((marca) => (
              <option key={marca.codigo} value={marca.codigo}>
                {marca.nombre}
              </option>
            ))}
          </select>

          {/* Rango de Precios */}
          <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
            <label className="text-gray-700 text-sm whitespace-nowrap">Precio:</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full md:w-40"
            />
            <span className="text-gray-700 text-sm">${priceRange}</span>
          </div>

        </div>
      </div>
    </div>
  )
}
