import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
const baseUrl = Settings.SERVER_URL;
import { Settings } from "../../../config/index.js";
import axios from "axios";

// import OrdersRow from "./OrdersRow";
import OrdersRow from "../../../components/OrdersRow/OrdersRow.jsx";
import { Input } from "@mui/material";

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
  { id: "paymentId", label: "ID orden", minWidth: 50, align: "center" },

  {
    id: "orderStatus",
    label: "Estado de Orden",
    minWidth: 50,
    align: "center",
  },
  { id: "cart", label: "Archivos", minWidth: 50, align: "center" },
  {
    id: "place",
    label: "Tipo de entrega",
    minWidth: 50,
    align: "center",
  },

  { id: "clientUid", label: "UID de cliente", minWidth: 50, align: "center" },
];

export default function Orders({ editor }) {
  const printingUsers = useSelector((state) => state.printingUsers);
  const deliveryUsers = useSelector((state) => state.deliveryUsers);

  const user = useSelector((state) => state.loggedUser);
  const [orders, setOrders] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, []);

  /* PAGINATION */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
  /* ---------------------------- */

  //--------------- GET PRINTING ORDERS --------------------
  async function fetchOrders() {
    try {
      let response = await axios.get(`${baseUrl}/printing/orders/${user.uid}`);

      let formatedOrders = response.data
        .map((order) => {
          const fechaStr = order.created_at;
          const fecha = new Date(fechaStr);
          const dia = fecha.getDate().toString().padStart(2, "0");
          const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
          const año = fecha.getFullYear();
          const fechaFormateada = `${dia}/${mes}/${año}`;

          return {
            uid: order.uid,
            order_number: order.order_number,
            orderStatus: order.orderStatus,
            cart: order.cart,
            paymentId: order.paymentData.id,
            paymentStatus: order.paymentData.status,
            transactionAmount:
              order.paymentData.transaction_details.total_paid_amount,
            statusDetail: order.paymentData.status_detail,
            clientUid: order.clientUid,
            uidPrinting: order.uidPrinting,
            uidDelivery: order.uidDelivery,
            uidDistribution: order.uidDistribution,
            uidPickup: order.uidPickup,
            clientUser: order.clientUser,
            report: order.report,
            createdAt: fechaFormateada,
            place: order.place,
          };
        })
        .reverse();
      setOrders(formatedOrders);
    } catch (error) {
      console.log(error);

      return error;
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4">
      <span className="text-2xl lg:text-3xl ">Estado de órdenes</span>
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
                  ? "border p-1 rounded-md text-[12px] bg-gray-500"
                  : "border p-1 rounded-md text-[12px] hover:bg-gray-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              En delivery
            </button>
            <button
              name="pending"
              className={
                filter === "pending"
                  ? "border p-1 rounded-md text-[12px] bg-gray-500"
                  : "border p-1 rounded-md text-[12px] hover:bg-gray-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Pendientes
            </button>
            <button
              name="unassigned"
              className={
                filter === "unassigned"
                  ? "border p-1 rounded-md text-[12px] bg-gray-500"
                  : "border p-1 rounded-md text-[12px] hover:bg-gray-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Sin Asignar
            </button>
            <button
              name="process"
              className={
                filter === "process"
                  ? "border p-1 rounded-md text-[12px] bg-gray-500"
                  : "border p-1 rounded-md text-[12px] hover:bg-gray-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              En proceso
            </button>
            <button
              name="printed"
              className={
                filter === "printed"
                  ? "border p-1 rounded-md text-[12px] bg-gray-500"
                  : "border p-1 rounded-md text-[12px] hover:bg-gray-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Impresas
            </button>
            <button
              name="received"
              className={
                filter === "received"
                  ? "border p-1 rounded-md text-[12px] bg-gray-500"
                  : "border p-1 rounded-md text-[12px] hover:bg-gray-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Recibidas
            </button>
            <button
              name="problems"
              className={
                filter === "problems"
                  ? "border p-1 rounded-md text-[12px] bg-gray-500"
                  : "border p-1 rounded-md text-[12px] hover:bg-gray-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Con problemas
            </button>

            <button
              name="no_filter"
              className={
                "underline p-1 rounded-md text-[12px] hover:bg-gray-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Quitar filtros
            </button>
          </div>
        </div>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column, index) => {
                        const value = order[column.id];

                        return (
                          <OrdersRow
                            order_number={order.order_number}
                            editor={editor}
                            value={value}
                            column={column}
                            printingUsers={printingUsers}
                            deliveryUsers={deliveryUsers}
                            orderId={order.paymentId}
                            order={order}
                            key={index}
                            fetchOrders={fetchOrders}
                          />
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
