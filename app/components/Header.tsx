import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="bg-blue-900 shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <Link href="/" className="flex items-center mb-4 sm:mb-0">
          <Image src="/images/logos/400px x 100 px KLINNER - ENCABEZADO - recortada.png" alt="Logo" width={200} height={100} />
        </Link>
        <Link href="/" className="flex items-center mb-4 sm:mb-0">
          <Image src="/images/logos/400px x 100 px WALKER - ENCABEZADO - recortada.png" alt="Logo" width={200} height={100} />
          <span className="ml-2 text-lg font-semibold">Representante Oficial Walker</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-gray-600">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/productos" className="hover:text-gray-600">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-gray-600">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

