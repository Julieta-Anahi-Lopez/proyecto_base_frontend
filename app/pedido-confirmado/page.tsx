// Para crear la página de confirmación, necesitas:
// 1. Crear una carpeta llamada "pedido-confirmado" dentro de "app"
// 2. Dentro de esa carpeta, crear un archivo page.tsx con el siguiente contenido:

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Package, Home } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PedidoConfirmadoPage() {
  const router = useRouter();

  // Efecto para simular redireccionamiento automático después de un tiempo
  useEffect(() => {
    // Opcional: redirigir automáticamente después de 30 segundos
    const timer = setTimeout(() => {
      router.push('/');
    }, 30000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            <span>Volver al inicio</span>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle size={72} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pedido Confirmado!</h1>
            <p className="text-gray-600">
              Gracias por tu compra. Hemos recibido tu pedido correctamente.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Próximos pasos:</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-3">
                  <Package size={20} className="text-blue-700" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Procesamiento de tu pedido</p>
                  <p className="text-gray-600">Estamos preparando tu pedido. Nos pondremos en contacto contigo pronto para confirmar los detalles.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-3">
                  <Home size={20} className="text-blue-700" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Coordinación de entrega</p>
                  <p className="text-gray-600">Te contactaremos para coordinar el método de pago y entrega que mejor se adapte a tus necesidades.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="text-center bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Volver al inicio
            </Link>
            <Link 
              href="/productos" 
              className="text-center border border-blue-600 text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}