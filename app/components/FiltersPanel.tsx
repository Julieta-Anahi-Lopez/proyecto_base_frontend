"use client";
import { useEffect, useState } from "react";
import { Filter, XCircle } from "lucide-react";
import { Rubro, Marca } from "@/types";
import { useFilters } from "../lib/hooks/useFilters";

interface Props {
  rubros: Rubro[];
  marcas: Marca[];
  onChange: (filters: ReturnType<typeof useFilters>["filters"]) => void;
}

export default function FiltersPanel({ rubros, marcas, onChange }: Props) {
  const { filters, updateFilter, setCategory, clearFilters } = useFilters();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [localFilters, setLocalFilters] = useState({ ...filters });

  // Detectar si está en mobile
  const isMobile = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 639px)").matches;

  // Inicialización responsive
  useEffect(() => {
    if (!isMobile()) {
      setIsCollapsed(false);
    }
  }, []);

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

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="w-full bg-white sticky top-[115px] z-40 border-b border-gray-200 shadow-sm">
      {/* Toggle en mobile */}
      <div className="sm:hidden sticky top-[90px] z-30 bg-white px-4 py-2 border-b border-gray-200 shadow flex justify-between items-center">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="relative flex items-center justify-center w-9 h-9 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          aria-label="Alternar filtros"
        >
          <Filter size={18} className={`transition-transform ${!isCollapsed ? "rotate-90" : ""}`} />
          {activeFilterCount > 0 && (
            <span className="absolute top-[-5px] right-[-5px] bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
  
      {/* Filtros + botones */}
      <div className="max-w-screen-xl mx-auto px-4 py-2 flex flex-wrap sm:flex-nowrap items-end gap-2">
        {/* Filtros */}
        <div className={`${isCollapsed ? "hidden sm:flex" : "flex"} flex-wrap gap-2 grow`}>
          {[
            {
              label: "Marca",
              name: "nromar",
              type: "select",
              className: "min-w-[120px]",
              options: marcas.map((m) => ({ label: m.nombre, value: m.codigo })),
            },
            {
              label: "Código",
              name: "codigo",
              type: "input",
              className: "w-24 text-gray-700",
            },
            {
              label: "Nombre",
              name: "nombre",
              type: "input",
              className: "min-w-[140px] text-gray-700",
            },
            {
              label: "Categoría",
              name: "category",
              type: "select",
              className: "min-w-[140px]",
              options: rubros.map((r) => ({ label: r.nombre, value: r.codigo })),
            },
            {
              label: "Subcategoría",
              name: "subcategory",
              type: "select",
              className: "min-w-[140px]",
              options:
                rubros.find((r) => r.codigo.toString() === localFilters.category)
                  ?.subrubros.map((s) => ({ label: s.nombre, value: s.codigo })) || [],
            },
            {
              label: "Precio máx.",
              name: "precio_max",
              type: "number",
              className: "w-28 text-gray-700",
              placeholder: "Ej: 10000",
            },
          ].map(({ label, name, type, options = [], className = "", placeholder }) => (
            <div key={name} className={`flex flex-col ${className}`}>
              <label className="text-xs font-medium text-gray-700">{label}</label>
              {type === "input" || type === "number" ? (
                <input
                  type={type}
                  name={name}
                  value={localFilters[name] || ""}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="h-7 px-2 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <select
                  name={name}
                  value={localFilters[name] || ""}
                  onChange={
                    name === "category"
                      ? (e) => handleCategoryClick(e.target.value)
                      : handleChange
                  }
                  className="h-7 px-2 text-sm border text-gray-700 bg-white border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas</option>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
  
        {/* Botones */}
        {(!isCollapsed || !isMobile()) && (
          <div className="flex gap-2 items-end">
            <button
              type="button"
              onClick={handleClearFilters}
              className="h-8 w-8 sm:w-auto sm:px-3 flex items-center justify-center text-red-700 bg-red-100 hover:bg-red-200 rounded transition text-sm"
              title="Limpiar filtros"
            >
              <XCircle className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="h-8 w-8 sm:w-auto sm:px-3 flex items-center justify-center text-blue-800 bg-blue-100 hover:bg-blue-200 rounded transition text-sm"
              title="Aplicar filtros"
            >
              <Filter className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Aplicar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )};
  