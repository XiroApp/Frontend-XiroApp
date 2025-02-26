import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import OrdersRow from "../../../components/OrdersRow/OrdersRow.jsx";
import {
  Backdrop,
  CircularProgress,
  Input,
  TableFooter,
  Typography,
} from "@mui/material";
import { OrdersAdapter } from "../../../Infra/Adapters/orders.adatper.js";
import { UsersAdapter } from "../../../Infra/Adapters/users.adapter.js";
import { ChevronLeftSharp } from "@mui/icons-material";

const columns = [
  {
    id: "order_number",
    label: "N°",
    align: "center",
  },
  {
    id: "createdAt",
    label: "Fecha ingreso",
    align: "center",
  },
  { id: "paymentId", label: "ID de pago", align: "center" },
  {
    id: "transactionAmount",
    label: "Monto",
    align: "center",
  },
  {
    id: "orderStatus",
    label: "Estado de Orden",
    align: "center",
  },

  {
    id: "place",
    label: "Tipo de entrega",

    align: "center",
  },
  { id: "cart", label: "Productos", align: "center" },

  {
    id: "assigned",
    label: "Responsables",
    align: "center",
  },
  {
    id: "clientUid",
    label: "Cliente",
  },
  {
    id: "paymentStatus",
    label: "Estado de Pago",

    align: "center",
  },
];

export default function Orders({ editor, role }) {
  const [printingUsers, setPrintingUsers] = useState([]);
  const [deliveryUsers, setDeliveryUsers] = useState([]);
  const [distributionUsers, setDistributionUsers] = useState([]);
  const [pickupUsers, setPickupUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(15); // Tamaño de la página
  const [lastDocument, setLastDocument] = useState(null); //
  const [hasMore, setHasMore] = useState(true); // Track if there are more pages

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);

  const fetchOrders = async (direction = "next") => {
    setLoading(true);
    setError(null);
    setOrders([]);

    try {
      const data = await OrdersAdapter.getOrdersPaginated(
        pageSize,
        page,
        lastDocument,
        "admin",
        direction
      );

      const { orders: fetchedOrders, lastVisible: newLastVisible } = data;

      // if (direction === "next") {
      //   setOrders([...orders, ...fetchedOrders]);
      // } else {
      setOrders(fetchedOrders);
      // }

      setLastDocument(newLastVisible);
      setHasMore(fetchedOrders.length === pageSize); // Update hasMore
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersByRole = () => {
    UsersAdapter.getSpecialUsers().then((res) => {
      setDeliveryUsers(res.deliveryUsers);
      setPrintingUsers(res.printingUsers);
      setDistributionUsers(res.distributionUsers);
      setPickupUsers(res.pickupUsers);
    });
  };

  useEffect(() => {
    fetchOrders("next");
    fetchUsersByRole();
  }, []);

  /* CHANGE ORDER STATUS */
  const [filter, setFilter] = useState("no_filter");
  /* SEARCH  */
  const handleSearch = (e) => {
    setFilter("no_filter");
    e.target.value.length > 2
      ? setOrders(
          orders.filter((order) =>
            order.paymentId.toString().includes(e.target.value)
          )
        )
      : setOrders(orders);
  };

  const handleFilter = (e) => {
    setFilter(e.target.name);
    e.target.name !== "no_filter"
      ? setOrders(orders.filter((order) => order.orderStatus === e.target.name))
      : setOrders(orders);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4 ">
      <span className="text-2xl lg:text-2xl ">Asignar órdenes</span>
      <div className="flex flex-col lg:flex-row  rounded-lg  lg:w-full p-2 gap-2">
        <div>
          <label htmlFor="">Buscar órdenes</label>
          <Input
            name="email"
            type="number"
            placeholder={"Ingresa número de orden ..."}
            onChange={(e) => handleSearch(e)}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="">Filtrar órdenes</label>
          <div className="flex flex-wrap gap-2">
            <button
              name="in_delivery"
              className={
                filter === "in_delivery"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              En delivery
            </button>
            <button
              name="pending"
              className={
                filter === "pending"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Pendientes
            </button>
            <button
              name="unassigned"
              className={
                filter === "unassigned"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Sin Asignar
            </button>
            <button
              name="process"
              className={
                filter === "process"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              En proceso
            </button>
            <button
              name="printed"
              className={
                filter === "printed"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Impresas
            </button>
            <button
              name="received"
              className={
                filter === "received"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Recibidas
            </button>
            <button
              name="problems"
              className={
                filter === "problems"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Con problemas
            </button>
            <button
              name="no_filter"
              className={
                "underline p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Quitar filtros
            </button>
          </div>
        </div>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 650, backgroundColor: "#f2f2f4" }}>
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    className=" cursor-pointer border-y border-blue-gray-400 p-4 transition-colors"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      id={column.label}
                      // onClick={(e) => handleSortUsers(e)}
                    >
                      {column.label}
                      {/* {index !== column.length - 1 && (
                        <ChevronLeftSharp
                          strokeWidth={2}
                          className="h-4 w-4"
                          id={column.filterName}
                          onClick={(e) => handleSortUsers(e)}
                        />
                      )} */}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders?.length ? (
                orders.map((order, index) => {
                  const isLast = index === orders.length - 1;
                  const classes = isLast
                    ? "w-fit px-4"
                    : "w-fit px-4 border-y border-green-500/50";

                  return (
                    <tr
                      role="button"
                      tabIndex={-1}
                      key={index}
                      className="p-0 m-0 hover:bg-green-900/80 hover:text-white"
                    >
                      {columns.map((column, index) => {
                        const value = order[column.id];
                        return (
                          <OrdersRow
                            key={index}
                            value={value}
                            column={column}
                            printingUsers={printingUsers}
                            deliveryUsers={deliveryUsers}
                            distributionUsers={distributionUsers}
                            pickupUsers={pickupUsers}
                            orderId={order.paymentId}
                            order={order}
                            editor={editor}
                            fetchOrders={fetchOrders}
                            classes={classes}
                          />
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={loading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              )}
            </tbody>
            <TableFooter>
              <div className="flex w-full gap-4">
                <button
                  onClick={() => fetchOrders("prev")}
                  disabled={!lastDocument || loading}
                >
                  Anterior
                </button>

                <button
                  onClick={() => fetchOrders("next")}
                  disabled={!hasMore || loading}
                >
                  Siguiente
                </button>
              </div>
            </TableFooter>
          </table>
        </TableContainer>
      </Paper>
    </div>
  );
}
