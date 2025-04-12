"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import CartModal from "./cartModal"; // Importamos el nuevo componente modal

// Interfaces para pedidos
interface PedidoDetalle {
  compro: string;
  nroord: number;
  codart: string;
  cantid: number;
  descri: string;
  penden: number;
  pendfc: number;
  precio: number;
  nrolis: number;
  pordes: number;
  nroemp: number;
  observ: string;
  poruni: number;
}

interface Pedido {
  compro: string;
  detalles: PedidoDetalle[];
  nrocli: number;
  fecped: string;
  plazo: string;
  lugent: string;
  condic: string;
  observ: string;
  nrousu: number;
  nroven: number;
  imputa: number;
  nombpc: string;
  origen: string;
  nroemp: number;
  tipdep: number;
  nroest: string;
}

// Props del componente Header
interface HeaderProps {
  pedidos?: Pedido[];
  pedidosLoading?: boolean;
  onSubmitOrder?: (observaciones: string) => Promise<boolean>;
}

// Mover el selector fuera del componente
const getCartItems = (state: RootState) => state.cart.items;

export default function Header({ pedidos = [], pedidosLoading = false, onSubmitOrder }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false); // Nuevo estado para modal completo

  const dispatch = useDispatch();

  // Usar el selector memoizado
  const cartItems = useSelector(getCartItems);
  const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

  // Función para manejar la vista previa del carrito con delay
  let hideTimeout: NodeJS.Timeout;
  const showCartPreview = () => {
    clearTimeout(hideTimeout);
    setIsCartPreviewOpen(true);
  };

  const hideCartPreview = () => {
    hideTimeout = setTimeout(() => {
      setIsCartPreviewOpen(false);
    }, 200);
  };

  // Función para abrir el modal completo
  const openCartModal = () => {
    setIsCartModalOpen(true);
    hideCartPreview(); // Ocultamos la vista previa
  };

  return (
    <header className="bg-blue-900 shadow-md relative z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Sección de logos */}
        <div className="flex items-center gap-6">
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

          {/* Logo Walker + Representante Oficial (centrado verticalmente) */}
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

        {/* Menú de navegación (pantallas grandes) */}
        <nav className="hidden lg:flex space-x-6 text-white text-lg items-center">
          <Link href="/" className="hover:text-gray-300">Inicio</Link>
          <Link href="/productos" className="hover:text-gray-300">Catálogo</Link>
          <Link href="/contacto" className="hover:text-gray-300">Contacto</Link>

          {/* Ícono del carrito con vista previa mejorada */}
          <div
            className="relative"
            onMouseOver={showCartPreview}
            onMouseLeave={hideCartPreview}
          >
            <button className="relative flex items-center" onClick={openCartModal}>
              <ShoppingCart className="w-6 h-6 text-white hover:text-gray-300" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Vista previa del carrito */}
            {isCartPreviewOpen && (
              <div
              className="absolute right-0 mt-2 w-120 bg-white shadow-lg p-4 rounded-md"
              style={{ width: "480px", maxWidth: "calc(100vw - 40px)" }}
              onMouseOver={showCartPreview}
              onMouseLeave={hideCartPreview}
            >
                {cartItems.length === 0 ? (
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">El carrito está vacío</p>
                    <button 
                      onClick={openCartModal} 
                      className="text-blue-600 text-sm mt-2 hover:underline"
                    >
                      Ver mis pedidos anteriores
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Productos en el carrito</h3>
                    <ul className="space-y-3 max-h-60 overflow-y-auto">
                      {cartItems.map((item) => {
                        const subtotal = item.precio * item.cantidad;
                        return (
                          <li key={item.codigo} className="flex items-center gap-4 border-b pb-3">
                            {/* Imagen del producto */}
                            <div className="flex-shrink-0">
                              <Image 
                                src={item.image} 
                                alt={item.nombre} 
                                width={50} 
                                height={50} 
                                className="rounded object-cover"
                              />
                            </div>
                            
                            {/* Información del producto */}
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate max-w-full">
                                {item.nombre}
                              </p>
                              <div className="flex justify-between mt-1">
                                <div className="flex items-center border rounded-md">
                                <button
                                    onClick={() => {
                                      if (item.cantidad > 1) {
                                        // Si hay más de 1 unidad, reducimos la cantidad en 1
                                        dispatch(removeFromCart(item.codigo, false));
                                      } else {
                                        // Si solo hay 1 unidad, eliminamos el producto completamente
                                        dispatch(removeFromCart(item.codigo, true));
                                      }
                                    }}
                                    className="px-2 py-1 text-blue-600 hover:bg-blue-50"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="px-2 text-sm font-medium">{item.cantidad}</span>
                                  <button 
                                    onClick={() => dispatch(addToCart(item))} 
                                    className="px-2 py-1 text-blue-600 hover:bg-blue-50"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                                  <button
                                  onClick={() => {
                                    // Aquí se elimina completamente el producto
                                    dispatch(removeFromCart(item.codigo, true))
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                  >
                                  <Trash2 size={16} />
                                  </button>
                              </div>
                            </div>
                            
                            {/* Precio y subtotal */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs text-gray-500">
                                ${item.precio.toFixed(2)} x {item.cantidad}
                              </p>
                              <p className="text-sm font-semibold text-blue-600">
                                ${subtotal.toFixed(2)}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    
                    {/* Total del carrito */}
                    <div className="mt-3 pt-2 border-t flex justify-between">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-blue-700">
                        ${cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Botones para ir al carrito o ver pedidos */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={openCartModal}
                        className="flex-1 text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Ver Carrito
                      </button>
                      <button
                        onClick={() => {
                          openCartModal();
                          // Cuando integremos el componente, utilizaremos esta función para cambiar a la pestaña de pedidos
                        }}
                        className="flex-1 text-center bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Mis Pedidos
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Botón de Menú en móvil */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white text-2xl"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Menú desplegable en móvil */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-900 shadow-md py-4 flex flex-col items-center space-y-4 text-white text-lg lg:hidden">
          <Link href="/" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
          <Link href="/productos" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
          <Link href="/contacto" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
          
          {/* Añadir enlace al carrito en el menú móvil */}
          <button 
            className="hover:text-gray-300 flex items-center gap-2" 
            onClick={() => {
              setIsMenuOpen(false);
              openCartModal();
            }}
          >
            <ShoppingCart size={18} />
            <span>Carrito</span>
            {cartCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Modal completo del carrito */}
      <CartModal 
        isOpen={isCartModalOpen} 
        onClose={() => setIsCartModalOpen(false)} 
        pedidos={pedidos} 
        pedidosLoading={pedidosLoading}
        onSubmitOrder={async (observaciones) => {
          // Si no se proporciona la función onSubmitOrder, devolvemos false
          if (!onSubmitOrder) {
            console.error("La función onSubmitOrder no ha sido proporcionada al Header");
            return false;
          }
          return await onSubmitOrder(observaciones);
        }}
      />
    </header>
  );
}









// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Menu, X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/store";
// import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
// import CartModal from "./cartModal"; // Importamos el nuevo componente modal

// // Interfaces para pedidos
// interface PedidoDetalle {
//   compro: string;
//   nroord: number;
//   codart: string;
//   cantid: number;
//   descri: string;
//   penden: number;
//   pendfc: number;
//   precio: number;
//   nrolis: number;
//   pordes: number;
//   nroemp: number;
//   observ: string;
//   poruni: number;
// }

// interface Pedido {
//   compro: string;
//   detalles: PedidoDetalle[];
//   nrocli: number;
//   fecped: string;
//   plazo: string;
//   lugent: string;
//   condic: string;
//   observ: string;
//   nrousu: number;
//   nroven: number;
//   imputa: number;
//   nombpc: string;
//   origen: string;
//   nroemp: number;
//   tipdep: number;
//   nroest: string;
// }

// // Props del componente Header
// interface HeaderProps {
//   pedidos?: Pedido[];
//   pedidosLoading?: boolean;
// }

// // Mover el selector fuera del componente
// const getCartItems = (state: RootState) => state.cart.items;

// export default function Header({ pedidos = [], pedidosLoading = false }: HeaderProps) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
//   const [isCartModalOpen, setIsCartModalOpen] = useState(false); // Nuevo estado para modal completo

//   const dispatch = useDispatch();

//   // Usar el selector memoizado
//   const cartItems = useSelector(getCartItems);
//   const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

//   // Función para manejar la vista previa del carrito con delay
//   let hideTimeout: NodeJS.Timeout;
//   const showCartPreview = () => {
//     clearTimeout(hideTimeout);
//     setIsCartPreviewOpen(true);
//   };

//   const hideCartPreview = () => {
//     hideTimeout = setTimeout(() => {
//       setIsCartPreviewOpen(false);
//     }, 200);
//   };

//   // Función para abrir el modal completo
//   const openCartModal = () => {
//     setIsCartModalOpen(true);
//     hideCartPreview(); // Ocultamos la vista previa
//   };

//   return (
//     <header className="bg-blue-900 shadow-md relative z-50">
//       <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//         {/* Sección de logos */}
//         <div className="flex items-center gap-6">
//           <Link href="/" className="flex-shrink-0">
//             <Image
//               src="/images/logos/400px x 100 px KLINNER - ENCABEZADO - recortada.png"
//               alt="Logo Klinner"
//               width={160}
//               height={80}
//               priority={true}
//               className="object-contain"
//             />
//           </Link>

//           {/* Logo Walker + Representante Oficial (centrado verticalmente) */}
//           <div className="hidden lg:flex flex-col items-center">
//             <Image
//               src="/images/logos/400px x 100 px WALKER - ENCABEZADO - recortada.png"
//               alt="Logo Walker"
//               width={140}
//               height={50}
//               priority={true}
//               className="object-contain"
//             />
//             <span className="text-white text-sm font-semibold">Representante Oficial Walker</span>
//           </div>
//         </div>

//         {/* Menú de navegación (pantallas grandes) */}
//         <nav className="hidden lg:flex space-x-6 text-white text-lg items-center">
//           <Link href="/" className="hover:text-gray-300">Inicio</Link>
//           <Link href="/productos" className="hover:text-gray-300">Catálogo</Link>
//           <Link href="/contacto" className="hover:text-gray-300">Contacto</Link>

//           {/* Ícono del carrito con vista previa mejorada */}
//           <div
//             className="relative"
//             onMouseOver={showCartPreview}
//             onMouseLeave={hideCartPreview}
//           >
//             <button className="relative flex items-center" onClick={openCartModal}>
//               <ShoppingCart className="w-6 h-6 text-white hover:text-gray-300" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </button>

//             {/* Vista previa del carrito */}
//             {isCartPreviewOpen && (
//               <div
//               className="absolute right-0 mt-2 w-120 bg-white shadow-lg p-4 rounded-md"
//               style={{ width: "480px", maxWidth: "calc(100vw - 40px)" }}
//               onMouseOver={showCartPreview}
//               onMouseLeave={hideCartPreview}
//             >
//                 {cartItems.length === 0 ? (
//                   <div className="text-center">
//                     <p className="text-gray-500 text-sm">El carrito está vacío</p>
//                     <button 
//                       onClick={openCartModal} 
//                       className="text-blue-600 text-sm mt-2 hover:underline"
//                     >
//                       Ver mis pedidos anteriores
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Productos en el carrito</h3>
//                     <ul className="space-y-3 max-h-60 overflow-y-auto">
//                       {cartItems.map((item) => {
//                         const subtotal = item.precio * item.cantidad;
//                         return (
//                           <li key={item.codigo} className="flex items-center gap-4 border-b pb-3">
//                             {/* Imagen del producto */}
//                             <div className="flex-shrink-0">
//                               <Image 
//                                 src={item.image} 
//                                 alt={item.nombre} 
//                                 width={50} 
//                                 height={50} 
//                                 className="rounded object-cover"
//                               />
//                             </div>
                            
//                             {/* Información del producto */}
//                             <div className="flex-grow min-w-0">
//                               <p className="text-sm font-medium text-gray-800 truncate max-w-full">
//                                 {item.nombre}
//                               </p>
//                               <div className="flex justify-between mt-1">
//                                 <div className="flex items-center border rounded-md">
//                                 <button
//                                     onClick={() => {
//                                       if (item.cantidad > 1) {
//                                         // Si hay más de 1 unidad, reducimos la cantidad en 1
//                                         dispatch(removeFromCart(item.codigo, false));
//                                       } else {
//                                         // Si solo hay 1 unidad, eliminamos el producto completamente
//                                         dispatch(removeFromCart(item.codigo, true));
//                                       }
//                                     }}
//                                     className="px-2 py-1 text-blue-600 hover:bg-blue-50"
//                                   >
//                                     <Minus size={14} />
//                                   </button>
//                                   <span className="px-2 text-sm font-medium">{item.cantidad}</span>
//                                   <button 
//                                     onClick={() => dispatch(addToCart(item))} 
//                                     className="px-2 py-1 text-blue-600 hover:bg-blue-50"
//                                   >
//                                     <Plus size={14} />
//                                   </button>
//                                 </div>
//                                   <button
//                                   onClick={() => {
//                                     // Aquí se elimina completamente el producto
//                                     dispatch(removeFromCart(item.codigo, true))
//                                   }}
//                                   className="text-red-500 hover:text-red-700"
//                                   >
//                                   <Trash2 size={16} />
//                                   </button>
//                               </div>
//                             </div>
                            
//                             {/* Precio y subtotal */}
//                             <div className="text-right flex-shrink-0">
//                               <p className="text-xs text-gray-500">
//                                 ${item.precio.toFixed(2)} x {item.cantidad}
//                               </p>
//                               <p className="text-sm font-semibold text-blue-600">
//                                 ${subtotal.toFixed(2)}
//                               </p>
//                             </div>
//                           </li>
//                         );
//                       })}
//                     </ul>
                    
//                     {/* Total del carrito */}
//                     <div className="mt-3 pt-2 border-t flex justify-between">
//                       <span className="font-medium">Total:</span>
//                       <span className="font-bold text-blue-700">
//                         ${cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2)}
//                       </span>
//                     </div>
                    
//                     {/* Botones para ir al carrito o ver pedidos */}
//                     <div className="flex gap-2 mt-3">
//                       <button
//                         onClick={openCartModal}
//                         className="flex-1 text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
//                       >
//                         Ver Carrito
//                       </button>
//                       <button
//                         onClick={() => {
//                           openCartModal();
//                           // Cuando integremos el componente, utilizaremos esta función para cambiar a la pestaña de pedidos
//                         }}
//                         className="flex-1 text-center bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 transition-colors"
//                       >
//                         Mis Pedidos
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
//         </nav>

//         {/* Botón de Menú en móvil */}
//         <button
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           className="lg:hidden text-white text-2xl"
//         >
//           {isMenuOpen ? <X /> : <Menu />}
//         </button>
//       </div>

//       {/* Menú desplegable en móvil */}
//       {isMenuOpen && (
//         <div className="absolute top-full left-0 w-full bg-blue-900 shadow-md py-4 flex flex-col items-center space-y-4 text-white text-lg lg:hidden">
//           <Link href="/" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
//           <Link href="/productos" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
//           <Link href="/contacto" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
          
//           {/* Añadir enlace al carrito en el menú móvil */}
//           <button 
//             className="hover:text-gray-300 flex items-center gap-2" 
//             onClick={() => {
//               setIsMenuOpen(false);
//               openCartModal();
//             }}
//           >
//             <ShoppingCart size={18} />
//             <span>Carrito</span>
//             {cartCount > 0 && (
//               <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                 {cartCount}
//               </span>
//             )}
//           </button>
//         </div>
//       )}

//       {/* Modal completo del carrito */}
//       <CartModal 
//         isOpen={isCartModalOpen} 
//         onClose={() => setIsCartModalOpen(false)} 
//         pedidos={pedidos} 
//         pedidosLoading={pedidosLoading} 
//       />
//     </header>
//   );
// }










// // "use client";

// // import { useState } from "react";
// // import Link from "next/link";
// // import Image from "next/image";
// // import { Menu, X, ShoppingCart } from "lucide-react";
// // import { useSelector, useDispatch } from "react-redux";
// // import { RootState } from "@/store";
// // import CartPreview from "./cartPreview"; // Importamos el nuevo componente

// // // Interfaces para Pedidos
// // interface PedidoDetalle {
// //   compro: string;
// //   nroord: number;
// //   codart: string;
// //   cantid: number;
// //   descri: string;
// //   penden: number;
// //   pendfc: number;
// //   precio: number;
// //   nrolis: number;
// //   pordes: number;
// //   nroemp: number;
// //   observ: string;
// //   poruni: number;
// // }

// // interface Pedido {
// //   compro: string;
// //   detalles: PedidoDetalle[];
// //   nrocli: number;
// //   fecped: string;
// //   plazo: string;
// //   lugent: string;
// //   condic: string;
// //   observ: string;
// //   nrousu: number;
// //   nroven: number;
// //   imputa: number;
// //   nombpc: string;
// //   origen: string;
// //   nroemp: number;
// //   tipdep: number;
// //   nroest: string;
// // }

// // // Props del componente Header
// // interface HeaderProps {
// //   pedidos: Pedido[];
// //   pedidosLoading: boolean;
// // }

// // // Mover el selector fuera del componente
// // const getCartItems = (state: RootState) => state.cart.items;

// // export default function Header({ pedidos = [], pedidosLoading = false }: HeaderProps) {
// //   const [isMenuOpen, setIsMenuOpen] = useState(false);
// //   const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);

// //   const dispatch = useDispatch();

// //   // Usar el selector memoizado
// //   const cartItems = useSelector(getCartItems);
// //   const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

// //   // Función para manejar la vista previa del carrito con delay
// //   let hideTimeout: NodeJS.Timeout;
// //   const showCartPreview = () => {
// //     clearTimeout(hideTimeout);
// //     setIsCartPreviewOpen(true);
// //   };

// //   const hideCartPreview = () => {
// //     hideTimeout = setTimeout(() => {
// //       setIsCartPreviewOpen(false);
// //     }, 200);
// //   };

// //   return (
// //     <header className="bg-blue-900 shadow-md relative z-50">
// //       <div className="container mx-auto px-4 py-4 flex justify-between items-center">
// //         {/* Sección de logos */}
// //         <div className="flex items-center gap-6">
// //           <Link href="/" className="flex-shrink-0">
// //             <Image
// //               src="/images/logos/400px x 100 px KLINNER - ENCABEZADO - recortada.png"
// //               alt="Logo Klinner"
// //               width={160}
// //               height={80}
// //               priority={true}
// //               className="object-contain"
// //             />
// //           </Link>

// //           {/* Logo Walker + Representante Oficial (centrado verticalmente) */}
// //           <div className="hidden lg:flex flex-col items-center">
// //             <Image
// //               src="/images/logos/400px x 100 px WALKER - ENCABEZADO - recortada.png"
// //               alt="Logo Walker"
// //               width={140}
// //               height={50}
// //               priority={true}
// //               className="object-contain"
// //             />
// //             <span className="text-white text-sm font-semibold">Representante Oficial Walker</span>
// //           </div>
// //         </div>

// //         {/* Menú de navegación (pantallas grandes) */}
// //         <nav className="hidden lg:flex space-x-6 text-white text-lg items-center">
// //           <Link href="/" className="hover:text-gray-300">Inicio</Link>
// //           <Link href="/productos" className="hover:text-gray-300">Catálogo</Link>
// //           <Link href="/contacto" className="hover:text-gray-300">Contacto</Link>

// //           {/* Ícono del carrito con vista previa mejorada */}
// //           <div
// //             className="relative"
// //             onMouseOver={showCartPreview}
// //             onMouseLeave={hideCartPreview}
// //           >
// //             <Link href="/cart" className="relative flex items-center">
// //               <ShoppingCart className="w-6 h-6 text-white hover:text-gray-300" />
// //               {cartCount > 0 && (
// //                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
// //                   {cartCount}
// //                 </span>
// //               )}
// //             </Link>

// //             {/* Vista previa del carrito - Ahora usando el componente CartPreview */}
// //             {isCartPreviewOpen && (
// //               <div
// //                 className="absolute right-0 mt-2 w-120 bg-white shadow-lg p-4 rounded-md"
// //                 style={{ width: "480px", maxWidth: "calc(100vw - 40px)" }}
// //                 onMouseOver={showCartPreview}
// //                 onMouseLeave={hideCartPreview}
// //               >
// //                 <CartPreview 
// //                   cartItems={cartItems} 
// //                   pedidos={pedidos} 
// //                   pedidosLoading={pedidosLoading} 
// //                   dispatch={dispatch}
// //                 />
// //               </div>
// //             )}
// //           </div>
// //         </nav>

// //         {/* Botón de Menú en móvil */}
// //         <button
// //           onClick={() => setIsMenuOpen(!isMenuOpen)}
// //           className="lg:hidden text-white text-2xl"
// //         >
// //           {isMenuOpen ? <X /> : <Menu />}
// //         </button>
// //       </div>

// //       {/* Menú desplegable en móvil */}
// //       {isMenuOpen && (
// //         <div className="absolute top-full left-0 w-full bg-blue-900 shadow-md py-4 flex flex-col items-center space-y-4 text-white text-lg lg:hidden">
// //           <Link href="/" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
// //           <Link href="/productos" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
// //           <Link href="/contacto" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
          
// //           {/* Añadir enlace al carrito en el menú móvil */}
// //           <Link href="/cart" className="hover:text-gray-300 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
// //             <ShoppingCart size={18} />
// //             <span>Carrito</span>
// //             {cartCount > 0 && (
// //               <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
// //                 {cartCount}
// //               </span>
// //             )}
// //           </Link>
// //         </div>
// //       )}
// //     </header>
// //   );
// // }


















// // // "use client";

// // // import { useState } from "react";
// // // import Link from "next/link";
// // // import Image from "next/image";
// // // import { Menu, X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
// // // import { useSelector, useDispatch } from "react-redux";
// // // import { RootState } from "@/store";
// // // import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
// // // import CartModal from "./cartModal";

// // // // Interfaz para la función de envío de pedidos
// // // interface HeaderProps {
// // //   onSubmitOrder?: (observaciones: string) => Promise<boolean>;
// // // }

// // // // Mover el selector fuera del componente
// // // const getCartItems = (state: RootState) => state.cart.items;

// // // export default function Header({ onSubmitOrder }: HeaderProps) {
// // //   const [isMenuOpen, setIsMenuOpen] = useState(false);
// // //   const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
// // //   const [isCartModalOpen, setIsCartModalOpen] = useState(false);

// // //   const dispatch = useDispatch();

// // //   // Usar el selector memoizado
// // //   const cartItems = useSelector(getCartItems);
// // //   const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

// // //   // Función para manejar la vista previa del carrito con delay
// // //   let hideTimeout: NodeJS.Timeout;
// // //   const showCartPreview = () => {
// // //     clearTimeout(hideTimeout);
// // //     setIsCartPreviewOpen(true);
// // //   };

// // //   const hideCartPreview = () => {
// // //     hideTimeout = setTimeout(() => {
// // //       setIsCartPreviewOpen(false);
// // //     }, 200);
// // //   };

// // //   // Función para abrir el modal del carrito
// // //   const openCartModal = () => {
// // //     setIsCartPreviewOpen(false); // Cerrar la vista previa si está abierta
// // //     setIsCartModalOpen(true);
// // //   };

// // //   // Función para manejar el envío de pedidos (si no se proporciona desde fuera)
// // //   const handleSubmitOrder = async (observaciones: string): Promise<boolean> => {
// // //     if (!onSubmitOrder) {
// // //       console.error("No se proporcionó una función para enviar pedidos");
// // //       return false;
// // //     }
    
// // //     try {
// // //       return await onSubmitOrder(observaciones);
// // //     } catch (error) {
// // //       console.error("Error al enviar pedido:", error);
// // //       return false;
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       <header className="bg-blue-900 shadow-md relative z-50">
// // //         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
// // //           {/* Sección de logos */}
// // //           <div className="flex items-center gap-6">
// // //             <Link href="/" className="flex-shrink-0">
// // //               <Image
// // //                 src="/images/logos/400px x 100 px KLINNER - ENCABEZADO - recortada.png"
// // //                 alt="Logo Klinner"
// // //                 width={160}
// // //                 height={80}
// // //                 priority={true}
// // //                 className="object-contain"
// // //               />
// // //             </Link>

// // //             {/* Logo Walker + Representante Oficial (centrado verticalmente) */}
// // //             <div className="hidden lg:flex flex-col items-center">
// // //               <Image
// // //                 src="/images/logos/400px x 100 px WALKER - ENCABEZADO - recortada.png"
// // //                 alt="Logo Walker"
// // //                 width={140}
// // //                 height={50}
// // //                 priority={true}
// // //                 className="object-contain"
// // //               />
// // //               <span className="text-white text-sm font-semibold">Representante Oficial Walker</span>
// // //             </div>
// // //           </div>

// // //           {/* Menú de navegación (pantallas grandes) */}
// // //           <nav className="hidden lg:flex space-x-6 text-white text-lg items-center">
// // //             <Link href="/" className="hover:text-gray-300">Inicio</Link>
// // //             <Link href="/productos" className="hover:text-gray-300">Catálogo</Link>
// // //             <Link href="/contacto" className="hover:text-gray-300">Contacto</Link>

// // //             {/* Ícono del carrito con vista previa mejorada */}
// // //             <div
// // //               className="relative"
// // //               onMouseOver={showCartPreview}
// // //               onMouseLeave={hideCartPreview}
// // //             >
// // //               <button 
// // //                 onClick={openCartModal} // Abrir modal al hacer clic
// // //                 className="relative flex items-center"
// // //               >
// // //                 <ShoppingCart className="w-6 h-6 text-white hover:text-gray-300" />
// // //                 {cartCount > 0 && (
// // //                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
// // //                     {cartCount}
// // //                   </span>
// // //                 )}
// // //               </button>

// // //               {/* Vista previa del carrito */}
// // //               {isCartPreviewOpen && (
// // //                 <div
// // //                 className="absolute right-0 mt-2 w-120 bg-white shadow-lg p-4 rounded-md"
// // //                 style={{ width: "480px", maxWidth: "calc(100vw - 40px)" }}
// // //                 onMouseOver={showCartPreview}
// // //                 onMouseLeave={hideCartPreview}
// // //               >
// // //                   {cartItems.length === 0 ? (
// // //                     <p className="text-gray-500 text-sm">El carrito está vacío</p>
// // //                   ) : (
// // //                     <>
// // //                       <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Productos en el carrito</h3>
// // //                       <ul className="space-y-3 max-h-60 overflow-y-auto">
// // //                         {cartItems.map((item) => {
// // //                           const subtotal = item.precio * item.cantidad;
// // //                           return (
// // //                             <li key={item.codigo} className="flex items-center gap-4 border-b pb-3">
// // //                               {/* Imagen del producto */}
// // //                               <div className="flex-shrink-0">
// // //                                 <Image 
// // //                                   src={item.image} 
// // //                                   alt={item.nombre} 
// // //                                   width={50} 
// // //                                   height={50} 
// // //                                   className="rounded object-cover"
// // //                                 />
// // //                               </div>
                              
// // //                               {/* Información del producto */}
// // //                               <div className="flex-grow min-w-0">
// // //                                 <p className="text-sm font-medium text-gray-800 truncate max-w-full">
// // //                                   {item.nombre}
// // //                                 </p>
// // //                                 <div className="flex justify-between mt-1">
// // //                                   <div className="flex items-center border rounded-md">
// // //                                   <button
// // //                                       onClick={() => {
// // //                                         if (item.cantidad > 1) {
// // //                                           // Si hay más de 1 unidad, reducimos la cantidad en 1
// // //                                           dispatch(removeFromCart(item.codigo, false));
// // //                                         } else {
// // //                                           // Si solo hay 1 unidad, eliminamos el producto completamente
// // //                                           dispatch(removeFromCart(item.codigo, true));
// // //                                         }
// // //                                       }}
// // //                                       className="px-2 py-1 text-blue-600 hover:bg-blue-50"
// // //                                     >
// // //                                       <Minus size={14} />
// // //                                     </button>
// // //                                     <span className="px-2 text-sm font-medium">{item.cantidad}</span>
// // //                                     <button 
// // //                                       onClick={() => dispatch(addToCart(item))} 
// // //                                       className="px-2 py-1 text-blue-600 hover:bg-blue-50"
// // //                                     >
// // //                                       <Plus size={14} />
// // //                                     </button>
// // //                                   </div>
// // //                                     <button
// // //                                     onClick={() => {
// // //                                       // Aquí se elimina completamente el producto
// // //                                       dispatch(removeFromCart(item.codigo, true))
// // //                                     }}
// // //                                     className="text-red-500 hover:text-red-700"
// // //                                     >
// // //                                     <Trash2 size={16} />
// // //                                     </button>
// // //                                 </div>
// // //                               </div>
                              
// // //                               {/* Precio y subtotal */}
// // //                               <div className="text-right flex-shrink-0">
// // //                                 <p className="text-xs text-gray-500">
// // //                                   ${item.precio.toFixed(2)} x {item.cantidad}
// // //                                 </p>
// // //                                 <p className="text-sm font-semibold text-blue-600">
// // //                                   ${subtotal.toFixed(2)}
// // //                                 </p>
// // //                               </div>
// // //                             </li>
// // //                           );
// // //                         })}
// // //                       </ul>
                      
// // //                       {/* Total del carrito */}
// // //                       <div className="mt-3 pt-2 border-t flex justify-between">
// // //                         <span className="font-medium">Total:</span>
// // //                         <span className="font-bold text-blue-700">
// // //                           ${cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2)}
// // //                         </span>
// // //                       </div>
                      
// // //                       {/* Botón para ir al carrito */}
// // //                       <button 
// // //                         onClick={openCartModal}
// // //                         className="block text-center bg-blue-600 text-white mt-3 py-2 rounded-md hover:bg-blue-700 transition-colors w-full"
// // //                       >
// // //                         Ver Carrito
// // //                       </button>
// // //                     </>
// // //                   )}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </nav>

// // //           {/* Botón de Menú en móvil */}
// // //           <button
// // //             onClick={() => setIsMenuOpen(!isMenuOpen)}
// // //             className="lg:hidden text-white text-2xl"
// // //           >
// // //             {isMenuOpen ? <X /> : <Menu />}
// // //           </button>
// // //         </div>

// // //         {/* Menú desplegable en móvil */}
// // //         {isMenuOpen && (
// // //           <div className="absolute top-full left-0 w-full bg-blue-900 shadow-md py-4 flex flex-col items-center space-y-4 text-white text-lg lg:hidden">
// // //             <Link href="/" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
// // //             <Link href="/productos" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
// // //             <Link href="/contacto" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
            
// // //             {/* Añadir enlace al carrito en el menú móvil */}
// // //             <button 
// // //               className="hover:text-gray-300 flex items-center gap-2" 
// // //               onClick={() => {
// // //                 setIsMenuOpen(false);
// // //                 openCartModal();
// // //               }}
// // //             >
// // //               <ShoppingCart size={18} />
// // //               <span>Carrito</span>
// // //               {cartCount > 0 && (
// // //                 <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
// // //                   {cartCount}
// // //                 </span>
// // //               )}
// // //             </button>
// // //           </div>
// // //         )}
// // //       </header>

// // //       {/* Modal del carrito */}
// // //       <CartModal 
// // //         isOpen={isCartModalOpen}
// // //         onClose={() => setIsCartModalOpen(false)}
// // //         cartItems={cartItems}
// // //         onSubmitOrder={handleSubmitOrder}
// // //       />
// // //     </>
// // //   );
// // // }