// page.tsx
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
  const [loading, setLoading] = useState(true);
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
      } else {
        console.log("No hay token válido, redirigiendo a login");
        router.push('/login');
      }
    }
  }, [isAuthenticated, token, authChecked, router]);

  // Carga de todos los datos necesarios
  useEffect(() => {
    console.log("🔵 Verificando autenticación antes de cargar datos");
    
    const hasLocalStorageAuth = typeof window !== 'undefined' && !!localStorage.getItem('auth_token');
    
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
    authChecked
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
  
  // Spinner para cuando está cargando los datos
  if (loading && authChecked) {
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
        <ProductGrid products={products} />
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
// import { apiService } from "@/services/api";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import ProductGrid from "./components/ProductGrid";
// import CategoryMenu from "./components/CategoryMenu";
// import FilterBar from "./components/FilterBar";
// import { useRouter } from "next/navigation";
// import { store } from '../redux/store';
// import { restoreAuth } from '../redux/slices/authSlice';
// import { createSelector } from '@reduxjs/toolkit';

// // // Código temporal para limpiar tokens
// // useEffect(() => {
// //   console.log("🧹 Limpiando tokens antiguos...");
// //   if (typeof window !== 'undefined') {
// //     localStorage.removeItem('auth_token');
// //     localStorage.removeItem('refresh_token');
// //     localStorage.removeItem('user');
// //     console.log("🧹 Tokens eliminados del localStorage");
    
// //     // Redirigir al login después de limpiar
// //     setTimeout(() => {
// //       window.location.href = '/login';
// //     }, 500);
// //   }
// // }, []);

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


// //Interface para las marcas

// interface Marca {
//   codigo: number;
//   nombre: string;
//   verweb: number;
// }


// //Interface para rubros con subrubros

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


// // Mover TODOS los selectores fuera del componente
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


//     // Agregar esto al inicio del componente Home
//     useEffect(() => {
//       // Este efecto se ejecuta solo una vez al montar el componente
//       console.log("🔵 Componente Home montado");
      
//       return () => {
//         // Limpieza cuando el componente se desmonta
//         console.log("🔵 Componente Home desmontado");
//         setAuthChecked(false); // Resetear el estado para futuras visitas a la página
//       };
//     }, []);

//   // NUEVO USEEFFECT: Verificación de autenticación
//   useEffect(() => {
//     // Verificar autenticación solo una vez
//     if (authChecked) return;
    
//     if (isAuthenticated && token) {
//       console.log("Usuario ya autenticado en Redux");
//       setAuthChecked(true);
//     } else {
//       console.log("Intentando restaurar autenticación desde localStorage");
//       // Intentar restaurar desde localStorage
//       store.dispatch(restoreAuth());
      
//       // Verificar después de intentar restaurar
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

//   useEffect(() => {
//     console.log("🔵 Verificando autenticación antes de cargar productos");
    
//     // Verificación directa de localStorage como fallback
//     const hasLocalStorageAuth = typeof window !== 'undefined' && !!localStorage.getItem('auth_token');
    
//     console.log("🔍 Valores actuales:", { 
//       authChecked, 
//       reduxAuth: authState.isAuthenticated, 
//       reduxToken: !!authState.token,
//       hasLocalStorageAuth
//     });
    
//     // Usar una condición más flexible que incluye localStorage
//     if (!authChecked || (!authState.isAuthenticated && !hasLocalStorageAuth)) {
//       console.log("🔴 No hay autenticación válida para cargar productos");
//       return;
//     }
    
//     console.log("✅ Autenticación verificada, cargando productos...");
    
//     const loadProducts = async () => {
//       try {
//         setLoading(true);
        
//         // Usar el token de Redux o directamente de localStorage
//         const effectiveToken = authState.token || localStorage.getItem('auth_token');
        
//         // Usar fetchApi directamente para tener más control
//         const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos`, {
//           headers: {
//             'Authorization': `Bearer ${effectiveToken}`,
//             'Content-Type': 'application/json'
//           }
//         }).then(response => {
//           if (!response.ok) {
//             throw new Error(`Error en la API: ${response.status}`);
//           }
//           return response.json();
//         });
        
//         console.log("📦 Datos recibidos:", data);
//         setProducts(data);
//         setError(null);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Error desconocido');
//         console.error("Error al cargar productos:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadProducts();
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
  
//   // Este useEffect para logging se mantiene igual
//   useEffect(() => {
//     console.log("🟣 Estado actualizado de productos:", products);
//   }, [products]);

//   // SPINNER REHABILITADO para la verificación de autenticación
//   if (!authChecked) {
//     return (
//       <div className="flex flex-col min-h-screen items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         <p className="mt-4 text-gray-600">Verificando autenticación...</p>
//       </div>
//     );
//   }
  
//   // Spinner para cuando está cargando los productos
//   if (loading && authChecked) {
//     return (
//       <div className="flex flex-col min-h-screen items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         <p className="mt-4 text-gray-600">Cargando productos...</p>
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




//   // El render principal se mantiene igual
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <FilterBar token={token} />
//       <main className="flex-grow flex flex-col md:flex-row bg-current">
//         <CategoryMenu token={token} />
//         <ProductGrid products={products} />
//       </main>
//       <Footer />
//     </div>
//   );




// // //page.tsx
// // "use client";
// // import { useState, useEffect } from "react";
// // import { useSelector } from "react-redux";
// // import { RootState } from "@/store";
// // import { apiService } from "@/services/api";
// // import Header from "./components/Header";
// // import Footer from "./components/Footer";
// // import ProductGrid from "./components/ProductGrid";
// // import CategoryMenu from "./components/CategoryMenu";
// // import FilterBar from "./components/FilterBar";
// // import { useRouter } from "next/navigation";
// // // En la parte superior de tu archivo de login
// // import { store } from '../redux/store'; // Ajusta la ruta según la ubicación de tu archivo store
// // import { restoreAuth } from '../redux/slices/authSlice';



// // interface Product {
// //   codigo: string;
// //   nombre: string;
// //   observ: string;
// //   precio: number;
// //   image: string;
// //   imagenes: { foto_1: string }[];
// //   rubro: string;
// //   subrubro: string;
// // }

// // export default function Home() {
// //   const [products, setProducts] = useState<Product[]>([]);
// //   const router = useRouter();
// //   const [authChecked, setAuthChecked] = useState(false);


// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
  
// //   const filters = useSelector((state: RootState) => state.filters);

// //   // // Obtener el token de autenticación desde Redux
// //   // const token = useSelector((state: RootState) => state.auth?.token);
// //   // const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated);
// //   // const token = useSelector((state: RootState) => state.auth ? state.auth.token : null);
// //   // const isAuthenticated = useSelector((state: RootState) => state.auth ? state.auth.isAuthenticated : false);

// //   // Usando un selector seguro
// //   const authState = useSelector((state: RootState) => 
// //   'auth' in state ? state.auth : { token: null, isAuthenticated: false }
// //   );
// //   const token = authState.token;
// //   const isAuthenticated = authState.isAuthenticated;


// //   // Obtener la categoría y subcategoría seleccionadas desde Redux
// //   const selectedCategory = useSelector((state: RootState) => state.filters.category);
// //   const selectedSubcategory = useSelector((state: RootState) => state.filters.subcategory);
// //   const selectedPrice = useSelector((state: RootState) => state.filters.precio_max);
// //   const selectedBrand = useSelector((state: RootState) => state.filters.nromar);
// //   const selectedCode = useSelector((state: RootState) => state.filters.codigo);
// //   const selectedName = useSelector((state: RootState) => state.filters.nombre);

// //   // Redirigir a login si no está autenticado
// // // En tu página Home
// // // UseEffect para verificar autenticación
// // useEffect(() => {
// //   // Si no hay token, no hacer nada (useAuth se encargará de redireccionar)
// //   if (!authState.isAuthenticated || !authState.token) {
// //     return;
// //   }

// //   const loadProducts = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await apiService.getProducts({
// //         nrogru: filters.category,
// //         nrosub: filters.subcategory,
// //         precio_max: filters.precio_max,
// //         nromar: filters.nromar,
// //         codigo: filters.codigo,
// //         nombre: filters.nombre
// //       });
// //       setProducts(data);
// //       setError(null);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : 'Error desconocido');
// //       console.error("Error al cargar productos:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   loadProducts();
// // }, [
// //   filters.category, 
// //   filters.subcategory, 
// //   filters.precio_max, 
// //   filters.nromar, 
// //   filters.codigo, 
// //   filters.nombre, 
// //   authState.isAuthenticated,
// //   authState.token
// // ]);

// //   // useEffect(() => {
// //   //   console.log("📢 Estado de Redux actualizado:", {
// //   //     selectedCategory,
// //   //     selectedSubcategory,
// //   //     selectedPrice,
// //   //     selectedBrand,
// //   //     selectedCode,
// //   //     selectedName,
// //   //   });
// //   //   console.log("🟡 Filtro actualizado:", { selectedCategory, selectedSubcategory, selectedPrice, selectedBrand, selectedCode, selectedName });
  
// //   //   let url = `${process.env.NEXT_PUBLIC_API_URL}/articulos/`;
// //   //   const params = new URLSearchParams();
  
// //   //   if (selectedCategory) params.append("nrogru", selectedCategory);
// //   //   if (selectedSubcategory) params.append("nrosub", selectedSubcategory);
// //   //   if (selectedPrice) params.append("precio_max", selectedPrice.toString());
// //   //   if (selectedBrand) params.append("nromar", selectedBrand);
// //   //   if (selectedCode) params.append("codigo", selectedCode);
// //   //   if (selectedName) params.append("nombre", selectedName);
  
// //   //   if (params.toString()) {
// //   //     url += `?${params.toString()}`;
// //   //   }
  
// //   //   console.log("🔵 URL generada para la API:", url);
  
// //   //   // Usar el token de Redux en lugar del hardcodeado
// //   //   if (!token) {
// //   //     console.log("No hay token disponible, redirigiendo a login");
// //   //     return;
// //   //   }

// //   //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos/`, {
// //   //     method: 'GET',
// //   //     headers: {
// //   //       'Authorization': `Bearer ${token}`,
// //   //       'Content-Type': 'application/json'
// //   //     }
// //   //   })
// //   //     .then((response) => {
// //   //       if (!response.ok) {
// //   //         // Si obtenemos un error 401 (No autorizado), redirigir a login
// //   //         if (response.status === 401) {
// //   //           console.log("Token inválido o expirado, redirigiendo a login");
// //   //           router.push('/login');
// //   //           return null;
// //   //         }
// //   //         return response.text().then((text) => {
// //   //           throw new Error(`❌ Error en la API: ${response.status} - ${text}`);
// //   //         });
// //   //       }
// //   //       return response.json();
// //   //     })
// //   //     .then((data) => {
// //   //       if (data) {
// //   //         console.log("🟢 Datos recibidos de la API:", data);
// //   //         setProducts(data);
// //   //       }
// //   //     })
// //   //     .catch((error) => console.error("🔴 Error al obtener productos:", error));
// //   // }, [selectedCategory, selectedSubcategory, selectedPrice, selectedBrand, selectedCode, selectedName, token, router]); // Añadido token y router
  
// //   useEffect(() => {
// //     console.log("🟣 Estado actualizado de productos:", products);
// //   }, [products]);

// //   // // Si está cargando la autenticación, mostrar un spinner o mensaje
// //   // if (!isAuthenticated && !token) {
// //   //   return (
// //   //     <div className="flex flex-col min-h-screen items-center justify-center">
// //   //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //   //       <p className="mt-4 text-gray-600">Verificando autenticación...</p>
// //   //     </div>
// //   //   );
// //   // }
// //   // En tu return, antes del contenido principal
// //   // if (!authChecked) {
// //   //   return (
// //   //     <div className="flex flex-col min-h-screen items-center justify-center">
// //   //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //   //       <p className="mt-4 text-gray-600">Verificando autenticación...</p>
// //   //     </div>
// //   //   );
// //   // }
// //   return (
// //     <div className="flex flex-col min-h-screen">
// //       <Header />
// //       <FilterBar />
// //       <main className="flex-grow flex flex-col md:flex-row bg-current">
// //         <CategoryMenu />
// //         <ProductGrid products={products} />
// //       </main>
// //       <Footer />
// //     </div>
// //   );
// // }











































// // "use client";
// // import { useState, useEffect } from "react";
// // import { useSelector } from "react-redux";
// // import { RootState } from "@/store";
// // import Header from "./components/Header";
// // import Footer from "./components/Footer";
// // import ProductGrid from "./components/ProductGrid";
// // import CategoryMenu from "./components/CategoryMenu";
// // import FilterBar from "./components/FilterBar";

// // // const API_URL = "http://localhost:8001/api"; // ✅ Corrección aquí
// // // NEXT_PUBLIC_API_URL=http://localhost:8001/api

// // interface Product {
// //   codigo: string;
// //   nombre: string;
// //   observ: string;
// //   precio: number;
// //   image: string;
// //   imagenes: { foto_1: string }[];
// //   rubro: string;
// //   subrubro: string;
// // }

// // export default function Home() {
// //   const [products, setProducts] = useState<Product[]>([]);

// //   // 🟢 Obtener la categoría y subcategoría seleccionadas desde Redux
// //   const selectedCategory = useSelector((state: RootState) => state.filters.category);
// //   const selectedSubcategory = useSelector((state: RootState) => state.filters.subcategory);
// //   const selectedPrice = useSelector((state: RootState) => state.filters.precio_max);
// //   const selectedBrand = useSelector((state: RootState) => state.filters.nromar);
// //   const selectedCode = useSelector((state: RootState) => state.filters.codigo);
// //   const selectedName = useSelector((state: RootState) => state.filters.nombre);
// //   // const selectedName = "cera"
// //   // useEffect(() => {
// //   //   console.log("📢 Estado de Redux actualizado:", {
// //   //     selectedCategory,
// //   //     selectedSubcategory,
// //   //     selectedPrice,
// //   //     selectedBrand,
// //   //     selectedCode,
// //   //     selectedName,
// //   //   });
// //   // }, [selectedCategory, selectedSubcategory, selectedPrice, selectedBrand, selectedCode, selectedName]);




// //   useEffect(() => {
// //     console.log("📢 Estado de Redux actualizado:", {
// //       selectedCategory,
// //       selectedSubcategory,
// //       selectedPrice,
// //       selectedBrand,
// //       selectedCode,
// //       selectedName,
// //     });
// //     console.log("🟡 Filtro actualizado:", { selectedCategory, selectedSubcategory, selectedPrice, selectedBrand, selectedCode, selectedName });
  
// //     // let url = `${API_URL}/articulos/`;
// //     let url = `${process.env.NEXT_PUBLIC_API_URL}/articulos/`;
// //     const params = new URLSearchParams();
  
// //     if (selectedCategory) params.append("nrogru", selectedCategory);
// //     if (selectedSubcategory) params.append("nrosub", selectedSubcategory);
// //     if (selectedPrice) params.append("precio_max", selectedPrice.toString());
// //     if (selectedBrand) params.append("nromar", selectedBrand);
// //     if (selectedCode) params.append("codigo", selectedCode);
// //     if (selectedName) params.append("nombre", selectedName);
  
// //     if (params.toString()) {
// //       url += `?${params.toString()}`;
// //     }
  
// //     console.log("🔵 URL generada para la API:", url);
  
// //     // Token hardcodeado para la autorización
// //     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTYyNTgyLCJpYXQiOjE3NDM5NTg5ODIsImp0aSI6ImE1NDllMjc0NjM5ZTQ0ZmRiYTI0Mzk1YjhlZDU4OTk4IiwidXNlcl9pZCI6NjEyfQ.xCqkxx2rcPL8zmpifd1sgYVq6o1BNFVi1GAwh-PT-KY";
// //     // const token = " ";

// //     fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulos/`, {
// //       method: 'GET',
// //       headers: {
// //         'Authorization': `Bearer ${token}`,
// //         'Content-Type': 'application/json'
// //       }
// //     })
// //       .then((response) => {
// //         if (!response.ok) {
// //           return response.text().then((text) => {
// //             throw new Error(`❌ Error en la API: ${response.status} - ${text}`);
// //           });
// //         }
// //         return response.json();
// //       })
// //       .then((data) => {
// //         console.log("🟢 Datos recibidos de la API:", data);
// //         setProducts(data);
// //       })
// //       .catch((error) => console.error("🔴 Error al obtener productos:", error));
// //   }, [selectedCategory, selectedSubcategory, selectedPrice, selectedBrand, selectedCode, selectedName]); // 🟢 Ejecutar fetch cada vez que cambie el filtro
// //   useEffect(() => {
// //     console.log("🟣 Estado actualizado de productos:", products);
// //   }, [products]); // 🟣 Se ejecuta cada vez que los productos cambian

// //   return (
// //     <div className="flex flex-col min-h-screen">
// //       <Header />
// //       <FilterBar />
// //       <main className="flex-grow flex flex-col md:flex-row bg-current">
// //         <CategoryMenu />
// //         {/* 🟢 Pasamos los productos filtrados a ProductGrid */}
// //         <ProductGrid products={products} />
// //       </main>
// //       <Footer />
// //     </div>
// //   );
// // }





















































// // // "use client";
// // // import { useState, useEffect } from "react";
// // // import { useSelector } from "react-redux";
// // // import { RootState } from "@/store";
// // // import Header from "./components/Header";
// // // import Footer from "./components/Footer";
// // // import ProductGrid from "./components/ProductGrid";
// // // import CategoryMenu from "./components/CategoryMenu";
// // // import FilterBar from "./components/FilterBar";

// // // const API_URL = "http://localhost:8001" || "http://128.0.204.82:8001";

// // // interface Product {
// // //   codigo: string;
// // //   nombre: string;
// // //   observ: string;
// // //   precio: number;
// // //   image: string;
// // //   imagenes: { foto_1: string }[];
// // //   rubro: string;
// // //   subrubro: string;
// // // }

// // // export default function Home() {
// // //   const [products, setProducts] = useState<Product[]>([]);

// // //   // 🟢 Obtener la categoría y subcategoría seleccionadas desde Redux
// // //   const selectedCategory = useSelector((state: RootState) => state.filters.category);
// // //   const selectedSubcategory = useSelector((state: RootState) => state.filters.subcategory);

// // //   useEffect(() => {
// // //     console.log("🟡 Filtro actualizado:");
// // //     console.log("   🏷 Categoría:", selectedCategory || "Todas");
// // //     console.log("   🔖 Subcategoría:", selectedSubcategory || "Todas");

// // //     let url = `${API_URL}/articulos/`;

// // //     // 🟢 Mapear categorías a valores de `nrogru`
// // //     const categoryMap: Record<string, string> = {
// // //       AUTOMOTOR: "004",
// // //     };

// // //     // 🟢 Construimos los parámetros dinámicamente
// // //     const params = new URLSearchParams();

// // //     if (selectedCategory) {
// // //       if (categoryMap[selectedCategory]) {
// // //         params.append("nrogru", categoryMap[selectedCategory]); // Si está en el mapa, usa `nrogru`
// // //       } else {
// // //         params.append("category", selectedCategory); // Si no está en el mapa, usa `category`
// // //       }
// // //     }

// // //     if (selectedSubcategory) {
// // //       params.append("subcategory", selectedSubcategory);
// // //     }

// // //     if (params.toString()) {
// // //       url += `?${params.toString()}`;
// // //     }

// // //     console.log("🔵 URL generada para la API:", url);

// // //     fetch(url)
// // //       .then((response) => {
// // //         if (!response.ok) {
// // //           throw new Error("❌ Error en la respuesta del servidor");
// // //         }
// // //         return response.json();
// // //       })
// // //       .then((data) => {
// // //         console.log("🟢 Datos recibidos de la API:", data);
// // //         setProducts(data);
// // //       })
// // //       .catch((error) => console.error("🔴 Error al obtener productos:", error));
// // //   }, [selectedCategory, selectedSubcategory]); // 🟢 Ejecutar fetch cada vez que cambie el filtro

// // //   useEffect(() => {
// // //     console.log("🟣 Estado actualizado de productos:", products);
// // //   }, [products]); // 🟣 Se ejecuta cada vez que los productos cambian

// // //   return (
// // //     <div className="flex flex-col min-h-screen">
// // //       <Header />
// // //       <FilterBar />
// // //       <main className="flex-grow flex flex-col md:flex-row bg-current">
// // //         <CategoryMenu />
// // //         {/* 🟢 Pasamos los productos filtrados a ProductGrid */}
// // //         <ProductGrid products={products} />
// // //       </main>
// // //       <Footer />
// // //     </div>
// // //   );
// // // }
































































// // // "use client";
// // // import { useState, useEffect } from "react";
// // // import { useSelector } from "react-redux";
// // // import { RootState } from "@/store";
// // // import Header from "./components/Header";
// // // import Footer from "./components/Footer";
// // // import ProductGrid from "./components/ProductGrid";
// // // import CategoryMenu from "./components/CategoryMenu";
// // // import FilterBar from "./components/FilterBar";

// // // const API_URL = "http://localhost:8001" || "http://128.0.204.82:8001";

// // // interface Product {
// // //   codigo: string;
// // //   nombre: string;
// // //   observ: string;
// // //   precio: number;
// // //   image: string;
// // //   imagenes: { foto_1: string }[];
// // //   rubro: string;
// // //   subrubro: string;
// // // }

// // // export default function Home() {
// // //   const [products, setProducts] = useState<Product[]>([]);

// // //   // 🟢 Obtener la categoría y subcategoría seleccionadas desde Redux
// // //   const selectedCategory = useSelector((state: RootState) => state.filters.category);
// // //   const selectedSubcategory = useSelector((state: RootState) => state.filters.subcategory);

// // //   useEffect(() => {
// // //     console.log("🟡 Filtro actualizado:");
// // //     console.log("   🏷 Categoría:", selectedCategory || "Todas");
// // //     console.log("   🔖 Subcategoría:", selectedSubcategory || "Todas");

// // //     let url = `${API_URL}/articulos/`;

// // //     // 🟢 Construimos los parámetros dinámicamente
// // //     const params = new URLSearchParams();
// // //     if (selectedCategory) params.append("category", selectedCategory);
// // //     if (selectedSubcategory) params.append("subcategory", selectedSubcategory);

// // //     if (params.toString()) {
// // //       url += `?${params.toString()}`;
// // //     }

// // //     console.log("🔵 URL generada para la API:", url);

// // //     fetch(url)
// // //       .then((response) => {
// // //         if (!response.ok) {
// // //           throw new Error("❌ Error en la respuesta del servidor");
// // //         }
// // //         return response.json();
// // //       })
// // //       .then((data) => {
// // //         console.log("🟢 Datos recibidos de la API:", data);
// // //         setProducts(data);
// // //       })
// // //       .catch((error) => console.error("🔴 Error al obtener productos:", error));
// // //   }, [selectedCategory, selectedSubcategory]); // 🟢 Ejecutar fetch cada vez que cambie el filtro

// // //   useEffect(() => {
// // //     console.log("🟣 Estado actualizado de productos:", products);
// // //   }, [products]); // 🟣 Se ejecuta cada vez que los productos cambian

// // //   return (
// // //     <div className="flex flex-col min-h-screen">
// // //       <Header />
// // //       <FilterBar />
// // //       <main className="flex-grow flex flex-col md:flex-row bg-current">
// // //         <CategoryMenu />
// // //         {/* 🟢 Pasamos los productos filtrados a ProductGrid */}
// // //         <ProductGrid products={products} />
// // //       </main>
// // //       <Footer />
// // //     </div>
// // //   );
// // // }
