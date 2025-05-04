import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import OrdersRow from "../../../components/OrdersRow/OrdersRow.jsx";
import {
  Backdrop,
  CircularProgress,
  Input,
  TableBody,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { OrdersAdapter } from "../../../Infra/Adapters/orders.adatper.js";
import { UsersAdapter } from "../../../Infra/Adapters/users.adapter.js";
import { twMerge } from "tailwind-merge";
import propTypes from "prop-types";
import { normalize, tLC } from "../../../Common/helpers.js";

export default function Orders({ editor }) {
  const [printingUsers, setPrintingUsers] = useState([]);
  const [deliveryUsers, setDeliveryUsers] = useState([]);
  const [distributionUsers, setDistributionUsers] = useState([]);
  const [pickupUsers, setPickupUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(null);
  const [pageSize] = useState(15);
  const [lastDocument, setLastDocument] = useState(null);
  const [, setHasMore] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filter, setFilter] = useState("no_filter");

  const [allOrders, setAllOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

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
        normalize(tLC(o?.clientUser?.displayName ?? "")).includes(searchTerm)

    );

    setOrders(filteredOrders);
  }

  function handleFilter(status) {
    setFilter(status);
    return status != "no_filter"
      ? setOrders(allOrders.filter((o) => o?.orderStatus == tLC(status)))
      : setOrders(allOrders);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4 ">
      <div className="flex flex-col lg:flex-row rounded-lg lg:w-full p-2 gap-y-4 gap-x-10">
        <div className="flex flex-col gap-y-1 w-full max-w-[200px]">
          <label
            htmlFor="search-orders"
            className="text-lg flex gap-x-3 items-center justify-start"
          >
            <svg
              className="w-5 h-5 font-bold"
              fill="#000000"
              viewBox="0 0 32 32"
            >
              <path d="M31.707 30.282l-9.717-9.776c1.811-2.169 2.902-4.96 2.902-8.007 0-6.904-5.596-12.5-12.5-12.5s-12.5 5.596-12.5 12.5 5.596 12.5 12.5 12.5c3.136 0 6.002-1.158 8.197-3.067l9.703 9.764c0.39 0.39 1.024 0.39 1.415 0s0.39-1.023 0-1.415zM12.393 23.016c-5.808 0-10.517-4.709-10.517-10.517s4.708-10.517 10.517-10.517c5.808 0 10.516 4.708 10.516 10.517s-4.709 10.517-10.517 10.517z" />
            </svg>
            Buscar órdenes
          </label>
          <Input
            autoFocus
            id="search-orders"
            name="email"
            type="text"
            placeholder="Ingresa una órden..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full text-gray-800"
          />
        </div>
        <div className="w-full flex flex-col gap-y-2">
          <label
            htmlFor="filter-orders"
            className="text-lg flex gap-x-2 items-center justify-start"
          >
            <svg className="w-5 h-5 font-bold" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Filtrar órdenes
          </label>
          <div className="w-full flex flex-wrap gap-1.5 justify-start items-center [&>button]:border [&>button]:px-3 [&>button]:py-1 [&>button]:rounded-md [&>button]:text-sm [&>button]:transition-colors">
            <button
              type="button"
              name="pending"
              onClick={() => handleFilter("pending")}
              className={twMerge(
                filter == "pending" ? "bg-green-300" : "hover:bg-green-300"
              )}
            >
              Pendientes
            </button>
            <button
              type="button"
              name="unassigned"
              onClick={() => handleFilter("unassigned")}
              className={twMerge(
                filter == "unassigned" ? "bg-green-300" : "hover:bg-green-300"
              )}
            >
              Sin Asignar
            </button>
            <button
              type="button"
              name="process"
              onClick={() => handleFilter("process")}
              className={twMerge(
                filter == "process" ? "bg-green-300" : "hover:bg-green-300"
              )}
            >
              En proceso
            </button>
            <button
              type="button"
              name="printed"
              onClick={() => handleFilter("printed")}
              className={twMerge(
                filter == "printed" ? "bg-green-300" : "hover:bg-green-300"
              )}
            >
              Impresas
            </button>
            <button
              type="button"
              name="in_delivery"
              onClick={() => handleFilter("in_delivery")}
              className={twMerge(
                filter == "in_delivery" ? "bg-green-300" : "hover:bg-green-300"
              )}
            >
              En delivery
            </button>
            <button
              type="button"
              name="distribution"
              onClick={() => handleFilter("distribution")}
              className={twMerge(
                filter == "distribution" ? "bg-green-300" : "hover:bg-green-300"
              )}
            >
              En punto de dist.
            </button>
            <button
              type="button"
              name="pickup"
              onClick={() => handleFilter("pickup")}
              className={twMerge(
                filter == "pickup" ? "bg-green-300" : "hover:bg-green-300"
              )}
            >
              En punto de retiro
            </button>
            <button
              type="button"
              name="received"
              onClick={() => handleFilter("received")}
              className={twMerge(
                filter == "received" ? "bg-green-300" : "hover:bg-green-300"
              )}
            >
              Recibidas
            </button>
            <button
              type="button"
              name="problems"
              onClick={() => handleFilter("problems")}
              className={twMerge(
                filter == "problems" ? "bg-green-300" : "hover:bg-green-300"
              )}
            >
              Con problemas
            </button>
            <button
              type="button"
              name="no_filter"
              onClick={() => handleFilter("no_filter")}
              className="bg-gray-100 hover:bg-gray-200"
            >
              Quitar filtros
            </button>
          </div>
        </div>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 550, backgroundColor: "#f2f2f4" }}>
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
                    >
                      {column.label}
                    </Typography>
                  </th>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.length ? (
                orders
                  // ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order, index) => {
                    const isLast = index === orders.length - 1;
                    const classes = isLast
                      ? "w-fit px-4"
                      : "w-fit px-4 border-y border-green-500/50";

                    return (
                      <TableRow
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
          </table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={allOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
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
