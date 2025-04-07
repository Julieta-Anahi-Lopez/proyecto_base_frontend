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
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="flex-grow bg-white p-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        {products.map((product) => (
          <ProductCard key={product.codigo} product={product} />
        ))}
      </div>
    </div>
  )
}
