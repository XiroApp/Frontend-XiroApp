import React, { useState } from "react";
import { Backdrop, Box, Button, CircularProgress } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDispatch, useSelector } from "react-redux";
import AddressCard from "../../../components/AddressCard/AddressCard";
import NewAddressForm from "../../../components/Forms/NewAddressForm";

export default function AddressData({ user }) {
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.addresses);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setError(false);
  };


  return (
    // <div className="grid grid-cols-2 md:grid lg:grid md:grid-cols-3 lg:grid-cols-5 rounded-2xl lg:h-2/3  gap-8">
    <div className="flex justify-start md:justify-start flex-wrap rounded-2xl w-full lg:h-2/3 gap-5">
      {/* NEW ADDRESS BUTTON */}
      <Box
        component="span"
        sx={{ p: 1, border: "1px dashed white", borderRadius: "25px" }}
        className="h-40 w-44 md:w-56 md:h-56 xl:h-60 xl:w-60 flex items-center justify-center"
      >
        <Button
          onClick={handleClickOpen}
          className="flex-col-2 items-center justify-center gap-2 w-full h-full "
        >
          <AddCircleIcon
            sx={{ height: "1em", width: "1em" }}
            className="text-white"
          />
          <span className="text-[0.8em] text-white">Agregar dirección</span>
        </Button>
      </Box>

      {/* ADDRESS CARD */}
      {addresses
        ? addresses.map((address, index) => (
            <AddressCard key={index} address={address} user={user} />
          ))
        : false}

      {/* -------------- */}
      {/* MODAL FORMULARIO */}
      <NewAddressForm open={open} setOpen={setOpen} />

      {/* <Dialog open={open} onClose={handleClose}>
        <article className="flex flex-col gap-1 pt-3  ">
          <h6 className="text-center text-xl text-stone-600 lg:text-2xl 2xl:text-3xl">
            Agregar Direccion
          </h6>
          <p className="ml-3 text-base text-stone-500 text-balance leading-4 mt-1 lg:mt-2 lg:ml-4 2xl:text-lg">
           Dirección actual : {location?.address || "No seleccionada"}
          </p>
        </article>
        <div className="w-[100%] h-[300px] ">
          <Places
            userAddress={user?.address}
            onLocationChange={handleLocationChange}
          />
        </div>
        <div className="h-[70px] bg-"></div>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Agregar
          </Button>
        </DialogActions>
      </Dialog> */}
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
  );
}
