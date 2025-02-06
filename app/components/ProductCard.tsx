"use client"

import { useState } from "react"
import Image from "next/image"
import Modal from "./Modal"

interface ProductProps {
  product: {
    nombre: string
    observ: string
    precio: number
    image: string
  }
}

export default function ProductCard({ product }: ProductProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  function normalizeText(text: string) {
    if (!text) return ""
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

  return (
    <>
      <div className="bg-gray-200 rounded-lg shadow-md overflow-hidden h-full flex flex-col">
        {/* Imagen */}
        <Image
          src={product.image || "/Caja.webp"}
          alt={product.nombre}
          width={300}
          height={300}
          className="w-full h-48 object-cover"
        />

        {/* Contenido */}
        <div className="p-4 flex-grow flex flex-col">
          {/* Nombre */}
          <h2 className="text-sm text-blue-600 font-semibold mb-2 min-h-[3rem] leading-tight">
            {normalizeText(product.nombre)}
          </h2>

          {/* Descripción */}
          <p className="text-gray-600 mb-2 line-clamp-2">{normalizeText(product.observ)}</p>

          {/* Precio */}
          <p className="text-xsm text-blue-600 font-bold mt-auto">${product.precio.toFixed(2)}</p>

          {/* Botón de "Más Información" */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-blue-600 text-white py-1 px-3 rounded-md 
                      hover:bg-blue-700 transition-colors"
          >
            Más Información
          </button>
        </div>
      </div>

      {/* Modal con toda la información */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-semibold text-blue-600">{normalizeText(product.nombre)}</h2>

        {/* Imagen mejorada dentro del modal */}
        <div className="flex justify-center my-4">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.nombre}
            width={500} // Mayor tamaño en el modal
            height={500}
            className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-md shadow-md"
          />
        </div>

        <p className="text-gray-700 mt-2">{normalizeText(product.observ)}</p>
        <p className="text-xl font-bold text-blue-600 mt-4">${product.precio.toFixed(2)}</p>
      </Modal>
    </>
  )
}
