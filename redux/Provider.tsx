// redux/Provider.tsx
// redux/Provider.tsx
"use client";

import { store } from "@/store";
import { Provider } from "react-redux";
import { AuthProvider } from "@/app/components/AuthProvider";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
// // redux/Provider.tsx
// import { Provider } from 'react-redux';
// import { store } from './store';
// import { ReactNode } from 'react';

// interface ReduxProviderProps {
//   children: ReactNode;
// }

// export default function ReduxProvider({ children }: ReduxProviderProps) {
//   return <Provider store={store}>{children}</Provider>;
// }