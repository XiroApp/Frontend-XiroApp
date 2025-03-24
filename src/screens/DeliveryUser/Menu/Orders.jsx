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
import { Backdrop, CircularProgress, Input, Typography } from "@mui/material";

const columns = [
  { id: "order_number", label: "N° de orden", minWidth: 50, align: "center" },
  {
    id: "price",
    label: "Precio",
    minWidth: 50,
    align: "center",
  },
  {
    id: "orderStatus",
    label: "Estado de Orden",
    minWidth: 50,
    align: "center",
  },
  {
    id: "place",
    label: "Tipo de entrega",
    minWidth: 50,
    align: "center",
  },

  { id: "clientUid", label: "Cliente", minWidth: 50, align: "center" },
];

export default function Orders({ editor }) {
  const printingUsers = useSelector((state) => state.printingUsers);
  const deliveryUsers = useSelector((state) => state.deliveryUsers);

  const user = useSelector((state) => state.loggedUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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

  //--------------- GET DELI ORDERS --------------------
  async function fetchOrders() {
    setLoading(true);
    try {
      let response = await axios.get(`${baseUrl}/delivery/orders/${user.uid}`);

      let formatedOrders = response.data
        .map((order) => {
          const fechaStr = order.paymentData.date_created;
          const fecha = new Date(fechaStr);

          const dia = fecha.getDate().toString().padStart(2, "0");
          const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
          const año = fecha.getFullYear();
          const fechaFormateada = `${dia}/${mes}/${año}`;
          // console.log(order.shipment_price);
          // Calcula el 90% para el delivery
          const delivery_price = (order?.shipment_price || 1500) * 0.9;

          return {
            uid: order.uid,
            orderStatus: order.orderStatus,
            order_number: order.order_number,
            cart: order.cart,
            price: delivery_price,
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
            deliveryUser: order.deliveryUser,
            distributionUser: order.distributionUser,
            pickupUser: order.pickupUser,
            printingUser: order.printingUser,
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4">
      {/* LOADER */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <span className="text-2xl lg:text-3xl ">Pedidos asignados</span>
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
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr className="w-fit">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    className=" cursor-pointer border-y border-blue-gray-400 p-4 transition-colors w-fit"
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
          </table>
        </TableContainer>
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
