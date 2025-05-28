import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import OrdersRow from "../../../components/OrdersRow/OrdersRow.jsx";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  Input,
  MenuItem,
  Select,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { OrdersAdapter } from "../../../Infra/Adapters/orders.adatper.js";
import { UsersAdapter } from "../../../Infra/Adapters/users.adapter.js";
import { twMerge } from "tailwind-merge";
import propTypes from "prop-types";
import { tLC } from "../../../Common/helpers.js";
import JsonToExcelConverter from "../../../components/FileConverter/JsonToExcelConverter.jsx";

export default function Orders({ editor }) {
  const [printingUsers, setPrintingUsers] = useState([]);
  const [deliveryUsers, setDeliveryUsers] = useState([]);
  const [distributionUsers, setDistributionUsers] = useState([]);
  const [pickupUsers, setPickupUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filter, setFilter] = useState("no_filter");
  const [allOrders, setAllOrders] = useState([]);
  /* -------------------------------------------- */
  /* PAGINADO DEL BACK NUEVO 2025 V 78598.1.0.156 */
  const limitOptions = [10, 25, 50, 100]; // Opciones de límite
  const [limit, setLimit] = useState(25); // Estado para el límite/pageSize
  // Estado para guardar los cursores recibidos del backend
  const [currentNextCursor, setCurrentNextCursor] = useState(null); // para pedir la siguiente pagina
  const [currentPreviousCursor, setCurrentPreviousCursor] = useState(null); // para pedir la pagina anterior
  // No necesitamos 'page', 'lastDocument' o 'direction' directamente
  // porque usamos los cursores del backend
  /* -------------------------------------------- */
  /* -------------------------------------------- */

  useEffect(() => {
    fetchOrders({ currentNextCursor, currentPreviousCursor });
    fetchUsersByRole();
  }, [limit]);

  async function fetchOrders({
    startAfterValue = null,
    endBeforeValue = null,
  }) {
    setLoading(true);
    setError(null);
    setOrders([]);
    setAllOrders([]);
    try {
      console.log(
        `Fetching orders with limit: ${limit}, startAfter: ${startAfterValue}, endBefore: ${endBeforeValue}`
      );
      const data = await OrdersAdapter.getOrdersPaginated(
        limit,
        startAfterValue,
        endBeforeValue,
        "admin"
      );

      // El backend te devuelve { orders: [...], nextPageStartAfter: ..., previousPageEndBefore: ... }
      const {
        orders: fetchedOrders,
        nextPageStartAfter,
        previousPageEndBefore,
      } = data;

      // Si estábamos paginando hacia atrás, el backend nos dio los resultados
      // en orden ascendente para que Firestore pudiera usar startAt().
      // Ahora en el frontend, si endBeforeValue no es null, debemos invertir
      // los resultados para que se muestren en orden descendente (como el orderBy original).
      let ordersToDisplay = fetchedOrders;
      // if (endBeforeValue !== null) {
      //   ordersToDisplay = fetchedOrders.reverse();
      // }

      setOrders(ordersToDisplay);
      setAllOrders(ordersToDisplay);
      // Actualiza los cursores para la próxima/anterior página basados en la respuesta
      setCurrentNextCursor(nextPageStartAfter);
      setCurrentPreviousCursor(previousPageEndBefore);
      // setHasMore(fetchedOrders.length === limit); // hasMore ya no es tan simple con paginación bidireccional
      // Los cursores (currentNextCursor, currentPreviousCursor)
      // son una mejor indicación de si hay páginas
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function fetchUsersByRole() {
    UsersAdapter.getSpecialUsers().then(res => {
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
      o =>
        tLC(o?.order_number ?? "").includes(searchTerm) ||
        normalizeStr(tLC(o?.clientUser?.displayName ?? "")).includes(searchTerm)
    );

    setOrders(filteredOrders);
  }

  async function handleFilter(status) {
    setFilter(status);
    console.log(status);
    console.log(orders);

    if (status != "no_filter") {
      setAllOrders(orders.filter(o => o?.orderStatus == tLC(status)));
    } else {
      const orders = await fetchOrders({});
      setAllOrders(orders);
    }
  }

  function handleLimitChange(e) {
    setLimit(e.target.value);
  }

  async function handleDownloadExcel() {
    try {
      setLoading(true);
      await OrdersAdapter.downloadOrdersExcel();
    } catch (error) {
      alert("Error al descargar el archivo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4 ">
      <div className="flex flex-col lg:flex-row rounded-lg lg:w-full p-2 gap-y-4 gap-x-10">
        <div className="flex flex-col gap-y-1 w-full max-w-[200px]">
          <label
            htmlFor="search-orders"
            className="text-lg flex gap-x-3 items-center justify-start"
            onClick={
              () => {
                fetchOrders({});
              } // Reset the orders when clicking the label
            }
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
            onChange={e => handleSearch(e.target.value)}
            className="w-full text-gray-800"
          />
        </div>
        <JsonToExcelConverter
          text={"Descargar Listado de órdenes"}
          icon={<FileDownloadIcon className="h-5 w-5" />}
          action={handleDownloadExcel}
        />
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
                    zIndex: theme => theme.zIndex.drawer + 1,
                  }}
                  open={loading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              )}
            </TableBody>
          </table>
        </TableContainer>
        <TableFooter>
          {/* Usamos TableRow y TableCell para que ocupe el ancho de la tabla */}
          <TableRow>
            {/* El colspan="XXX" debe ser igual al número de columnas en tu tabla */}
            {/* Cuenta cuántas <th> tienes en tu TableHead (N° de orden, Fecha, etc.) */}
            {/* En tu código original hay 10 columnas, así que usamos colspan="10" */}
            <td colSpan={10} className="p-2 border-none">
              {" "}
              {/* Ajusta el colspan si tienes un número diferente de columnas */}
              <div className="flex items-center justify-end gap-4">
                {" "}
                {/* Flexbox para alinear elementos a la derecha */}
                {/* Selector de Límite (Filas por página) */}
                <div className="flex items-center gap-2">
                  <Typography variant="body2" color="textSecondary">
                    Filas por página:
                  </Typography>
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: 60 }}
                    size="small"
                  >
                    {/* No necesitamos InputLabel si usamos variant="standard" y el texto fuera */}
                    {/* <InputLabel id="limit-select-label">Límite</InputLabel> */}
                    <Select
                      labelId="limit-select-label"
                      id="limit-select"
                      value={limit} // Conectado al estado 'limit'
                      onChange={handleLimitChange} // Conectado al handler
                      // label="Límite" // No necesario con variant="standard"
                      disableUnderline={true} // Estilo minimalista: quita el subrayado
                      sx={{
                        ".MuiSelect-select": {
                          paddingRight: "24px !important",
                        },
                      }} // Ajuste de padding si es necesario
                    >
                      {/* Mapea las opciones de límite. Asegúrate de que 'limitOptions' esté definido en tu componente (ej: [10, 25, 50, 100]) */}
                      {limitOptions.map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                {/* Información opcional (si no tienes el total de count, esto puede ser solo indicativo) */}
                <Typography variant="body2" color="textSecondary">
                  {loading
                    ? "Cargando..."
                    : `Mostrando ${orders?.length} órdenes`}{" "}
                  {/* Podrías refinar este texto */}
                </Typography>
                {/* Botón para ir a la página anterior */}
                <Button
                  onClick={() =>
                    fetchOrders({
                      startAfterValue: null,
                      endBeforeValue: currentPreviousCursor,
                    })
                  } // Llama a fetchOrders con el cursor anterior
                  disabled={!currentPreviousCursor || loading} // Deshabilitado si no hay cursor anterior o está cargando
                  variant="outlined" // Estilo outlined minimalista
                  size="small" // Tamaño pequeño
                  sx={{ textTransform: "none" }} // Evita MAYÚSCULAS automáticas
                >
                  Anterior
                </Button>
                {/* Botón para ir a la página siguiente */}
                <Button
                  onClick={() =>
                    fetchOrders({
                      startAfterValue: currentNextCursor,
                      endBeforeValue: null,
                    })
                  } // Llama a fetchOrders con el cursor siguiente
                  disabled={!currentNextCursor || loading} // Deshabilitado si no hay cursor siguiente (llegaste al final) o está cargando
                  variant="outlined" // Estilo outlined minimalista
                  size="small" // Tamaño pequeño
                  sx={{ textTransform: "none" }} // Evita MAYÚSCULAS automáticas
                >
                  Siguiente
                </Button>
              </div>
            </td>
          </TableRow>
        </TableFooter>
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
