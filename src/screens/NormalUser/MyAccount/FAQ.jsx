import { Accordion, AccordionSummary } from "@mui/material";
import React from "react";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function FAQ() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="flex flex-col rounded-2xl lg:h-2/3 p-1 gap-4">
      <span className="text-3xl opacity-80">Preguntas Frecuentes</span>
      <section className="flex flex-col h-full lg:h-80 gap-3 overflow-y-auto">
        <div>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
            className="py-2"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <span className="text-xl"> ¿Cómo hago mi pedido?</span>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="flex flex-col gap-2">
                <p>
                  {" "}
                  Al ingresar a la web en donde deberás iniciar sesión (puede
                  ser con google de forma rápida), tienes que seleccionar donde
                  quieres recibir tu pedido, puede ser tu domicilio u oficina,
                  añadiendo tu dirección.
                </p>
                <p>
                  {" "}
                  Luego seleccionar “Cargar archivo” que te permitirá
                  seleccionarlo desde tus documentos o archivos.
                </p>
                <p>
                  {" "}
                  El siguiente paso será personalizar tu pedido, luego “agregar
                  al carrito” para revisar el detalle y resumen del pedido y
                  finalmente proceder con el pago.
                </p>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        <div>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
            className="py-2"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <span className="text-xl"> ¿Cómo personalizo mi pedido?</span>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="flex flex-col gap-2">
                <p>
                  Una vez cargado el archivo, tendrás en el margen superior
                  derecho, los botones de personalización del pedido: “blanco y
                  negro o color” / “tamaños de papel” / “orientación” / “simple
                  faz o doble faz” / “copias por carilla” / “anillado o sin
                  anillado”. Dependiendo cada selección se configura el precio
                  final
                </p>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        <div>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
            className="py-2"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <span className="text-xl"> ¿Cómo cancelo mi pedido?</span>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="flex flex-col gap-2">
                <p>
                  En el menú principal, debajo del botón “cargar archivos”
                  tendrás el botón “Eliminar mis archivos”.
                </p>
                <p>
                  Luego en el carrito, en el resumen de pago y la parte del
                  pago, en la esquina inferior izquierda tendrás un botón de
                  “vaciar carrito”.
                </p>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        <div>
          <Accordion
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
            className="py-2"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <span className="text-xl"> ¿Cuáles son las formas de pago?</span>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Trabajamos únicamente con Mercado Pago. Es decir, la web los
                redirige directamente para pagar a través de su plataforma.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        <div>
          <Accordion
            expanded={expanded === "panel5"}
            onChange={handleChange("panel5")}
            className="py-2"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <span className="text-xl">
                {" "}
                ¿Puedo pagar con otra tarjeta de débito o crédito?
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Sí, la misma App de mercado pago permite agregar en el momento
                cualquier tipo de tarjeta.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        <div>
          <Accordion
            expanded={expanded === "panel6"}
            onChange={handleChange("panel6")}
            className="py-2"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <span className="text-xl">
                ¿Que hago en caso de tener algún reclamo?
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                En nuestra web hay un botón azul en la esquina inferior derecha
                con un ícono de Whatsapp que te dirige directamente a realizar
                un reclamo con nuestro equipo de soporte donde podrás realizar
                consultas y reclamos.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        <div>
          <Accordion
            expanded={expanded === "panel7"}
            onChange={handleChange("panel7")}
            className="py-2"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <span className="text-xl">
                {" "}
                ¿Puedo tener más de una dirección de envío?
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Si, en nuestro menú principal, “direcciones de envío” en el cual
                tendrás la opción de “agregar dirección de envío”. Igualmente,
                al iniciar un pedido tendrás que seleccionar una dirección.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        <div>
          <Accordion
            expanded={expanded === "panel8"}
            onChange={handleChange("panel8")}
            className="py-2"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <span className="text-xl">
                {" "}
                ¿Qué tipo de archivos puedo cargar en XIRO?
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Puedes cargar archivos PDF, Word, Excel, Power Point,archivos de
                texto e imágenes.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        <div>
          <Accordion
            expanded={expanded === "panel9"}
            onChange={handleChange("panel9")}
            className="py-2"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <span className="text-xl">
                {" "}
                ¿En cuánto tiempo llega mi pedido?
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <p> El producto se envía por delivery.</p>
                <p>
                  Una vez realizado el pago recibirás distintos tipos de
                  notificaciones vía MAIL para notificarte sobre el estado de tu
                  pedido.
                </p>
                <p>
                  Próximamente habilitaremos puntos de recogida en el centro y
                  diferentes puntos importantes de la provincia.
                </p>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        <div>
          <Accordion
            expanded={expanded === "panel10"}
            onChange={handleChange("panel10")}
            className="py-2"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <span className="text-xl">
                {" "}
                ¿En cuánto tiempo llega mi pedido?
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Tu pedido puede llegar en un máximo de 72hs.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
