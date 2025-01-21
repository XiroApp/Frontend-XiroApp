import React, { useState, useEffect} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import citiesJson from "../../utils/data/filteredMendozaCities.json";
import { useDispatch, useSelector } from "react-redux";
import {
  Autocomplete,
  Button,
  Input,
  TextField,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";
import { createAddressValidator } from "../../utils/inputValidator";
import { addAddress } from "../../redux/actions";
import Places from "../Maps/Places";

export default function NewAddressForm({ open, setOpen, selectedAddress }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.dataBaseUser);

  const [openInputTag, setOpenInputTag] = useState(false);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [input, setInput] = useState({
    userUid: user.uid,
    name: "",
    number: "",
    city: "",
    locality: "",
    zipCode: "",
    lat: null,
    lng: null,
    floorOrApartment: "-",
    tag: "Casa",
    ...selectedAddress,
  });

  useEffect(() => {
    if (selectedAddress) {
      setInput((prevInput) => ({
        ...prevInput,
        ...selectedAddress,
      }));
    }
  }, [selectedAddress]);

  const [localities, setLocalities] = useState(citiesJson.localities);
  const [cities, setCities] = useState(citiesJson.cities);

  function handleInput(e) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

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

  const handleClose = () => {
    setOpen(false);
    setInput({
      userUid: user.uid,
      name: null,
      number: null,
      city: null,
      locality: null,
      zipCode: null,
      floorOrApartment: "-",
      tag: "Casa",
    });
    setError(false);
  };

  /* AUTOCOMPLETE STATE */
  const localitiesProps = {
    options: localities,
    getOptionLabel: (option) => option.name,
  };

  const citiesProps = {
    options: cities,
    getOptionLabel: (option) => option.name,
  };
  // create your filer options here
  const renderOptions = (props, option) => {
    return (
      <li {...props} key={option.id}>
        {option.name}
      </li>
    );
  };
  /* --------------- MAPAS -------------------------------- */
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleSubmitLocation = () => {
    try {
      if (selectedAddress) {
        console.log("Editar dirección:", selectedAddress);
      } else {
        const data = {
          userUid: user.uid,
          name: input.name,
          number: input.number,
          zipCode: input.zipCode,
          floorOrApartment: input.floorOrApartment,
          city: input.city,
          locality: input.locality,
          tag: input.tag,
          lat: location.lat,
          lng: location.lng,
          address: location.address,
        };

        setLoader(true);
        setOpen(false);
        dispatch(addAddress(user, data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* STEPPER */
  const steps = ["Ingresa tu dirección", "Ayúdanos a encontrarte"];

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  function handleSubmitStep1(e) {
    if (input) {
      let results = createAddressValidator(
        input.name,
        input.number,
        input.zipCode,
        input.floorOrApartment,
        input.city,
        input.locality,
        input.tag
        // location.lat,
        // location.lng,
        // location.address
      );

      setError(results.error);
      let continueRegister = results.allowCreate;

      if (continueRegister) {
        const searchQuery = `${input.name} ${input.number}, ${input.locality}, ${input.city}, Mendoza, Argentina`;
        setSearchQuery(searchQuery);
        handleNext();
      }
    } else {
      console.log("No se ha seleccionado ninguna dirección.");
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          width: { xs: "95%", sm: "85%", md: "700px" },
          maxHeight: "90vh",
          margin: { xs: "0", sm: "auto" },
          px: { xs: "2px", sm: 2 },
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          paddingY: { xs: 2, sm: 4 },
          width: "100%",
        }}
      >
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              Todos los pasos completados.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reiniciar</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box sx={{ mt: 2, mb: 1 }}>
              {activeStep === 0 && (
                <DialogContent dividers className="flex flex-col gap-8">
                  <div className="flex gap-8">
                    <div className="flex flex-col w-full">
                      <span className="text-sm ">CALLE</span>
                      <Input
                        error={error.name}
                        name="name"
                        // defaultValue={user.displayName}
                        placeholder="Calle ejemplo"
                        value={input.name || ""}
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
                      <span className="text-sm ">NÚMERO</span>
                      <Input
                        error={error.number}
                        name="number"
                        type="number"
                        inputProps={{ max: 99999, min: 0, maxLength: 5 }}
                        placeholder="1234"
                        value={input.number || ""}
                        // defaultValue={user.displayName}
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
                      <span className="text-sm ">PISO/DEPARTAMENTO</span>
                      <Input
                        error={error.floorOrApartment}
                        name="floorOrApartment"
                        // type="number"
                        placeholder="N° de casa o departamento..."
                        value={input.floorOrApartment || ""}
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
                      <span className="text-sm ">C.P</span>
                      <Input
                        error={error.zipCode}
                        name="zipCode"
                        value={input.zipCode|| ""}
                        type="number"
                        placeholder="5519"
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
                        getOptionLabel={params => params}
                        id="auto-complete"
                        value={input.city || null}
                        name="city"
                        isOptionEqualToValue={()=>true }
                        onSelect={(e) => handleInput(e)}
                        renderInput={(params) => (
                          <TextField
                            error={error.city}
                            name="city"
                            placeholder="Elige la ciudad"
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
                    <span className="text-sm ">LOCALIDAD</span>
                    <Autocomplete
                      {...localitiesProps}
                      // filterOptions={filterOptions}
                      getOptionLabel={params => params}
                      value={input.locality || null}
                      renderOption={renderOptions}
                      isOptionEqualToValue={()=> true }
                      id="auto-complete"
                      name="locality"
                      onSelect={(e) => handleInput(e)}
                      renderInput={(params) => (
                        <TextField
                          error={error.locality}
                          {...params}
                          name="locality"
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
                    <span className="text-sm ">
                      ¿QUÉ NOMBRE LE DAREMOS A ESTA DIRECCIÓN?
                    </span>
                    <div className="flex flex-wrap gap-5">
                      <button
                        name="Casa"
                        className={
                          input.tag === "Casa"
                            ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#789360] text-sm text-white"
                            : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-gray-600 hover:bg-[#789360] text-sm text-white"
                        }
                        onClick={(e) => handleTag(e)}
                      >
                        Casa
                      </button>
                      <button
                        name="Oficina"
                        className={
                          input.tag === null || input.tag === "Oficina"
                            ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#789360] text-sm text-white"
                            : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-gray-600 hover:bg-[#789360] text-sm text-white"
                        }
                        onClick={(e) => handleTag(e)}
                      >
                        Oficina
                      </button>
                      <button
                        name="Trabajo"
                        className={
                          input.tag === "Trabajo"
                            ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#789360] text-sm text-white"
                            : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-gray-600 hover:bg-[#789360] text-sm text-white"
                        }
                        onClick={(e) => handleTag(e)}
                      >
                        Trabajo
                      </button>
                      <button
                        name="Universidad"
                        className={
                          input.tag === "Universidad"
                            ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#789360] text-sm text-white"
                            : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-gray-600 hover:bg-[#789360] text-sm text-white"
                        }
                        onClick={(e) => handleTag(e)}
                      >
                        Universidad
                      </button>
                      <button
                        name="Escuela"
                        className={
                          input.tag === "Escuela"
                            ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#789360] text-sm text-white"
                            : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-gray-600 hover:bg-[#789360] text-sm text-white"
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
                            ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#789360] text-sm text-white"
                            : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-gray-600 hover:bg-[#789360] text-sm text-white"
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
                            placeholder="Ingresa un nombre"
                            // defaultValue={user.displayName}
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
              )}
              {activeStep === 1 && (
                // MAPA
                <DialogContent
                  sx={{
                    p: 1,
                    height: { xs: "450px", sm: "400px" },
                    width: "100%",
                  }}
                  dividers
                  className="flex flex-col gap-8"
                >
                  <Places
                    userAddress={user?.address}
                    onLocationChange={handleLocationChange}
                    searchQuery={searchQuery}
                  />
                </DialogContent>
              )}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                ATRÁS
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />

              <Button
                sx={{ border: "1px solid #789360" }}
                onClick={() => {
                  if (activeStep === steps.length - 1) {
                    handleSubmitLocation();
                  } else {
                    handleSubmitStep1();
                  }
                }}
              >
                {activeStep === steps.length - 1
                  ? "AGREGAR DIRECCIÓN"
                  : "SIGUIENTE"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Dialog>
  );
}
