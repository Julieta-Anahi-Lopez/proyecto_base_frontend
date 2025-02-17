"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"; // 🛒 Iconos
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);

  const dispatch = useDispatch();

  // 🟢 Obtener los productos del carrito desde Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

  // 🟢 Función para manejar la vista previa del carrito con delay
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

  return (
    <header className="bg-blue-900 shadow-md relative z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* 🔥 Sección de logos */}
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


          {/* 🔥 Logo Walker + Representante Oficial (centrado verticalmente) */}
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

        {/* 🔥 Menú de navegación (pantallas grandes) */}
        <nav className="hidden lg:flex space-x-6 text-white text-lg items-center">
          <Link href="/" className="hover:text-gray-300">Inicio</Link>
          <Link href="/productos" className="hover:text-gray-300">Catálogo</Link>
          <Link href="/contacto" className="hover:text-gray-300">Contacto</Link>

          {/* 🛒 Ícono del carrito con vista previa mejorada */}
          <div
            className="relative"
            onMouseOver={showCartPreview}
            onMouseLeave={hideCartPreview}
          >
            <Link href="/cart" className="relative flex items-center">
              <ShoppingCart className="w-6 h-6 text-white hover:text-gray-300" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 🟢 Vista previa del carrito */}
            {isCartPreviewOpen && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white shadow-lg p-4 rounded-md"
                onMouseOver={showCartPreview}
                onMouseLeave={hideCartPreview}
              >
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-sm">El carrito está vacío</p>
                ) : (
                  <ul className="space-y-2">
                    {cartItems.map((item) => (
                      <li key={item.codigo} className="flex items-center justify-between border-b pb-2">
                        {/* 🟢 Imagen del producto */}
                        <Image src={item.image} alt={item.nombre} width={40} height={40} className="rounded" />

                        {/* 🟢 Nombre y precio */}
                        <div className="w-36 px-2">
                          <p className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.nombre}
                          </p>
                          <p className="text-xs text-gray-600">${item.precio.toFixed(2)}</p>
                        </div>

                        {/* 🟢 Controles de cantidad */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              item.cantidad > 1
                                ? dispatch(removeFromCart(item.codigo))
                                : dispatch(removeFromCart(item.codigo))
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-sm font-semibold">{item.cantidad}</span>
                          <button onClick={() => dispatch(addToCart(item))} className="text-green-500 hover:text-green-700">
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* 🟢 Botón de eliminar */}
                        <button
                          onClick={() => dispatch(removeFromCart(item.codigo))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Botón para ir al carrito */}
                <Link href="/cart" className="block text-center bg-blue-600 text-white mt-3 py-2 rounded-md hover:bg-blue-700">
                  Ver Carrito
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* 🔥 Botón de Menú en móvil */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white text-2xl"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* 🔥 Menú desplegable en móvil */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-900 shadow-md py-4 flex flex-col items-center space-y-4 text-white text-lg lg:hidden">
          <Link href="/" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
          <Link href="/productos" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
          <Link href="/contacto" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
        </div>
      )}
    </header>
  );
}
