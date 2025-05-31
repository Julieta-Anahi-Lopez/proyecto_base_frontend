// app/politica-privacidad/page.tsx

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PoliticaPrivacidad() {
    return (
        <>
        <Header />
      <main className=" py-12 px-4 bg-gray-50">
        <h1 className="max-w-3xl text-3xl mx-auto text-justify font-bold mb-6 text-slate-900">Política de Privacidad</h1>
  
        <section className="max-w-3xl mx-auto my-8 space-y-4 text-justify text-slate-900">
          <p>
            Para poder utilizar este Sitio Web de manera eficiente y segura, los usuarios deberán aportar ciertos datos,
            entre ellos, su nombre y apellido, domicilio, cuenta de e-mail, sin los cuales se tornaría imposible brindar
            los servicios. Por eso se requiere que éstos sean verdaderos y exactos.
          </p>
          <p>
            La información personal que los Usuarios ingresan en este Sitio Web es totalmente confidencial y HORIZONTE SUR S.R.L
            hará su mejor esfuerzo para proteger la privacidad de los mismos, de conformidad con lo dispuesto en la Ley 25.326.
          </p>
          <p>
            Los Usuarios tienen el derecho de acceder a la información de su Cuenta, y podrán modificar los datos ingresados
            cuando lo deseen. También podrán ejercer el derecho de rectificación, y requerir en cualquier momento la baja de
            su solicitud y la eliminación de su Cuenta de la base de datos.
          </p>
          <p>
            En caso de que los datos sean requeridos por la vía legal, administrativa o judicial correspondiente,
            HORIZONTE SUR S.R.L se verá compelida a revelar los mismos a la autoridad solicitante. En la medida en que la legislación
            lo permita, se informará a los Usuarios sobre estos requerimientos.
          </p>
          <p>
            Por el sólo hecho de registrarse en este Sitio Web, los Usuarios aceptan que HORIZONTE SUR S.R.L tiene derecho a comunicarse
            con ellos por vía postal, telefónica o electrónica y enviar información que considere de su interés. Los Usuarios
            podrán optar por no recibir estas comunicaciones.
          </p>
  
          <h2 className="text-2xl font-semibold mt-8">Información técnica sobre dispositivos</h2>
          <p>
            Si usted accede al Sitio Web de HORIZONTE SUR S.R.L a través de un dispositivo móvil, la información recogida también incluirá
            el identificador único del dispositivo, ubicación geográfica y otros datos similares, cuando esté permitido.
          </p>
          <p>
            Mientras navega, usamos tecnologías de recogida automática de datos como cookies, balizas web y servicios de terceros
            (Double Click, Google Analytics, etc.). Usted tiene el derecho de oponerse al uso de dichas tecnologías.
          </p>
        </section>
      </main>
      <Footer />
      </>
    );
  }
  