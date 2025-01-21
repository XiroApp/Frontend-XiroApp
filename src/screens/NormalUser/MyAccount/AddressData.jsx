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
  const [selectedAddress, setSelectedAddress] = useState(null); 

  const handleClickOpen = (address = null) => {
    setSelectedAddress(address); 
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAddress(null); 
  };

  return (
    <div className="flex justify-start md:justify-start flex-wrap rounded-2xl w-full lg:h-2/3 gap-5">
      {/* Botón Nueva Dirección */}
      <Box
        component="span"
        sx={{ p: 1, border: "1px dashed white", borderRadius: "25px" }}
        className="h-40 w-44 md:w-56 md:h-56 xl:h-60 xl:w-60 flex items-center justify-center"
      >
        <Button
          onClick={() => handleClickOpen()}
          className="flex-col-2 items-center justify-center gap-2 w-full h-full"
        >
          <AddCircleIcon
            sx={{ height: "1em", width: "1em" }}
            className="text-white"
          />
          <span className="text-[0.8em] text-white">Agregar dirección</span>
        </Button>
      </Box>

      {/* Lista de Direcciones */}
      {addresses &&
        addresses.map((address, index) => (
          <AddressCard
            key={index}
            address={address}
            user={user}
            handleClickOpen={() => handleClickOpen(address)} // Enviar dirección
          />
        ))}

      {/* Formulario Nueva Dirección / Editar */}
      <NewAddressForm
        open={open}
        setOpen={setOpen}
        selectedAddress={selectedAddress} // Pasar dirección seleccionada
      />
    </div>
  );
}
