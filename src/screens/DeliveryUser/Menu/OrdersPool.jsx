import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { Button, Tooltip, Typography } from "@mui/material";
import { OrdersAdapter } from "../../../Infra/Adapters/orders.adatper";
import { useSelector } from "react-redux";
import { Inventory2Outlined, MopedOutlined } from "@mui/icons-material";

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
    const pedidosPorSemanaYDistribuidor = {};

    pedidos.forEach((pedido) => {
      const fechaPedido = new Date(pedido.created_at);
      const uidDistribution = pedido.uidDistribution;

      // Si no existe un grupo para este distribuidor, lo creamos
      if (!pedidosPorSemanaYDistribuidor[uidDistribution]) {
        pedidosPorSemanaYDistribuidor[uidDistribution] = [];
      }

      const semanasDelDistribuidor =
        pedidosPorSemanaYDistribuidor[uidDistribution];
      let semanaActual = null;

      // Buscamos si existe una semana que coincida con la fecha del pedido
      for (let i = 0; i < semanasDelDistribuidor.length; i++) {
        const semana = semanasDelDistribuidor[i];
        const fechaInicioSemana = semana.fechaInicio;

        if (
          fechaPedido.getTime() >= fechaInicioSemana.getTime() &&
          !(fechaPedido.getDay() === 1 && fechaPedido.getHours() < 17)
        ) {
          semanaActual = semana;
          break;
        }
      }

      // Si no encontramos una semana válida, creamos una nueva
      if (!semanaActual) {
        semanaActual = {
          fechaInicio: new Date(fechaPedido),
          pedidos: [],
        };
        semanaActual.fechaInicio.setHours(0, 0, 0, 0); // Inicio de la semana a las 00:00:00
        semanasDelDistribuidor.push(semanaActual);
      }

      const color = determinarColor(fechaPedido);
      pedido.color = color; // Añade el color al pedido
      semanaActual.pedidos.push(pedido);
    });

    // Convertimos el objeto de distribuidores en un array de lotes
    const lotes = [];
    Object.values(pedidosPorSemanaYDistribuidor).forEach(
      (semanasDelDistribuidor) => {
        semanasDelDistribuidor.forEach((semana) => {
          lotes.push(semana.pedidos);
        });
      }
    );

    return lotes;
  }

  async function handleAssignBatch(batch) {
    await OrdersAdapter.setBatchToDelivery(batch, user.uid).then(fetchOrders());
  }

  return (
    <section className="w-full text-balance flex flex-col justify-start items-start p-4 gap-4">
      <Typography variant="h4" className="">
        Lotes disponibles
      </Typography>

      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
        {batchOrders?.map((batch, index) => (
          <div key={index}>
            {batch?.map((order, index) => (
              <div key={index} className="flex flex-col">
                {console.log(order)}
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
                        LOTE ZONA ??? | 
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
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      numero orden: {order.order_number}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ p: 2 }}>
                    <Typography gutterBottom variant="body2">
                      Información
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        color="primary"
                        label={
                          <Tooltip title="Cantidad de pedidos">
                            <div className="flex items-center gap-1">
                              <Inventory2Outlined
                                style={{ height: "1em", width: "1em" }}
                              />
                              <span className="text-lg">{batch.length}</span>
                            </div>
                          </Tooltip>
                        }
                        size="small"
                      />
                      <Chip
                        color="primary"
                        label={
                          <Tooltip title="Cantidad de pedidos">
                            <div className="flex items-center gap-1">
                              <MopedOutlined
                                style={{ height: "1em", width: "1em" }}
                              />
                              {/* <span className="text-lg">{batch.length}</span> */}
                            </div>
                          </Tooltip>
                        }
                        size="small"
                      />
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
