import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function TyC() {
  return (
    <div className="flex flex-col justify-center items-center p-4 gap-4 ">
      <article className="flex flex-col justify-center gap-4 w-7/12 bg-white p-4 rounded-lg">
        <Link to="/" className="w-full">
          <Button variant="text" className="w-full">
            {"<"} Regresar a XIRO
          </Button>
        </Link>
        <h1 className="text-2xl underline font-bold">
          TÉRMINOS Y CONDICIONES DE USO DE XIRO
        </h1>
        <section className=" flex flex-col gap-2">
          <p>
            Para participar por premios y beneficios deberás seguir nuestro
            instagram{" "}
            <a href="https://www.instagram.com/xiro_app/profilecard/?igsh=aHR6aXdoNDNvbWps">
              @xiro_app
            </a>
            y estar atento al seguimiento de XIRO CUP. Los requisitos para
            participar son seguir nuestro instagram y estar logueado en la web.
            El último domingo de cada mes, se publicará en las historias
            destacadas del instagram de XIRO, la tabla de posiciones con los
            usuarios que más pedidos totales hayan realizado hasta el momento, y
            los mismos recibirán diferentes premios y regalos que estaremos
            entregando en colaboración con distintas marcas.
          </p>
        </section>

        <section className=" flex flex-col gap-2">
          <h2 className="underline font-bold">1. Condiciones de Uso:</h2>
          <p>1.1. XIRO es propiedad de Rodriguez Cicchitti Gaspar Ricardo.</p>
          <p>
            1.2. Al utilizar XIRO, aceptas cumplir con todas las leyes y
            regulaciones aplicables en la República Argentina.
          </p>
        </section>
        <section className=" flex flex-col gap-2">
          <h2 className="underline font-bold">2. Registro y Cuenta:</h2>
          <p>
            2.1. Para utilizar los servicios de XIRO, es posible que necesites
            registrarte y crear una cuenta. Debes proporcionar información
            precisa y actualizada durante el proceso de registro.
          </p>
          <p>
            2.2. Eres responsable de mantener la confidencialidad de tu
            contraseña y de todas las actividades que ocurran bajo tu cuenta.
          </p>
        </section>
        {/* 3 */}
        <section className=" flex flex-col gap-2">
          <h2 className="underline font-bold">3. Uso de la Aplicación:</h2>
          <p>
            3.1. Al utilizar XIRO, te comprometes a no realizar actividades que
            puedan dañar, interferir o comprometer la seguridad de la
            aplicación.
          </p>
          <p>
            3.2. No debes utilizar XIRO de manera fraudulenta o para cualquier
            propósito ilegal o no autorizado.
          </p>
          <p>
            3.3 Al crear una cuenta en XIRO, los usuarios deben proporcionar su
            nombre completo, fecha de nacimiento, dirección de correo
            electrónico, número de teléfono y dirección de entrega de las
            copias. No se recopilan datos de tarjetas de crédito u otros métodos
            de pago, ya que el pago se realiza a través de la API de Mercado
            Pago.
          </p>
          <p>
            3.4 XIRO no recopila datos adicionales de los usuarios más allá de
            la información mencionada anteriormente.
          </p>
          <p>
            3.5 XIRO utiliza la dirección de correo electrónico proporcionada
            por los usuarios para enviar promociones, noticias y encuestas sobre
            la experiencia del usuario.
          </p>
          <p>
            3.6 XIRO comparte la información del usuario, incluyendo nombre
            completo, número de teléfono y dirección de entrega, con la empresa
            de mensajería para coordinar la entrega de las copias solicitadas.
          </p>
          <p>3.7 Cancelación de pedido.</p>
          <p>
            Si te arrepientes de tu compra, la opción de arrepentimiento estará
            disponible vía WhatsApp. Deberás comunicarte al número de atención
            al cliente de XIRO, disponible en la plataforma mediante en el botón
            con el ícono de WhatsApp o al siguiente número; +54 9 2616 36-2351.
            Los usuarios pueden arrepentirse de su pedido únicamente antes de
            que haya comenzado el proceso de impresión. XIRO confirmará la
            posibilidad de cancelación según el estado del pedido.
          </p>
          <p>3.8 Reembolsos.</p>
          <p>
            Si el pedido es cancelado exitosamente antes de comenzar el proceso
            de impresión, el usuario tendrá derecho a un reembolso completo del
            monto abonado. Si el pedido ha comenzado el proceso de impresión, no
            se realizará ningún reembolso, salvo en los casos en que el error
            sea atribuible a XIRO.
          </p>
          <p>3.9 Errores en el producto.</p>
          <p>
            En caso de que el producto entregado presente defectos atribuibles a
            XIRO, tales como errores en la impresión que no corresponden al
            archivo cargado por el usuario, el usuario podrá: Solicitar la
            reimpresión del pedido sin coste adicional ó Solicitar un reembolso
            parcial o total, dependiendo del caso. Para gestionar esta
            solicitud, el usuario deberá presentar evidencia del defecto (por
            ejemplo, fotos del producto recibido) a través de WhatsApp o correo
            electrónico en un plazo máximo de 48 horas desde la recepción del
            pedido.
          </p>
          <p>3.10 Exclusiones.</p>

          <p>
            XIRO no se responsabiliza por errores derivados del contenido de los
            archivos cargados por los usuarios (por ejemplo, errores
            tipográficos, imágenes de baja calidad). Tampoco se realizarán
            reembolsos si el producto no cumple con expectativas subjetivas del
            usuario que no estén especificadas en los requisitos técnicos del
            pedido.
          </p>
          <p>3.11. Plazos para el reembolso.</p>
          <p>
            Una vez aprobado el reembolso, XIRO procesará el mismo dentro de un
            plazo de 7 a 10 días hábiles, dependiendo del método de pago
            utilizado por el usuario.
          </p>
          <p>
            10.6. Condiciones adicionales: XIRO se reserva el derecho de evaluar
            cada solicitud de reembolso o cancelación de manera individual,
            según las circunstancias específicas del caso.
          </p>
        </section>
        {/* 4 */}
        <section className=" flex flex-col gap-2">
          <h2 className="underline font-bold">
            4. Contenido y Propiedad Intelectual:
          </h2>
          <p>
            4.1. Todo el contenido disponible en XIRO, incluidos textos,
            gráficos, logotipos, imágenes y software, está protegido por
            derechos de autor y otros derechos de propiedad intelectual.
          </p>
          <p>
            4.2. No puedes utilizar, copiar, modificar, distribuir o reproducir
            ningún contenido de XIRO sin el consentimiento previo por escrito de
            Rodriguez Cicchitti Gaspar Ricardo.
          </p>
          <p>
            4.3. XIRO no analiza ni verifica los archivos que los usuarios
            cargan en el sistema para imprimir. Por lo tanto, los usuarios son
            los únicos responsables de garantizar que tienen los derechos
            necesarios sobre el contenido que suben y que no están infringiendo
            los derechos de autor, patentes u otros derechos de propiedad de
            terceros.
          </p>
          <p>
            4.4. XIRO no se hace responsable de ninguna violación de derechos de
            autor, patentes u otros derechos de propiedad intelectual que puedan
            surgir del contenido proporcionado por los usuarios.
          </p>
          <p>
            4.5. En caso de que se presente una reclamación o disputa
            relacionada con los derechos de autor, patentes u otros derechos de
            propiedad intelectual, el usuario que haya proporcionado el
            contenido será el único responsable y se compromete a indemnizar y
            eximir de responsabilidad a XIRO por cualquier daño, pérdida o gasto
            que surja de dicha reclamación o disputa.
          </p>
        </section>
        {/* 5 */}
        <section className=" flex flex-col gap-2">
          <h2 className="underline font-bold">
            5. Responsabilidad del Usuario:
          </h2>
          <p>
            5.1. Eres responsable de cualquier contenido que envíes o cargues a
            XIRO, incluidos archivos, imágenes y mensajes.
          </p>
          <p>
            5.2. XIRO no se hace responsable de cualquier pérdida, daño o
            perjuicio resultante del uso de la aplicación o de cualquier
            contenido proporcionado por los usuarios.
          </p>
        </section>
        {/* 6 */}
        <section className=" flex flex-col gap-2">
          <h2 className="underline font-bold">
            6. Modificaciones y Terminación:
          </h2>
          <p>
            6.1. XIRO se reserva el derecho de modificar o interrumpir la
            aplicación en cualquier momento, sin previo aviso.
          </p>
          <p>
            6.2. Podemos suspender o terminar tu acceso a XIRO si violas estos
            términos y condiciones o si consideramos que tu uso de la aplicación
            es perjudicial para otros usuarios o para nosotros.
          </p>
        </section>
        {/* 7*/}
        <section className="flex flex-col gap-2">
          <h2 className="underline font-bold">
            7. COPA XIRO: Programa de Premios y Beneficios
          </h2>
          <p>
            7.1. Definición: XIRO CUP es una iniciativa para premiar la
            confianza y el apoyo de nuestra comunidad de usuarios. A través de
            esta sección, podrás participar en sorteos, recibir beneficios
            exclusivos y acceder a premios ofrecidos en colaboración con
            distintas marcas.
          </p>
          <p>
            7.2. Requisitos para participar:
            <ul>
              <li>- Estar registrado y logueado en la plataforma de XIRO.</li>
              <li>
                - Haber realizado al menos un pedido válido a través de la web.
              </li>
              <li>
                - Seguir la cuenta oficial de XIRO en Instagram{" "}
                <a href="https://www.instagram.com/xiro_app/profilecard/?igsh=aHR6aXdoNDNvbWps">
                  @xiro_app
                </a>
                .
              </li>
            </ul>
          </p>
          <p>7.3. Funcionamiento del programa:</p>
          <p>
            <ul>
              <li>
                - En la sección &quot;Pedidos&quot; del margen superior de la web, los
                usuarios podrán visualizar el total acumulado de pedidos
                realizados.
              </li>
              <li>
                - La tabla de posiciones con los usuarios que más pedidos hayan
                realizado se publicará el último domingo de cada mes en las
                historias destacadas del Instagram de XIRO.
              </li>
              <li>
                - Los usuarios mejor posicionados recibirán premios y beneficios
                específicos que se detallarán en cada ocasión.
              </li>
            </ul>
          </p>
          <p>7.4. Condiciones de los premios:</p>
          <p>
            <ul>
              <li>
                - Los premios y beneficios son personales e intransferibles.
              </li>
              <li>
                - XIRO se reserva el derecho de verificar la autenticidad de los
                pedidos acumulados y la elegibilidad de los usuarios.
              </li>
              <li>
                - En caso de detectarse fraude o irregularidades, el usuario
                será descalificado automáticamente del programa.
              </li>
            </ul>
          </p>
          <p>7.5. Modificaciones y terminación:</p>
          <p>
            XIRO puede modificar las reglas del programa, los requisitos de
            participación o los premios en cualquier momento, notificándolo con
            antelación en la plataforma web y redes sociales.
          </p>
          <p>7.6. Exoneración de responsabilidad:</p>
          <p>
            XIRO no se responsabiliza por errores técnicos o fallas de conexión
            que puedan afectar el registro de los pedidos o la participación en
            el programa.
          </p>
        </section>
        {/* 8 */}
        <section className=" flex flex-col gap-2">
          <h2 className="underline font-bold">
            8. Limitación de Responsabilidad
          </h2>
          <p>
            8.1. Alcance del Servicio: XIRO es una plataforma digital que
            permite la gestión y solicitud de servicios de impresión en línea.
            Si bien nos esforzamos por garantizar un servicio de alta calidad,
            no podemos garantizar que la plataforma esté disponible en todo
            momento ni que esté libre de errores.
          </p>
          <p>8.2. Exclusión de responsabilidad por errores técnicos:</p>
          <p>
            <ul>
              <li>
                XIRO no se hace responsable por fallos técnicos, interrupciones
                o problemas de conexión que puedan afectar la disponibilidad de
                la plataforma, el procesamiento de pedidos, o el acceso a las
                funcionalidades ofrecidas.
              </li>
              <li>
                El usuario es responsable de contar con un dispositivo y una
                conexión a internet adecuada para utilizar nuestros servicios.
              </li>
              <li>
                Para el caso que el usuario registre algún inconveniente, tendrá
                soporte vía WhatsApp en los horarios de atención indicados.
              </li>
            </ul>
          </p>
          <p>8.3. Exclusión de responsabilidad por errores en la impresión:</p>
          <p>
            XIRO no revisa ni verifica el contenido de los archivos cargados por
            los usuarios. Por lo tanto, no asumimos responsabilidad por errores,
            defectos o problemas en el producto final que sean consecuencia
            directa del contenido o formato de los archivos proporcionados.
          </p>
          <p>
            XIRO se reserva el derecho de rechazar archivos que no cumplan con
            los requisitos técnicos especificados en la plataforma.
          </p>
          <p>8.4. Entregas y plazos:</p>
          <p>
            XIRO no se hace responsable por retrasos en las entregas debido a
            fallas en los servicios de mensajería externa, condiciones
            climáticas, o cualquier otra causa fuera de nuestro control
            razonable. En caso de pérdida o daño durante la entrega, el usuario
            debe comunicarse por WhatsApp para recibir la asistencia
            correspondiente.
          </p>
          <p>
            Si el pedido no fue entregado por una causa ajena a XIRO, el cliente
            deberá retirarlo por el punto de entrega indicado desde el WhatsApp
            de soporte de XIRO. (El cadete le proporcionará a XIRO mensaje
            comprobando intento de contacto fallido con el cliente, el cual sera
            prueba suficiente que XIRO cumplió con el envio del pedido y el
            cliente se ausentó o no dio respuestas)
          </p>
          Entregas: Martes y viernes entre las 9hs a 13hs y 15hs a 20hs. Los
          pedidos ingresados hasta las 12pm del día previo al de entrega, se
          entregarán en el día previsto. Los que ingresan después de las 12pm se
          entregarán el día de entrega siguiente. Si querés saber el estado de
          tu pedido escribimos al WhatsApp indicando tu <strong>nombre</strong>.
          Para entregas a domicilio el cadete se contactará por el mismo medio
          para coordinar la entrega y horario el día de entrega. Para retiros
          por punto de entrega, recibirás notificación: “pedido listo para
          retirar” ya sea por Mail o por WhatsApp. Una vez recibida podes pasar
          a retirar en los horarios comerciales del local.
          <p>8.5. Exclusión de garantías:</p>
          <p>
            XIRO no garantiza que el servicio cumpla con todas las expectativas
            del usuario. El usuario acepta que utiliza la plataforma bajo su
            propio riesgo.
          </p>
          <p>8.6 Limitación de daños:</p>
          <p>
            La responsabilidad máxima de XIRO frente al usuario, bajo cualquier
            circunstancia, estará limitada al monto efectivamente abonado por el
            usuario en relación con el pedido en cuestión.
          </p>
        </section>

        {/* 9 */}
        <section className=" flex flex-col gap-2">
          <h2 className="underline font-bold">
            9. Ley Aplicable y Jurisdicción:
          </h2>
          <p>
            9.1. Estos términos y condiciones se rigen por las leyes de la
            República Argentina.
          </p>
          <p>
            9.2. Cualquier disputa relacionada con estos términos y condiciones
            estará sujeta a la jurisdicción exclusiva de los tribunales de la
            Ciudad de Mendoza, Argentina.
          </p>
        </section>
        <h3 className="italic">
          Al utilizar XIRO, aceptas estos términos y condiciones en su
          totalidad. Si no estás de acuerdo con alguno de estos términos, te
          recomendamos que no utilices nuestra aplicación.
        </h3>
        <Link to="/" className="w-full">
          <Button variant="contained" className="w-full">
            Regresar a Xiro App
          </Button>
        </Link>
      </article>
    </div>
  );
}
