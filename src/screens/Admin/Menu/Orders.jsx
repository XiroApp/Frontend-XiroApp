import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import OrdersRow from "../../../components/OrdersRow/OrdersRow.jsx";
import {
  Backdrop,
  CircularProgress,
  Input,
  TableBody,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { OrdersAdapter } from "../../../Infra/Adapters/orders.adatper.js";
import { UsersAdapter } from "../../../Infra/Adapters/users.adapter.js";
import { twMerge } from "tailwind-merge";
import propTypes from "prop-types";
import { tLC } from "../../../Common/helpers.js";

export default function Orders({ editor }) {
  const [printingUsers, setPrintingUsers] = useState([]);
  const [deliveryUsers, setDeliveryUsers] = useState([]);
  const [distributionUsers, setDistributionUsers] = useState([]);
  const [pickupUsers, setPickupUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(null);
  const [pageSize] = useState(15);
  const [lastDocument, setLastDocument] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [orders, setOrders] = useState([]);
  // const [page] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filter, setFilter] = useState("no_filter");
  // const [allOrders, setAllOrders] = useState([]);

  const [allOrders, setAllOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [roleFIlter, setRoleFIlter] = useState("");
  //! Falta obtener todos las ordenes (no por paginación).

  useEffect(() => {
    fetchOrders("next");
    fetchUsersByRole();
  }, []);

  async function fetchOrders(direction = "next") {
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
      console.log(data.length);

      const { orders: fetchedOrders, lastVisible: newLastVisible } = data;
      const sortedOrders = fetchedOrders.sort(
        (a, b) => a.order_number < b.order_number
      );
      setOrders(sortedOrders);
      setAllOrders(sortedOrders);
      setLastDocument(newLastVisible);
      setHasMore(fetchedOrders.length === pageSize);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function fetchUsersByRole() {
    UsersAdapter.getSpecialUsers().then((res) => {
      setDeliveryUsers(res.deliveryUsers);
      setPrintingUsers(res.printingUsers);
      setDistributionUsers(res.distributionUsers);
      setPickupUsers(res.pickupUsers);
    });
  }

  function handleSearch(term) {
    const searchTerm = tLC(term);

    if (searchTerm == "") return setOrders(allOrders);

    const filteredOrders = allOrders.filter(
      (o) =>
        tLC(o?.order_number ?? "").includes(searchTerm) ||
        tLC(o?.clientUser?.email ?? "").includes(searchTerm) ||
        tLC(o?.clientUser?.displayName ?? "").includes(searchTerm) ||
        tLC(o?.clientUser?.phone ?? "").includes(searchTerm)
    );

    setOrders(filteredOrders);
  }

  function handleFilter(status) {
    setFilter(status);
    return status != "no_filter"
      ? setOrders(allOrders.filter((o) => o?.orderStatus == tLC(status)))
      : setOrders(allOrders);
  }
  /* PAGINATION */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  console.log(allOrders);

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4 ">
      <span className="text-2xl lg:text-2xl">Asignar órdenes</span>
      <div className="flex flex-col lg:flex-row  rounded-lg lg:w-full p-2 gap-2">
        <div>
          <label htmlFor="search-orders">Buscar órdenes</label>
          <Input
            id="search-orders"
            name="email"
            type="text"
            placeholder="Ingresa número de orden..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="filter-orders">Filtrar órdenes</label>
          <div className="flex flex-wrap gap-2">
            <button
              name="in_delivery"
              className={
                filter == "in_delivery"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={() => handleFilter("in_delivery")}
            >
              En delivery
            </button>
            <button
              name="pending"
              className={
                filter == "pending"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={() => handleFilter("pending")}
            >
              Pendientes
            </button>
            <button
              name="unassigned"
              className={
                filter == "unassigned"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={() => handleFilter("unassigned")}
            >
              Sin Asignar
            </button>
            <button
              name="process"
              className={
                filter == "process"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={() => handleFilter("process")}
            >
              En proceso
            </button>
            <button
              name="printed"
              className={
                filter == "printed"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={() => handleFilter("printed")}
            >
              Impresas
            </button>
            <button
              name="received"
              className={
                filter == "received"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={() => handleFilter("received")}
            >
              Recibidas
            </button>
            <button
              name="problems"
              className={
                filter == "problems"
                  ? "border p-1 rounded-md text-[12px] bg-green-300"
                  : "border p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={() => handleFilter("problems")}
            >
              Con problemas
            </button>
            <button
              name="no_filter"
              className={
                "underline p-1 rounded-md text-[12px] hover:bg-green-500"
              }
              onClick={() => handleFilter("no_filter")}
            >
              Quitar filtros
            </button>
          </div>
        </div>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 650, backgroundColor: "#f2f2f4" }}>
          <table className="w-full min-w-max table-auto text-left">
            <TableHead>
              <TableRow>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.length ? (
                orders
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order, index) => {
                    const isLast = index === orders.length - 1;
                    const classes = isLast
                      ? "w-fit px-4"
                      : "w-fit px-4 border-y border-green-500/50";

                    return (
                      <TableRow
                        hover
                        role="button"
                        tabIndex={-1}
                        key={index}
                        className={twMerge(
                          index == selectedRow
                            ? "bg-green-900/80 text-white "
                            : "hover:bg-green-900/30",
                          "p-0 m-0"
                        )}
                        onClick={() => {
                          if (selectedRow == index) return;
                          else return setSelectedRow(index);
                        }}
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
                      </TableRow>
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
            </TableBody>

            {/* <TableFooter>
              <div className="flex w-full gap-2 mt-2 mb-4 ml-2">
                <button
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md"
                  onClick={() => {
                    setSelectedRow(null);
                    fetchOrders("prev");
                  }}
                  disabled={!lastDocument || loading}
                >
                  Anterior
                </button>

                <button
                  className="bg-green-200 hover:bg-green-300 px-4 py-2 rounded-md"
                  onClick={() => {
                    setSelectedRow(null);
                    fetchOrders("next");
                  }}
                  disabled={!hasMore || loading}
                >
                  Siguiente
                </button>
              </div>
            </TableFooter> */}
          </table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={allOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

const columns = [
  {
    id: "order_number",
    label: "N° de orden",
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

Orders.propTypes = {
  editor: propTypes.any,
  role: propTypes.any,
};
