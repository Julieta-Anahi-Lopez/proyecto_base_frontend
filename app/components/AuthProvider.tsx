"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth } from '@/redux/slices/authSlice';
import { RootState } from '@/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  
  // El problema está aquí - useSelector no está siendo reconocido
  // Vamos a modificar esto
  
  useEffect(() => {
    // Simplificar para evitar usar useSelector aquí
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
}