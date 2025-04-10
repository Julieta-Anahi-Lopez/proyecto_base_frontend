"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { setCategory } from "@/redux/slices/filtersSlice";
import { RootState } from "@/store";

interface SubRubro {
  nrorub: number;
  codigo: number;
  nombre: string;
}

interface Rubro {
  codigo: number;
  nombre: string;
  verweb?: string;
  nrodep?: string;
  subrubros: SubRubro[];
}

interface CategoryMenuProps {
  rubros: Rubro[];
}

export default function CategoryMenu({ rubros }: CategoryMenuProps) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: number]: boolean }>({});

  const selectedCategory = useSelector((state: RootState) => state.filters.category);
  const selectedSubcategory = useSelector((state: RootState) => state.filters.subcategory);

  function normalizeText(text: string) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  const toggleCategory = (e: React.MouseEvent, categoryId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategorySelect = (categoryName: string, categoryCode: number) => {
    dispatch(setCategory({ category: categoryName, subcategory: null }));
    const category = rubros.find(r => r.codigo === categoryCode);
    if (category && category.subrubros.length > 0) {
      setExpandedCategories(prev => ({
        ...prev,
        [categoryCode]: true
      }));
    }
  };

  const handleSubcategorySelect = (
    categoryName: string,
    categoryCode: number,
    subcategoryName: string,
    subcategoryCode: number
  ) => {
    dispatch(setCategory({
      category: categoryName,
      subcategory: subcategoryName
    }));
  };

  const isCategorySelected = (rubroNombre: string) => {
    return selectedCategory === rubroNombre;
  };

  const isSubcategorySelected = (rubroNombre: string, subrubroNombre: string) => {
    return selectedCategory === rubroNombre && selectedSubcategory === subrubroNombre;
  };

  return (
    <>
      {/* FAB móvil */}
      <button
        className="md:hidden fixed bottom-4 left-4 z-50 bg-blue-900 text-white p-3 rounded-full shadow-md ring-2 ring-white/10"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar desktop */}
      <div
        className={`hidden md:flex flex-col bg-blue-900 text-white p-5 shadow-inner border-r border-blue-950 transition-all duration-300 ease-in-out 
        ${isOpen ? "w-64" : "w-16 overflow-hidden min-w-[16px]"}`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-4 flex items-center justify-between w-full text-white"
        >
          {isOpen && <span className="text-base font-semibold tracking-wide uppercase">Categorías</span>}
          <Menu className="w-5 h-5" />
        </button>

        {isOpen && (
          <ul className="space-y-2">
            {rubros.map((rubro) => (
              <li key={rubro.codigo}>
                <div className="flex items-center justify-between group">
                  <button
                    className={`text-left text-sm font-medium py-1 px-1.5 rounded transition-colors duration-150 flex-grow hover:text-blue-100 ${
                      isCategorySelected(rubro.nombre) ? 'text-blue-200 font-semibold' : 'text-white'
                    }`}
                    onClick={() => handleCategorySelect(rubro.nombre, rubro.codigo)}
                  >
                    {normalizeText(rubro.nombre)}
                  </button>

                  {rubro.subrubros.length > 0 && (
                    <button
                      onClick={(e) => toggleCategory(e, rubro.codigo)}
                      className="p-1 opacity-80 hover:opacity-100 transition"
                    >
                      {expandedCategories[rubro.codigo] ? (
                        <ChevronDown className="w-4 h-4 text-white" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-white" />
                      )}
                    </button>
                  )}
                </div>

                {rubro.subrubros.length > 0 && expandedCategories[rubro.codigo] && (
                  <ul className="ml-4 mt-1 space-y-0.5 border-l border-blue-700 pl-2">
                    {rubro.subrubros.map((subrubro) => (
                      <li key={`${subrubro.nrorub}-${subrubro.codigo}`}>
                        <button
                          className={`text-sm text-blue-100 hover:text-white hover:underline pl-2 py-1 w-full text-left transition ${
                            isSubcategorySelected(rubro.nombre, subrubro.nombre)
                              ? 'text-blue-200 font-semibold'
                              : ''
                          }`}
                          onClick={() =>
                            handleSubcategorySelect(rubro.nombre, rubro.codigo, subrubro.nombre, subrubro.codigo)
                          }
                        >
                          {normalizeText(subrubro.nombre)}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sidebar móvil */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex z-[9999]">
          <div className="bg-blue-900 w-64 h-full p-5 overflow-y-auto shadow-xl">
            <button onClick={() => setIsMobileOpen(false)} className="mb-6 text-white flex justify-end">
              <X className="w-6 h-6" />
            </button>
            <ul className="space-y-2">
              {rubros.map((rubro) => (
                <li key={rubro.codigo}>
                  <div className="flex items-center justify-between group">
                    <button
                      className={`text-left text-sm font-medium py-1 px-1.5 rounded transition-colors duration-150 flex-grow hover:text-blue-100 ${
                        isCategorySelected(rubro.nombre) ? 'text-blue-200 font-semibold' : 'text-white'
                      }`}
                      onClick={() => handleCategorySelect(rubro.nombre, rubro.codigo)}
                    >
                      {normalizeText(rubro.nombre)}
                    </button>

                    {rubro.subrubros.length > 0 && (
                      <button
                        onClick={(e) => toggleCategory(e, rubro.codigo)}
                        className="p-1 opacity-80 hover:opacity-100 transition"
                      >
                        {expandedCategories[rubro.codigo] ? (
                          <ChevronDown className="w-4 h-4 text-white" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-white" />
                        )}
                      </button>
                    )}
                  </div>

                  {rubro.subrubros.length > 0 && expandedCategories[rubro.codigo] && (
                    <ul className="ml-4 mt-1 space-y-0.5 border-l border-blue-700 pl-2">
                      {rubro.subrubros.map((subrubro) => (
                        <li key={`${subrubro.nrorub}-${subrubro.codigo}`}>
                          <button
                            className={`text-sm text-blue-100 hover:text-white hover:underline pl-2 py-1 w-full text-left transition ${
                              isSubcategorySelected(rubro.nombre, subrubro.nombre)
                                ? 'text-blue-200 font-semibold'
                                : ''
                            }`}
                            onClick={() =>
                              handleSubcategorySelect(rubro.nombre, rubro.codigo, subrubro.nombre, subrubro.codigo)
                            }
                          >
                            {normalizeText(subrubro.nombre)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
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

// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
// import { setCategory } from "@/redux/slices/filtersSlice";
// import { RootState } from "@/store";

// // Interfaces
// interface SubRubro {
//   nrorub: number;
//   codigo: number;
//   nombre: string;
// }

// interface Rubro {
//   codigo: number;
//   nombre: string;
//   verweb?: string;
//   nrodep?: string;
//   subrubros: SubRubro[];
// }

// // Props del componente
// interface CategoryMenuProps {
//   rubros: Rubro[];
// }

// export default function CategoryMenu({ rubros }: CategoryMenuProps) {
//   const dispatch = useDispatch();
//   const [isOpen, setIsOpen] = useState(true);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [expandedCategories, setExpandedCategories] = useState<{[key: number]: boolean}>({});

//   // Obtener el estado actual de los filtros
//   const selectedCategory = useSelector((state: RootState) => state.filters.category);
//   const selectedSubcategory = useSelector((state: RootState) => state.filters.subcategory);

//   function normalizeText(text: string) {
//     if (!text) return "";
//     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
//   }

//   // Función para alternar la expansión de una categoría
//   const toggleCategory = (e: React.MouseEvent, categoryId: number) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setExpandedCategories(prev => ({
//       ...prev,
//       [categoryId]: !prev[categoryId]
//     }));
//   };

//   // Función para seleccionar una categoría
//   const handleCategorySelect = (categoryName: string, categoryCode: number) => {
//     console.log(`Seleccionando categoría: ${categoryName} (${categoryCode})`);
//     // Enviamos el nombre en lugar del código
//     dispatch(setCategory({ 
//       category: categoryName,
//       subcategory: null
//     }));
    
//     // Expandir automáticamente la categoría seleccionada si tiene subrubros
//     const category = rubros.find(r => r.codigo === categoryCode);
//     if (category && category.subrubros.length > 0) {
//       setExpandedCategories(prev => ({
//         ...prev,
//         [categoryCode]: true
//       }));
//     }
//   };

//   // Función para seleccionar un subrubro
//   const handleSubcategorySelect = (categoryName: string, categoryCode: number, subcategoryName: string, subcategoryCode: number) => {
//     console.log(`Seleccionando subcategoría: ${subcategoryName} (${subcategoryCode}) de ${categoryName} (${categoryCode})`);
//     // Enviamos los nombres en lugar de los códigos
//     dispatch(setCategory({ 
//       category: categoryName,
//       subcategory: subcategoryName
//     }));
//   };

//   // Función para verificar si una categoría está seleccionada 
//   const isCategorySelected = (rubroNombre: string) => {
//     return selectedCategory === rubroNombre;
//   };

//   // Función para verificar si un subrubro está seleccionado
//   const isSubcategorySelected = (rubroNombre: string, subrubroNombre: string) => {
//     return selectedCategory === rubroNombre && selectedSubcategory === subrubroNombre;
//   };

//   return (
//     <>
//       {/* FAB flotante para abrir menú en móviles */}
//       <button
//         className="md:hidden fixed bottom-4 left-4 z-50 bg-blue-900 text-white p-3 rounded-full shadow-lg"
//         onClick={() => setIsMobileOpen(true)}
//       >
//         <Menu className="w-6 h-6" />
//       </button>

//       {/* Menú lateral en pantallas grandes */}
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

//         {isOpen && (
//           <ul>
//             {rubros.map((rubro) => (
//               <li key={rubro.codigo} className="mb-2">
//                 <div className="flex items-center justify-between text-white cursor-pointer group">
//                   <button
//                     className={`text-left font-medium text-lg py-1 flex-grow hover:text-blue-200 ${
//                       isCategorySelected(rubro.nombre) ? 'text-blue-300 font-bold' : ''
//                     }`}
//                     onClick={() => handleCategorySelect(rubro.nombre, rubro.codigo)}
//                   >
//                     {normalizeText(rubro.nombre)}
//                   </button>
                  
//                   {rubro.subrubros.length > 0 && (
//                     <button 
//                       onClick={(e) => toggleCategory(e, rubro.codigo)}
//                       className="p-1 opacity-80 hover:opacity-100"
//                     >
//                       {expandedCategories[rubro.codigo] ? (
//                         <ChevronDown className="w-4 h-4 text-white" />
//                       ) : (
//                         <ChevronRight className="w-4 h-4 text-white" />
//                       )}
//                     </button>
//                   )}
//                 </div>
                
//                 {rubro.subrubros.length > 0 && expandedCategories[rubro.codigo] && (
//                   <ul className="ml-4 mt-1 space-y-1">
//                     {rubro.subrubros.map((subrubro) => (
//                       <li key={`${subrubro.nrorub}-${subrubro.codigo}`}>
//                         <button 
//                           className={`text-slate-300 hover:text-blue-200 hover:underline text-md bg-transparent border-0 p-0 py-1 cursor-pointer ${
//                             isSubcategorySelected(rubro.nombre, subrubro.nombre) 
//                               ? 'text-blue-300 font-semibold' 
//                               : ''
//                           }`}
//                           onClick={() => handleSubcategorySelect(rubro.nombre, rubro.codigo, subrubro.nombre, subrubro.codigo)}
//                         >
//                           {normalizeText(subrubro.nombre)}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Menú modal en móviles (aparece desde la izquierda) */}
//       {isMobileOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex z-[9999]">
//           <div className="bg-blue-800 w-64 h-full p-4 overflow-y-auto">
//             <button onClick={() => setIsMobileOpen(false)} className="mb-4 text-white flex justify-end">
//               <X className="w-6 h-6" />
//             </button>
//             <ul>
//               {rubros.map((rubro) => (
//                 <li key={rubro.codigo} className="mb-2">
//                   <div className="flex items-center justify-between text-white cursor-pointer group">
//                     <button
//                       className={`text-left font-medium text-lg py-1 flex-grow hover:text-blue-200 ${
//                         isCategorySelected(rubro.nombre) ? 'text-blue-300 font-bold' : ''
//                       }`}
//                       onClick={() => handleCategorySelect(rubro.nombre, rubro.codigo)}
//                     >
//                       {normalizeText(rubro.nombre)}
//                     </button>
                    
//                     {rubro.subrubros.length > 0 && (
//                       <button 
//                         onClick={(e) => toggleCategory(e, rubro.codigo)}
//                         className="p-1 opacity-80 hover:opacity-100"
//                       >
//                         {expandedCategories[rubro.codigo] ? (
//                           <ChevronDown className="w-4 h-4 text-white" />
//                         ) : (
//                           <ChevronRight className="w-4 h-4 text-white" />
//                         )}
//                       </button>
//                     )}
//                   </div>
                  
//                   {rubro.subrubros.length > 0 && expandedCategories[rubro.codigo] && (
//                     <ul className="ml-4 mt-1 space-y-1">
//                       {rubro.subrubros.map((subrubro) => (
//                         <li key={`${subrubro.nrorub}-${subrubro.codigo}`}>
//                           <button 
//                             className={`text-slate-300 hover:text-blue-200 hover:underline text-md bg-transparent border-0 p-0 py-1 cursor-pointer ${
//                               isSubcategorySelected(rubro.nombre, subrubro.nombre) 
//                                 ? 'text-blue-300 font-semibold' 
//                                 : ''
//                             }`}
//                             onClick={() => handleSubcategorySelect(rubro.nombre, rubro.codigo, subrubro.nombre, subrubro.codigo)}
//                           >
//                             {normalizeText(subrubro.nombre)}
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }















// "use client";

// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
// import { setCategory } from "@/redux/slices/filtersSlice";
// import { RootState } from "@/store";

// // Interfaces
// interface SubRubro {
//   nrorub: number;
//   codigo: number;
//   nombre: string;
// }

// interface Rubro {
//   codigo: number;
//   nombre: string;
//   verweb?: string;
//   nrodep?: string;
//   subrubros: SubRubro[];
// }

// // Props del componente
// interface CategoryMenuProps {
//   rubros: Rubro[];
// }

// export default function CategoryMenu({ rubros }: CategoryMenuProps) {
//   const dispatch = useDispatch();
//   const [isOpen, setIsOpen] = useState(true);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [expandedCategories, setExpandedCategories] = useState<{[key: number]: boolean}>({});

//   // Obtener el estado actual de los filtros
//   const selectedCategory = useSelector((state: RootState) => state.filters.category);
//   const selectedSubcategory = useSelector((state: RootState) => state.filters.subcategory);

//   function normalizeText(text: string) {
//     if (!text) return "";
//     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
//   }

//   // Función para alternar la expansión de una categoría
//   const toggleCategory = (e: React.MouseEvent, categoryId: number) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setExpandedCategories(prev => ({
//       ...prev,
//       [categoryId]: !prev[categoryId]
//     }));
//   };

//   // Función para seleccionar una categoría
//   const handleCategorySelect = (categoryName: string, categoryCode: number) => {
//     console.log(`Seleccionando categoría: ${categoryName} (${categoryCode})`);
//     dispatch(setCategory({ 
//       category: categoryCode.toString(),
//       subcategory: null
//     }));
    
//     // Expandir automáticamente la categoría seleccionada si tiene subrubros
//     const category = rubros.find(r => r.codigo === categoryCode);
//     if (category && category.subrubros.length > 0) {
//       setExpandedCategories(prev => ({
//         ...prev,
//         [categoryCode]: true
//       }));
//     }
//   };

//   // Función para seleccionar un subrubro
//   const handleSubcategorySelect = (categoryName: string, categoryCode: number, subcategoryName: string, subcategoryCode: number) => {
//     console.log(`Seleccionando subcategoría: ${subcategoryName} (${subcategoryCode}) de ${categoryName} (${categoryCode})`);
//     dispatch(setCategory({ 
//       category: categoryCode.toString(),
//       subcategory: subcategoryCode.toString()
//     }));
//   };

//   return (
//     <>
//       {/* FAB flotante para abrir menú en móviles */}
//       <button
//         className="md:hidden fixed bottom-4 left-4 z-50 bg-blue-900 text-white p-3 rounded-full shadow-lg"
//         onClick={() => setIsMobileOpen(true)}
//       >
//         <Menu className="w-6 h-6" />
//       </button>

//       {/* Menú lateral en pantallas grandes */}
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

//         {isOpen && (
//           <ul>
//             {rubros.map((rubro) => (
//               <li key={rubro.codigo} className="mb-2">
//                 <div className="flex items-center justify-between text-white cursor-pointer group">
//                   <button
//                     className={`text-left font-medium text-lg py-1 flex-grow hover:text-blue-200 ${
//                       selectedCategory === rubro.codigo.toString() ? 'text-blue-300 font-bold' : ''
//                     }`}
//                     onClick={() => handleCategorySelect(rubro.nombre, rubro.codigo)}
//                   >
//                     {normalizeText(rubro.nombre)}
//                   </button>
                  
//                   {rubro.subrubros.length > 0 && (
//                     <button 
//                       onClick={(e) => toggleCategory(e, rubro.codigo)}
//                       className="p-1 opacity-80 hover:opacity-100"
//                     >
//                       {expandedCategories[rubro.codigo] ? (
//                         <ChevronDown className="w-4 h-4 text-white" />
//                       ) : (
//                         <ChevronRight className="w-4 h-4 text-white" />
//                       )}
//                     </button>
//                   )}
//                 </div>
                
//                 {rubro.subrubros.length > 0 && expandedCategories[rubro.codigo] && (
//                   <ul className="ml-4 mt-1 space-y-1">
//                     {rubro.subrubros.map((subrubro) => (
//                       <li key={`${subrubro.nrorub}-${subrubro.codigo}`}>
//                         <button 
//                           className={`text-slate-300 hover:text-blue-200 hover:underline text-md bg-transparent border-0 p-0 py-1 cursor-pointer ${
//                             selectedCategory === rubro.codigo.toString() && 
//                             selectedSubcategory === subrubro.codigo.toString() 
//                               ? 'text-blue-300 font-semibold' 
//                               : ''
//                           }`}
//                           onClick={() => handleSubcategorySelect(rubro.nombre, rubro.codigo, subrubro.nombre, subrubro.codigo)}
//                         >
//                           {normalizeText(subrubro.nombre)}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Menú modal en móviles (aparece desde la izquierda) */}
//       {isMobileOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex z-[9999]">
//           <div className="bg-blue-800 w-64 h-full p-4 overflow-y-auto">
//             <button onClick={() => setIsMobileOpen(false)} className="mb-4 text-white flex justify-end">
//               <X className="w-6 h-6" />
//             </button>
//             <ul>
//               {rubros.map((rubro) => (
//                 <li key={rubro.codigo} className="mb-2">
//                   <div className="flex items-center justify-between text-white cursor-pointer group">
//                     <button
//                       className={`text-left font-medium text-lg py-1 flex-grow hover:text-blue-200 ${
//                         selectedCategory === rubro.codigo.toString() ? 'text-blue-300 font-bold' : ''
//                       }`}
//                       onClick={() => handleCategorySelect(rubro.nombre, rubro.codigo)}
//                     >
//                       {normalizeText(rubro.nombre)}
//                     </button>
                    
//                     {rubro.subrubros.length > 0 && (
//                       <button 
//                         onClick={(e) => toggleCategory(e, rubro.codigo)}
//                         className="p-1 opacity-80 hover:opacity-100"
//                       >
//                         {expandedCategories[rubro.codigo] ? (
//                           <ChevronDown className="w-4 h-4 text-white" />
//                         ) : (
//                           <ChevronRight className="w-4 h-4 text-white" />
//                         )}
//                       </button>
//                     )}
//                   </div>
                  
//                   {rubro.subrubros.length > 0 && expandedCategories[rubro.codigo] && (
//                     <ul className="ml-4 mt-1 space-y-1">
//                       {rubro.subrubros.map((subrubro) => (
//                         <li key={`${subrubro.nrorub}-${subrubro.codigo}`}>
//                           <button 
//                             className={`text-slate-300 hover:text-blue-200 hover:underline text-md bg-transparent border-0 p-0 py-1 cursor-pointer ${
//                               selectedCategory === rubro.codigo.toString() && 
//                               selectedSubcategory === subrubro.codigo.toString() 
//                                 ? 'text-blue-300 font-semibold' 
//                                 : ''
//                             }`}
//                             onClick={() => handleSubcategorySelect(rubro.nombre, rubro.codigo, subrubro.nombre, subrubro.codigo)}
//                           >
//                             {normalizeText(subrubro.nombre)}
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }











// // "use client";

// // import { useState } from "react";
// // import { useDispatch } from "react-redux";
// // import { Menu, X } from "lucide-react";
// // import { setCategory } from "@/redux/slices/filtersSlice";

// // // Interfaces
// // interface SubRubro {
// //   nrorub: number;
// //   codigo: number;
// //   nombre: string;
// // }

// // interface Rubro {
// //   codigo: number;
// //   nombre: string;
// //   subrubros: SubRubro[];
// // }

// // // Props del componente
// // interface CategoryMenuProps {
// //   rubros: Rubro[];
// // }

// // export default function CategoryMenu({ rubros }: CategoryMenuProps) {
// //   const dispatch = useDispatch();
// //   const [isOpen, setIsOpen] = useState(true);
// //   const [isMobileOpen, setIsMobileOpen] = useState(false);

// //   function normalizeText(text: string) {
// //     if (!text) return "";
// //     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
// //   }

// //   return (
// //     <>
// //       {/* FAB flotante para abrir menú en móviles */}
// //       <button
// //         className="md:hidden fixed bottom-4 left-4 z-50 bg-blue-900 text-white p-3 rounded-full shadow-lg"
// //         onClick={() => setIsMobileOpen(true)}
// //       >
// //         <Menu className="w-6 h-6" />
// //       </button>

// //       {/* Menú lateral en pantallas grandes */}
// //       <div
// //         className={`hidden md:flex flex-col bg-blue-900 p-4 transition-all duration-300 ease-in-out 
// //                     ${isOpen ? "w-64" : "w-16 overflow-hidden min-w-[16px]"}`}
// //       >
// //         <button
// //           onClick={() => setIsOpen(!isOpen)}
// //           className="mb-4 flex items-center justify-between w-full text-white"
// //         >
// //           {isOpen ? <span className="text-lg font-semibold">Categorías</span> : null}
// //           <Menu className="w-5 h-5" />
// //         </button>

// //         <ul className={`${isOpen ? "block" : "hidden"}`}>
// //           {rubros.map((rubro) => (
// //             <li key={rubro.codigo} className="mb-2">
// //               <details>
// //                 <summary
// //                   className="cursor-pointer font-medium text-white text-lg"
// //                   onClick={(e) => {
// //                     e.preventDefault();
// //                     dispatch(setCategory({ category: rubro.nombre }));
// //                   }}
// //                 >
// //                   {normalizeText(rubro.nombre)}
// //                 </summary>
// //                 {rubro.subrubros.map((subrubro) => (
// //                 <li key={`${subrubro.nrorub}-${subrubro.codigo}`} className="mb-1">
// //                   <button 
// //                     className="text-slate-300 hover:underline text-md bg-transparent border-0 p-0 cursor-pointer"
// //                     onClick={(e) => {
// //                       e.preventDefault();
// //                       dispatch(setCategory({ category: rubro.nombre, subcategory: subrubro.nombre }));
// //                     }}
// //                   >
// //                     {normalizeText(subrubro.nombre)}
// //                   </button>
// //                 </li>
// //               ))}
// //               </details>
// //             </li>
// //           ))}
// //         </ul>
// //       </div>

// //       {/* Menú modal en móviles (aparece desde la izquierda) */}
// //       {isMobileOpen && (
// //         <div className="fixed inset-0 bg-black bg-opacity-75 flex z-[9999]">
// //           <div className="bg-blue-800 w-64 h-full p-4">
// //             <button onClick={() => setIsMobileOpen(false)} className="mb-4 text-white flex justify-end">
// //               <X className="w-6 h-6" />
// //             </button>
// //             <ul>
// //               {rubros.map((rubro) => (
// //                 <li key={rubro.codigo} className="mb-2">
// //                   <details>
// //                     <summary
// //                       className="cursor-pointer font-medium text-white text-lg"
// //                       onClick={(e) => {
// //                         e.preventDefault();
// //                         dispatch(setCategory({ category: rubro.nombre }));
// //                       }}
// //                     >
// //                       {normalizeText(rubro.nombre)}
// //                     </summary>
// //                     {rubro.subrubros.map((subrubro) => (
// //                   <li key={`${subrubro.nrorub}-${subrubro.codigo}`} className="mb-1">
// //                     <button 
// //                       className="text-slate-300 hover:underline text-md bg-transparent border-0 p-0 cursor-pointer"
// //                       onClick={(e) => {
// //                         e.preventDefault();
// //                         dispatch(setCategory({ category: rubro.nombre, subcategory: subrubro.nombre }));
// //                       }}
// //                     >
// //                       {normalizeText(subrubro.nombre)}
// //                     </button>
// //                   </li>
// //                 ))}
// //                   </details>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // }
























// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { useDispatch, useSelector } from "react-redux";
// // // import { RootState } from "@/store";
// // // import { Menu, X } from "lucide-react";
// // // import { setCategory } from "@/redux/slices/filtersSlice";
// // // import { apiService } from "@/services/api";

// // // const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
// // // const getToken = (state: RootState) => state.auth?.token;

// // // interface SubRubro {
// // //   nrorub: number;
// // //   codigo: number;
// // //   nombre: string;
// // // }

// // // interface Rubro {
// // //   codigo: number;
// // //   nombre: string;
// // //   subrubros: SubRubro[];
// // // }


// // // export default function CategoryMenu() {
// // //   const dispatch = useDispatch();
// // //   const token = useSelector(getToken);
// // //   const [isOpen, setIsOpen] = useState(true);
// // //   const [isMobileOpen, setIsMobileOpen] = useState(false);
// // //   const [rubros, setRubros] = useState<Rubro[]>([]);

// // //   function normalizeText(text: string) {
// // //     if (!text) return "";
// // //     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
// // //   }

// // //   useEffect(() => {
// // //     if (!token) {
// // //       console.log("No hay token disponible para CategoryMenu");
// // //       return;
// // //     }
    
// // //     apiService.get('/tipo-rubros-con-subrubros')
// // //       .then((data) => setRubros(data))
// // //       .catch((error) => console.error("Error al obtener categorías:", error));
// // //   }, [token]);

// // //   return (
// // //     <>
// // //       {/* FAB flotante para abrir menú en móviles */}
// // //       <button
// // //         className="md:hidden fixed bottom-4 left-4 z-50 bg-blue-900 text-white p-3 rounded-full shadow-lg"
// // //         onClick={() => setIsMobileOpen(true)}
// // //       >
// // //         <Menu className="w-6 h-6" />
// // //       </button>

// // //       {/* Menú lateral en pantallas grandes */}
// // //       <div
// // //         className={`hidden md:flex flex-col bg-blue-900 p-4 transition-all duration-300 ease-in-out 
// // //                     ${isOpen ? "w-64" : "w-16 overflow-hidden min-w-[16px]"}`}
// // //       >
// // //         <button
// // //           onClick={() => setIsOpen(!isOpen)}
// // //           className="mb-4 flex items-center justify-between w-full text-white"
// // //         >
// // //           {isOpen ? <span className="text-lg font-semibold">Categorías</span> : null}
// // //           <Menu className="w-5 h-5" />
// // //         </button>

// // //         <ul className={`${isOpen ? "block" : "hidden"}`}>
// // //           {rubros.map((rubro) => (
// // //             <li key={rubro.codigo} className="mb-2">
// // //               <details>
// // //                 <summary
// // //                   className="cursor-pointer font-medium text-white text-lg"
// // //                   onClick={(e) => {
// // //                     e.preventDefault();
// // //                     dispatch(setCategory({ category: rubro.nombre }));
// // //                   }}
// // //                 >
// // //                   {normalizeText(rubro.nombre)}
// // //                 </summary>
// // //                 {rubro.subrubros.map((subrubro) => (
// // //                 <li key={`${subrubro.nrorub}-${subrubro.codigo}`} className="mb-1">
// // //                   <button 
// // //                     className="text-slate-300 hover:underline text-md bg-transparent border-0 p-0 cursor-pointer"
// // //                     onClick={(e) => {
// // //                       e.preventDefault();
// // //                       dispatch(setCategory({ category: rubro.nombre, subcategory: subrubro.nombre }));
// // //                     }}
// // //                   >
// // //                     {normalizeText(subrubro.nombre)}
// // //                   </button>
// // //                 </li>
// // //               ))}
// // //               </details>
// // //             </li>
// // //           ))}
// // //         </ul>
// // //       </div>

// // //       {/* Menú modal en móviles (aparece desde la izquierda) */}
// // //       {isMobileOpen && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-75 flex z-[9999]">
// // //           <div className="bg-blue-800 w-64 h-full p-4">
// // //             <button onClick={() => setIsMobileOpen(false)} className="mb-4 text-white flex justify-end">
// // //               <X className="w-6 h-6" />
// // //             </button>
// // //             <ul>
// // //               {rubros.map((rubro) => (
// // //                 <li key={rubro.codigo} className="mb-2">
// // //                   <details>
// // //                     <summary
// // //                       className="cursor-pointer font-medium text-white text-lg"
// // //                       onClick={(e) => {
// // //                         e.preventDefault();
// // //                         dispatch(setCategory({ category: rubro.nombre }));
// // //                       }}
// // //                     >
// // //                       {normalizeText(rubro.nombre)}
// // //                     </summary>
// // //                     {rubro.subrubros.map((subrubro) => (
// // //                   <li key={`${subrubro.nrorub}-${subrubro.codigo}`} className="mb-1">
// // //                     <button 
// // //                       className="text-slate-300 hover:underline text-md bg-transparent border-0 p-0 cursor-pointer"
// // //                       onClick={(e) => {
// // //                         e.preventDefault();
// // //                         dispatch(setCategory({ category: rubro.nombre, subcategory: subrubro.nombre }));
// // //                       }}
// // //                     >
// // //                       {normalizeText(subrubro.nombre)}
// // //                     </button>
// // //                   </li>
// // //                 ))}
// // //                   </details>
// // //                 </li>
// // //               ))}
// // //             </ul>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // }

// // // // "use client";

// // // // import { useState, useEffect } from "react";
// // // // import { useDispatch } from "react-redux";

// // // // import { Menu, X } from "lucide-react";
// // // // import { setCategory } from "@/redux/slices/filtersSlice";

// // // // // const API_URL = "http://localhost:8001/api";
// // // // const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
// // // // interface SubRubro {
// // // //   nrorub: number;
// // // //   codigo: number;
// // // //   nombre: string;
// // // // }

// // // // interface Rubro {
// // // //   codigo: number;
// // // //   nombre: string;
// // // //   subrubros: SubRubro[];
// // // // }

// // // // export default function CategoryMenu() {
// // // //   const dispatch = useDispatch();// 🟢 Necesario para actualizar Redux
// // // //   const [isOpen, setIsOpen] = useState(true);
// // // //   const [isMobileOpen, setIsMobileOpen] = useState(false);
// // // //   const [rubros, setRubros] = useState<Rubro[]>([]);

// // // //   function normalizeText(text: string) {
// // // //     if (!text) return "";
// // // //     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
// // // //   }

// // // //   useEffect(() => {
// // // //     // 🔵 Token hardcodeado para la autorización
// // // //     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTYyNTgyLCJpYXQiOjE3NDM5NTg5ODIsImp0aSI6ImE1NDllMjc0NjM5ZTQ0ZmRiYTI0Mzk1YjhlZDU4OTk4IiwidXNlcl9pZCI6NjEyfQ.xCqkxx2rcPL8zmpifd1sgYVq6o1BNFVi1GAwh-PT-KY";
    
// // // //     // 🔵 Modificación del fetch para incluir headers de autorización
// // // //     fetch(`${API_URL}/tipo-rubros-con-subrubros`, {
// // // //       method: 'GET',
// // // //       headers: {
// // // //         'Authorization': `Bearer ${token}`, // 🔵 Header de autorización Bearer
// // // //         'Content-Type': 'application/json'
// // // //       }
// // // //     })
// // // //       .then((response) => {
// // // //         if (!response.ok) {
// // // //           throw new Error("Error en la respuesta del servidor");
// // // //         }
// // // //         return response.json();
// // // //       })
// // // //       .then((data) => setRubros(data))
// // // //       .catch((error) => console.error("Error al obtener categorías:", error));
// // // //   }, []);

// // // //   return (
// // // //     <>
// // // //       {/* 🔥 FAB flotante para abrir menú en móviles */}
// // // //       <button
// // // //         className="md:hidden fixed bottom-4 left-4 z-50 bg-blue-900 text-white p-3 rounded-full shadow-lg"
// // // //         onClick={() => setIsMobileOpen(true)}
// // // //       >
// // // //         <Menu className="w-6 h-6" />
// // // //       </button>

// // // //       {/* 🔥 Menú lateral en pantallas grandes */}
// // // //       <div
// // // //         className={`hidden md:flex flex-col bg-blue-900 p-4 transition-all duration-300 ease-in-out 
// // // //                     ${isOpen ? "w-64" : "w-16 overflow-hidden min-w-[16px]"}`}
// // // //       >
// // // //         <button
// // // //           onClick={() => setIsOpen(!isOpen)}
// // // //           className="mb-4 flex items-center justify-between w-full text-white"
// // // //         >
// // // //           {isOpen ? <span className="text-lg font-semibold">Categorías</span> : null}
// // // //           <Menu className="w-5 h-5" />
// // // //         </button>

// // // //         <ul className={`${isOpen ? "block" : "hidden"}`}>
// // // //           {rubros.map((rubro) => (
// // // //             <li key={rubro.codigo} className="mb-2">
// // // //               <details>
// // // //                 <summary
// // // //                   className="cursor-pointer font-medium text-white text-lg"
// // // //                   onClick={() => dispatch(setCategory({ category: rubro.nombre }))}
// // // //                 >
// // // //                   {normalizeText(rubro.nombre)}
// // // //                 </summary>
// // // //                 {rubro.subrubros.length > 0 && (
// // // //                   <ul className="ml-4 mt-2">
// // // //                     {rubro.subrubros.map((subrubro) => (
// // // //                       <li key={`${subrubro.nrorub}-${subrubro.codigo}`} className="mb-1">
// // // //                         <a
// // // //                           href="#"
// // // //                           className="text-slate-300 hover:underline text-md"
// // // //                           onClick={() =>
// // // //                             dispatch(setCategory({ category: rubro.nombre, subcategory: subrubro.nombre }))
// // // //                           }
// // // //                         >
// // // //                           {normalizeText(subrubro.nombre)}
// // // //                         </a>
// // // //                       </li>
// // // //                     ))}
// // // //                   </ul>
// // // //                 )}
// // // //               </details>
// // // //             </li>
// // // //           ))}
// // // //         </ul>
// // // //       </div>

// // // //       {/* 🔥 Menú modal en móviles (aparece desde la izquierda) */}
// // // //       {isMobileOpen && (
// // // //         <div className="fixed inset-0 bg-black bg-opacity-75 flex z-[9999]">
// // // //           <div className="bg-blue-800 w-64 h-full p-4">
// // // //             <button onClick={() => setIsMobileOpen(false)} className="mb-4 text-white flex justify-end">
// // // //               <X className="w-6 h-6" />
// // // //             </button>
// // // //             <ul>
// // // //               {rubros.map((rubro) => (
// // // //                 <li key={rubro.codigo} className="mb-2">
// // // //                   <details>
// // // //                     <summary
// // // //                       className="cursor-pointer font-medium text-white text-lg"
// // // //                       onClick={() => dispatch(setCategory({ category: rubro.nombre }))}
// // // //                     >
// // // //                       {normalizeText(rubro.nombre)}
// // // //                     </summary>
// // // //                     {rubro.subrubros.length > 0 && (
// // // //                       <ul className="ml-4 mt-2">
// // // //                         {rubro.subrubros.map((subrubro) => (
// // // //                           <li key={`${subrubro.nrorub}-${subrubro.codigo}`} className="mb-1">
// // // //                             <a
// // // //                               href="#"
// // // //                               className="text-slate-300 hover:underline text-md"
// // // //                               onClick={() =>
// // // //                                 dispatch(setCategory({ category: rubro.nombre, subcategory: subrubro.nombre }))
// // // //                               }
// // // //                             >
// // // //                               {normalizeText(subrubro.nombre)}
// // // //                             </a>
// // // //                           </li>
// // // //                         ))}
// // // //                       </ul>
// // // //                     )}
// // // //                   </details>
// // // //                 </li>
// // // //               ))}
// // // //             </ul>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </>
// // // //   );
// // // // }
