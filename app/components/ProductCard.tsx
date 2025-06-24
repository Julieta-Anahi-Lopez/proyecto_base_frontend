"use client";
import { useState, useEffect } from "react";
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
    precio_final: number;
    stock: number;
    imagenes: { foto_1: string }[];
  };
  isAuthenticated: boolean;
}

export default function ProductCard({ product, isAuthenticated }: ProductProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();
  // const { isAuthenticated } = useAuth();

  const fallbackImage = "/Caja.webp";
  const originalImage = product.imagenes?.[0]?.foto_1;
  const [imageSrc, setImageSrc] = useState<string>(originalImage || fallbackImage);
  const [imageKey, setImageKey] = useState<number>(0); // fuerza rerender de <Image>

  const stock = product.stock ?? 0;

  let stockMessage = null;
  if (stock <= 0) {
    stockMessage = "Sin stock";
  } else if (stock <= 5) {
    stockMessage = "¡Quedan pocos!";
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      console.warn("🚫 Usuario no autenticado, no se puede agregar.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      return;
    }
  
    if (typeof product.precio_final !== "number") return;
  
    const item = {
      codigo: product.codigo,
      nombre: product.nombre,
      precio: product.precio_final,
      image: imageSrc,
      cantidad: 1,
    };
  
    dispatch(addToCart(item));
    // setShowToast(true);
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
        {/* Imagen principal */}
        <div className="relative h-64 bg-gray-50 border-b border-gray-200">
          <Image
            key={imageKey}
            src={imageSrc}
            alt={product.nombre}
            fill
            onError={() => {
              if (imageSrc !== fallbackImage) {
                setImageSrc(fallbackImage);
                setImageKey(prev => prev + 1); // fuerza rerender
              }
            }}
            className="object-contain p-3"
          />
        </div>

        {/* Contenido */}
        <div className="flex flex-col justify-between flex-grow p-4 gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
              {normalizeText(product.nombre)}
            </h3>
            {stockMessage && (
              <p
                className={`text-xs font-medium mt-1 ${
                  stock <= 0 ? "text-red-600" : "text-yellow-600"
                }`}
              >
                {stockMessage}
              </p>
            )}
          </div>

          {/* Precio */}
          {typeof product.precio_final === "number" && (
            <div className="flex justify-end">
              <span className="text-base font-semibold text-gray-900">
                ${formatPrice(product.precio_final)}
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
              disabled={!isAuthenticated || stock <= 0}
              className={`flex-1 text-sm rounded-md py-1.5 transition ${
                !isAuthenticated || stock <= 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "text-white bg-gray-800 hover:bg-black"
              }`}
              title={
                !isAuthenticated
                  ? "Iniciá sesión para agregar productos"
                  : stock <= 0
                  ? "Producto sin stock"
                  : ""
              }
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
            key={`modal-${imageKey}`}
            src={imageSrc}
            alt={product.nombre}
            fill
            onError={() => {
              if (imageSrc !== fallbackImage) {
                setImageSrc(fallbackImage);
                setImageKey(prev => prev + 1);
              }
            }}
            className="object-contain p-6"
          />
        </div>
        {stockMessage && (
          <p
            className={`text-sm font-medium text-center mb-2 ${
              stock <= 0 ? "text-red-600" : "text-yellow-600"
            }`}
          >
            {stockMessage}
          </p>
        )}
      </Modal>

      {/* Toast */}
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
            onClick={() => (window.location.href = "/login")}
            className="bg-white text-blue-600 font-semibold text-sm px-4 py-1.5 rounded-md shadow-sm hover:bg-gray-100 transition w-full sm:w-auto"
          >
            Iniciar sesión
          </button>
        </div>
      )}
    </>
  );
}
