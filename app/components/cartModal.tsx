
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, Package2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addToCart, removeFromCart, clearCart } from "@/redux/slices/cartSlice";
import { useAuth } from "../../app/lib/hooks/useAuth";

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

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedidos: Pedido[];
  pedidosLoading: boolean;
  onSubmitOrder: (
    observaciones: string,
    items: { codigo: string; cantidad: number; precio: number }[]
  ) => Promise<boolean>;
}

export default function CartModal({ isOpen, onClose, pedidos = [], pedidosLoading = false, onSubmitOrder }: CartModalProps) {
  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart');
  const [observaciones, setObservaciones] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const [showBankModal, setShowBankModal] = useState(false);
  const [pedidoTotal, setPedidoTotal] = useState<number>(0);
  const MIN_TOTAL = 50000;





  // Obtener items del carrito desde Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartTotal = cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  // Formatear fecha de pedido
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit',
    });
  };

  // Formatear número de pedido
  const formatOrderNumber = (compro: string) => {
    // Extraer solo la parte numérica si tiene formato "0002-00001375"
    const parts = compro.split('-');
    return parts.length > 1 ? parts[1] : compro;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">Mi Carrito</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-xl leading-none"
          >
            ✖
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex items-center px-4 py-2 font-medium ${activeTab === 'cart'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <ShoppingCart size={18} className="mr-2" />
            <span>Carrito</span>
            {cartItems.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-medium rounded-full px-2 py-0.5">
                {cartItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center px-4 py-2 font-medium ${activeTab === 'orders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Package2 size={18} className="mr-2" />
            <span>Mis Pedidos</span>
            {pedidos.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-medium rounded-full px-2 py-0.5">
                {pedidos.length}
              </span>
            )}
          </button>
        </div>

        {/* Contenido: Carrito */}
        {activeTab === 'cart' && (
          <>
            {cartItems.length === 0 ? (
              // Carrito vacío
              <div className="text-center py-16">
                <div className="flex justify-center mb-4">
                  <ShoppingCart size={64} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h3>
                <p className="text-gray-500 mb-6">Parece que aún no has agregado productos a tu carrito</p>
                <Link
                  href="/catalogo"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  onClick={onClose}
                >
                  Ver productos
                </Link>
              </div>
            ) : (
              // Carrito con productos
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Lista de productos */}
                <div className="lg:w-2/3">
                  <div className="max-h-96 overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.codigo}
                        className="flex items-center gap-4 py-4 border-b"
                      >
                        {/* Imagen del producto */}
                        <div className="relative w-16 h-16 bg-gray-100 rounded border overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.nombre}
                            fill
                            className="object-contain"
                          />
                        </div>

                        {/* Información del producto */}
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-800">{item.nombre}</h4>
                          <div className="flex items-center mt-2">
                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => {
                                  if (item.cantidad > 1) {
                                    dispatch(removeFromCart(item.codigo, false));
                                  } else {
                                    dispatch(removeFromCart(item.codigo, true));
                                  }
                                }}
                                className="px-2 py-1 text-blue-600 hover:bg-blue-50"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-2 text-gray-700 text-sm font-medium">{item.cantidad}</span>
                              <button
                                onClick={() => dispatch(addToCart(item))}
                                className="px-2 py-1 text-blue-600 hover:bg-blue-50"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => dispatch(removeFromCart({ codigo: item.codigo, removeCompletely: true }))}
                              className="ml-4 text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Precio */}
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">${(item.precio * item.cantidad).toFixed(2)}</div>
                          <div className="text-xs text-gray-500">${item.precio.toFixed(2)} por unidad</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => dispatch(clearCart())}
                    className="mt-4 text-red-500 hover:text-red-700 text-sm flex items-center"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Vaciar carrito
                  </button>
                </div>

                {/* Resumen del pedido */}
                <div className="lg:w-1/3 bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 pb-2 border-b">Resumen del pedido</h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="text-gray-700">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-900">Envío</span>
                      <span className="text-blue-600">A calcular</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between font-bold">
                      <span className="text-gray-700">Total</span>
                      <span className="text-gray-900">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Campo de observaciones */}
                  <div className="mb-4">
                    <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones para el pedido:
                    </label>
                    <textarea
                      id="observaciones"
                      className="w-full border text-gray-900 border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Agregar instrucciones especiales o comentarios sobre el pedido..."
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                    />
                  </div>

                  {/* Error de envío si existe */}
                  {submitError && (
                    <div className="bg-red-50 text-red-600 p-2 rounded-md text-sm mb-4">
                      {submitError}
                    </div>
                  )}

                  {cartTotal < MIN_TOTAL && (
                    <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md text-sm mb-4 border border-yellow-300">
                      Te faltan <strong>${(MIN_TOTAL - cartTotal).toFixed(2)}</strong> para alcanzar el mínimo de <strong>${MIN_TOTAL.toLocaleString()}</strong> requerido para realizar un pedido.
                    </div>
                  )}



                  <button
                    className={`w-full py-3 rounded-md font-medium transition-colors ${isSubmitting || cartItems.length === 0 || cartTotal < MIN_TOTAL
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    onClick={async () => {
                      if (!isAuthenticated) {
                        setSubmitError("Debes iniciar sesión para enviar un pedido.");
                        return;
                      }

                      if (isSubmitting || cartItems.length === 0 || cartTotal < MIN_TOTAL) return;

                      setIsSubmitting(true);
                      setSubmitError(null);

                      try {
                        const simplifiedItems = cartItems.map(({ codigo, cantidad, precio }) => ({
                          codigo,
                          cantidad,
                          precio,
                        }));

                        const success = await onSubmitOrder(observaciones, simplifiedItems);
                        if (success) {
                          const total = cartItems.reduce(
                            (total, item) => total + item.precio * item.cantidad,
                            0
                          );
                          setPedidoTotal(total);
                          dispatch(clearCart());
                          setObservaciones("");
                          setShowBankModal(true);
                        }
                      } catch (error) {
                        console.error("Error al enviar pedido:", error);
                        setSubmitError("Ocurrió un error al enviar el pedido. Por favor, intente nuevamente.");
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={isSubmitting || cartItems.length === 0 || cartTotal < MIN_TOTAL}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando pedido...
                      </span>
                    ) : (
                      "Realizar pedido"
                    )}
                  </button>


                  <p className="text-xs text-gray-500 text-center mt-3">
                    Al hacer click, enviarás tu pedido a nuestro sistema. A continuacion podés realizar el pago y enviar el comprobante por Whatsapp o bien, comunicarte con nosotros para coordinar pago y envío.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Contenido: Pedidos */}
        {activeTab === 'orders' && (
          <div className="py-2 px-1">
            {pedidosLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500">Cargando tus pedidos...</p>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <Package2 size={64} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes pedidos previos</h3>
                <p className="text-gray-500">Cuando realices pedidos, aparecerán aquí para que puedas consultarlos</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto pr-2">
                <div className="grid gap-4">
                  {pedidos.map((pedido) => (
                    <div key={pedido.compro} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-800">
                            Pedido #{formatOrderNumber(pedido.compro)}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatDate(pedido.fecped)}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {pedido.detalles.length} artículos
                        </span>
                      </div>

                      {/* Detalles del pedido */}
                      <div className="space-y-2 mb-3">
                        {pedido.detalles.map((detalle) => (
                          <div key={`${pedido.compro}-${detalle.nroord}`} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                            <div className="flex-grow">
                              <p className="text-gray-800 font-medium truncate">{detalle.descri}</p>
                              <p className="text-gray-500 text-xs">{detalle.cantid} unidad(es)</p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="font-semibold text-blue-600">${(detalle.precio * detalle.cantid).toFixed(2)}</p>
                              <p className="text-xs text-gray-500">${detalle.precio.toFixed(2)} c/u</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total y observaciones */}
                      <div className="mt-3 pt-2 border-t">
                        {pedido.observ && pedido.observ !== "Sin observaciones" && (
                          <p className="text-sm text-gray-900 mb-2">
                            <span className="font-medium">Observaciones:</span> {pedido.observ}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">Total del pedido:</span>
                          <span className="font-bold text-blue-700 text-lg">
                            ${pedido.detalles.reduce((sum, item) => sum + (item.precio * item.cantid), 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Botón cerrar */}
        <div className="border-t pt-4 mt-4">
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
      {showBankModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 relative">
            <button
              onClick={() => setShowBankModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl leading-none"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold text-gray-800">Información para el pago</h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Total del pedido:</strong> ${pedidoTotal.toFixed(2)}</p>
              <p><strong>Banco:</strong> Banco Nación</p>
              <p><strong>CBU:</strong> 0110123456789012345678</p>
              <p><strong>Alias:</strong> mi.negocio.transfer</p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText("0110123456789012345678");
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-sm text-gray-700 py-2 rounded transition"
            >
              Copiar CBU
            </button>

            <button
              onClick={() => {
                const mensaje = `Hola, acabo de realizar un pedido de $${pedidoTotal.toFixed(
                  2
                )}. Adjunto comprobante de transferencia.`;
                window.open(
                  `https://wa.me/5492914732827?text=${encodeURIComponent(mensaje)}`,
                  "_blank"
                );
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded transition flex justify-center items-center gap-2"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 32 32"
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 .396C7.176.396.001 7.57.001 16.396c0 2.907.765 5.65 2.21 8.087L.06 32l7.308-2.14a15.82 15.82 0 008.63 2.536c8.824 0 15.999-7.173 15.999-16S24.824.396 16 .396zM16 29.93c-2.786 0-5.505-.772-7.87-2.237l-.564-.337-4.348 1.272 1.3-4.236-.366-.606a13.88 13.88 0 01-2.068-7.09c0-7.732 6.29-14.02 14.02-14.02S30.02 8.664 30.02 16.396 23.732 29.93 16 29.93zm8.148-10.368c-.447-.223-2.646-1.304-3.057-1.453-.41-.15-.708-.223-1.006.223-.297.446-1.15 1.453-1.41 1.75-.26.297-.518.335-.965.112-.447-.223-1.89-.693-3.6-2.211-1.33-1.19-2.227-2.656-2.488-3.102-.26-.446-.028-.685.195-.908.2-.2.447-.52.67-.78.224-.26.298-.446.447-.743.15-.297.075-.56-.037-.78-.112-.223-1.006-2.42-1.378-3.314-.363-.868-.735-.752-1.006-.766l-.86-.015c-.297 0-.78.112-1.187.56-.41.447-1.56 1.52-1.56 3.706s1.596 4.3 1.817 4.593c.223.297 3.132 4.778 7.595 6.703.63.27 1.12.43 1.505.55.63.2 1.202.172 1.654.105.504-.075 1.56-.637 1.78-1.253.223-.618.223-1.15.15-1.253-.075-.104-.28-.164-.728-.372z" />
              </svg>
              Enviar comprobante
            </button>
          </div>
        </div>
      )}


    </div>
  );
}

