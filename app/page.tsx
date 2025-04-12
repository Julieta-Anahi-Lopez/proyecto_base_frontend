
"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductGrid from "./components/ProductGrid";
import CategoryMenu from "./components/CategoryMenu";
import FilterBar from "./components/FilterBar";
import { useRouter } from "next/navigation";
import { store } from '../redux/store';
import { restoreAuth } from '../redux/slices/authSlice';

// Definición de interfaces para tipar los datos
interface Product {
  codigo: string;
  nombre: string;
  observ: string;
  precio: number;
  image: string;
  imagenes: { foto_1: string }[];
  rubro: string;
  subrubro: string;
}

interface Marca {
  codigo: number;
  nombre: string;
  verweb: number;
}

interface SubRubro {
  nrorub: number;
  codigo: number;
  nombre: string;
}

interface Rubro {
  codigo: number;
  nombre: string;
  subrubros: SubRubro[];
}

// Interfaz para la estructura del pedido
interface OrderItem {
  codigo: string;
  cantidad: number;
  precio: number;
}

interface Order {
  items: OrderItem[];
  observaciones: string;
  total: number;
}

// Definición de selectores para Redux fuera del componente
const getAuthState = (state: RootState) => 
  'auth' in state ? state.auth : { token: null, isAuthenticated: false };

const getFilters = (state: RootState) => state.filters;
const getSelectedCategory = (state: RootState) => state.filters.category;
const getSelectedSubcategory = (state: RootState) => state.filters.subcategory;
const getSelectedPrice = (state: RootState) => state.filters.precio_max;
const getSelectedBrand = (state: RootState) => state.filters.nromar;
const getSelectedCode = (state: RootState) => state.filters.codigo;
const getSelectedName = (state: RootState) => state.filters.nombre;

// Selector para los items del carrito
const getCartItems = (state: RootState) => state.cart.items;

export default function Home() {
  // Estados locales del componente
  const [products, setProducts] = useState<Product[]>([]);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const router = useRouter();
  
  // Estados para control de autenticación y carga
  const [authChecked, setAuthChecked] = useState(false);
  const [hasLocalStorageAuth, setHasLocalStorageAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el proceso de envío de pedido
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  
  // Obtener datos del estado global (Redux)
  const filters = useSelector(getFilters);
  const authState = useSelector(getAuthState);
  const token = authState.token;
  const isAuthenticated = authState.isAuthenticated;
  const selectedCategory = useSelector(getSelectedCategory);
  const selectedSubcategory = useSelector(getSelectedSubcategory);
  const selectedPrice = useSelector(getSelectedPrice);
  const selectedBrand = useSelector(getSelectedBrand);
  const selectedCode = useSelector(getSelectedCode);
  const selectedName = useSelector(getSelectedName);
  
  // Obtener los items del carrito
  const cartItems = useSelector(getCartItems);

  // useEffect para registrar el montaje/desmontaje del componente
  useEffect(() => {
    console.log("🔵 Componente Home montado");
    
    return () => {
      console.log("🔵 Componente Home desmontado");
      setAuthChecked(false);
    };
  }, []);

  // useEffect para verificar la autenticación del usuario
  useEffect(() => {
    if (authChecked) return;
    
    const localStorageAuth = typeof window !== 'undefined' && !!localStorage.getItem('auth_token');
    setHasLocalStorageAuth(localStorageAuth);
    
    if (isAuthenticated && token) {
      console.log("Usuario ya autenticado en Redux");
      setAuthChecked(true);
    } else {
      console.log("Intentando restaurar autenticación desde localStorage");
      store.dispatch(restoreAuth());
      
      const updatedState = store.getState().auth;
      if (updatedState.isAuthenticated && updatedState.token) {
        console.log("Autenticación restaurada desde localStorage");
        setAuthChecked(true);
      } else if (localStorageAuth) {
        // Si hay token en localStorage pero no se pudo restaurar en redux
        console.log("Token en localStorage pero no restaurado en Redux");
        setAuthChecked(true);
      } else {
        console.log("No hay token válido, redirigiendo a login");
        router.push('/login');
      }
    }
  }, [isAuthenticated, token, authChecked, router]);

  // useEffect para cargar datos iniciales (categorías y marcas)
  useEffect(() => {
    if (!authChecked || (!authState.isAuthenticated && !hasLocalStorageAuth) || dataLoaded) {
      return;
    }
    
    console.log("🔵 Carga inicial de datos después de autenticación");
    
    const loadInitialData = async () => {
      try {
        setInitialDataLoading(true);
        
        // Obtener token efectivo
        const effectiveToken = authState.token || localStorage.getItem('auth_token');
        
        // Cargar rubros y marcas en paralelo
        const [rubrosData, marcasData] = await Promise.all([
          // Llamada para rubros/categorías
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-rubros-con-subrubros`, {
            headers: {
              'Authorization': `Bearer ${effectiveToken}`,
              'Content-Type': 'application/json'
            }
          }).then(response => {
            if (!response.ok) throw new Error(`Error en la API de rubros: ${response.status}`);
            return response.json();
          }),
          
          // Llamada para marcas
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-marcas/`, {
            headers: {
              'Authorization': `Bearer ${effectiveToken}`,
              'Content-Type': 'application/json'
            }
          }).then(response => {
            if (!response.ok) throw new Error(`Error en la API de marcas: ${response.status}`);
            return response.json();
          })
        ]);
        
        // Actualizar los estados con los datos recibidos
        setRubros(rubrosData);
        
        // Filtrar marcas que pueden mostrarse en la web
        const filteredMarcas = marcasData.filter(
          (marca: Marca) => marca.verweb === 0 || marca.verweb === 1
        );
        setMarcas(filteredMarcas);
        
        setDataLoaded(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar datos iniciales');
        console.error("Error al cargar datos iniciales:", err);
      } finally {
        setInitialDataLoading(false);
      }
    };
    
    loadInitialData();
  }, [authChecked, authState.isAuthenticated, authState.token, hasLocalStorageAuth, dataLoaded]);

  // useEffect para cargar productos según los filtros aplicados
  useEffect(() => {
    if (!authChecked || (!authState.isAuthenticated && !hasLocalStorageAuth)) {
      console.log("🔴 No hay autenticación válida para cargar productos");
      return;
    }
    
    console.log("🔵 Cargando productos con filtros actualizados:", filters);
    
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Obtener token efectivo
        const effectiveToken = authState.token || localStorage.getItem('auth_token');
        
        // Construir URL con los filtros aplicados
        let url = `${process.env.NEXT_PUBLIC_API_URL}/articulos/`;
        
        // Preparar los parámetros del filtro
        const params = new URLSearchParams();
        
        if (filters.category) params.append('nrogru', filters.category);
        if (filters.subcategory) params.append('subrubro', filters.subcategory);
        if (filters.precio_max) params.append('precio_max', filters.precio_max.toString());
        if (filters.nromar) params.append('nromar', filters.nromar);
        if (filters.codigo) params.append('codigo', filters.codigo);
        if (filters.nombre) params.append('nombre', filters.nombre);
        
        // Añadir los parámetros a la URL si hay alguno
        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
        
        console.log("🔍 URL de fetching productos:", url);
        
        // Hacer la llamada a la API
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${effectiveToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error en la API de productos: ${response.status}`);
        }
        
        const productsData = await response.json();
        setProducts(productsData);
        
        console.log("📦 Productos cargados correctamente:", productsData.length);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar productos');
        console.error("Error al cargar productos:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [
    authChecked,
    authState.isAuthenticated,
    authState.token,
    hasLocalStorageAuth,
    filters
  ]);
  
// Función para enviar el pedido al servidor
// Función para enviar el pedido al servidor
const handleSubmitOrder = async (observaciones: string): Promise<boolean> => {
  // Verificar si hay items en el carrito
  if (cartItems.length === 0) {
    setOrderError("No hay productos en el carrito");
    return false;
  }
  
  try {
    setIsSubmittingOrder(true);
    setOrderError(null);
    
    // Obtener token efectivo
    const effectiveToken = authState.token || localStorage.getItem('auth_token');
    
    if (!effectiveToken) {
      setOrderError("No hay sesión activa");
      return false;
    }
    
    // Preparar los ítems del pedido según el formato requerido por la API
    // Aseguramos que observacion no sea vacía o null
    const detalleItems = cartItems.map(item => ({
      codigo: item.codigo,
      cantidad: item.cantidad,
      precio: item.precio,
      descuento: 0, // Por defecto sin descuento
      observacion: "Sin observaciones" // Valor por defecto para evitar valores null o vacíos
    }));
    
    // Preparar el objeto de pedido según el formato requerido
    // Aseguramos que observ no sea vacía o null
    const pedidoData = {
      observ: observaciones && observaciones.trim() !== "" 
        ? observaciones 
        : "Sin observaciones", // Valor por defecto para evitar valores null o vacíos
      detalle: detalleItems
    };
    
    console.log("🛒 Enviando pedido:", pedidoData);
    
    // Realizar la petición POST
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${effectiveToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pedidoData)
    });
    
    // Procesar la respuesta
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || 
        `Error al enviar el pedido: ${response.status} ${response.statusText}`
      );
    }
    
    const responseData = await response.json();
    console.log("✅ Pedido enviado correctamente:", responseData);
    
    // Manejar respuesta exitosa
    setOrderSuccess(true);
    
    // Aquí podrías vaciar el carrito si lo deseas
    // dispatch(clearCart());
    
    return true;
  } catch (error) {
    // Manejar errores
    console.error("Error al enviar pedido:", error);
    
    setOrderSuccess(false);
    setOrderError(error instanceof Error ? error.message : 'Error desconocido al enviar pedido');
    
    return false;
  } finally {
    setIsSubmittingOrder(false);
  }
};
  
  // Logs de depuración para ver cambios en los estados principales
  useEffect(() => {
    console.log("🟣 Estado actualizado de productos:", products.length);
  }, [products]);
  
  useEffect(() => {
    console.log("🟣 Estado actualizado de rubros:", rubros.length);
  }, [rubros]);
  
  useEffect(() => {
    console.log("🟣 Estado actualizado de marcas:", marcas.length);
  }, [marcas]);
  
  useEffect(() => {
    console.log("🟣 Estado actualizado de filtros:", filters);
  }, [filters]);

  // Renderizado condicional: Spinner mientras verifica autenticación
  if (!authChecked) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Verificando autenticación...</p>
      </div>
    );
  }
  
  // Renderizado condicional: Spinner durante carga inicial de datos
  if (initialDataLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Cargando datos iniciales...</p>
      </div>
    );
  }

  // Renderizado condicional: Mensaje de error si algo falla
  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Renderizado principal con la estructura de la página
  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabecera con logo y menú - pasamos la función handleSubmitOrder como prop */}
      <Header onSubmitOrder={handleSubmitOrder} />
      
      {/* Barra de filtros */}
      <FilterBar marcas={marcas} />
      
      {/* Contenido principal */}
      <main className="flex-grow flex flex-col md:flex-row bg-gray-50">
        {/* Menú lateral de categorías */}
        <CategoryMenu rubros={rubros} />
        
        {/* Área principal de productos */}
        <div className="flex-grow">
          {/* Mostrar indicador de carga o la cuadrícula de productos */}
          {loading ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-blue-500 animate-pulse">Actualizando productos...</div>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </main>
      
      {/* Pie de página */}
      <Footer />
    </div>
  );
}


