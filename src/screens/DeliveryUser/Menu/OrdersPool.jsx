import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {
  Backdrop,
  Button,
  CircularProgress,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import { OrdersAdapter } from "../../../Infra/Adapters/orders.adatper";
import { useDispatch, useSelector } from "react-redux";
import {
  AttachMoney,
  Inventory2Outlined,
  MopedOutlined,
  Straighten,
} from "@mui/icons-material";
import { setToast } from "../../../redux/actions";

const OrdersPool = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loggedUser);
  const [batchOrders, setBatchOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const orders = await OrdersAdapter.getUnassignedOrders();
      // console.log(orders);
      const batches = groupOrdersIntoBatches(orders);
      setBatchOrders(batches);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Función para determinar la fecha de entrega según las condiciones
  function getDeliveryDate(orderDate) {
    const date = new Date(orderDate);
    const dayOfWeek = date.getDay(); // 0 (Domingo) a 6 (Sábado)
    const hour = date.getHours();

    // Condición 1: Desde lunes 17hrs hasta jueves 17hrs (entregar el viernes de esa semana)
    if (
      (dayOfWeek === 1 && hour >= 17) || // Lunes desde las 17hrs
      dayOfWeek === 2 ||
      dayOfWeek === 3 || // Martes y Miércoles
      (dayOfWeek === 4 && hour < 17) // Jueves antes de las 17hrs
    ) {
      const friday = new Date(date);
      friday.setDate(date.getDate() + (5 - dayOfWeek)); // Viernes de esa semana
      return friday.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    }

    // Condición 2: Desde jueves 17hrs hasta lunes 17hrs (entregar el martes próximo)
    const nextTuesday = new Date(date);
    nextTuesday.setDate(date.getDate() + ((2 - dayOfWeek + 7) % 7 || 7)); // Martes próximo
    return nextTuesday.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  }

  // Función para agrupar los pedidos en lotes
  function groupOrdersIntoBatches(orders) {
    const batches = {};

    orders.forEach((order) => {
      const deliveryDate = getDeliveryDate(order.created_at);
      const uidDistribution = order.uidDistribution;
      const distributionUser = order.distributionUser;

      // Crear clave única para el lote (fecha de entrega + uidDistribution)
      const batchKey = `${deliveryDate}_${uidDistribution}`;

      // Inicializar el lote si no existe
      if (!batches[batchKey]) {
        batches[batchKey] = {
          fechaEntrega: deliveryDate.split("-").reverse().join("/"),
          uidDistribution: uidDistribution,
          distributionUser: distributionUser,
          orders: [], // Lista de pedidos en este lote
          totalShipmentPrice: 0,
          distance: order?.cart[0]?.distance?.value,
        };
      }

      // Agregar el pedido al lote correspondiente
      batches[batchKey].orders.push(order);

      // Sumar el shipment_price al total del lote
      batches[batchKey].totalShipmentPrice += order.cart[0].distance.value || 0;
    });

    return Object.values(batches); // Convertir a array de lotes
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleAssignBatch(batch) {
    console.log(batch);
    setLoading(true);
    try {
      await OrdersAdapter.setBatchToDelivery(batch, user.uid).then(
        fetchOrders()
      );
    } catch (error) {
      dispatch(setToast("Error al asignar lote de pedidos", "error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full text-balance flex flex-col justify-start items-start p-4 gap-4">
      {/* LOADER */}
      {loading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        false
      )}
      <Typography variant="h4" className="">
        Lotes disponibles
      </Typography>

      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
        {batchOrders?.map((batch, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row gap-4 flex-wrap p-8 items-center justify-center "
          >
            {/* {console.log(Object.keys(batch.orders[0].cart[0]))}
            {console.log(batch.orders[0].cart[0].distance.value)} */}
            <Card variant="outlined" sx={{ maxWidth: 500 }}>
              <Box sx={{ p: 2 }}>
                <Stack
                  direction="column"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography gutterBottom variant="h5" component="div">
                    {batch?.distributionUser?.displayName}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                  ></Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    {/* ${order.shipment_price || 0.0} */}
                    Fecha de entrega: {batch?.fechaEntrega}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {` ${batch?.distributionUser?.addresses[0].name} ${batch?.distributionUser?.addresses[0].number}, ${batch?.distributionUser?.addresses[0].locality}, ${batch?.distributionUser?.addresses[0].city}`}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {/* numero orden: {order.order_number} */}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ p: 2 }}>
                <Typography gutterBottom variant="body2">
                  Información general:
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
                          <span className="text-lg">
                            {batch?.orders?.length}
                          </span>
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
                          <Straighten style={{ height: "1em", width: "1em" }} />
                          <span className="text-lg">{batch.distance}</span>
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
                          <AttachMoney
                            style={{ height: "1em", width: "1em" }}
                          />
                          <span className="text-lg">
                            {batch.totalShipmentPrice}
                          </span>
                        </div>
                      </Tooltip>
                    }
                    size="small"
                  />

                  {/* <Link>Ver ruta</Link> */}
                </Stack>
              </Box>
              <Divider />
              <Box
                sx={{
                  width: "100%",
                  p: 2,
                  display: "flex",
                  justifyContent: "end",
                  flexDirection: "column",
                  alignItems: "center",
                  gap:"5px"
                }}
              >
                {/* <Button variant="text" className="w-full">Ver ruta</Button> */}
                <Button variant="outlined" className="w-full">Ver ruta</Button>

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
    </section>
  );
};

export default OrdersPool;
