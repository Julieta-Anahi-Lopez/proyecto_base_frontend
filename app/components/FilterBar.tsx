




"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setFilters } from "@/redux/slices/filtersSlice";

interface Marca {
  codigo: number;
  nombre: string;
  verweb: number;
}

const API_URL = "http://localhost:8001";

export default function FilterBar() {
  const dispatch = useDispatch(); // 🟢 Importamos Redux para actualizar filtros

  // 🟢 Obtenemos los valores actuales de Redux para ver si están cambiando
  const selectedPrice = useSelector((state: RootState) => state.filters.precio_max);
  const selectedBrand = useSelector((state: RootState) => state.filters.nromar);
  const selectedCode = useSelector((state: RootState) => state.filters.codigo);
  const selectedName = useSelector((state: RootState) => state.filters.nombre);

  const [priceRange, setPriceRange] = useState(selectedPrice || 100);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [codigo, setCodigo] = useState(selectedCode || "");
  const [nombre, setNombre] = useState(selectedName || "");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(selectedBrand || "");

  useEffect(() => {
    fetch(`${API_URL}/tipo-marcas/`)
      .then((response) => response.json())
      .then((data) => {
        const marcasFiltradas = data.filter((marca: Marca) =>marca.verweb === 0 || marca.verweb === 1);
        setMarcas(marcasFiltradas);
      })
      .catch((error) => console.error("Error al obtener las marcas:", error));
  }, []);

  // 🟢 Función para actualizar los filtros en Redux con logs de depuración
  const updateFilters = (key: string, value: string | number | null) => {
    console.log(`🔵 Actualizando filtro: ${key} -> ${value}`);
    dispatch(setFilters({ [key]: value }));
  };

  return (
    <div className="bg-gray-100 p-3 md:p-4 shadow-md overflow-hidden">
      <div className="container max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full">
          {/* Código */}
          <input
            type="text"
            placeholder="Código"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value);
              updateFilters("codigo", e.target.value);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-40"
          />
          {/* Nombre */}
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              updateFilters("nombre", e.target.value);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-60"
          />
          {/* Select de Marca con opciones dinámicas */}
          <select
            className="border text-gray-600 border-gray-300 rounded-md px-3 py-2 w-full md:w-48"
            value={marcaSeleccionada}
            onChange={(e) => {
              setMarcaSeleccionada(e.target.value);
              updateFilters("nromar", e.target.value);
            }}
          >
            <option value="">Seleccione una marca</option>
            {marcas.map((marca) => (
              <option key={marca.codigo} value={marca.nombre}>
                {marca.nombre}
              </option>
            ))}
          </select>
          {/* Rango de Precios */}
          <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
            <label className="text-gray-700 text-sm whitespace-nowrap">Precio:</label>
            <input
              type="range"
              min="0"
              max="100000"
              value={priceRange}
              onChange={(e) => {
                const value = Number(e.target.value);
                setPriceRange(value);
                updateFilters("precio_max", value);
              }}
              className="w-full md:w-40"
            />
            <span className="text-gray-700 text-sm">${priceRange}</span>
          </div>
        </div>
      </div>
    </div>
  );
}























































































// "use client";
// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setFilters } from "@/redux/slices/filtersSlice";

// interface Marca {
//   codigo: number;
//   nombre: string;
//   verweb: number;
// }

// const API_URL = "http://localhost:8001";

// export default function FilterBar() {
//   const dispatch = useDispatch(); // 🟢 Importamos Redux para actualizar filtros
//   const [priceRange, setPriceRange] = useState(100);
//   const [marcas, setMarcas] = useState<Marca[]>([]);
//   const [codigo, setCodigo] = useState("");
//   const [nombre, setNombre] = useState("");
//   const [marcaSeleccionada, setMarcaSeleccionada] = useState("");

//   useEffect(() => {
//     fetch(`${API_URL}/tipo-marcas/`)
//       .then((response) => response.json())
//       .then((data) => {
//         const marcasFiltradas = data.filter((marca: Marca) => marca.verweb === 1);
//         setMarcas(marcasFiltradas);
//       })
//       .catch((error) => console.error("Error al obtener las marcas:", error));
//   }, []);

//   // 🟢 Función para actualizar los filtros en Redux
//   const updateFilters = (key: string, value: string | number | null) => {
//     dispatch(setFilters({ [key]: value }));
//   };

//   return (
//     <div className="bg-gray-100 p-3 md:p-4 shadow-md overflow-hidden">
//       <div className="container max-w-screen-xl mx-auto">
//         <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full">
//           {/* Código */}
//           <input
//             type="text"
//             placeholder="Código"
//             value={codigo}
//             onChange={(e) => {
//               setCodigo(e.target.value);
//               updateFilters("codigo", e.target.value);
//             }}
//             className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-40"
//           />
//           {/* Nombre */}
//           <input
//             type="text"
//             placeholder="Nombre"
//             value={nombre}
//             onChange={(e) => {
//               setNombre(e.target.value);
//               updateFilters("nombre", e.target.value);
//             }}
//             className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-60"
//           />
//           {/* Select de Marca con opciones dinámicas */}
//           <select
//             className="border text-gray-600 border-gray-300 rounded-md px-3 py-2 w-full md:w-48"
//             value={marcaSeleccionada}
//             onChange={(e) => {
//               setMarcaSeleccionada(e.target.value);
//               updateFilters("nromar", e.target.value);
//             }}
//           >
//             <option value="">Seleccione una marca</option>
//             {marcas.map((marca) => (
//               <option key={marca.codigo} value={marca.nombre}>
//                 {marca.nombre}
//               </option>
//             ))}
//           </select>
//           {/* Rango de Precios */}
//           <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
//             <label className="text-gray-700 text-sm whitespace-nowrap">Precio:</label>
//             <input
//               type="range"
//               min="0"
//               max="1000"
//               value={priceRange}
//               onChange={(e) => {
//                 const value = Number(e.target.value);
//                 setPriceRange(value);
//                 updateFilters("precio_max", value);
//               }}
//               className="w-full md:w-40"
//             />
//             <span className="text-gray-700 text-sm">${priceRange}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

















































































// "use client"
// import { useState, useEffect } from "react"

// interface Marca {
//   codigo: number
//   nombre: string
//   verweb: number
// }

// const API_URL = "http://localhost:8001";

// export default function FilterBar() {
//   const [priceRange, setPriceRange] = useState(100)
//   const [marcas, setMarcas] = useState<Marca[]>([])

//   useEffect(() => {
//     fetch(`${API_URL}/tipo-marcas/`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Error en la respuesta del servidor')
//         }
//         return response.json()
//       })
//       .then((data) => {
//         const marcasFiltradas = data.filter((marca: Marca) => marca.verweb === 1)
//         setMarcas(marcasFiltradas)
//       })
//       .catch((error) => console.error("Error al obtener las marcas:", error))
//   }, [])

//   return (
//     <div className="bg-gray-100 p-3 md:p-4 shadow-md overflow-hidden">
//       <div className="container max-w-screen-xl mx-auto">
//         <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full">
//           {/* Código */}
//           <input
//             type="text"
//             placeholder="Código"
//             className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-40"
//           />
//           {/* Nombre */}
//           <input
//             type="text"
//             placeholder="Nombre"
//             className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-60"
//           />
//           {/* Select de Marca con opciones dinámicas */}
//           <select className="border text-gray-600 border-gray-300 rounded-md px-3 py-2 w-full md:w-48">
//             <option value="">Seleccione una marca</option>
//             {marcas.map((marca) => (
//               <option key={marca.codigo} value={marca.codigo}>
//                 {marca.nombre}
//               </option>
//             ))}
//           </select>
//           {/* Rango de Precios */}
//           <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
//             <label className="text-gray-700 text-sm whitespace-nowrap">Precio:</label>
//             <input
//               type="range"
//               min="0"
//               max="1000"
//               value={priceRange}
//               onChange={(e) => setPriceRange(Number(e.target.value))}
//               className="w-full md:w-40"
//             />
//             <span className="text-gray-700 text-sm">${priceRange}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }