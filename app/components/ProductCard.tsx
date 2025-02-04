import Image from "next/image"

interface ProductProps {
  product: {
    nombre: string
    observ: string
    precio: number
    image: string
  }
}

export default function ProductCard({ product }: ProductProps) {

  function normalizeText(text: string) {
    if (!text) return ""; // Manejar valores nulos o vacíos
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  


  return (
    <div className="bg-gray-200 rounded-lg shadow-md overflow-hidden">
      <Image
        src={product.image || "/placeholder.svg"}
        alt={product.nombre}
        width={300}
        height={300}
        className="w-full h-48"
      />
      <div className="p-4">
        <h2 className="text-sm text-blue-600 font-semibold mb-2">{normalizeText(product.nombre)}</h2>
        <p className="text-gray-600 mb-2 line-clamp-2">{normalizeText(product.observ)}</p>
        <p className="text-xsm text-blue-600 font-bold">${product.precio.toFixed(2)}</p>
      </div>
    </div>
  )
}

