import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  getPrintingUsers,
} from "../../../redux/actions/adminActions";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import OrdersRow from "../../../components/OrdersRow/OrdersRow.jsx";
import { Input } from "@mui/material";

const columns = [
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
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders);
  const printingUsers = useSelector((state) => state.printingUsers);

  const [allOrders, setAllOrders] = useState(orders);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getAllOrders()).then((res) => setAllOrders(res));
    // dispatch(getPrintingUsers());
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
      ? setAllOrders(
          orders.filter((order) =>
            order.paymentId.toString().includes(e.target.value)
          )
        )
      : setAllOrders(orders);
  };

  const handleFilter = (e) => {
  
    setFilter(e.target.name);
    e.target.name !== "no_filter"
      ? setAllOrders(
          orders.filter((order) => order.orderStatus === e.target.name)
        )
      : setAllOrders(orders);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4">
      <span className="text-2xl lg:text-3xl ">Asignar órdenes</span>
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
              {allOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.paymentId}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];

                        return (
                          <OrdersRow
                            key={row.paymentId}
                            value={value}
                            column={column}
                            printingUsers={printingUsers}
                            orderId={row.paymentId}
                            order={row}
                            editor={editor}
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
