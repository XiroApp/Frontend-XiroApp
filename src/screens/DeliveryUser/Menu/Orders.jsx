import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import OrdersRow from "../../../components/OrdersRow/OrdersRow.jsx";
import { Input } from "@mui/material";
import { OrdersAdapter } from "../../../Infra/Adapters/orders.adatper.js";
import { UsersAdapter } from "../../../Infra/Adapters/users.adapter.js";

const columns = [
  {
    id: "order_number",
    label: "N° Orden",
    minWidth: 100,
    align: "center",
  },
  {
    id: "createdAt",
    label: "Fecha de llegada",
    minWidth: 100,
    align: "center",
  },
  { id: "paymentId", label: "ID de pago", minWidth: 100, align: "center" },
  {
    id: "paymentStatus",
    label: "Estado de Pago",
    minWidth: 100,
    align: "center",
  },
  {
    id: "statusDetail",
    label: "Detalle de Pago",
    minWidth: 100,
    align: "center",
  },
  {
    id: "transactionAmount",
    label: "Monto",
    minWidth: 50,
    align: "center",
  },
  {
    id: "orderStatus",
    label: "Estado de Orden",
    minWidth: 300,
    align: "center",
  },
  {
    id: "place",
    label: "Tipo de entrega",
    minWidth: 150,
    align: "center",
  },
  { id: "cart", label: "Pedido", minWidth: 100, align: "center" },

  {
    id: "clientUid",
    label: "Cliente",
    minWidth: 150,
    align: "center",
  },
];

export default function Orders({ editor }) {
  const user = useSelector((state) => state.loggedUser);
  const [printingUsers, setPrintingUsers] = useState([]);
  const [deliveryUsers, setDeliveryUsers] = useState([]);
  const [distributionUsers, setDistributionUsers] = useState([]);
  const [pickupUsers, setPickupUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(10); // Tamaño de la página
  const [nextVisible, setNextVisible] = useState(null); // Último documento visible para la paginación hacia adelante
  const [prevVisible, setPrevVisible] = useState(null); // Primer documento visible para la paginación hacia atrás
  const [hasNext, setHasNext] = useState(false); // Indica si hay más páginas hacia adelante
  const [hasPrev, setHasPrev] = useState(false); // Indica si hay más páginas hacia atrás
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchOrders = async (direction = "next") => {
    setLoading(true);
    setError(null);

    try {
      const data = await OrdersAdapter.getOrdersPaginated(
        pageSize,
        nextVisible,
        prevVisible,
        direction,
        "delivery",
        user.uid
      );

      console.log(data);

      // Actualizar el estado de las órdenes
      setOrders(data.orders);
      // Actualizar los valores de paginación
      // console.log(data.nextLastVisible);
      // console.log(data.firstVisible);
      // console.log(!!data.nextLastVisible);
      // console.log(!!data.firstVisible);
      setNextVisible(data.nextLastVisible || null);
      setPrevVisible(data.firstVisible || null);
      setHasNext(!!data.nextLastVisible);
      setHasPrev(!!data.firstVisible);
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
    fetchOrders();
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
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{ maxHeight: 650, backgroundColor: "#f2f2f4" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.length
                ? orders.map((order, index) => {
                    return (
                      <TableRow
                        hover
                        role="button"
                        tabIndex={-1}
                        key={index}
                        className="p-0 m-0"
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
                            />
                          );
                        })}
                      </TableRow>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex gap-4">
          <button
            onClick={() => fetchOrders("prev")}
            // disabled={!hasPrev || loading}
            disabled={loading}
          >
            Anterior
          </button>{" "}
          |
          <button
            onClick={() => fetchOrders("next")}
            // disabled={!hasNext || loading}
            disabled={loading}
          >
            Siguiente
          </button>
        </div>

        {/* <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
    </div>
  );
}
