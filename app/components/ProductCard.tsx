"use client";
import { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { useDispatch } from "react-redux"; // Importamos Redux
import { addToCart } from "@/redux/slices/cartSlice"; // Importamos la acción para agregar al carrito

interface ProductProps {
  product: {
    codigo: string;
    nombre: string;
    observ: string;
    precio: number;
    imagenes: { foto_1: string }[];
  };
}

export default function ProductCard({ product }: ProductProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch(); // Inicializamos Redux

  function normalizeText(text: string) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  const productImage = product.imagenes?.[0]?.foto_1 || "/Caja.webp";

  // Función para agregar el producto al carrito
  const handleAddToCart = () => {
    const item = {
      codigo: product.codigo,
      nombre: product.nombre,
      precio: product.precio,
      image: productImage, // Aseguramos que la imagen se pase correctamente
    };
    dispatch(addToCart(item));
  };

  return (
    <>
<div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[460px]">
  {/* Imagen más alta */}
  <div className="relative h-64 bg-gray-50 border-b border-gray-200">
    <Image
      src={productImage}
      alt={product.nombre}
      fill
      className="object-contain p-3"
    />
  </div>

  {/* Contenido */}
  <div className="flex flex-col justify-between flex-grow p-4 gap-3">
    <div>
      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
        {normalizeText(product.nombre)}
      </h3>
      {/* <p className="text-xs text-gray-500 line-clamp-2">
        {normalizeText(product.observ)}
      </p> */}
    </div>

    {/* Precio bien integrado */}
    <div className="flex justify-end">
      <span className="text-base font-semibold text-gray-900">${product.precio.toFixed(2)}</span>
    </div>

    {/* Acciones */}
    <div className="mt-auto flex gap-2">
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex-1 text-sm text-gray-700 border border-gray-300 rounded-md py-1.5 hover:bg-gray-100 transition"
      >
        Más Info
      </button>
      <button
        onClick={handleAddToCart}
        className="flex-1 text-sm text-white bg-gray-800 rounded-md py-1.5 hover:bg-black transition"
      >
        Agregar
      </button>
    </div>
  </div>
</div>

      {/* Modal con toda la información */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={normalizeText(product.nombre)} description={product.observ}>
        <div className="relative h-80 bg-gray-100 mb-4">
          <Image
            src={productImage}
            alt={product.nombre}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-6"
          />
        </div>
      </Modal>
    </>
  );
}




{/* <h2 className="text-2xl font-bold mb-4">{normalizeText(product.nombre)}</h2>
<div className="relative h-64 bg-gray-100 mb-4">
  <Image
    src={productImage}
    alt={product.nombre}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-contain p-2"
  />
</div>
<p className="text-gray-700 mb-4">{normalizeText(product.observ)}</p>
<p className="text-2xl font-bold text-blue-600 mb-6">${product.precio.toFixed(2)}</p>

{/* Botón para agregar al carrito dentro del modal */}
{/* <button
  onClick={handleAddToCart}
  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
>
  🛒 Agregar al Carrito
</button>  */}






