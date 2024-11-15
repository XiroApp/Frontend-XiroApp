import { Button, TableCell, Tooltip } from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch } from "react-redux";
import { updateUserRole } from "../../../redux/actions/adminActions";

export default function UsersRow({ column, value, uidUser }) {
  const dispatch = useDispatch();
  const [editStatus, setEditStatus] = useState(false);

  const handleSetEditStatus = (e) => {
    setEditStatus(false);
  };

  const [input, setInput] = useState({
    roles: ["user"],
  });

  const handleAssignRole = () => {
    dispatch(updateUserRole(uidUser, input)).then(setEditStatus(false));
  };

  return (
    <>
      <TableCell key={column.id} align={column.align}>
        {column.id === "email" && <span className="font-bold">{value}</span>}
        {column.id === "uid" && (
          <Tooltip placement="top" title={value}>
            <span className="font-bold">{value.slice(0, 10) + "..."}</span>
          </Tooltip>
        )}
        {column.id === "phone" && (
          <span className="font-bold">{value || "-"}</span>
        )}
        {column.id === "displayName" && (
          <span className="font-bold">{value}</span>
        )}
        {column.id === "roles" &&
          value.map((rol) => (
            <span className="font-bold">
              {rol === "printing" ? "imprenta" : rol}
            </span>
          ))}
        {column.id === "edit" && (
          <>
            <button>
              <Tooltip placement="bottom" title="Editar Usuario">
                <EditIcon
                  sx={{ height: "1.2em", width: "1.2em" }}
                  className="hover:text-[#4675C0] hover:bg-[#1e1e1e] rounded-lg p-1 "
                  onClick={(e) => setEditStatus(true)}
                />
              </Tooltip>
            </button>

            {/* MODAL FORMULARIO */}
            <Dialog open={editStatus} onClose={(e) => setEditStatus(false)}>
              <DialogTitle className="text-center">Editar rol</DialogTitle>
              <DialogContent dividers className="flex flex-col gap-8">
                <section className="flex flex-col items-center gap-4 w-96">
                  <div className="w-full">
                    <div className="flex flex-col w-full">
                      <label className="py-2" for="roleSelector">
                        Cambiar rol de usuario.
                      </label>
                      <select
                        onChange={(e) => setInput({ roles: [e.target.value] })}
                        name="roleSelector"
                        id="roleSelector"
                        className="border rounded-l p-2"
                      >
                        <option value="user">Seleccionar</option>
                        <option value="user">Usuario Base 🙍‍♂️</option>
                        <option value="printing">Imprenta 📄</option>
                        <option value="delivery">Delivery 🛸</option>
                        <option value="admin">Administrador 🏆</option>
                      </select>
                    </div>
                  </div>
                </section>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  onClick={(e) => handleSetEditStatus(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={(e) => handleAssignRole(e)}
                >
                  Aceptar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </TableCell>
    </>
  );
}
