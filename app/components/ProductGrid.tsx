"use client";
import ProductCard from "./ProductCard"

interface Product {
  codigo: string
  nombre: string
  observ: string
  precio: number
  imagenes: { foto_1: string }[]
}

interface ProductGridProps {
  products: Product[]
  isAuthenticated: boolean;
}

export default function ProductGrid({ products, isAuthenticated  }: ProductGridProps) {
  return (
    <div className="flex-grow bg-white py-4">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-28">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.codigo}
              product={product}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </div>
    </div>
  )};