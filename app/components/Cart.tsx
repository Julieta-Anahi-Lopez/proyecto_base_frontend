"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";

export default function CartComponent() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Carrito de compras</h2>
      {cart.length === 0 && <p>Tu carrito está vacío</p>}
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.quantity}
            <button onClick={() => dispatch(removeFromCart(item.id))}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => dispatch(addToCart({ id: 1, name: "Ejemplo", price: 10, quantity: 1 }))}>
        Agregar Producto
      </button>
    </div>
  );
}
