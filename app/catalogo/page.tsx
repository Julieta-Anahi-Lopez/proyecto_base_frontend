"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import FiltersPanel from "../components/FiltersPanel";

import { useAuth } from "@/app/lib/hooks/useAuth";
import { useFilters, Filters } from "@/app/lib/hooks/useFilters";
import { apiService } from "@/services/api";
import WhatsAppButton from "../components/WhatsAppButton";

export default function CatalogoPage() {
  const { token, isAuthenticated, authChecked } = useAuth();
  const [filters, setFilters] = useState<Filters>({
    category: null,
    subcategory: null,
    precio_max: null,
    nromar: null,
    codigo: null,
    nombre: null,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
      console.log("Algo")
    }
  }, []);

  // 🔃 Cargar rubros y marcas una sola vez
  useEffect(() => {
    if (!authChecked || dataLoaded) return;

    const loadInitialData = async () => {
      try {
        const [rubrosData, marcasData] = await Promise.all([
          apiService.getRubros(),
          apiService.getMarcas()
        ]);

        setRubros(rubrosData);
        setMarcas(
          marcasData.filter((m: Marca) => m.verweb === 0 || m.verweb === 1)
        );
        setDataLoaded(true);
      } catch (err) {
        console.error("Error al cargar rubros y marcas:", err);
        setError("Error al cargar datos iniciales.");
      }
    };

    loadInitialData();
  }, [authChecked, dataLoaded]);

  // 🔃 Cargar productos cada vez que cambian filtros o sesión
  useEffect(() => {
    if (!authChecked) return;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProducts({
          nromar: filters.nromar,
          codigo: filters.codigo,
          nombre: filters.nombre,
          nrogru: filters.category,
          subrubro: filters.subcategory,
          precio_max: filters.precio_max,
        });

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("Error al cargar productos.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [authChecked, filters, refreshKey]);


  useEffect(() => {
    if (!authChecked) return; // esperar que se verifique
    if (!isAuthenticated) {
      setPedidos([]);
      return;
    }
  
    const loadPedidos = async () => {
      try {
        const data = await apiService.getPedidosCliente();
        setPedidos(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        console.error("Error al cargar pedidos del cliente:", err);
      }
    };
  
    loadPedidos();
  }, [authChecked, isAuthenticated]);
  

  const handleSubmitOrder = async (
    observaciones: string,
    items: { codigo: string; cantidad: number; precio: number }[]
  ): Promise<boolean> => {
    try {
      const payload = {
        observ: observaciones.trim() || "Sin observaciones",
        detalle: items.map(item => ({
          codigo: item.codigo,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
      };
  
      const response = await apiService.createPedido(payload);
      return !!response;
    } catch (error) {
      console.error("❌ Error enviando pedido:", error);
      return false;
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        pedidos={isAuthenticated ? pedidos : []}
        pedidosLoading={false}
        onSubmitOrder={handleSubmitOrder}
        onLogoutRefresh={() => setRefreshKey((prev) => prev + 1)}
        ref={headerRef}
      />
      <div style={{ height: headerHeight }} />

      <main className="flex-grow flex flex-col bg-gray-50">
        <FiltersPanel rubros={rubros} marcas={marcas} onChange={setFilters} />
        <div className="flex-grow">
          {loading ? (
            <div className="p-6">Cargando productos...</div>
          ) : (
            <ProductGrid products={products}  isAuthenticated={isAuthenticated} />
          )}
        </div>
      </main>
      <WhatsAppButton 
        phoneNumber="+5492914732827"
        message="Hola, estoy interesado en productos Klinner"
      />

      <Footer />
    </div>
  );
}
