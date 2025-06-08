"use client";
import { Rubro, Marca } from "@/types"; // Asegurate de exportarlos si no están
import { useFilters } from "../lib/hooks/useFilters";

interface Props {
  rubros: Rubro[];
  marcas: Marca[];
  onChange: (filters: ReturnType<typeof useFilters>["filters"]) => void;
}

export default function FiltersPanel({ rubros, marcas, onChange }: Props) {
  const { filters, updateFilter, setCategory, clearFilters } = useFilters();

  const handleCategoryClick = (category: string, subcategory?: string) => {
    setCategory(category, subcategory);
    onChange({ ...filters, category, subcategory: subcategory || null });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = value === "" ? null : value;
    updateFilter(name as any, newValue);
    onChange({ ...filters, [name]: newValue });
  };

  return (
    <div className="w-full bg-gray-50 border-b border-gray-200 shadow-sm p-4">
      <div className="flex flex-wrap gap-4 items-end justify-start">
        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Marca</label>
          <select
            name="nromar"
            value={filters.nromar || ""}
            onChange={handleChange}
            className="w-44 border border-gray-300 rounded px-2 py-1 text-sm"
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Código</label>
          <input
            name="codigo"
            value={filters.codigo || ""}
            onChange={handleChange}
            className="w-32 border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            name="nombre"
            value={filters.nombre || ""}
            onChange={handleChange}
            className="w-48 border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Rubro y Subrubro */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            name="category"
            value={filters.category || ""}
            onChange={(e) => handleCategoryClick(e.target.value)}
            className="w-44 border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">Todas</option>
            {rubros.map((rubro) => (
              <option key={rubro.codigo} value={rubro.codigo}>
                {rubro.nombre}
              </option>
            ))}
          </select>
        </div>

        {filters.category && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Subcategoría</label>
            <select
              name="subcategory"
              value={filters.subcategory || ""}
              onChange={handleChange}
              className="w-44 border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">Todas</option>
              {rubros
                .find((r) => r.codigo.toString() === filters.category)
                ?.subrubros.map((sub) => (
                  <option key={sub.codigo} value={sub.codigo}>
                    {sub.nombre}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Botón limpiar */}
        <div className="ml-auto">
          <button
            onClick={clearFilters}
            className="text-sm bg-red-100 text-red-800 border border-red-300 rounded px-4 py-1 hover:bg-red-200"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
