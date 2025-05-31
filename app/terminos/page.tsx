// app/terminos/page.tsx

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TerminosCondiciones() {
  return (
    <>
      <Header />
      <main className="py-12 px-4 bg-gray-50">
        <h1 className="max-w-3xl text-3xl mx-auto text-justify font-bold mb-6 text-slate-900">Términos y Condiciones</h1>

        <section className="max-w-3xl mx-auto my-8 space-y-4 text-justify text-slate-900">
          <h2 className="text-2xl font-semibold">Condiciones de uso</h2>
          <p>
            El acceso y uso de este Sitio Web (klinner.com.ar) de HORIZONTE SUR S.R.L, se rige por la presente condiciones de uso
            (las “Condiciones de uso”). Al acceder, navegar y utilizar nuestro Sitio Web usted reconoce que ha leído,
            entendido y aceptado, sin reservas, estas Condiciones de Uso, con las modificaciones que podamos realizar en el futuro.
          </p>
          <p>
            Si hubiese alguna modificación en nuestras Condiciones de Uso, publicaremos una nueva versión en nuestro Sitio Web.
            Por lo tanto, le sugerimos consultar estas Condiciones de Uso con regularidad a los efectos de mantenerse actualizado al respecto.
          </p>

          <h2 className="text-2xl font-semibold mt-8">Derecho de Autor y Propiedad Intelectual</h2>
          <p>
            El contenido del Sitio Web, así como los textos, marcas, logos, fotografías, videos, música, diseños y productos
            son de uso exclusivo de HORIZONTE SUR S.R.L bajo la autorización de la empresa propietaria de estos derechos, y en consecuencia
            están protegidos por derechos de autor, marcas, patentes y otros derechos de propiedad intelectual o industrial
            existentes bajo la legislación aplicable.
          </p>

          <h2 className="text-2xl font-semibold mt-8">El uso del Sitio Web</h2>
          <p>
            Usted puede descargar, visualizar o imprimir el contenido de nuestro Sitio Web exclusivamente para uso personal y no comercial.
            Cualquier otro uso, incluyendo la reproducción, modificación, transmisión o difusión del contenido del Sitio Web,
            en todo o en parte y por cualquier medio, está estrictamente prohibido, salvo que por consentimiento previo por escrito
            otorgue HORIZONTE SUR S.R.L
          </p>
          <p>
            Salvo lo dispuesto en el siguiente punto, nada de lo contenido en nuestro Sitio Web se entenderá o interpretará como una
            concesión a usted de una licencia o un derecho de uso de dichos contenidos de nuestro Sitio Web.
          </p>

          <h2 className="text-2xl font-semibold mt-8">Información Considerada No Confidencial</h2>
          <p>
            Los datos e información de identificación personal que usted proporcione a través de nuestro Sitio Web están protegidos
            y tratados de acuerdo a nuestra Política de Privacidad. HORIZONTE SUR S.R.L le invita a leer atentamente dichas Políticas de
            Privacidad antes de proveernos con tales datos e información de identificación personal.
          </p>
          <p>
            Cualquier otra información o material remitido a HORIZONTE SUR S.R.L a través de Internet, por correo electrónico o de otra manera,
            incluyendo datos, preguntas, comentarios, sugerencias, ideas, gráficos o similares, son y serán tratados como no confidenciales.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
