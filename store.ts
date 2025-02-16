// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import filtersReducer from "@/redux/slices/filtersSlice";
import cartReducer from "@/redux/slices/cartSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    cart: cartReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
