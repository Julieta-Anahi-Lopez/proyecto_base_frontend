// store.ts
import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filtersSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice'; // Importa el nuevo reducer
import orderReducer from './slices/orderSlice';



export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    cart: cartReducer,
    auth: authReducer, // Añade el reducer de autenticación
    order: orderReducer
  },
});

// export type RootState = ReturnType<typeof store.getState>;
// En store.ts
export type RootState = {
  filters: ReturnType<typeof filtersReducer>;
  cart: ReturnType<typeof cartReducer>;
  auth: ReturnType<typeof authReducer>;
  order: ReturnType<typeof orderReducer>;
};
export type AppDispatch = typeof store.dispatch;


// // redux/store.tsx
// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';
// // Importa otros reducers aquí si los tienes

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     // Añade aquí otros reducers
//   },
// });

// // Tipos para TypeScript
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;