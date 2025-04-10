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
      // Verificar que estamos en el navegador antes de usar localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("cart", JSON.stringify(state.items)); // Guardar en localStorage
      }
    },
    // Eliminar un producto del carrito o reducir su cantidad
    removeFromCart: (state, action: PayloadAction<string | { codigo: string, removeCompletely?: boolean }>) => {
      let codigo: string;
      let removeCompletely: boolean = false;

      // Determinar si queremos eliminar por completo o solo reducir cantidad
      if (typeof action.payload === 'string') {
        codigo = action.payload;
      } else {
        codigo = action.payload.codigo;
        removeCompletely = action.payload.removeCompletely || false;
      }

      const itemIndex = state.items.findIndex((item) => item.codigo === codigo);
      
      if (itemIndex !== -1) {
        if (removeCompletely || state.items[itemIndex].cantidad <= 1) {
          // Si removeCompletely es true o solo queda 1 unidad, eliminamos el producto
          state.items = state.items.filter((item) => item.codigo !== codigo);
        } else {
          // Si hay más de 1 unidad y no queremos eliminar por completo, reducimos en 1
          state.items[itemIndex].cantidad -= 1;
        }
        
        // Actualizar localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(state.items));
        }
      }
    },
    // Vaciar el carrito
    clearCart: (state) => {
      state.items = [];
      // Verificar que estamos en el navegador antes de usar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem("cart");
      }
    },
    // Cargar el carrito desde localStorage
    loadCartFromStorage: (state) => {
      // Verificar que estamos en el navegador antes de usar localStorage
      if (typeof window !== 'undefined') {
        const cart = localStorage.getItem("cart");
        if (cart) {
          state.items = JSON.parse(cart);
        }
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, loadCartFromStorage } = cartSlice.actions;
export default cartSlice.reducer; 

















































// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface CartItem {
//   codigo: string;
//   nombre: string;
//   precio: number;
//   cantidad: number;
//   image: string;
// }

// interface CartState {
//   items: CartItem[];
// }

// const initialState: CartState = {
//   items: [],
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     // Agregar un producto al carrito
//     addToCart: (state, action: PayloadAction<CartItem>) => {
//       const existingItem = state.items.find((item) => item.codigo === action.payload.codigo);
//       if (existingItem) {
//         existingItem.cantidad += 1; // Si ya está en el carrito, aumentar la cantidad
//       } else {
//         state.items.push({ ...action.payload, cantidad: 1 });
//       }
//       localStorage.setItem("cart", JSON.stringify(state.items)); // Guardar en localStorage
//     },
//     // Eliminar un producto del carrito
//     removeFromCart: (state, action: PayloadAction<string>) => {
//       state.items = state.items.filter((item) => item.codigo !== action.payload);
//       localStorage.setItem("cart", JSON.stringify(state.items)); // Actualizar localStorage
//     },
//     // Vaciar el carrito
//     clearCart: (state) => {
//       state.items = [];
//       localStorage.removeItem("cart");
//     },
//     // Cargar el carrito desde localStorage
//     loadCartFromStorage: (state) => {
//       const cart = localStorage.getItem("cart");
//       if (cart) {
//         state.items = JSON.parse(cart);
//       }
//     },
//   },
// });

// export const { addToCart, removeFromCart, clearCart, loadCartFromStorage } = cartSlice.actions;
// export default cartSlice.reducer;
