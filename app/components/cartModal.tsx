"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart, clearCart } from "@/redux/slices/cartSlice";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react";

// Interfaz para los elementos del carrito
interface CartItem {
  codigo: string;
  nombre: string;
  precio: number;
  cantidad: number;
  image: string;
}

// Interfaz para las props del componente
interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onSubmitOrder: (observaciones: string) => Promise<boolean>;
}

export default function CartModal({ isOpen, onClose, cartItems, onSubmitOrder }: CartModalProps) {
  const dispatch = useDispatch();
  
  // Estados locales
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [observaciones, setObservaciones] = useState("");
  
  // Calcular totales
  const cartTotal = cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
  
  // Manejar el envío del pedido
  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      setOrderError("No hay productos en el carrito");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setOrderError(null);
      
      // Llamar a la función de envío proporcionada por el padre
      const success = await onSubmitOrder(observaciones);
      
      if (success) {
        setOrderSuccess(true);
        // Limpiar carrito después del éxito
        dispatch(clearCart());
        
        // Cerrar el modal después de unos segundos
        setTimeout(() => {
          onClose();
          // Reiniciar el estado del modal
          setOrderSuccess(false);
          setObservaciones("");
        }, 3000);
      } else {
        setOrderError("Error al procesar el pedido. Por favor, intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al procesar pedido:", error);
      setOrderError(error instanceof Error ? error.message : "Error desconocido al procesar el pedido");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        {/* Cabecera del modal */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Mi Carrito</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✖
          </button>
        </div>
        
        {/* Mensajes de estado */}
        {orderError && (
          <div className="mx-6 my-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{orderError}</span>
          </div>
        )}
        
        {orderSuccess && (
          <div className="mx-6 my-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>¡Pedido enviado exitosamente! Pronto nos comunicaremos contigo.</span>
          </div>
        )}
        
        {/* Contenido principal */}
        <div className="p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <div className="flex justify-center mb-4">
                <ShoppingCart size={64} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500">Agrega productos para realizar un pedido</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Lista de productos */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 gap-4 p-3 bg-gray-50 text-sm font-medium text-gray-600 border-b">
                    <div className="col-span-6">Producto</div>
                    <div className="col-span-2 text-center">Precio</div>
                    <div className="col-span-2 text-center">Cantidad</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>
                  
                  {cartItems.map((item) => (
                    <div 
                      key={item.codigo} 
                      className="border-b last:border-b-0 p-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                    >
                      {/* Producto */}
                      <div className="md:col-span-6 flex items-center gap-3">
                        <div className="w-16 h-16 relative flex-shrink-0 border rounded overflow-hidden bg-white">
                          <Image 
                            src={item.image} 
                            alt={item.nombre} 
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 text-sm">{item.nombre}</h3>
                          <p className="text-xs text-gray-500">Código: {item.codigo}</p>
                        </div>
                      </div>
                      
                      {/* Precio */}
                      <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                        <span className="md:hidden text-xs text-gray-500">Precio:</span>
                        <span className="font-medium text-sm">${item.precio.toFixed(2)}</span>
                      </div>
                      
                      {/* Cantidad */}
                      <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                        <span className="md:hidden text-xs text-gray-500">Cantidad:</span>
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => {
                              if (item.cantidad > 1) {
                                dispatch(removeFromCart({ codigo: item.codigo, removeCompletely: false }));
                              } else {
                                dispatch(removeFromCart({ codigo: item.codigo, removeCompletely: true }));
                              }
                            }}
                            className="px-2 py-1 text-blue-600 hover:bg-blue-50"
                            disabled={isSubmitting}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2 py-1 text-sm font-medium">{item.cantidad}</span>
                          <button 
                            onClick={() => dispatch(addToCart(item))} 
                            className="px-2 py-1 text-blue-600 hover:bg-blue-50"
                            disabled={isSubmitting}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Subtotal */}
                      <div className="md:col-span-2 flex justify-between md:justify-end items-center">
                        <span className="md:hidden text-xs text-gray-500">Subtotal:</span>
                        <div className="flex items-center">
                          <span className="font-semibold text-blue-600 text-sm">${(item.precio * item.cantidad).toFixed(2)}</span>
                          <button 
                            onClick={() => dispatch(removeFromCart({ codigo: item.codigo, removeCompletely: true }))}
                            className="ml-3 text-red-500 hover:text-red-700"
                            disabled={isSubmitting}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => dispatch(clearCart())}
                  className="mt-3 px-3 py-1.5 border border-red-500 text-red-500 text-sm hover:bg-red-50 rounded font-medium transition-colors flex items-center"
                  disabled={isSubmitting || cartItems.length === 0}
                >
                  <Trash2 size={14} className="mr-2" />
                  Vaciar Carrito
                </button>
              </div>
              
              {/* Resumen y checkout */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded border border-gray-200 p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Resumen del pedido</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Envío</span>
                      <span className="text-blue-600 text-sm">A calcular</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-bold text-blue-700">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Observaciones */}
                  <div className="mb-4">
                    <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones (opcional)
                    </label>
                    <textarea
                      id="observaciones"
                      rows={3}
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Detalles adicionales de tu pedido..."
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      disabled={isSubmitting}
                    ></textarea>
                  </div>
                  
                  {/* Botón de pedido */}
                  <button 
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full bg-blue-600 text-white py-2.5 rounded font-medium hover:bg-blue-700 transition-colors mb-3 flex justify-center items-center disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </>
                    ) : "Realizar pedido"}
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Al hacer click, enviarás tu pedido y te contactaremos para coordinar el pago y la entrega.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}