"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Menu, X } from "lucide-react";
import { setCategory } from "@/redux/slices/filtersSlice";
import { apiService } from "@/services/api";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
const getToken = (state: RootState) => state.auth?.token;

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


export default function CategoryMenu() {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [rubros, setRubros] = useState<Rubro[]>([]);

  function normalizeText(text: string) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  useEffect(() => {
    if (!token) {
      console.log("No hay token disponible para CategoryMenu");
      return;
    }
    
    apiService.get('/tipo-rubros-con-subrubros')
      .then((data) => setRubros(data))
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, [token]);

  return (
    <>
      {/* FAB flotante para abrir menú en móviles */}
      <button
        className="md:hidden fixed bottom-4 left-4 z-50 bg-blue-900 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Menú lateral en pantallas grandes */}
      <div
        className={`hidden md:flex flex-col bg-blue-900 p-4 transition-all duration-300 ease-in-out 
                    ${isOpen ? "w-64" : "w-16 overflow-hidden min-w-[16px]"}`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-4 flex items-center justify-between w-full text-white"
        >
          {isOpen ? <span className="text-lg font-semibold">Categorías</span> : null}
          <Menu className="w-5 h-5" />
        </button>

        <ul className={`${isOpen ? "block" : "hidden"}`}>
          {rubros.map((rubro) => (
            <li key={rubro.codigo} className="mb-2">
              <details>
                <summary
                  className="cursor-pointer font-medium text-white text-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setCategory({ category: rubro.nombre }));
                  }}
                >
                  {normalizeText(rubro.nombre)}
                </summary>
                {rubro.subrubros.map((subrubro) => (
                <li key={`${subrubro.nrorub}-${subrubro.codigo}`} className="mb-1">
                  <button 
                    className="text-slate-300 hover:underline text-md bg-transparent border-0 p-0 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setCategory({ category: rubro.nombre, subcategory: subrubro.nombre }));
                    }}
                  >
                    {normalizeText(subrubro.nombre)}
                  </button>
                </li>
              ))}
              </details>
            </li>
          ))}
        </ul>
      </div>

      {/* Menú modal en móviles (aparece desde la izquierda) */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex z-[9999]">
          <div className="bg-blue-800 w-64 h-full p-4">
            <button onClick={() => setIsMobileOpen(false)} className="mb-4 text-white flex justify-end">
              <X className="w-6 h-6" />
            </button>
            <ul>
              {rubros.map((rubro) => (
                <li key={rubro.codigo} className="mb-2">
                  <details>
                    <summary
                      className="cursor-pointer font-medium text-white text-lg"
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(setCategory({ category: rubro.nombre }));
                      }}
                    >
                      {normalizeText(rubro.nombre)}
                    </summary>
                    {rubro.subrubros.map((subrubro) => (
                  <li key={`${subrubro.nrorub}-${subrubro.codigo}`} className="mb-1">
                    <button 
                      className="text-slate-300 hover:underline text-md bg-transparent border-0 p-0 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(setCategory({ category: rubro.nombre, subcategory: subrubro.nombre }));
                      }}
                    >
                      {normalizeText(subrubro.nombre)}
                    </button>
                  </li>
                ))}
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";

// import { Menu, X } from "lucide-react";
// import { setCategory } from "@/redux/slices/filtersSlice";

// // const API_URL = "http://localhost:8001/api";
// const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
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

// export default function CategoryMenu() {
//   const dispatch = useDispatch();// 🟢 Necesario para actualizar Redux
//   const [isOpen, setIsOpen] = useState(true);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [rubros, setRubros] = useState<Rubro[]>([]);

//   function normalizeText(text: string) {
//     if (!text) return "";
//     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
//   }

//   useEffect(() => {
//     // 🔵 Token hardcodeado para la autorización
//     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTYyNTgyLCJpYXQiOjE3NDM5NTg5ODIsImp0aSI6ImE1NDllMjc0NjM5ZTQ0ZmRiYTI0Mzk1YjhlZDU4OTk4IiwidXNlcl9pZCI6NjEyfQ.xCqkxx2rcPL8zmpifd1sgYVq6o1BNFVi1GAwh-PT-KY";
    
//     // 🔵 Modificación del fetch para incluir headers de autorización
//     fetch(`${API_URL}/tipo-rubros-con-subrubros`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`, // 🔵 Header de autorización Bearer
//         'Content-Type': 'application/json'
//       }
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Error en la respuesta del servidor");
//         }
//         return response.json();
//       })
//       .then((data) => setRubros(data))
//       .catch((error) => console.error("Error al obtener categorías:", error));
//   }, []);

//   return (
//     <>
//       {/* 🔥 FAB flotante para abrir menú en móviles */}
//       <button
//         className="md:hidden fixed bottom-4 left-4 z-50 bg-blue-900 text-white p-3 rounded-full shadow-lg"
//         onClick={() => setIsMobileOpen(true)}
//       >
//         <Menu className="w-6 h-6" />
//       </button>

//       {/* 🔥 Menú lateral en pantallas grandes */}
//       <div
//         className={`hidden md:flex flex-col bg-blue-900 p-4 transition-all duration-300 ease-in-out 
//                     ${isOpen ? "w-64" : "w-16 overflow-hidden min-w-[16px]"}`}
//       >
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="mb-4 flex items-center justify-between w-full text-white"
//         >
//           {isOpen ? <span className="text-lg font-semibold">Categorías</span> : null}
//           <Menu className="w-5 h-5" />
//         </button>

//         <ul className={`${isOpen ? "block" : "hidden"}`}>
//           {rubros.map((rubro) => (
//             <li key={rubro.codigo} className="mb-2">
//               <details>
//                 <summary
//                   className="cursor-pointer font-medium text-white text-lg"
//                   onClick={() => dispatch(setCategory({ category: rubro.nombre }))}
//                 >
//                   {normalizeText(rubro.nombre)}
//                 </summary>
//                 {rubro.subrubros.length > 0 && (
//                   <ul className="ml-4 mt-2">
//                     {rubro.subrubros.map((subrubro) => (
//                       <li key={`${subrubro.nrorub}-${subrubro.codigo}`} className="mb-1">
//                         <a
//                           href="#"
//                           className="text-slate-300 hover:underline text-md"
//                           onClick={() =>
//                             dispatch(setCategory({ category: rubro.nombre, subcategory: subrubro.nombre }))
//                           }
//                         >
//                           {normalizeText(subrubro.nombre)}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </details>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* 🔥 Menú modal en móviles (aparece desde la izquierda) */}
//       {isMobileOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex z-[9999]">
//           <div className="bg-blue-800 w-64 h-full p-4">
//             <button onClick={() => setIsMobileOpen(false)} className="mb-4 text-white flex justify-end">
//               <X className="w-6 h-6" />
//             </button>
//             <ul>
//               {rubros.map((rubro) => (
//                 <li key={rubro.codigo} className="mb-2">
//                   <details>
//                     <summary
//                       className="cursor-pointer font-medium text-white text-lg"
//                       onClick={() => dispatch(setCategory({ category: rubro.nombre }))}
//                     >
//                       {normalizeText(rubro.nombre)}
//                     </summary>
//                     {rubro.subrubros.length > 0 && (
//                       <ul className="ml-4 mt-2">
//                         {rubro.subrubros.map((subrubro) => (
//                           <li key={`${subrubro.nrorub}-${subrubro.codigo}`} className="mb-1">
//                             <a
//                               href="#"
//                               className="text-slate-300 hover:underline text-md"
//                               onClick={() =>
//                                 dispatch(setCategory({ category: rubro.nombre, subcategory: subrubro.nombre }))
//                               }
//                             >
//                               {normalizeText(subrubro.nombre)}
//                             </a>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </details>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
