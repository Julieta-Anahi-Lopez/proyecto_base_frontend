"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"

const categories = [
  {
    name: "Electrónicos",
    subcategories: ["Smartphones", "Laptops", "Tablets"],
  },
  {
    name: "Ropa",
    subcategories: ["Hombres", "Mujeres", "Niños"],
  },
  {
    name: "Hogar",
    subcategories: ["Muebles", "Decoración", "Electrodomésticos"],
  },
]

export default function CategoryMenu() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className={`bg-blue-600 p-4 ${isOpen ? "w-64" : "w-16"} transition-all duration-300 ease-in-out`}>
      <button onClick={() => setIsOpen(!isOpen)} className="mb-4 flex items-center justify-between w-full">
        {isOpen ? (
          <>
            <span className="text-lg font-semibold">Categorías</span>
            <ChevronLeft className="w-5 h-5" />
          </>
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <ul>
          {categories.map((category, index) => (
            <li key={index} className="mb-2">
              <details>
                <summary className="cursor-pointer font-medium">{category.name}</summary>
                <ul className="ml-4 mt-2">
                  {category.subcategories.map((subcategory, subIndex) => (
                    <li key={subIndex} className="mb-1">
                      <a href="#" className="text-slate-300 hover:underline">
                        {subcategory}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

