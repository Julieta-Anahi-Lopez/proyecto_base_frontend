"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import CategoryMenu from "../components/CategoryMenu";
import FilterBar from "../components/FilterBar";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/lib/hooks/useAuth";
// ...importaciones que ya tenías
import FiltersPanel from "../components/FiltersPanel";
import { useFilters, Filters } from "../lib/hooks/useFilters";

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
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  
  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);






  const router = useRouter();
  // const cartItems = useSelector(getCartItems);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!authChecked || dataLoaded) return;
    const loadInitialData = async () => {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [rubrosRes, marcasRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-rubros-con-subrubros`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-marcas/`, { headers }),
      ]);
      const rubrosData = await rubrosRes.json();
      const marcasData = await marcasRes.json();
      setRubros(rubrosData);
      setMarcas(marcasData.filter((m: Marca) => m.verweb === 0 || m.verweb === 1));
      setDataLoaded(true);
    };
    loadInitialData();
  }, [authChecked, token, dataLoaded]);

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/articulos/?${params.toString()}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await res.json();
        setProducts(data);
      } catch {
        setError("Error al cargar productos.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [authChecked, isAuthenticated, filters, token, refreshKey]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        pedidos={isAuthenticated ? pedidos : []}
        pedidosLoading={false}
        onSubmitOrder={() => {}}
        onLogoutRefresh={() => setRefreshKey((prev) => prev + 1)}
        ref={headerRef}
      />
      <div style={{ height: headerHeight }} />

    <main className="flex-grow flex flex-col">
      <FiltersPanel rubros={rubros} marcas={marcas} onChange={setFilters} />
      <div className="flex-grow">
        {loading ? (
          <div className="p-6">Cargando productos...</div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </main>
      <Footer />
    </div>
  );
}
