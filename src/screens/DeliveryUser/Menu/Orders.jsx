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
import { getDeliveryOrders } from "../../../redux/actions/deliveryActions.js";
import { Input } from "@mui/material";

const columns = [
  { id: "paymentId", label: "ID de orden", minWidth: 100, align: "center" },
  {
    id: "place",
    label: "Tipo de entrega",
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
    id: "clientUid",
    label: "Cliente",
    minWidth: 150,
    align: "center",
  },
  // {
  //   id: "createdAt",
  //   label: "Fecha de llegada",
  //   minWidth: 100,
  //   align: "center",
  // },

  // { id: "cart", label: "Archivos", minWidth: 100, align: "center" },
];

export default function Orders({ editor }) {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders);
  const printingUsers = useSelector((state) => state.printingUsers);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getDeliveryOrders());
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
  console.log(orders);
  const [allOrders, setAllOrders] = useState(orders);
  const [filter, setFilter] = useState("no_filter");
  /* SEARCH USER */
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
          orders.filter((order) => order.place.address.city === e.target.name)
        )
      : setAllOrders(orders);
  };

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
          <label htmlFor="">Filtrar por lugar</label>
          <div className="flex flex-wrap gap-2">
     
            <button
              name="Mendoza"
              className={
                filter === "Mendoza"
                  ? "border p-1 rounded-md text-[12px] bg-gray-500"
                  : "border p-1 rounded-md text-[12px] hover:bg-gray-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Mendoza
            </button>
            <button
              name="Las Heras"
              className={
                filter === "Las Heras"
                  ? "border p-1 rounded-md text-[12px] bg-gray-500"
                  : "border p-1 rounded-md text-[12px] hover:bg-gray-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Las Heras
            </button>
            <button
              name="Godoy Cruz"
              className={
                filter === "Godoy Cruz"
                  ? "border p-1 rounded-md text-[12px] bg-gray-500"
                  : "border p-1 rounded-md text-[12px] hover:bg-gray-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Godoy Cruz
            </button>
            <button
              name="Lujan de Cuyo"
              className={
                filter === "Lujan de Cuyo"
                  ? "border p-1 rounded-md text-[12px] bg-gray-500"
                  : "border p-1 rounded-md text-[12px] hover:bg-gray-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Lujan de Cuyo
            </button>
            <button
              name="Guaymallén"
              className={
                filter === "Guaymallén"
                  ? "border p-1 rounded-md text-[12px] bg-gray-500"
                  : "border p-1 rounded-md text-[12px] hover:bg-gray-500"
              }
              onClick={(e) => handleFilter(e)}
            >
              Guaymallén
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
