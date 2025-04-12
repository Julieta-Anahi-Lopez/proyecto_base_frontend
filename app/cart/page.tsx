"use client";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const authState = useSelector((state: RootState) => state.auth);
  
  const [orderInProgress, setOrderInProgress] = useState(false);
  
  // Función para enviar pedidos (pasada al Header)
  const handleSubmitOrder = async (observaciones: string): Promise<boolean> => {
    // Validaciones básicas
    if (cartItems.length === 0) {
      console.error("No hay productos en el carrito");
      return false;
    }

    try {
      setOrderInProgress(true);
      
      console.log("🔵 Iniciando envío de pedido con observaciones:", observaciones);
      
      // Verificar autenticación
      const effectiveToken = authState.token || localStorage.getItem('auth_token');
      const userDataString = localStorage.getItem('user');
      
      if (!effectiveToken || !userDataString) {
        console.error("🔴 No hay autenticación válida para realizar el pedido");
        router.push('/login');
        return false;
      }
      
      // Obtener datos del usuario
      const userData = JSON.parse(userDataString);
      
      // Preparar los datos del pedido
      const orderData = {
        cliente: userData.codigo?.toString() || '',
        items: cartItems.map(item => ({
          codigo: item.codigo,
          cantidad: item.cantidad,
          precio: item.precio
        })),
        observaciones: observaciones || ''
      };
      
      console.log("📦 Datos del pedido:", orderData);
      
      // Realizar la solicitud a la API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${effectiveToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      // Manejar la respuesta
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("🔴 Error en la respuesta de la API:", response.status, errorData);
        
        // Si hay error de autenticación, redirigir a login
        if (response.status === 401) {
          router.push('/login');
          return false;
        }
        
        return false;
      }
      
      // Si la respuesta es exitosa
      const data = await response.json();
      console.log("🟢 Pedido creado exitosamente:", data);
      
      return true;
      
    } catch (error) {
      console.error("🔴 Error al crear pedido:", error);
      return false;
    } finally {
      setOrderInProgress(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSubmitOrder={handleSubmitOrder} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Gestión del Carrito</h1>
          <p className="text-gray-600">
            Usa el botón de carrito en la parte superior para ver y gestionar tus productos.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}