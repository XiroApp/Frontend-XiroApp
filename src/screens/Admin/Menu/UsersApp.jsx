import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../redux/actions/adminActions";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import UsersRow from "./UsersRow.jsx";
import { Button, Input } from "@mui/material";

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
  const [allUsers, setAllUsers] = useState(usersApp);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roleFIlter, setRoleFIlter] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  useEffect(() => {
    setAllUsers(usersApp);
    setRoleFIlter("")
  }, [usersApp]);

  /* PAGINATION */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // console.log(usersApp);

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

  const handleFilter = (e) => {
    setPage(0);
    setRoleFIlter(e.target.name);
    if (e.target.name == "refresh") {
      setAllUsers(usersApp);
    } else {
      e.target.value.length
        ? setAllUsers(
            usersApp.filter((user) => user?.roles?.includes(e.target.value))
          )
        : setAllUsers(usersApp);
    }
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
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={allUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
