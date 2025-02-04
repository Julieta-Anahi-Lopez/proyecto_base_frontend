import ProductCard from "./ProductCard"

interface Product {
  codigo: number
  nombre: string
  observ: string
  precio: number
  image: string
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="flex-grow p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.codigo} product={product} />
        ))}
      </div>
    </div>
  )
}

