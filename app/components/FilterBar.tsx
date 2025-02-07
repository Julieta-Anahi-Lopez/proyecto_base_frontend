"use client"

import { useState } from "react"

export default function FilterBar() {
  const [priceRange, setPriceRange] = useState(100)

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

          {/* Marca */}
          <select className="border text-gray-600 border-gray-300 rounded-md px-3 py-2 w-full md:w-40">
            <option value="">Seleccione una marca</option>
            <option value="Walker">Walker</option>
            <option value="Hecspi">Hecspi</option>
            <option value="Multimax">Multimax</option>
            <option value="Algabo">Algabo</option>
            <option value="Seiq">Seiq</option>
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
