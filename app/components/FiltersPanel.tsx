"use client";
import { Rubro, Marca } from "@/types";
import { useFilters } from "../lib/hooks/useFilters";
import { useState } from "react";
import { Filter } from "lucide-react";

interface Props {
  rubros: Rubro[];
  marcas: Marca[];
  onChange: (filters: ReturnType<typeof useFilters>["filters"]) => void;
}

export default function FiltersPanel({ rubros, marcas, onChange }: Props) {
  const { filters, updateFilter, setCategory, clearFilters } = useFilters();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [localFilters, setLocalFilters] = useState({ ...filters });

  const handleCategoryClick = (category: string, subcategory?: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      category,
      subcategory: subcategory || null,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const applyFilters = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([, value]) => value != null)
    );
    for (const key in cleanFilters) {
      updateFilter(
        key as keyof typeof localFilters,
        cleanFilters[key as keyof typeof localFilters]
      );
    }
    onChange(cleanFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
    const resetFilters = {
      codigo: null,
      nombre: null,
      nromar: null,
      category: null,
      subcategory: null,
      precio_max: null,
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  return (
    <div className="w-full border-b border-gray-300 shadow-sm bg-white sticky top-[115px] z-40">
      {/* Toggle en mobile */}
      <div className="sm:hidden sticky top-[90px] z-30 bg-white px-4 py-2 border-b border-gray-200 shadow">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          aria-label="Alternar filtros"
        >
          <Filter
            size={20}
            className={`transition-transform duration-300 ${
              !isCollapsed ? "rotate-90" : ""
            }`}
          />
        </button>
      </div>
  
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className={`${isCollapsed ? "hidden sm:grid" : "grid"} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3`}>
          {/* Marca */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700">Marca</label>
            <select
              name="nromar"
              value={localFilters.nromar || ""}
              onChange={handleChange}
              className="text-xs border border-gray-300 text-gray-700 rounded-md px-2 h-8 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              {marcas.map((marca) => (
                <option key={marca.codigo} value={marca.codigo}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>
  
          {/* Código */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700">Código</label>
            <input
              name="codigo"
              value={localFilters.codigo || ""}
              onChange={handleChange}
              className="text-xs border border-gray-300 text-gray-700 rounded-md px-2 h-8 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          {/* Nombre */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700">Nombre</label>
            <input
              name="nombre"
              value={localFilters.nombre || ""}
              onChange={handleChange}
              className="text-xs border border-gray-300 text-gray-700 rounded-md px-2 h-8 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          {/* Categoría */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700">Categoría</label>
            <select
              name="category"
              value={localFilters.category || ""}
              onChange={(e) => handleCategoryClick(e.target.value)}
              className="text-xs border border-gray-300 text-gray-700 rounded-md px-2 h-8 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              {rubros.map((rubro) => (
                <option key={rubro.codigo} value={rubro.codigo}>
                  {rubro.nombre}
                </option>
              ))}
            </select>
          </div>
  
          {/* Subcategoría */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700">Subcategoría</label>
            <select
              name="subcategory"
              value={localFilters.subcategory || ""}
              onChange={handleChange}
              className="text-xs border border-gray-300 text-gray-700 rounded-md px-2 h-8 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              {rubros
                .find((r) => r.codigo.toString() === localFilters.category)
                ?.subrubros.map((sub) => (
                  <option key={sub.codigo} value={sub.codigo}>
                    {sub.nombre}
                  </option>
                ))}
            </select>
          </div>
  
          {/* Precio máx */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700">Precio máx.</label>
            <input
              type="number"
              min={0}
              name="precio_max"
              value={localFilters.precio_max || ""}
              onChange={handleChange}
              className="text-xs border border-gray-300 rounded-md px-2 h-8 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 10000"
            />
          </div>
        </div>
  
        {/* Botones en una fila aparte */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs bg-red-100 text-red-800 px-4 h-8 rounded-md hover:bg-red-200 transition"
          >
            Limpiar filtros
          </button>
          <button
            type="button"
            onClick={applyFilters}
            className="text-xs bg-blue-100 text-blue-800 px-4 h-8 rounded-md hover:bg-blue-200 transition"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
  