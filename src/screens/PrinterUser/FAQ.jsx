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
      <section className="flex flex-col h-full gap-3">
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
              <Typography>
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
              <Typography>
                Donec placerat, lectus sed mattis semper, neque lectus feugiat
                lectus, varius pulvinar diam eros in elit. Pellentesque
                convallis laoreet laoreet.
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
              <Typography>
                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl.
                Integer sit amet egestas eros, vitae egestas augue. Duis vel est
                augue.
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
                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl.
                Integer sit amet egestas eros, vitae egestas augue. Duis vel est
                augue. Nunc vitae orci ultricies, auctor nunc in, volutpat nisl.
                Integer sit amet egestas eros, vitae egestas augue. Duis vel est
                augue. Nunc vitae orci ultricies, auctor nunc in, volutpat nisl.
                Integer sit amet egestas eros, vitae egestas augue. Duis vel est
                augue.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
