import { Button, TableCell, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { updateUserRole } from "../../../redux/actions/adminActions";

export default function UsersRow({ column, value, uidUser, user, index }) {
  const dispatch = useDispatch();
  const [editStatus, setEditStatus] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(user.roles);
  console.log(selectedRoles);

  const handleSetEditStatus = (e) => {
    setEditStatus(false);
  };

  const handleAssignRole = () => {
    dispatch(updateUserRole(uidUser, { roles: selectedRoles })).then(
      setEditStatus(false)
    );
  };

  // Función para manejar el cambio de los checkboxes
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    // Si el checkbox está marcado, agregar el valor al array
    if (checked) {
      setSelectedRoles([...selectedRoles, value]);
    } else {
      // Si el checkbox no está marcado, eliminar el valor del array
      setSelectedRoles(selectedRoles.filter((role) => role !== value));
    }
  };

  return (
    <>
      <TableCell key={column.id} align={column.align}>
        {column.id === "edit" ? (
          <>
            <button>
              <Tooltip placement="bottom" title="Editar Usuario">
                <EditIcon
                  sx={{ height: "1.2em", width: "1.2em" }}
                  className="hover:text-green-700 hover:bg-[#1e1e1e] rounded-lg p-1 "
                  onClick={(e) => setEditStatus(true)}
                />
              </Tooltip>
            </button>

            {/* MODAL FORMULARIO  EDITAR ROL*/}
            <Dialog open={editStatus} onClose={(e) => setEditStatus(false)}>
              <DialogTitle className="text-center">Editar rol</DialogTitle>
              <DialogContent dividers className="flex flex-col gap-8">
                {/* <section className="flex flex-col items-center gap-4 w-96">
                  <div className="w-full">
                    <div className="flex flex-col w-full">
                      <label className="py-2" for="roleSelector">
                        Cambiar rol de usuario.
                      </label>
                      <select
                        onChange={(e) => setInput({ roles: [e.target.value] })}
                        name="roleSelector"
                        id="roleSelector"
                        className="border rounded-l p-2 bg-white"
                      >
                        <option value="user">Seleccionar</option>
                        <option value="user">Usuario Base 🙍‍♂️</option>
                        <option value="printing">Imprenta 📄</option>
                        <option value="delivery">Delivery 🛸</option>
                        <option value="admin">Administrador 🏆</option>
                      </select>
                    </div>
                  </div>
                </section> */}

                <div className="flex flex-col w-full">
                  <label className="py-2">Cambiar rol de usuario.</label>
                  {/* Checkbox para Usuario Base */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="user"
                      value="user"
                      defaultChecked={user?.roles?.includes("user")}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor="user">Usuario Base 🙍‍♂️</label>
                  </div>

                  {/* Checkbox para Imprenta */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="printing"
                      value="printing"
                      defaultChecked={user?.roles?.includes("printing")}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor="printing">Imprenta 📄</label>
                  </div>

                  {/* Checkbox para Delivery */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="distribution"
                      value="distribution"
                      defaultChecked={user?.roles?.includes("distribution")}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor="distribution">Distribución ⛽</label>
                  </div>
                  {/* Checkbox para Delivery */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pickup"
                      value="pickup"
                      defaultChecked={user?.roles?.includes("pickup")}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor="pickup">Pickup 🧭</label>
                  </div>

                  {/* Checkbox para Delivery */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="delivery"
                      value="delivery"
                      defaultChecked={user?.roles?.includes("delivery")}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor="delivery">Delivery 🛸</label>
                  </div>

                  {/* Checkbox para Administrador */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="admin"
                      value="admin"
                      defaultChecked={user?.roles?.includes("admin")}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor="admin">Administrador 🏆</label>
                  </div>

                  {/* Mostrar el estado actual (opcional) */}
                  <div className="mt-4">
                    <strong>Roles seleccionados:</strong>{" "}
                    {selectedRoles.join(", ")}
                  </div>
                </div>
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
        ) : (
          <>
            {column.id == "index" ? (
              <span className="font-bold text-black/50">{value}</span>
            ) : (
              <span className="font-bold">{value}</span>
            )}
          </>
        )}
      </TableCell>
    </>
  );
}
