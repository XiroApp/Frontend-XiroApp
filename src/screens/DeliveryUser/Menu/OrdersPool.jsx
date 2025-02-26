import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { Button, Typography } from "@mui/material";
import { OrdersAdapter } from "../../../Infra/Adapters/orders.adatper";
import { useSelector } from "react-redux";

const OrdersPool = () => {
  const user = useSelector((state) => state.loggedUser);
  const [batchOrders, setBatchOrders] = useState([]);
  const fetchOrders = async () => {
    const response = await OrdersAdapter.getUnassignedOrders();
    const batchOrders = clasificarPedidos(response);
    setBatchOrders(batchOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  function determinarColor(fecha) {
    const diaSemana = fecha.getDay(); // 0 (Domingo) - 6 (Sábado)
    const hora = fecha.getHours();

    if (diaSemana === 1 && hora < 17) {
      // Lunes antes de las 17h
      return "verde";
    } else if (diaSemana === 4 && hora >= 17) {
      // Jueves a partir de las 17h
      return "verde";
    } else if (diaSemana >= 1 && diaSemana <= 3) {
      // Martes, Miércoles, Jueves antes de las 17h
      return "amarillo";
    } else if (diaSemana >= 5 || diaSemana === 0) {
      // Viernes, Sábado, Domingo, Lunes después de las 17h
      return "verde";
    } else {
      return "amarillo"; // Jueves antes de las 17h
    }
  }

  function clasificarPedidos(pedidos) {
    const pedidosPorSemana = [];
    let semanaActual = [];
    let fechaInicioSemana = null;

    pedidos.forEach((pedido) => {
      const fechaPedido = new Date(pedido.created_at);

      // Si es el primer pedido de la semana, establece la fecha de inicio
      if (!fechaInicioSemana) {
        fechaInicioSemana = new Date(fechaPedido);
        fechaInicioSemana.setHours(0, 0, 0, 0); // Inicio de la semana a las 00:00:00
      }

      // Si el pedido es de una semana diferente, guarda la semana anterior y comienza una nueva
      if (
        fechaPedido.getTime() < fechaInicioSemana.getTime() ||
        (fechaPedido.getDay() === 1 && fechaPedido.getHours() < 17)
      ) {
        pedidosPorSemana.push(semanaActual);
        semanaActual = [];
        fechaInicioSemana = new Date(fechaPedido);
        fechaInicioSemana.setHours(0, 0, 0, 0);
      }

      const color = determinarColor(fechaPedido);
      pedido.color = color; // Añade el color al pedido
      semanaActual.push(pedido);
    });

    // Guarda la última semana

    pedidosPorSemana.push(semanaActual);

    return pedidosPorSemana;
  }

  async function handleAssignBatch(batch) {
    await OrdersAdapter.setBatchToDelivery(batch, user.uid).then(fetchOrders());
  }

  return (
    <section className="w-full h-full text-balance flex flex-col justify-start items-start p-4 gap-2">
      <Typography variant="h2" className="">
        Lotes disponibles
      </Typography>

      <div className="flex items-center gap-4">
        {batchOrders?.map((batch, index) => (
          <div key={index}>
            {batch?.map((order, index) => (
              <div key={index} className="flex flex-col">
                <Card variant="outlined" sx={{ maxWidth: 500 }}>
                  <Box sx={{ p: 2 }}>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography gutterBottom variant="h5" component="div">
                        LOTE
                      </Typography>
                      <Typography gutterBottom variant="h6" component="div">
                        ${order.shipment_price || 0.0}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Cantidad de pedidos {batch.length}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ p: 2 }}>
                    <Typography gutterBottom variant="body2">
                      Información
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip color="primary" label="Soft" size="small" />
                      <Chip label="Medium" size="small" />
                      <Chip label="Hard" size="small" />
                    </Stack>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      width: "100%",
                      p: 2,
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      variant="contained"
                      className="w-full"
                      onClick={(e) => handleAssignBatch(batch)}
                    >
                      Asignar lote
                    </Button>
                  </Box>
                </Card>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrdersPool;
