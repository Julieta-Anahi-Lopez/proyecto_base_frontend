"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductGrid from "./components/ProductGrid";
import CategoryMenu from "./components/CategoryMenu";
import FilterBar from "./components/FilterBar";

const API_URL = "http://localhost:8001"; // ✅ Corrección aquí

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  // 🟢 Obtener la categoría y subcategoría seleccionadas desde Redux
  const selectedCategory = useSelector((state: RootState) => state.filters.category);
  const selectedSubcategory = useSelector((state: RootState) => state.filters.subcategory);
  const selectedPrice = useSelector((state: RootState) => state.filters.precio_max);
  const selectedBrand = useSelector((state: RootState) => state.filters.nromar);
  const selectedCode = useSelector((state: RootState) => state.filters.codigo);
  const selectedName = useSelector((state: RootState) => state.filters.nombre);
  // const selectedName = "cera"
  // useEffect(() => {
  //   console.log("📢 Estado de Redux actualizado:", {
  //     selectedCategory,
  //     selectedSubcategory,
  //     selectedPrice,
  //     selectedBrand,
  //     selectedCode,
  //     selectedName,
  //   });
  // }, [selectedCategory, selectedSubcategory, selectedPrice, selectedBrand, selectedCode, selectedName]);




  useEffect(() => {
    console.log("📢 Estado de Redux actualizado:", {
      selectedCategory,
      selectedSubcategory,
      selectedPrice,
      selectedBrand,
      selectedCode,
      selectedName,
    });
    console.log("🟡 Filtro actualizado:", { selectedCategory, selectedSubcategory, selectedPrice, selectedBrand, selectedCode, selectedName });

    let url = `${API_URL}/articulos/`;
    const params = new URLSearchParams();

    if (selectedCategory) params.append("nrogru", selectedCategory);
    if (selectedSubcategory) params.append("nrosub", selectedSubcategory);
    if (selectedPrice) params.append("precio_max", selectedPrice.toString());
    if (selectedBrand) params.append("nromar", selectedBrand);
    if (selectedCode) params.append("codigo", selectedCode);
    if (selectedName) params.append("nombre", selectedName);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log("🔵 URL generada para la API:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`❌ Error en la API: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("🟢 Datos recibidos de la API:", data);
        setProducts(data);
      })
      .catch((error) => console.error("🔴 Error al obtener productos:", error));
  }, [selectedCategory, selectedSubcategory, selectedPrice, selectedBrand, selectedCode, selectedName]); // 🟢 Ejecutar fetch cada vez que cambie el filtro

  useEffect(() => {
    console.log("🟣 Estado actualizado de productos:", products);
  }, [products]); // 🟣 Se ejecuta cada vez que los productos cambian

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <FilterBar />
      <main className="flex-grow flex flex-col md:flex-row bg-current">
        <CategoryMenu />
        {/* 🟢 Pasamos los productos filtrados a ProductGrid */}
        <ProductGrid products={products} />
      </main>
      <Footer />
    </div>
  );
}





















































// "use client";
// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import ProductGrid from "./components/ProductGrid";
// import CategoryMenu from "./components/CategoryMenu";
// import FilterBar from "./components/FilterBar";

// const API_URL = "http://localhost:8001" || "http://128.0.204.82:8001";

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

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);

//   // 🟢 Obtener la categoría y subcategoría seleccionadas desde Redux
//   const selectedCategory = useSelector((state: RootState) => state.filters.category);
//   const selectedSubcategory = useSelector((state: RootState) => state.filters.subcategory);

//   useEffect(() => {
//     console.log("🟡 Filtro actualizado:");
//     console.log("   🏷 Categoría:", selectedCategory || "Todas");
//     console.log("   🔖 Subcategoría:", selectedSubcategory || "Todas");

//     let url = `${API_URL}/articulos/`;

//     // 🟢 Mapear categorías a valores de `nrogru`
//     const categoryMap: Record<string, string> = {
//       AUTOMOTOR: "004",
//     };

//     // 🟢 Construimos los parámetros dinámicamente
//     const params = new URLSearchParams();

//     if (selectedCategory) {
//       if (categoryMap[selectedCategory]) {
//         params.append("nrogru", categoryMap[selectedCategory]); // Si está en el mapa, usa `nrogru`
//       } else {
//         params.append("category", selectedCategory); // Si no está en el mapa, usa `category`
//       }
//     }

//     if (selectedSubcategory) {
//       params.append("subcategory", selectedSubcategory);
//     }

//     if (params.toString()) {
//       url += `?${params.toString()}`;
//     }

//     console.log("🔵 URL generada para la API:", url);

//     fetch(url)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("❌ Error en la respuesta del servidor");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("🟢 Datos recibidos de la API:", data);
//         setProducts(data);
//       })
//       .catch((error) => console.error("🔴 Error al obtener productos:", error));
//   }, [selectedCategory, selectedSubcategory]); // 🟢 Ejecutar fetch cada vez que cambie el filtro

//   useEffect(() => {
//     console.log("🟣 Estado actualizado de productos:", products);
//   }, [products]); // 🟣 Se ejecuta cada vez que los productos cambian

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <FilterBar />
//       <main className="flex-grow flex flex-col md:flex-row bg-current">
//         <CategoryMenu />
//         {/* 🟢 Pasamos los productos filtrados a ProductGrid */}
//         <ProductGrid products={products} />
//       </main>
//       <Footer />
//     </div>
//   );
// }
































































// "use client";
// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import ProductGrid from "./components/ProductGrid";
// import CategoryMenu from "./components/CategoryMenu";
// import FilterBar from "./components/FilterBar";

// const API_URL = "http://localhost:8001" || "http://128.0.204.82:8001";

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

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);

//   // 🟢 Obtener la categoría y subcategoría seleccionadas desde Redux
//   const selectedCategory = useSelector((state: RootState) => state.filters.category);
//   const selectedSubcategory = useSelector((state: RootState) => state.filters.subcategory);

//   useEffect(() => {
//     console.log("🟡 Filtro actualizado:");
//     console.log("   🏷 Categoría:", selectedCategory || "Todas");
//     console.log("   🔖 Subcategoría:", selectedSubcategory || "Todas");

//     let url = `${API_URL}/articulos/`;

//     // 🟢 Construimos los parámetros dinámicamente
//     const params = new URLSearchParams();
//     if (selectedCategory) params.append("category", selectedCategory);
//     if (selectedSubcategory) params.append("subcategory", selectedSubcategory);

//     if (params.toString()) {
//       url += `?${params.toString()}`;
//     }

//     console.log("🔵 URL generada para la API:", url);

//     fetch(url)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("❌ Error en la respuesta del servidor");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("🟢 Datos recibidos de la API:", data);
//         setProducts(data);
//       })
//       .catch((error) => console.error("🔴 Error al obtener productos:", error));
//   }, [selectedCategory, selectedSubcategory]); // 🟢 Ejecutar fetch cada vez que cambie el filtro

//   useEffect(() => {
//     console.log("🟣 Estado actualizado de productos:", products);
//   }, [products]); // 🟣 Se ejecuta cada vez que los productos cambian

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <FilterBar />
//       <main className="flex-grow flex flex-col md:flex-row bg-current">
//         <CategoryMenu />
//         {/* 🟢 Pasamos los productos filtrados a ProductGrid */}
//         <ProductGrid products={products} />
//       </main>
//       <Footer />
//     </div>
//   );
// }
