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
import { Input } from "@mui/material";

const columns = [
  {
    id: "displayName",
    label: "Nombre completo",
    minWidth: 100,
    align: "start",
  },
  {
    id: "email",
    label: "Email",
    minWidth: 50,
    align: "start",
  },
  {
    id: "phone",
    label: "Teléfono",
    minWidth: 100,
    align: "center",
  },
  { id: "uid", label: "UID de usuario", minWidth: 50, align: "center" },
  { id: "roles", label: "Rol asignado", minWidth: 50, align: "center" },

  {
    id: "edit",
    label: "Editar rol",
    minWidth: 100,
    align: "center",
  },
];

export default function UsersApp({ editor }) {
  const dispatch = useDispatch();

  const usersApp = useSelector((state) => state.usersApp);

  const [allUsers, setAllUsers] = useState(usersApp);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);
  useEffect(() => {
    setAllUsers(usersApp);
  }, [usersApp]);

  /* PAGINATION */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  /* SEARCH USER */
  const handleSearch = (e) => {
    e.target.value.length
      ? setAllUsers(
          usersApp.filter((user) => user.email.includes(e.target.value))
        )
      : setAllUsers(usersApp);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4">
      <span className="text-2xl lg:text-3xl ">Usuarios</span>
      <div className="flex flex-col rounded-lg  w-1/2 p-2">
        <label htmlFor="">Buscar usuarios</label>
        <Input
          name="email"
          type="text"
          placeholder={"Ingresa un email a buscar..."}
          onChange={(e) => handleSearch(e)}
          className="w-full"
        />
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
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
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.uid}>
                      {columns.map((column, index) => {
                        const value = row[column.id];

                        return (
                          <>
                            <UsersRow
                              key={index}
                              value={value}
                              column={column}
                              uidUser={row.uid}
                            />
                          </>
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
