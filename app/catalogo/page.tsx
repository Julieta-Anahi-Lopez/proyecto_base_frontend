"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import CategoryMenu from "../components/CategoryMenu";
import FilterBar from "../components/FilterBar";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/lib/hooks/useAuth";

// Tipos de producto, marca, rubro y pedido
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

interface OrderItem {
  codigo: string;
  cantidad: number;
  precio: number;
}

interface PedidoDetalle {
  compro: string;
  nroord: number;
  codart: string;
  cantid: number;
  descri: string;
  penden: number;
  pendfc: number;
  precio: number;
  nrolis: number;
  pordes: number;
  nroemp: number;
  observ: string;
  poruni: number;
}

interface Pedido {
  compro: string;
  detalles: PedidoDetalle[];
  nrocli: number;
  fecped: string;
  plazo: string;
  lugent: string;
  condic: string;
  observ: string;
  nrousu: number;
  nroven: number;
  imputa: number;
  nombpc: string;
  origen: string;
  nroemp: number;
  tipdep: number;
  nroest: string;
}

interface PedidosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pedido[];
}

// Selectores de Redux
const getFilters = (state: RootState) => state.filters;
const getCartItems = (state: RootState) => state.cart.items;

export default function CatalogoPage() {
  const router = useRouter();
  const filters = useSelector(getFilters);
  const cartItems = useSelector(getCartItems);
  const { token, isAuthenticated, authChecked } = useAuth();
  const [showNotice, setShowNotice] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [pedidosLoading, setPedidosLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);



  useEffect(() => {
    if (!isAuthenticated && authChecked) {
      console.log("Mostrando advertencia....")
      setShowNotice(true);
      const timeout = setTimeout(() => setShowNotice(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [authChecked, isAuthenticated]);

  // Cargar rubros y marcas
  useEffect(() => {
    if (!authChecked || dataLoaded) return;

    const loadInitialData = async () => {
      try {
        setInitialDataLoading(true);
        const headers = {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        };

        const [rubrosRes, marcasRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-rubros-con-subrubros`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-marcas/`, { headers }),
        ]);

        const rubrosData = await rubrosRes.json();
        const marcasData = await marcasRes.json();

        setRubros(rubrosData);
        setMarcas(marcasData.filter((m: Marca) => m.verweb === 0 || m.verweb === 1));
        setDataLoaded(true);
      } catch (err) {
        setError("Error al cargar rubros o marcas.");
      } finally {
        setInitialDataLoading(false);
      }
    };

    loadInitialData();
  }, [authChecked, token, dataLoaded]);

  // Cargar productos según filtros
  useEffect(() => {
    if (!authChecked) return;
  
    const loadProducts = async () => {
      try {
        setLoading(true);
  
        const params = new URLSearchParams();
        if (filters.category) params.append("nrogru", filters.category);
        if (filters.subcategory) params.append("subrubro", filters.subcategory);
        if (filters.precio_max) params.append("precio_max", filters.precio_max.toString());
        if (filters.nromar) params.append("nromar", filters.nromar);
        if (filters.codigo) params.append("codigo", filters.codigo);
        if (filters.nombre) params.append("nombre", filters.nombre);
  
        const url = `${process.env.NEXT_PUBLIC_API_URL}/articulos/?${params.toString()}`;
  
        const headers = {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        };
  
        const res = await fetch(url, { headers });
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError("Error al cargar productos.");
      } finally {
        setLoading(false);
      }
    };
  
    loadProducts();
  }, [authChecked, isAuthenticated, filters, token, refreshKey]);
  
  // Cargar pedidos solo si está autenticado
  useEffect(() => {
    if (!authChecked || !isAuthenticated) return;

    const loadPedidos = async () => {
      try {
        setPedidosLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pedidos/usuario/mis-pedidos/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data: PedidosResponse = await res.json();
        setPedidos(data.results);
      } catch (err) {
        setError("Error al cargar pedidos.");
      } finally {
        setPedidosLoading(false);
      }
    };

    loadPedidos();
  }, [authChecked, isAuthenticated, token]);

  // Enviar pedido
  const handleSubmitOrder = async (observaciones: string): Promise<boolean> => {
    if (cartItems.length === 0) {
      setOrderError("No hay productos en el carrito");
      return false;
    }

    try {
      setIsSubmittingOrder(true);
      const detalleItems = cartItems.map(item => ({
        codigo: item.codigo,
        cantidad: item.cantidad,
        precio: item.precio,
        descuento: 0,
        observacion: "Sin observaciones",
      }));

      const pedidoData = {
        observ: observaciones.trim() || "Sin observaciones",
        detalle: detalleItems,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedidoData),
      });

      if (!res.ok) throw new Error("Error al enviar pedido");

      await res.json();
      setOrderSuccess(true);
      return true;
    } catch (err) {
      setOrderError("Error al enviar el pedido");
      return false;
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Renderizado
  if (!authChecked || initialDataLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    );
  }

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

  return (
    <div className="flex flex-col min-h-screen">
      


  
      <Header
        pedidos={isAuthenticated ? pedidos : []}
        pedidosLoading={isAuthenticated && pedidosLoading}
        onSubmitOrder={isAuthenticated ? handleSubmitOrder : undefined}
        onLogoutRefresh={() => setRefreshKey(prev => prev + 1)} // 👈 fuerza reload
      />
      
      <FilterBar marcas={marcas} />
      
      <main className="flex-grow flex flex-col md:flex-row bg-current">
        <CategoryMenu rubros={rubros} />
        <div className="flex-grow">
          {loading ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-blue-500 animate-pulse">Actualizando productos...</div>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </main>
      {showNotice && (
        <div className="fixed bottom-6 right-6 bg-gray-50 text-gray-800 px-5 py-4 rounded-lg shadow-lg z-50 flex items-center justify-between gap-4 border border-blue-200 ring-1 ring-blue-100 backdrop-blur-sm ">
  <span className="text-sm flex items-center gap-2">
    <span className="text-blue-600 text-lg">ℹ️</span>
    Iniciá sesión para ver precios y hacer pedidos.
  </span>
  <button
    onClick={() => router.push('/login')}
    className="bg-blue-600 text-white font-semibold text-sm px-3 py-1.5 rounded-md shadow-md hover:bg-blue-700 transition-colors"
  >
    Iniciar sesión
  </button>
</div>


        )}


      <Footer />
    </div>
  );
}





