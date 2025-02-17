import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  codigo: string;
  nombre: string;
  precio: number;
  cantidad: number;
  image: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Agregar un producto al carrito
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.codigo === action.payload.codigo);
      if (existingItem) {
        existingItem.cantidad += 1; // Si ya está en el carrito, aumentar la cantidad
      } else {
        state.items.push({ ...action.payload, cantidad: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(state.items)); // Guardar en localStorage
    },
    // Eliminar un producto del carrito
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.codigo !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items)); // Actualizar localStorage
    },
    // Vaciar el carrito
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
    // Cargar el carrito desde localStorage
    loadCartFromStorage: (state) => {
      const cart = localStorage.getItem("cart");
      if (cart) {
        state.items = JSON.parse(cart);
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, loadCartFromStorage } = cartSlice.actions;
export default cartSlice.reducer;
