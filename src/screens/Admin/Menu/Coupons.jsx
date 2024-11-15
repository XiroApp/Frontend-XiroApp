import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Input,
  TextField,
} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { useDispatch, useSelector } from "react-redux";
import { createCouponValidator } from "../../../utils/inputValidator";
import {
  createCoupon,
  getAllCoupons,
} from "../../../redux/actions/adminActions";
import CouponCard from "../../../components/Admin/CouponCard";

export default function Coupons({ user }) {
  const dispatch = useDispatch();

  const coupons = useSelector((state) => state.adminCoupons);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [input, setInput] = useState({
    name: null,
    code: null,
    type: null,
    stock: null,
    ammount: null,
  });

  useEffect(() => {
    dispatch(getAllCoupons());
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setInput({
      userUid: user.uid,
      name: null,
      code: null,
      type: null,
      stock: null,
      ammount: null,
    });
    setError(false);
  };

  const handleCancel = () => {
    setInput({
      name: null,
      code: null,
      type: null,
      stock: null,
      ammount: null,
    });
    setOpen(false);
    setError(false);
  };

  function handleInput(e) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

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
      dispatch(createCoupon(input))
        .then(setOpen(false))
        .then((res) => {
          dispatch(getAllCoupons());
        });
      setInput({
        name: null,
        code: null,
        type: null,
        stock: null,
        ammount: null,
      });
    }
  }

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
    // <div className="grid grid-cols-2 md:grid lg:grid md:grid-cols-3 lg:grid-cols-5 rounded-2xl lg:h-2/3  gap-8">
    <div className=" h-full p-4">
      <h1 className="text-2xl">Cupones</h1>
      <div className="flex justify-start md:justify-start flex-wrap rounded-2xl w-full lg:h-2/3 gap-5 py-5">
        {/* NEW ADDRESS BUTTON */}
        <Box
          component="span"
          sx={{ p: 1, border: "1px dashed #4675C0", borderRadius: "25px" }}
          className="h-40 w-44 md:w-56 md:h-56 lg:h-56 lg:w-56  flex items-center justify-center"
        >
          <Button
            onClick={handleClickOpen}
            className="flex-col-2 items-center justify-center gap-2 w-full h-full "
          >
            <ConfirmationNumberIcon sx={{ height: "1em", width: "1em" }} />
            <span className="text-[0.8em] ">Agregar cupón</span>
          </Button>
        </Box>

        {/* COUPON CARD */}
        {coupons
          ? coupons.map((coupon, index) => (
              <CouponCard key={index} coupon={coupon} />
            ))
          : "Cargando cupones"}

        {/* -------------- */}
        {/* MODAL FORMULARIO */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle className="text-center">Nuevo cupón</DialogTitle>
          <DialogContent dividers className="flex flex-col gap-6">
            <div className="flex flex-col w-full">
              <span className="text-sm">NOMBRE</span>
              <Input
                error={error.name}
                name="name"
                // defaultValue={user.displayName}
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
                <span className="text-sm">CÓDIGO</span>
                <Input
                  error={error.name}
                  name="code"
                  // defaultValue={user.displayName}
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
                  // defaultValue={1}
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
                  // defaultValue={user.displayName}
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
              Agregar
            </Button>
          </DialogActions>
        </Dialog>
        {/* --------------- */}
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
      </div>
    </div>
  );
}
