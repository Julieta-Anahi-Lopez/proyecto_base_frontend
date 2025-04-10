"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addToCart, removeFromCart, clearCart } from "@/redux/slices/cartSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  
  // Calcular el total del carrito
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.precio * item.cantidad, 
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Cabecera del carrito */}
        <div className="mb-8">
          <Link href="/productos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            <span>Continuar comprando</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Carrito de Compras</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-center mb-4">
              <ShoppingCart size={64} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-6">Parece que aún no has agregado productos a tu carrito</p>
            <Link 
              href="/productos" 
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Lista de productos */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-gray-600">
                  <div className="col-span-6">Producto</div>
                  <div className="col-span-2 text-center">Precio</div>
                  <div className="col-span-2 text-center">Cantidad</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>
                
                {cartItems.map((item) => (
                  <div 
                    key={item.codigo} 
                    className="border-b last:border-b-0 p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                  >
                    {/* Imagen y datos del producto */}
                    <div className="md:col-span-6 flex items-center gap-4">
                      <div className="w-20 h-20 relative flex-shrink-0 border rounded-md overflow-hidden bg-white">
                        <Image 
                          src={item.image} 
                          alt={item.nombre} 
                          width={80}
                          height={80}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{item.nombre}</h3>
                        <p className="text-sm text-gray-500">Código: {item.codigo}</p>
                        <button 
                          onClick={() => dispatch(removeFromCart({ codigo: item.codigo, removeCompletely: true }))}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center mt-2 md:hidden"
                        >
                          <Trash2 size={14} className="mr-1" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Precio unitario */}
                    <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                      <span className="md:hidden text-sm text-gray-600">Precio:</span>
                      <span className="font-medium">${item.precio.toFixed(2)}</span>
                    </div>
                    
                    {/* Controles de cantidad */}
                    <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                      <span className="md:hidden text-sm text-gray-600">Cantidad:</span>
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => {
                            if (item.cantidad > 1) {
                              dispatch(removeFromCart({ codigo: item.codigo, removeCompletely: false }));
                            } else {
                              dispatch(removeFromCart({ codigo: item.codigo, removeCompletely: true }));
                            }
                          }}
                          className="px-2 py-1 text-blue-600 hover:bg-blue-50"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 py-1 font-medium">{item.cantidad}</span>
                        <button 
                          onClick={() => dispatch(addToCart(item))} 
                          className="px-2 py-1 text-blue-600 hover:bg-blue-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="md:col-span-2 flex justify-between md:justify-end items-center">
                      <span className="md:hidden text-sm text-gray-600">Subtotal:</span>
                      <div className="flex items-center">
                        <span className="font-semibold text-blue-600">${(item.precio * item.cantidad).toFixed(2)}</span>
                        <button 
                          onClick={() => dispatch(removeFromCart({ codigo: item.codigo, removeCompletely: true }))}
                          className="ml-4 text-red-500 hover:text-red-700 hidden md:block"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => dispatch(clearCart())}
                className="mt-4 px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-md font-medium transition-colors flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Vaciar Carrito
              </button>
            </div>
              
            {/* Resumen del pedido */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Resumen del pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Envío</span>
                    <span className="text-blue-600">A calcular</span>
                  </div>
                  <div className="pt-3 mt-2 border-t flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-900">Total</span>
                    <span className="font-bold text-lg text-blue-700">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors mb-4"
                >
                  Realizar pedido
                </button>
                
                <p className="text-sm text-gray-500 text-center px-2">
                  Al hacer click, enviarás tu pedido a nuestro comercio y te contactaremos para coordinar el pago y la entrega.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}



// "use client";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/store";
// import { addToCart, removeFromCart, clearCart } from "@/redux/slices/cartSlice";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import Image from "next/image";
// import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
// import Link from "next/link";

// export default function CartPage() {
//   const cartItems = useSelector((state: RootState) => state.cart.items);
//   const dispatch = useDispatch();
  
//   // Calcular el total del carrito
//   const cartTotal = cartItems.reduce(
//     (total, item) => total + item.precio * item.cantidad, 
//     0
//   );

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
      
//       <main className="flex-grow container mx-auto px-4 py-8">
//         {/* Cabecera del carrito */}
//         <div className="mb-8">
//           <Link href="/productos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors">
//             <ArrowLeft size={18} className="mr-2" />
//             <span>Continuar comprando</span>
//           </Link>
//           <h1 className="text-3xl font-bold text-gray-800">Carrito de Compras</h1>
//         </div>

//         {cartItems.length === 0 ? (
//           <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm">
//             <div className="flex justify-center mb-4">
//               <ShoppingCart size={64} className="text-gray-300" />
//             </div>
//             <h2 className="text-2xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
//             <p className="text-gray-500 mb-6">Parece que aún no has agregado productos a tu carrito</p>
//             <Link 
//               href="/productos" 
//               className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
//             >
//               Ver productos
//             </Link>
//           </div>
//         ) : (
//           <div className="flex flex-col lg:flex-row gap-8">
//             {/* Lista de productos */}
//             <div className="lg:w-2/3">
//               <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                 <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-gray-600">
//                   <div className="col-span-6">Producto</div>
//                   <div className="col-span-2 text-center">Precio</div>
//                   <div className="col-span-2 text-center">Cantidad</div>
//                   <div className="col-span-2 text-right">Subtotal</div>
//                 </div>
                
//                 {cartItems.map((item) => (
//                   <div 
//                     key={item.codigo} 
//                     className="border-b last:border-b-0 p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
//                   >
//                     {/* Imagen y datos del producto */}
//                     <div className="md:col-span-6 flex items-center gap-4">
//                       <div className="w-20 h-20 relative flex-shrink-0 border rounded-md overflow-hidden bg-white">
//                         <Image 
//                           src={item.image} 
//                           alt={item.nombre} 
//                           width={80}
//                           height={80}
//                           className="object-contain w-full h-full"
//                         />
//                       </div>
//                       <div>
//                         <h3 className="font-medium text-gray-800">{item.nombre}</h3>
//                         <p className="text-sm text-gray-500">Código: {item.codigo}</p>
//                         <button 
//                           onClick={() => dispatch(removeFromCart({ codigo: item.codigo, removeCompletely: true }))}
//                           className="text-red-500 hover:text-red-700 text-sm flex items-center mt-2 md:hidden"
//                         >
//                           <Trash2 size={14} className="mr-1" />
//                           <span>Eliminar</span>
//                         </button>
//                       </div>
//                     </div>
                    
//                     {/* Precio unitario */}
//                     <div className="md:col-span-2 flex justify-between md:justify-center items-center">
//                       <span className="md:hidden text-sm text-gray-600">Precio:</span>
//                       <span className="font-medium">${item.precio.toFixed(2)}</span>
//                     </div>
                    
//                     {/* Controles de cantidad */}
//                     <div className="md:col-span-2 flex justify-between md:justify-center items-center">
//                       <span className="md:hidden text-sm text-gray-600">Cantidad:</span>
//                       <div className="flex items-center border rounded-md">
//                         <button
//                           onClick={() => {
//                             if (item.cantidad > 1) {
//                               dispatch(removeFromCart({ codigo: item.codigo, removeCompletely: false }));
//                             } else {
//                               dispatch(removeFromCart({ codigo: item.codigo, removeCompletely: true }));
//                             }
//                           }}
//                           className="px-2 py-1 text-blue-600 hover:bg-blue-50"
//                         >
//                           <Minus size={16} />
//                         </button>
//                         <span className="px-3 py-1 font-medium">{item.cantidad}</span>
//                         <button 
//                           onClick={() => dispatch(addToCart(item))} 
//                           className="px-2 py-1 text-blue-600 hover:bg-blue-50"
//                         >
//                           <Plus size={16} />
//                         </button>
//                       </div>
//                     </div>
                    
//                     {/* Subtotal */}
//                     <div className="md:col-span-2 flex justify-between md:justify-end items-center">
//                       <span className="md:hidden text-sm text-gray-600">Subtotal:</span>
//                       <div className="flex items-center">
//                         <span className="font-semibold text-blue-600">${(item.precio * item.cantidad).toFixed(2)}</span>
//                         <button 
//                           onClick={() => dispatch(removeFromCart({ codigo: item.codigo, removeCompletely: true }))}
//                           className="ml-4 text-red-500 hover:text-red-700 hidden md:block"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <button
//                 onClick={() => dispatch(clearCart())}
//                 className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors flex items-center"
//               >
//                 <Trash2 size={18} className="mr-2" />
//                 Vaciar Carrito
//               </button>
//             </div>
            
//             {/* Resumen del pedido */}
//             <div className="lg:w-1/3 mt-8 lg:mt-0">
//               <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del pedido</h2>
                
//                 <div className="space-y-3 mb-6">
//                   <div className="flex justify-between text-gray-600">
//                     <span>Subtotal</span>
//                     <span>${cartTotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <span>Envío</span>
//                     <span>A calcular</span>
//                   </div>
//                   <div className="border-t pt-3 flex justify-between font-bold text-lg">
//                     <span>Total</span>
//                     <span>${cartTotal.toFixed(2)}</span>
//                   </div>
//                 </div>
                
//                 <button 
//                   className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors mb-3"
//                 >
//                   Proceder al pago
//                 </button>
                
//                 <p className="text-sm text-gray-500 text-center">
//                   Los impuestos y gastos de envío se calcularán durante el proceso de pago
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
      
//       <Footer />
//     </div>
//   );
// }




























// "use client";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/store";
// import { removeFromCart, clearCart } from "@/redux/slices/cartSlice";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// export default function CartPage() {
//   const cartItems = useSelector((state: RootState) => state.cart.items);
//   const dispatch = useDispatch();

//   return (
//     <div className="container mx-auto p-4">
//       <Header />
//       <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>

//       {cartItems.length === 0 ? (
//         <p className="text-gray-500">Tu carrito está vacío.</p>
//       ) : (
//         <div>
//           {cartItems.map((item) => (
//             <div key={item.codigo} className="flex justify-between items-center border-b py-2">
//               <img src={item.image} alt={item.nombre} className="w-16 h-16 object-cover" />
//               <span>{item.nombre}</span>
//               <span className="font-bold">${item.precio}</span>
//               <span>x {item.cantidad}</span>
//               <button
//                 onClick={() => dispatch(removeFromCart(item.codigo))}
//                 className="bg-red-500 text-white px-2 py-1 rounded"
//               >
//                 ❌
//               </button>
//             </div>
//           ))}
//           <button
//             onClick={() => dispatch(clearCart())}
//             className="bg-red-600 text-white px-4 py-2 mt-4 rounded"
//           >
//             Vaciar Carrito
//           </button>
//         </div>
//       )}
//       <Footer />
//     </div>
//   );
// }
