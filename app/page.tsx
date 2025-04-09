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

// Interfaces
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

// Mover los selectores fuera del componente
const getAuthState = (state: RootState) => 
  'auth' in state ? state.auth : { token: null, isAuthenticated: false };

const getFilters = (state: RootState) => state.filters;
const getSelectedCategory = (state: RootState) => state.filters.category;
const getSelectedSubcategory = (state: RootState) => state.filters.subcategory;
const getSelectedPrice = (state: RootState) => state.filters.precio_max;
const getSelectedBrand = (state: RootState) => state.filters.nromar;
const getSelectedCode = (state: RootState) => state.filters.codigo;
const getSelectedName = (state: RootState) => state.filters.nombre;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [hasLocalStorageAuth, setHasLocalStorageAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Usar los selectores memoizados
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

  // Efecto para limpieza al montar/desmontar
  useEffect(() => {
    console.log("🔵 Componente Home montado");
    
    return () => {
      console.log("🔵 Componente Home desmontado");
      setAuthChecked(false);
    };
  }, []);

  // Verificación de autenticación
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

  // Carga de todos los datos necesarios
  useEffect(() => {
    console.log("🔵 Verificando autenticación antes de cargar datos");
    
    console.log("🔍 Valores actuales:", { 
      authChecked, 
      reduxAuth: authState.isAuthenticated, 
      reduxToken: !!authState.token,
      hasLocalStorageAuth
    });
    
    if (!authChecked || (!authState.isAuthenticated && !hasLocalStorageAuth)) {
      console.log("🔴 No hay autenticación válida para cargar datos");
      return;
    }
    
    console.log("✅ Autenticación verificada, cargando todos los datos...");
    
    const loadAllData = async () => {
      try {
        setLoading(true);
        
        // Obtener token efectivo
        const effectiveToken = authState.token || localStorage.getItem('auth_token');
        
        // Cargar datos en paralelo para mejor rendimiento
        const [productsData, rubrosData, marcasData] = await Promise.all([
          // Llamada para productos
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`, {
            headers: {
              'Authorization': `Bearer ${effectiveToken}`,
              'Content-Type': 'application/json'
            }
          }).then(response => {
            if (!response.ok) throw new Error(`Error en la API de productos: ${response.status}`);
            return response.json();
          }),
          
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
        setProducts(productsData);
        setRubros(rubrosData);
        
        // Filtrar marcas si es necesario
        const filteredMarcas = marcasData.filter(
          (marca: Marca) => marca.verweb === 0 || marca.verweb === 1
        );
        setMarcas(filteredMarcas);
        
        console.log("📦 Todos los datos cargados correctamente");
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar datos');
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
        setInitialDataLoading(false);
      }
    };
    
    loadAllData();
  }, [
    filters.category, 
    filters.subcategory, 
    filters.precio_max, 
    filters.nromar, 
    filters.codigo, 
    filters.nombre, 
    authState.isAuthenticated,
    authState.token,
    authChecked,
    hasLocalStorageAuth
  ]);
  
  // Logging para depuración
  useEffect(() => {
    console.log("🟣 Estado actualizado de productos:", products);
  }, [products]);
  
  useEffect(() => {
    console.log("🟣 Estado actualizado de rubros:", rubros);
  }, [rubros]);
  
  useEffect(() => {
    console.log("🟣 Estado actualizado de marcas:", marcas);
  }, [marcas]);

  // SPINNER para verificación de autenticación
  if (!authChecked) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Verificando autenticación...</p>
      </div>
    );
  }
  
  // Spinner solo se muestra en la carga inicial, no en las filtraciones posteriores
  if (initialDataLoading && authChecked) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  // Mensaje de error si hay algún problema
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

  // Render principal con datos pasados como props
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <FilterBar marcas={marcas} />
      <main className="flex-grow flex flex-col md:flex-row bg-current">
        <CategoryMenu rubros={rubros} />
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="animate-pulse text-blue-500">Actualizando...</div>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </main>
      <Footer />
    </div>
  );
}



























// // page.tsx
// "use client";
// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import ProductGrid from "./components/ProductGrid";
// import CategoryMenu from "./components/CategoryMenu";
// import FilterBar from "./components/FilterBar";
// import { useRouter } from "next/navigation";
// import { store } from '../redux/store';
// import { restoreAuth } from '../redux/slices/authSlice';

// // Interfaces
// interface Product {
//   codigo: string;
//   nombre: string;
//   observ: string;
//   precio: number;
//   image: string;
//   imagenes: { foto_1: string }[];
//   rubro: string;
//   subrubro: string;
// }

// interface Marca {
//   codigo: number;
//   nombre: string;
//   verweb: number;
// }

// interface SubRubro {
//   nrorub: number;
//   codigo: number;
//   nombre: string;
// }

// interface Rubro {
//   codigo: number;
//   nombre: string;
//   subrubros: SubRubro[];
// }

// // Mover los selectores fuera del componente
// const getAuthState = (state: RootState) => 
//   'auth' in state ? state.auth : { token: null, isAuthenticated: false };

// const getFilters = (state: RootState) => state.filters;
// const getSelectedCategory = (state: RootState) => state.filters.category;
// const getSelectedSubcategory = (state: RootState) => state.filters.subcategory;
// const getSelectedPrice = (state: RootState) => state.filters.precio_max;
// const getSelectedBrand = (state: RootState) => state.filters.nromar;
// const getSelectedCode = (state: RootState) => state.filters.codigo;
// const getSelectedName = (state: RootState) => state.filters.nombre;

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [rubros, setRubros] = useState<Rubro[]>([]);
//   const [marcas, setMarcas] = useState<Marca[]>([]);
//   const router = useRouter();
//   const [authChecked, setAuthChecked] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // Usar los selectores memoizados
//   const filters = useSelector(getFilters);
//   const authState = useSelector(getAuthState);
//   const token = authState.token;
//   const isAuthenticated = authState.isAuthenticated;
//   const selectedCategory = useSelector(getSelectedCategory);
//   const selectedSubcategory = useSelector(getSelectedSubcategory);
//   const selectedPrice = useSelector(getSelectedPrice);
//   const selectedBrand = useSelector(getSelectedBrand);
//   const selectedCode = useSelector(getSelectedCode);
//   const selectedName = useSelector(getSelectedName);

//   // Efecto para limpieza al montar/desmontar
//   useEffect(() => {
//     console.log("🔵 Componente Home montado");
    
//     return () => {
//       console.log("🔵 Componente Home desmontado");
//       setAuthChecked(false);
//     };
//   }, []);

//   // Verificación de autenticación
//   useEffect(() => {
//     if (authChecked) return;
    
//     if (isAuthenticated && token) {
//       console.log("Usuario ya autenticado en Redux");
//       setAuthChecked(true);
//     } else {
//       console.log("Intentando restaurar autenticación desde localStorage");
//       store.dispatch(restoreAuth());
      
//       const updatedState = store.getState().auth;
//       if (updatedState.isAuthenticated && updatedState.token) {
//         console.log("Autenticación restaurada desde localStorage");
//         setAuthChecked(true);
//       } else {
//         console.log("No hay token válido, redirigiendo a login");
//         router.push('/login');
//       }
//     }
//   }, [isAuthenticated, token, authChecked, router]);

//   // Carga de todos los datos necesarios
//   useEffect(() => {
//     console.log("🔵 Verificando autenticación antes de cargar datos");
    
//     const hasLocalStorageAuth = typeof window !== 'undefined' && !!localStorage.getItem('auth_token');
    
//     console.log("🔍 Valores actuales:", { 
//       authChecked, 
//       reduxAuth: authState.isAuthenticated, 
//       reduxToken: !!authState.token,
//       hasLocalStorageAuth
//     });
    
//     if (!authChecked || (!authState.isAuthenticated && !hasLocalStorageAuth)) {
//       console.log("🔴 No hay autenticación válida para cargar datos");
//       return;
//     }
    
//     console.log("✅ Autenticación verificada, cargando todos los datos...");
    
//     const loadAllData = async () => {
//       try {
//         setLoading(true);
        
//         // Obtener token efectivo
//         const effectiveToken = authState.token || localStorage.getItem('auth_token');
        
//         // Cargar datos en paralelo para mejor rendimiento
//         const [productsData, rubrosData, marcasData] = await Promise.all([
//           // Llamada para productos
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`, {
//             headers: {
//               'Authorization': `Bearer ${effectiveToken}`,
//               'Content-Type': 'application/json'
//             }
//           }).then(response => {
//             if (!response.ok) throw new Error(`Error en la API de productos: ${response.status}`);
//             return response.json();
//           }),
          
//           // Llamada para rubros/categorías
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-rubros-con-subrubros`, {
//             headers: {
//               'Authorization': `Bearer ${effectiveToken}`,
//               'Content-Type': 'application/json'
//             }
//           }).then(response => {
//             if (!response.ok) throw new Error(`Error en la API de rubros: ${response.status}`);
//             return response.json();
//           }),
          
//           // Llamada para marcas
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-marcas/`, {
//             headers: {
//               'Authorization': `Bearer ${effectiveToken}`,
//               'Content-Type': 'application/json'
//             }
//           }).then(response => {
//             if (!response.ok) throw new Error(`Error en la API de marcas: ${response.status}`);
//             return response.json();
//           })
//         ]);
        
//         // Actualizar los estados con los datos recibidos
//         setProducts(productsData);
//         setRubros(rubrosData);
        
//         // Filtrar marcas si es necesario
//         const filteredMarcas = marcasData.filter(
//           (marca: Marca) => marca.verweb === 0 || marca.verweb === 1
//         );
//         setMarcas(filteredMarcas);
        
//         console.log("📦 Todos los datos cargados correctamente");
//         setError(null);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Error desconocido al cargar datos');
//         console.error("Error al cargar datos:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadAllData();
//   }, [
//     filters.category, 
//     filters.subcategory, 
//     filters.precio_max, 
//     filters.nromar, 
//     filters.codigo, 
//     filters.nombre, 
//     authState.isAuthenticated,
//     authState.token,
//     authChecked
//   ]);
  
//   // Logging para depuración
//   useEffect(() => {
//     console.log("🟣 Estado actualizado de productos:", products);
//   }, [products]);
  
//   useEffect(() => {
//     console.log("🟣 Estado actualizado de rubros:", rubros);
//   }, [rubros]);
  
//   useEffect(() => {
//     console.log("🟣 Estado actualizado de marcas:", marcas);
//   }, [marcas]);

//   // SPINNER para verificación de autenticación
//   if (!authChecked) {
//     return (
//       <div className="flex flex-col min-h-screen items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         <p className="mt-4 text-gray-600">Verificando autenticación...</p>
//       </div>
//     );
//   }
  
//   // Spinner para cuando está cargando los datos
//   if (loading && authChecked) {
//     return (
//       <div className="flex flex-col min-h-screen items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         <p className="mt-4 text-gray-600">Cargando datos...</p>
//       </div>
//     );
//   }

//   // Mensaje de error si hay algún problema
//   if (error) {
//     return (
//       <div className="flex flex-col min-h-screen items-center justify-center">
//         <div className="text-red-500 text-xl">Error: {error}</div>
//         <button 
//           onClick={() => window.location.reload()} 
//           className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Reintentar
//         </button>
//       </div>
//     );
//   }

//   // Render principal con datos pasados como props
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <FilterBar marcas={marcas} />
//       <main className="flex-grow flex flex-col md:flex-row bg-current">
//         <CategoryMenu rubros={rubros} />
//         <ProductGrid products={products} />
//       </main>
//       <Footer />
//     </div>
//   );
// }







