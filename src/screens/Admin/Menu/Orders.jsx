import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import OrdersRow from "../../../components/OrdersRow/OrdersRow.jsx";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AssessmentIcon from "@mui/icons-material/Assessment";
import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  Input, // Mantener Input si se usa en otro lugar, pero para la búsqueda usaremos OutlinedInput
  MenuItem,
  Select,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  InputLabel,
  OutlinedInput, // Importar OutlinedInput
  InputAdornment, // Importar InputAdornment
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
  TextField, // Importar IconButton
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import ClearIcon from "@mui/icons-material/Clear"; // Importar icono de limpiar
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
  const [filter, setFilter] = useState(null); // Estado para el filtro seleccionado
  const [allOrders, setAllOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para el término de búsqueda
  const [reportModal, setReportModal] = useState(false); // Nuevo estado para el término de búsqueda
  /* -------------------------------------------- */
  /* PAGINADO DEL BACK NUEVO 2025 V 78598.1.0.1 56 */
  const limitOptions = [10, 25, 50, 100]; // Opciones de límite
  const [limit, setLimit] = useState(25); // Estado para el límite/pageSize
  // Estado para guardar los cursores recibidos del backend
  const [currentNextCursor, setCurrentNextCursor] = useState(null); // para pedir la siguiente pagina
  const [currentPreviousCursor, setCurrentPreviousCursor] = useState(null); // para pedir la pagina anterior
  const [hasMoreForward, setHasMoreForward] = useState(false); // Indica si hay más páginas hacia adelante
  const [hasMoreBackward, setHasMoreBackward] = useState(false); // Indica si hay más páginas hacia atrás
  /* -------------------------------------------- */
  /* REPORTES */
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date
  /* -------------------------------------------- */

  // Opciones de filtro para el desplegable
  const filterOptions = [
    { value: null, label: "Todos" },
    { value: "pending", label: "Pendientes" },
    { value: "unassigned", label: "Sin Asignar" },
    { value: "process", label: "En proceso" },
    { value: "printed", label: "Impresas" },
    { value: "in_delivery", label: "En delivery" },
    { value: "distribution", label: "En punto de dist." },
    { value: "pickup", label: "En punto de retiro" },
    { value: "received", label: "Recibidas" },
    { value: "problems", label: "Con problemas" },
  ];

  useEffect(() => {
    // Al cambiar el límite o el filtro, siempre se debe reiniciar a la primera página
    fetchOrders({ startAfterValue: null, endBeforeValue: null });
    fetchUsersByRole();
  }, [limit, filter]); // Las dependencias son limit y filter, no los cursores

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
        filter, // Usar el estado `filter`
        "admin"
      );

      // El backend te devuelve { orders: [...], nextPageStartAfter: ..., previousPageEndBefore: ..., hasMoreForward, hasMoreBackward }
      const {
        orders: fetchedOrders,
        nextPageStartAfter,
        previousPageEndBefore,
        hasMoreForward: fetchedHasMoreForward,
        hasMoreBackward: fetchedHasMoreBackward,
      } = data;

      // El backend ya garantiza el orden descendente, así que no necesitamos invertir aquí.
      let ordersToDisplay = fetchedOrders;

      setOrders(ordersToDisplay);
      setAllOrders(ordersToDisplay);
      // Actualiza los cursores y los indicadores de "hay más" basados en la respuesta del backend
      setCurrentNextCursor(nextPageStartAfter);
      setCurrentPreviousCursor(previousPageEndBefore);
      setHasMoreForward(fetchedHasMoreForward);
      setHasMoreBackward(fetchedHasMoreBackward);
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
    setSearchTerm(term); // Actualiza el estado del término de búsqueda
    const searchTermLower = tLC(term);
    if (searchTermLower === "") {
      setOrders(allOrders); // Si el campo está vacío, muestra todas las órdenes
    } else {
      const filteredOrders = allOrders.filter(
        (o) =>
          tLC(o?.order_number ?? "").includes(searchTermLower) ||
          tLC(o?.clientUser?.displayName ?? "").includes(searchTermLower)
      );
      setOrders(filteredOrders);
    }
  }

  function handleClearSearch() {
    setSearchTerm(""); // Vacía el campo de búsqueda
    fetchOrders({}); // Reinicia las órdenes a la primera página sin filtro de búsqueda
  }

  function handleFilter(event) {
    // Al aplicar un filtro, se debe reiniciar la paginación a la primera página
    setFilter(event.target.value); // El valor del Select se obtiene de event.target.value
    // El useEffect se encargará de llamar a fetchOrders con los cursores a null
  }

  function handleLimitChange(e) {
    // Al cambiar el límite, se debe reiniciar la paginación a la primera página
    setLimit(e.target.value);
    // El useEffect se encargará de llamar a fetchOrders con los cursores a null
  }

  async function handleDownloadExcel() {
    setLoading(true);
    try {
      await OrdersAdapter.downloadOrdersExcel(startDate, endDate);
    } catch (error) {
      alert("Error al descargar el archivo");
    } finally {
      setLoading(false);
      handleReportModal();
    }
  }

  async function handleRefresh() {
    if (filter) {
      setSearchTerm("");
      setFilter(null);
    } else {
      fetchOrders({});
    }
  }

  function handleReportModal() {
    setReportModal(!reportModal);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4 ">
      <div className="flex flex-col lg:flex-row justify-between rounded-lg lg:w-full p-2 gap-y-4 gap-x-10">
        <div className="flex gap-4 items-center">
          {/* Reemplazado el label y Input por FormControl con OutlinedInput */}
          <FormControl variant="outlined" size="small" className="w-56">
            <InputLabel htmlFor="search-orders-input">
              Buscar órdenes
            </InputLabel>
            <OutlinedInput
              id="search-orders-input"
              type="text"
              value={searchTerm} // Conectado al nuevo estado searchTerm
              onChange={(e) => handleSearch(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={handleClearSearch} // Llama a la nueva función para limpiar
                    edge="end"
                    disabled={searchTerm === ""} // Deshabilitar si no hay texto
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              }
              // startAdornment={
              //   <InputAdornment position="start">
              //     <SearchIcon />
              //   </InputAdornment>
              // }
              label="Buscar órdenes" // Debe coincidir con el InputLabel
              sx={{ borderRadius: "8px" }} // Tailwind rounded corners
            />
          </FormControl>

          <FormControl variant="outlined" size="small" className="w-56">
            <InputLabel id="order-status-filter-label">
              Filtrar por estado
            </InputLabel>
            <Select
              labelId="order-status-filter-label"
              id="order-status-filter"
              value={filter || ""} // Si filter es null, el value es "" para mostrar el placeholder
              onChange={handleFilter}
              label="Estado de Orden"
              sx={{ borderRadius: "8px" }} // Tailwind rounded corners
            >
              {filterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleRefresh}>
            Borrar filtros <ReplayIcon />
          </Button>
        </div>

        <Button variant="contained" onClick={handleReportModal}>
          <AssessmentIcon />
          Generar reporte
        </Button>
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
                      {limitOptions.map((option) => (
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
                  disabled={!hasMoreBackward || loading} // Deshabilitado si no hay cursor anterior o está cargando
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
                  disabled={!hasMoreForward || loading} // Deshabilitado si no hay cursor siguiente (llegaste al final) o está cargando
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
      </Paper>
      <Dialog
        open={reportModal}
        onClose={handleReportModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Generar reporte</DialogTitle>
        <DialogContent>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Seleccione las fechas
            </DialogContentText>
            <div className="flex flex-col gap-4 mt-4">
              <TextField
                label="Fecha de Inicio"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Fecha de Fin"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                variant="outlined"
              />
            </div>
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleReportModal}>
            Cerrar
          </Button>
          <JsonToExcelConverter
            text={"Descargar"}
            icon={<FileDownloadIcon className="h-5 w-5" />}
            action={handleDownloadExcel}
          />
        </DialogActions>
      </Dialog>
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
