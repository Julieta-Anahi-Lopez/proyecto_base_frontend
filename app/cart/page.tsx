"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { removeFromCart, clearCart } from "@/redux/slices/cartSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CartPage() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <div className="container mx-auto p-4">
      <Header />
      <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.codigo} className="flex justify-between items-center border-b py-2">
              <img src={item.image} alt={item.nombre} className="w-16 h-16 object-cover" />
              <span>{item.nombre}</span>
              <span className="font-bold">${item.precio}</span>
              <span>x {item.cantidad}</span>
              <button
                onClick={() => dispatch(removeFromCart(item.codigo))}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                ❌
              </button>
            </div>
          ))}
          <button
            onClick={() => dispatch(clearCart())}
            className="bg-red-600 text-white px-4 py-2 mt-4 rounded"
          >
            Vaciar Carrito
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}
