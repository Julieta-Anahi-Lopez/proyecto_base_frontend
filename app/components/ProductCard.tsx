"use client";
import { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { useAuth } from "@/app/lib/hooks/useAuth";

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
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const productImage = product.imagenes?.[0]?.foto_1 || "/Caja.webp";

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      return;
    }

    if (typeof product.publico !== "number") return;

    const item = {
      codigo: product.codigo,
      nombre: product.nombre,
      precio: product.publico,
      image: productImage,
      cantidad: 1,
    };

    dispatch(addToCart(item));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  function normalizeText(text: string) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  function formatPrice(price: number): string {
    const fixed = price.toFixed(2);
    const [intPart, decPart] = fixed.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedInt},${decPart}`;
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[460px]">
        {/* Imagen */}
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
          </div>

          {/* Precio */}
          {typeof product.publico === "number" && (
            <div className="flex justify-end">
              <span className="text-base font-semibold text-gray-900">
                ${formatPrice(product.publico)}
              </span>
            </div>
          )}

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
              className={`flex-1 text-sm rounded-md py-1.5 transition ${
                isAuthenticated
                  ? "text-white bg-gray-800 hover:bg-black"
                  : "bg-gray-200 text-gray-400 cursor-pointer"
              }`}
              title={!isAuthenticated ? "Iniciá sesión para agregar productos" : ""}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={normalizeText(product.nombre)}
        description={product.observ}
      >
        <div className="relative h-80 bg-gray-100 mb-4">
          <Image
            src={productImage}
            alt={product.nombre}
            fill
            className="object-contain p-6"
          />
        </div>
      </Modal>

      {/* Toast informativo */}
      {showToast && (
  <div className="fixed bottom-4 right-4 bg-blue-600 text-white py-3 px-4 rounded-md shadow-lg transition-opacity duration-300 z-50 w-[95vw] max-w-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
    <div className="flex items-center gap-2 flex-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 flex-shrink-0 text-white"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10A8 8 0 11.999 10 8 8 0 0118 10zM9 5a1 1 0 012 0v4a1 1 0 01-2 0V5zm1 8a1 1 0 100 2 1 1 0 000-2z"
          clipRule="evenodd"
        />
      </svg>
      <p className="text-sm">Iniciá sesión para comenzar tu pedido</p>
    </div>
    <button
      onClick={() => window.location.href = "/login"}
      className="bg-white text-blue-600 font-semibold text-sm px-4 py-1.5 rounded-md shadow-sm hover:bg-gray-100 transition w-full sm:w-auto"
    >
      Iniciar sesión
    </button>
  </div>
)}

    </>
  );
}
