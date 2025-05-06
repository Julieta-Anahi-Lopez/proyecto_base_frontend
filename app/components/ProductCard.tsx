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
    publico: number;
    imagenes: { foto_1: string }[];
  };
}

export default function ProductCard({ product }: ProductProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch(); // Inicializamos Redux

  const [showToast, setShowToast] = useState(false);

  // Función para formatear precios con separador de miles y coma decimal
// Función para formatear precios con punto como separador de miles y coma decimal
function formatPrice(price: number): string {
  // Convertir a string con 2 decimales fijos
  const fixed = price.toFixed(2);
  
  // Separar parte entera y decimal
  const [intPart, decPart] = fixed.split('.');
  
  // Formatear parte entera con puntos cada 3 dígitos
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Unir con coma decimal
  return `${formattedInt},${decPart}`;
}

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
      precio: product.publico,
      image: productImage, // Aseguramos que la imagen se pase correctamente
    };
    dispatch(addToCart(item));
      // Mostrar toast
    setShowToast(true);
    
    // Ocultar toast después de 2 segundos
    setTimeout(() => {
      setShowToast(false);
    }, 1000);
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
      <span className="text-base font-semibold text-gray-900">${formatPrice(product.publico)}</span>
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
      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-md shadow-lg transition-opacity duration-300 flex items-center space-x-2 z-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p>Producto agregado al carrito</p>
        </div>
      )}
    </>
  );
}

