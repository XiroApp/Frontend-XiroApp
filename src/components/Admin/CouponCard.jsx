import {
  Autocomplete,
  TextField,
  Backdrop,
  Box,
  CircularProgress,
  Input,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorIcon from "@mui/icons-material/Error";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch } from "react-redux";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";
import { createCouponValidator } from "../../utils/inputValidator";
import {
  deleteCoupon,
  editCoupon,
  getAllCoupons,
} from "../../redux/actions/adminActions";

export default function CouponCard({ coupon }) {
  const dispatch = useDispatch();

  /* EDIT BUTTON */
  const [editModal, setEditModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [error, setError] = useState(false);
  const [input, setInput] = useState(coupon);

  function handleInput(e) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  function handleCloseEditModal() {
    setEditModal(false);
  }
  function handleClickOpenEditModal() {
    setEditModal(true);
  }
  const handleCancel = () => {
    setInput(coupon);
    setEditModal(false);
    setError(false);
  };

  function handleSubmit(e) {
    let results = createCouponValidator(
      input.name,
      input.code,
      input.type,
      input.stock,
      input.ammount,
      input.status
    );

    setError(results.error);
    let continueRegister = results.allowCreate;

    if (continueRegister) {
      setLoader(true);
      dispatch(editCoupon(coupon.code, input)).then(setEditModal(false));
      setInput({
        name: null,
        code: null,
        type: null,
        stock: null,
        ammount: null,
      });
    }
  }

  /* DELETE BUTTON */
  const [deleteModal, setDeleteModal] = useState(false);

  const handleClickOpenDeleteModal = () => {
    setDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
  };
  const handleDeleteCoupon = () => {
    dispatch(deleteCoupon(coupon.code)).then((res) =>
      dispatch(getAllCoupons())
    );
    setDeleteModal(false);
  };

  /* AUTOCOMPLETE STATE */
  const statusProps = {
    options: ["Activo", "NO activo"],
    getOptionLabel: (option) => option ?? "N/A",
  };

  const couponTypeProps = {
    options: ["% Descuento por porcentaje", "$ Descuento por monto"],
    getOptionLabel: (option) => option ?? "N/A",
  };

  return (
    <>
      {/* CARD */}
      <Box
        component="span"
        sx={{ p: 1, borderRadius: "25px", padding: "1em" }}
        className="h-40 w-44 md:w-56 md:h-56 lg:h-56 lg:w-56 flex flex-col items-center justify-center border border-gray-500  bg-[#1e1e1e]"
      >
        <div className="relative flex flex-col items-center justify-center w-full h-full  ">
          <div className="absolute top-0 right-0 flex gap-2">
            <Tooltip title="Editar" placement="top" arrow>
              <EditIcon
                onClick={handleClickOpenEditModal}
                color="action"
                sx={{ height: "1em", width: "1em" }}
                className="hover:bg-[#4675C0] rounded-lg"
              />
            </Tooltip>
            <Tooltip title="Eliminar" placement="top" arrow>
              <DeleteIcon
                onClick={handleClickOpenDeleteModal}
                color="action"
                sx={{ height: "1em", width: "1em" }}
                className="hover:bg-[#4675C0] rounded-lg"
              />
            </Tooltip>
          </div>
          <div className="absolute bottom-0 flex flex-col justify-start gap-3 w-full items-start text-white">
            {coupon.type[0] === "$" ? (
              <AttachMoneyIcon
                className="text-blue-400"
                sx={{ height: "2rem", width: "2rem" }}
              />
            ) : (
              <PercentIcon
                className="text-blue-400"
                sx={{ height: "2rem", width: "2rem" }}
              />
            )}
            <div className="flex flex-col items-start">
              <span className="text-sm">
                {coupon?.name?.length < 20
                  ? coupon.name
                  : `${coupon.name.slice(0, 20)}...`}{" "}
                {coupon.number}
              </span>

              <span className="text-sm opacity-60">{coupon.code}</span>
              <span
                className={
                  coupon.status === "Activo"
                    ? "text-sm font-bold text-green-500 opacity-60"
                    : "text-sm font-bold text-red-500 opacity-60"
                }
              >
                {coupon.status}
              </span>
            </div>
          </div>
        </div>
      </Box>
      {/* EDIT MODAL FORM */}
      <Dialog open={editModal} onClose={handleCloseEditModal}>
        <DialogTitle className="text-center">Editar cupón</DialogTitle>
        <DialogContent dividers className="flex flex-col gap-6">
          <div className="flex flex-col w-full">
            <span className="text-sm">NOMBRE</span>
            <Input
              disabled
              error={error.name}
              name="name"
              defaultValue={coupon.name}
              placeholder="Inserta el nombre de referencia..."
              onChange={(e) => handleInput(e)}
            />
            {error.name ? (
              <span className="text-[12px] text-red-500 font-bold">
                Formato de nombre no válido.
              </span>
            ) : (
              false
            )}
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col w-full">
              <span className="text-sm">CÓDIGO </span>
              <Input
                disabled
                error={error.name}
                name="code"
                defaultValue={coupon.code}
                placeholder="Inserta el código que tus clientes usarán.."
                onChange={(e) => handleInput(e)}
              />
              {error.name ? (
                <span className="text-[12px] text-red-500 font-bold">
                  Formato de código no válido.
                </span>
              ) : (
                false
              )}
            </div>
          </div>

          {/* AUTOCOMPLETE DE TIPO CUPÓN */}
          <div className="flex flex-col w-full">
            <span className="text-sm">TIPO DE DESCUENTO</span>
            <Autocomplete
              {...couponTypeProps}
              id="auto-complete"
              name="type"
              defaultValue={coupon.type}
              onSelect={(e) => handleInput(e)}
              renderInput={(params) => (
                <TextField
                  error={error.type}
                  name="type"
                  placeholder="Seleccionar..."
                  {...params}
                  label=""
                  variant="standard"
                />
              )}
            />
            {error.type ? (
              <span className="text-[12px] text-red-500 font-bold">
                Selección no válida.
              </span>
            ) : (
              false
            )}
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col w-1/2">
              <span className="text-sm">STOCK</span>
              <Input
                error={error.stock}
                name="stock"
                type="number"
                inputProps={{ max: 999999, min: 1 }}
                placeholder="Cantidad de cupones..."
                defaultValue={coupon.stock}
                onChange={(e) => handleInput(e)}
              />
              {error.stock ? (
                <span className="text-[12px] text-red-500 font-bold">
                  Stock incorrecto.
                </span>
              ) : (
                false
              )}
            </div>

            <div className="flex flex-col w-1/2">
              <span className="text-sm">DESCUENTO</span>
              <Input
                error={error.ammount}
                name="ammount"
                inputProps={{ max: 999999, min: 1 }}
                defaultValue={coupon.ammount}
                type="number"
                placeholder="$ ó %"
                onChange={(e) => handleInput(e)}
              />
              {error.ammount ? (
                <span className="text-[12px] text-red-500 font-bold">
                  Descuento inválido
                </span>
              ) : (
                <span className="text-[12px] font-light">
                  Selecciona el monto que quieres otorgar de descuento.
                </span>
              )}
            </div>
          </div>

          {/* AUTOCOMPLETE DE ESTADO CUPÓN */}
          <div className="flex flex-col w-full">
            <span className="text-sm">ESTADO / VIGENCIA</span>
            <Autocomplete
              {...statusProps}
              id="auto-complete"
              name="status"
              defaultValue={coupon.status}
              onSelect={(e) => handleInput(e)}
              renderInput={(params) => (
                <TextField
                  error={error.status}
                  name="status"
                  placeholder="Seleccionar..."
                  {...params}
                  label=""
                  variant="standard"
                />
              )}
            />
            {error.status ? (
              <span className="text-[12px] text-red-500 font-bold">
                Debes seleccionar un estado.
              </span>
            ) : (
              false
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      {/* DELETE MODAL  */}
      <Dialog
        // fullScreen={fullScreen}
        open={deleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="flex flex-col justify-center items-center">
          <DialogTitle
            id="responsive-dialog-title"
            className="flex flex-col items-center gap-5 text-center"
          >
            <ErrorIcon color="warning" sx={{ height: "4em", width: "4em" }} />
            <span className="text-xl lg:text-2xl">
              ¿Está seguro que desea eliminar este cupón?
            </span>
          </DialogTitle>
          <DialogContent className="flex justify-center">
            <DialogContentText className="text-center">
              <span className="text-md lg:text-lg">
                Esta acción es permanente
              </span>
            </DialogContentText>
          </DialogContent>

          <div className="flex justify-end items-end w-full">
            <DialogActions>
              <Button
                color="primary"
                autoFocus
                onClick={handleCloseDeleteModal}
              >
                <span className="text-lg font-[400]">Cancelar</span>
              </Button>
              <Button color="error" onClick={handleDeleteCoupon} autoFocus>
                <span className="text-lg font-[400]">Borrar</span>
              </Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>
      {/* ------------- */}

      {/* LOADER */}
      {loader ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openLoader}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        false
      )}
    </>
  );
}
