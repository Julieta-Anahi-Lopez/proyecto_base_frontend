import Header from "./components/Header"
import HeroCarousel from "./home/HeroCarousel";
import WaveSection from "./components/WaveSection";
import ServiceFeatures from "./components/ServiceFeatures";
import BrandLogos from "./components/BrandLogos";
import Footer from "./components/Footer";
import ImageSection from "./components/ImageSection";
import WaveDivider from "./components/WaveDivider";
import WhatsAppButton from "./components/WhatsAppButton";


export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 " >
      <Header />
      <main className="flex-grow pt-28">
        <HeroCarousel />
        
        {/* Sección de servicios con fondo de olas en pantallas grandes y color en pequeñas */}
        <WaveSection bgColor="bg-blue-600">
          <ServiceFeatures />
        </WaveSection>
        
        <ImageSection
                  imageSrc="/images/1200px x 900 px  - IMAGEN CARROUSEL 2.jpg"
                  imageAlt="Productos Klinner para limpieza y cuidado"
                  title="Soluciones profesionales de limpieza"
                  description="Descubre nuestra línea completa de productos para el cuidado y limpieza de vehículos, con la más alta calidad y resultados profesionales garantizados."
                  imageOnRight={false}
                  buttonText="Ver productos"
                  buttonLink="/catalogo" />
        
        {/* Sección de marcas con el mismo tratamiento */}
        <WaveSection bgColor="bg-blue-600">
          <BrandLogos />
        </WaveSection>
        <ImageSection
                  imageSrc="/images/1200px x 900 px  - IMAGEN CARROUSEL 1.jpg"
                  imageAlt="Productos Klinner para limpieza y cuidado"
                  title="Soluciones profesionales de limpieza"
                  description="Descubre nuestra línea completa de productos para el cuidado y limpieza de vehículos, con la más alta calidad y resultados profesionales garantizados."
                  imageOnRight={true}
                  buttonText="Ver productos"
                  buttonLink="/catalogo" />
      </main>
      <Footer />
            {/* Botón de WhatsApp para esta página específica */}
      <WhatsAppButton 
        phoneNumber="+5492914732827"
        message="Hola, estoy interesado en productos Klinner"
      />
    </div>
  );
}

