import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../redux/actions/adminActions";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

import UsersRow from "./UsersRow.jsx";
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
  DialogContent, // Importar IconButton
} from "@mui/material";
import { UsersAdapter } from "../../../Infra/Adapters/users.adapter.js";

const columns = [
  {
    id: "index",
    label: "",
    align: "left",
  },
  {
    id: "displayName",
    label: "Nombre completo",
    // minWidth: 100,
    align: "left",
  },
  {
    id: "orders_total",
    label: "Pedidos",
    // minWidth: 100,
    align: "left",
  },
  {
    id: "email",
    label: "Email",
    // minWidth: 50,
    align: "left",
  },
  {
    id: "phone",
    label: "Teléfono",
    // minWidth: 100,
    align: "left",
  },
  {
    id: "edit",
    label: "Roles",
    // minWidth: 100,
    align: "right",
  },
];

export default function UsersApp({ editor }) {
  const dispatch = useDispatch();

  const usersApp = useSelector((state) => state.usersApp);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roleFIlter, setRoleFIlter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null); // Estado para el filtro seleccionado

  /* -------------------------------------------- */
  /* PAGINADO DEL BACK NUEVO 2025 V 78598.1.0.1 56 */
  const limitOptions = [5, 10, 25, 50, 100]; // Opciones de límite
  const [limit, setLimit] = useState(5); // Estado para el límite/pageSize
  // Estado para guardar los cursores recibidos del backend
  const [currentNextCursor, setCurrentNextCursor] = useState(null); // para pedir la siguiente pagina
  const [currentPreviousCursor, setCurrentPreviousCursor] = useState(null); // para pedir la pagina anterior
  const [hasMoreForward, setHasMoreForward] = useState(false); // Indica si hay más páginas hacia adelante
  const [hasMoreBackward, setHasMoreBackward] = useState(false); // Indica si hay más páginas hacia atrás
  /* -------------------------------------------- */
  /* -------------------------------------------- */
  // Opciones de filtro para el desplegable
  const filterOptions = [
    { value: null, label: "Todos" },
    { value: "user", label: "user" },
    { value: "", label: "Sin Asignar" },
    { value: "admin", label: "Administrador" },
    { value: "printing", label: "Imprenta" },
    { value: "pick_up", label: "Punto de retiro" },
    { value: "distribution", label: "Punto de distribución" },
  ];

  const fetchUsers = async ({
    startAfterValue = null,
    endBeforeValue = null,
  }) => {
    try {
      setLoading(true);
      setError(null);
      setUsers([]);
      setAllUsers([]);
      const data = await UsersAdapter.getUsersPaginated(
        limit,
        startAfterValue,
        endBeforeValue,
        filter, // Usar el estado `filter`
        "admin"
      );

      // El backend te devuelve { orders: [...], nextPageStartAfter: ..., previousPageEndBefore: ..., hasMoreForward, hasMoreBackward }
      const {
        users: fetchedUsers,
        nextPageStartAfter,
        previousPageEndBefore,
        hasMoreForward: fetchedHasMoreForward,
        hasMoreBackward: fetchedHasMoreBackward,
      } = data;

      // El backend ya garantiza el orden descendente, así que no necesitamos invertir aquí.
      let usersToDisplay = fetchedUsers;

      setUsers(usersToDisplay);
      setAllUsers(usersToDisplay);
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
  };

  useEffect(() => {
    fetchUsers({ startAfterValue: null, endBeforeValue: null });
  }, [limit, filter]);

  /* PAGINATION */
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

  /* SEARCH USER */
  const handleSearch = (e) => {
    setPage(0);
    setRoleFIlter("");
    e.target.value.length
      ? setAllUsers(
          usersApp.filter(
            (user) =>
              user?.email?.includes(e.target.value) ||
              user?.displayName?.includes(e.target.value) ||
              user?.phone?.includes(e.target.value)
          )
        )
      : setAllUsers(usersApp);
  };

  const renderButton = (name, value, label) => (
    <Button
      type="text"
      variant={roleFIlter === name ? "contained" : "outlined"}
      onClick={(e) => handleFilter(e)}
      className="w-full"
      name={name}
      value={value} //Opcional. Si el value siempre debe ser el mismo que el name
    >
      {label}
    </Button>
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4">
      <span className="text-2xl lg:text-3xl ">Usuarios</span>
      <div className="flex">
        <div className="flex flex-col rounded-lg  w-1/3 p-2">
          <label htmlFor="">Buscar</label>
          <Input
            name="email"
            type="text"
            placeholder={"Ingrese nombre, email o número telefónico..."}
            onChange={(e) => handleSearch(e)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col rounded-lg  w-1/2 p-2">
          <label htmlFor="">Filtrar por rol</label>
          <section className="flex justify-start gap-2">
            {renderButton("user", "user", "Usuarios")}
            {renderButton("printing", "printing", "Imprenta")}
            {renderButton("distribution", "distribution", "Distribución")}
            {renderButton("pickup", "pickup", "Pickup")}
            {renderButton("delivery", "delivery", "Delivery")}
            {renderButton("admin", "admin", "Administrador")}
            <Button
              type="text"
              variant="text"
              onClick={(e) => handleFilter(e)}
              className="w-full"
              name="refresh"
              value="refresh"
            >
              Quitar filtros
            </Button>
          </section>
        </div>
      </div>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: "60vh" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns?.map((column) => (
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
              {allUsers
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, indexUser) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={indexUser}
                    >
                      {columns.map((column, index) => {
                        let copyUser = { ...user, index: indexUser + 1 };
                        const value = copyUser[column.id];
                        return (
                          <UsersRow
                            key={index}
                            value={value}
                            column={column}
                            uidUser={user.uid}
                            user={user}
                          />
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
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
                    : `Mostrando ${users?.length} órdenes`}{" "}
                  {/* Podrías refinar este texto */}
                </Typography>
                {/* Botón para ir a la página anterior */}
                <Button
                  onClick={() =>
                    fetchUsers({
                      startAfterValue: null,
                      endBeforeValue: currentPreviousCursor,
                    })
                  } // Llama a fetchUsers con el cursor anterior
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
                    fetchUsers({
                      startAfterValue: currentNextCursor,
                      endBeforeValue: null,
                    })
                  } // Llama a fetchUsers con el cursor siguiente
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
    </div>
  );
}
