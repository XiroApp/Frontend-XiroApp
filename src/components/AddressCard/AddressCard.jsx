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
import PlaceIcon from "@mui/icons-material/Place";
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
import { deleteAddress, editAddress } from "../../redux/actions";
import { createAddressValidator } from "../../utils/inputValidator";
import citiesJson from "../../utils/data/filteredMendozaCities.json";

export default function AddressCard({ address, user }) {
  const dispatch = useDispatch();

  const [openInputTag, setOpenInputTag] = useState(false);
  const [localities, setLocalities] = useState(citiesJson.localities);
  const [cities, setCities] = useState(citiesJson.cities);

  function handleTag(e) {
    if (e.target.name !== "Otro") {
      setOpenInputTag(false);
      setInput({ ...input, ["tag"]: e.target.name });
    } else {
      setInput({ ...input, ["tag"]: e.target.value });
    }
  }
  function handleOtherTag(e) {
    setOpenInputTag(true);
    setInput({ ...input, ["tag"]: e.target.name });
  }
  /* EDIT BUTTON */
  const [editModal, setEditModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [error, setError] = useState(false);
  const [input, setInput] = useState(address);
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
    setInput(address);
    setEditModal(false);
    setError(false);
  };
  function handleSubmit(e) {
    let results = createAddressValidator(
      input.name,
      input.number,
      input.zipCode,
      input.floorOrApartment,
      input.city,
      input.locality,
      input.tag
    );

    setError(results.error);
    let continueRegister = results.allowCreate;

    if (continueRegister) {
      setLoader(true);
      dispatch(editAddress(user, input)).then(setEditModal(false));
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
  const handleDeleteAddress = () => {
    dispatch(deleteAddress(address));
    setDeleteModal(false);
  };
  /* AUTOCOMPLETE STATE */
  const localitiesProps = {
    options: localities,
    getOptionLabel: (option) => option.name,
  };
  const citiesProps = {
    options: cities,
    getOptionLabel: (option) => option.name ?? "N/A",
  };
  // create your filer options here
  const renderOptions = (props, option) => {
    return (
      <li {...props} key={option.id}>
        {option.name}
      </li>
    );
  };

  return (
    <>
      {/* CARD */}
      <Box
        component="span"
        sx={{ p: 1, borderRadius: "25px", padding: "1em" }}
        className="h-40 w-44 md:w-56 md:h-56 lg:h-56 lg:w-56 flex flex-col items-center justify-center  bg-[#fff]"
      >
        <div className="relative flex flex-col items-center justify-center w-full h-full   text-black">
          <div className="absolute top-0 right-0 flex gap-2">
            <Tooltip title="Editar" placement="top" arrow>
              <EditIcon
                onClick={handleClickOpenEditModal}
                color="action"
                sx={{ height: "1em", width: "1em" }}
                className="hover:bg-[#c9d9bb] rounded-lg"
              />
            </Tooltip>
            <Tooltip title="Eliminar" placement="top" arrow>
              <DeleteIcon
                onClick={handleClickOpenDeleteModal}
                color="action"
                sx={{ height: "1em", width: "1em" }}
                className="hover:bg-[#c9d9bb] rounded-lg"
              />
            </Tooltip>
          </div>
          
          <div className="absolute bottom-0 flex flex-col justify-start gap-3 w-full items-start text-black">
            <PlaceIcon
              color="primary"
              sx={{ height: "1.3em", width: "1.3em" }}
            />
            <div className="flex flex-col items-start">
              <span className="text-sm">
                {address?.name?.length < 15
                  ? address.name
                  : `${address.name.slice(0, 15)}...`}{" "}
                {address.number}
              </span>
              <span className="text-sm opacity-60">{address.tag}</span>
            </div>
          </div>
        </div>
      </Box>
      {/* EDIT MODAL FORM */}
      <Dialog open={editModal} onClose={handleCloseEditModal}>
        <DialogTitle className="text-center">Editar dirección</DialogTitle>
        <DialogContent dividers className="flex flex-col gap-8">
          <div className="flex gap-8">
            <div className="flex flex-col w-full">
              <span className="text-sm">CALLE</span>
              <Input
                error={error.name}
                name="name"
                defaultValue={address.name}
                placeholder={address.name}
                onChange={(e) => handleInput(e)}
              />
              {error.name ? (
                <span className="text-[12px] text-red-500 font-bold">
                  Formato de dirección no válido.
                </span>
              ) : (
                false
              )}
            </div>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col w-36">
              <span className="text-sm">NÚMERO</span>
              <Input
                error={error.number}
                name="number"
                type="number"
                defaultValue={address.number}
                placeholder={address.number}
                onChange={(e) => handleInput(e)}
              />
              {error.number ? (
                <span className="text-[12px] text-red-500 font-bold">
                  Número incompleto.
                </span>
              ) : (
                false
              )}
            </div>
            <div className="flex flex-col w-full">
              <span className="text-sm">PISO/DEPARTAMENTO</span>
              <Input
                error={error.floorOrApartment}
                name="floorOrApartment"
                // type="number"
                defaultValue={address.floorOrApartment}
                placeholder={address.floorOrApartment}
                onChange={(e) => handleInput(e)}
              />
              {error.floorOrApartment ? (
                <span className="text-[12px] text-red-500 font-bold">
                  Campo incompleto.
                </span>
              ) : (
                false
              )}
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex flex-col w-36">
              <span className="text-sm">C.P</span>
              <Input
                error={error.zipCode}
                name="zipCode"
                type="number"
                defaultValue={address.zipCode}
                placeholder={address.zipCode}
                onChange={(e) => handleInput(e)}
              />
              {error.zipCode ? (
                <span className="text-[12px] text-red-500 font-bold">
                  Código postal no admitido.
                </span>
              ) : (
                false
              )}
            </div>

            {/* AUTOCOMPLETE DE CIUDADES */}
            <div className="flex flex-col w-full">
              <span className="text-sm">CIUDAD</span>
              <Autocomplete
                {...citiesProps}
                id="auto-complete"
                name="city"
                onSelect={(e) => handleInput(e)}
                renderInput={(params) => (
                  <TextField
                    error={error.city}
                    name="city"
                    defaultValue={address.city}
                    placeholder={address.city}
                    {...params}
                    label=""
                    variant="standard"
                  />
                )}
              />
              {error.city ? (
                <span className="text-[12px] text-red-500 font-bold">
                  Ciudad no válida.
                </span>
              ) : (
                false
              )}
            </div>
          </div>

          {/* AUTOCOMPLETE DE LOCALIDADES */}
          <div className="flex flex-col w-full">
            <span className="text-sm">LOCALIDAD</span>
            <Autocomplete
              {...localitiesProps}
              // filterOptions={filterOptions}
              renderOption={renderOptions}
              id="auto-complete"
              name="locality"
              onSelect={(e) => handleInput(e)}
              renderInput={(params) => (
                <TextField
                  error={error.locality}
                  {...params}
                  name="locality"
                  defaultValue={address.locality}
                  placeholder={address.locality}
                  label=""
                  variant="standard"
                />
              )}
            />
            {error.locality ? (
              <span className="text-[12px] text-red-500 font-bold">
                Localidad no válida.
              </span>
            ) : (
              false
            )}
          </div>
          <div className="flex flex-col  gap-3">
            <span className="text-sm">
              ¿QUÉ NOMBRE LE DAREMOS A ESTA DIRECCIÓN?
            </span>
            <div className="flex flex-wrap gap-5">
              <button
                name="Casa"
                className={
                  input.tag === "Casa"
                    ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#c9d9bb] text-sm"
                    : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-gray-600 hover:bg-[#c9d9bb] text-sm"
                }
                onClick={(e) => handleTag(e)}
              >
                Casa
              </button>
              <button
                name="Oficina"
                className={
                  input.tag === null || input.tag === "Oficina"
                    ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#c9d9bb] text-sm"
                    : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-gray-600 hover:bg-[#c9d9bb] text-sm"
                }
                onClick={(e) => handleTag(e)}
              >
                Oficina
              </button>
              <button
                name="Trabajo"
                className={
                  input.tag === "Trabajo"
                    ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#c9d9bb] text-sm"
                    : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-gray-600 hover:bg-[#c9d9bb] text-sm"
                }
                onClick={(e) => handleTag(e)}
              >
                Trabajo
              </button>
              <button
                name="Universidad"
                className={
                  input.tag === "Universidad"
                    ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#c9d9bb] text-sm"
                    : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-gray-600 hover:bg-[#c9d9bb] text-sm"
                }
                onClick={(e) => handleTag(e)}
              >
                Universidad
              </button>
              <button
                name="Escuela"
                className={
                  input.tag === "Escuela"
                    ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#c9d9bb] text-sm"
                    : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-gray-600 hover:bg-[#c9d9bb] text-sm"
                }
                onClick={(e) => handleTag(e)}
              >
                Escuela
              </button>
              <button
                name="Otro"
                className={
                  input.tag === "Otro" ||
                  (input.tag !== "Escuela" &&
                    input.tag !== "Oficina" &&
                    input.tag !== "Casa" &&
                    input.tag !== "Universidad" &&
                    input.tag !== "Trabajo")
                    ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#c9d9bb] text-sm"
                    : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-gray-600 hover:bg-[#c9d9bb] text-sm"
                }
                onClick={(e) => handleOtherTag(e)}
              >
                Otro
              </button>
              {openInputTag ? (
                <section className="flex flex-col">
                  <Input
                    error={error.tag}
                    name="Otro"
                    type="text"
                    placeholder={
                      input.tag !== "Otro" || input.tag === "" || !input.tag
                        ? input.tag
                        : input.tag !== "Otro"
                        ? "Ingresa un nombre..."
                        : "Ingresa un nombre..."
                    }
                    defaultValue={input.tag}
                    onChange={(e) => handleTag(e)}
                  />
                  {error.tag ? (
                    <span className="text-[12px] text-red-500 font-bold">
                      Nombre no válido o demasiado largo.
                    </span>
                  ) : (
                    false
                  )}
                </section>
              ) : (
                false
              )}
            </div>
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
              ¿Está seguro que desea eliminar esta dirección?
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
              <Button color="error" onClick={handleDeleteAddress} autoFocus>
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
