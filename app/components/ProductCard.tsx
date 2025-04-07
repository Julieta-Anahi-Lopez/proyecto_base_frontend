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
      <div className="bg-white shadow-md rounded-md overflow-hidden border border-gray-200">
        {/* Imagen del producto */}
        <div className="relative h-48 bg-gray-100">
          <Image
            src={productImage}
            alt={product.nombre}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            className="object-contain p-2"
          />
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{normalizeText(product.nombre)}</h3>
          <p className="text-sm text-gray-600 h-12 overflow-hidden">{normalizeText(product.observ)}</p>
          <p className="text-xl font-bold text-blue-600 mt-2">${product.precio.toFixed(2)}</p>
          
          {/* Botón para abrir el modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Más Información
          </button>
          
          {/* Botón para agregar al carrito */}
          <button
            onClick={handleAddToCart}
            className="mt-2 ml-2 bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors"
          >
            🛒 Agregar al Carrito
          </button>
        </div>
      </div>

      {/* Modal con toda la información */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">{normalizeText(product.nombre)}</h2>
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
        <button
          onClick={handleAddToCart}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          🛒 Agregar al Carrito
        </button>
      </Modal>
    </>
  );
}













// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Modal from "./Modal";
// import { useDispatch } from "react-redux"; // 🟢 Importamos Redux
// import { addToCart } from "@/redux/slices/cartSlice"; // 🟢 Importamos la acción para agregar al carrito

// interface ProductProps {
//   product: {
//     codigo: string;
//     nombre: string;
//     observ: string;
//     precio: number;
//     imagenes: { foto_1: string }[];
//   };
// }

// export default function ProductCard({ product }: ProductProps) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const dispatch = useDispatch(); // 🟢 Inicializamos Redux

//   function normalizeText(text: string) {
//     if (!text) return "";
//     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
//   }

//   const productImage = product.imagenes?.[0]?.foto_1 || "/Caja.webp";

//   // 🟢 Función para agregar el producto al carrito
//   const handleAddToCart = () => {
//     const item = {
//       codigo: product.codigo,
//       nombre: product.nombre,
//       precio: product.precio,
//       image: productImage, // Aseguramos que la imagen se pase correctamente
//     };
//     dispatch(addToCart(item));
//   };

//   return (
//     <>
//       <div className="bg-gray-300 rounded-lg shadow-md overflow-hidden flex flex-col min-h-50 w-full">
//         {/* 🔥 Imagen del producto */}
//         <Image
//           src={productImage}
//           alt={product.nombre}
//           width={200}
//           height={260}
//           className="w-full p-2 object-contain"
//         />

//         {/* Contenido */}
//         <div className="p-4 flex-grow flex flex-col">
//           <h2 className="text-sm text-blue-600 font-semibold mb-2 min-h-[3rem] leading-tight">
//             {normalizeText(product.nombre)}
//           </h2>

//           <p className="text-gray-600 mb-2 line-clamp-2">{normalizeText(product.observ)}</p>

//           <p className="text-xsm text-blue-600 font-bold mt-auto">${product.precio.toFixed(2)}</p>

//           {/* 🟢 Botón para abrir el modal */}
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Más Información
//           </button>

//           {/* 🟢 Botón para agregar al carrito */}
//           <button
//             onClick={handleAddToCart}
//             className="mt-2 bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors"
//           >
//             🛒 Agregar al Carrito
//           </button>
//         </div>
//       </div>

//       {/* Modal con toda la información */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <h2 className="text-lg font-semibold text-blue-600">{normalizeText(product.nombre)}</h2>

//         <div className="flex justify-center my-4">
//           <Image
//             src={productImage}
//             alt={product.nombre}
//             width={500}
//             height={500}
//             className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-md shadow-md"
//           />
//         </div>

//         <p className="text-gray-700 mt-2">{normalizeText(product.observ)}</p>
//         <p className="text-xl font-bold text-blue-600 mt-4">${product.precio.toFixed(2)}</p>

//         {/* 🟢 Botón para agregar al carrito dentro del modal */}
//         <button
//           onClick={handleAddToCart}
//           className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
//         >
//           🛒 Agregar al Carrito
//         </button>
//       </Modal>
//     </>
//   );
// }
