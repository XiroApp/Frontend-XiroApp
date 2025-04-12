import { useState } from "react";
import "react-phone-number-input/style.css";
import { countries } from "../../../utils/data/countriesAreaCodes";
import {
  Autocomplete,
  Box,
  Button,
  Input,
  Modal,
  TextField,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../redux/actions";
import { updateUserValidator } from "../../../utils/inputValidator";
import propTypes from "prop-types";
import { twMerge } from "tailwind-merge";

export default function PersonalData({ user }) {
  const currentDate = new Date();
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(currentDate.getFullYear() - 18);

  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(currentDate.getFullYear() - 100);

  const fecha100AtrasFormato =
    hundredYearsAgo.getFullYear() +
    "-" +
    (hundredYearsAgo.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    hundredYearsAgo.getDate().toString().padStart(2, "0");

  const fecha18AtrasFormato =
    eighteenYearsAgo.getFullYear() +
    "-" +
    (eighteenYearsAgo.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    eighteenYearsAgo.getDate().toString().padStart(2, "0");

  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [input, setInput] = useState({ ...user });
  const [error, setError] = useState(false);

  const handleInput = e =>
    setInput({ ...input, [e.target.name]: e.target.value });
  const handleCountry = e => setInput({ ...input, areaCode: e.target.value });
  const handleGender = e => setInput({ ...input, gender: e.target.name });

  function handleCloseModal(e) {
    e.preventDefault();
    setOpenModal(!openModal);
  }

  async function saveChanges(e) {
    e.preventDefault();

    let results = updateUserValidator(
      input.displayName,
      input.phone,
      input.bio,
      input.birthdate
    );

    setError(results.error);

    const continueRegister = results.allowUpdate;

    if (continueRegister) {
      dispatch(updateUser(input, false)).then(() => setOpenModal(!openModal));
    }
  }

  return (
    <section className="personal-data bg-[#fff] rounded-2xl lg:h-2/3 p-6 w-full">
      <p className="text-2xl opacity-80 mb-5">Datos personales</p>

      <form
        className="grid grid-cols-1 lg:grid-cols-2 gap-5   w-full max-w-[700px]"
        onSubmit={saveChanges}
      >
        <div className="col-span-full">
          <label htmlFor="displayName" className="text-[12px] block">
            NOMBRE Y APELLIDO
          </label>
          <Input
            id="displayName"
            error={error.displayName}
            name="displayName"
            defaultValue={user.displayName}
            inputProps={{ max: 99999, min: 0, maxLength: 50 }}
            onChange={handleInput}
            fullWidth
          />
          {error.displayName && (
            <span className="text-[12px] text-red-500 font-bold">
              Formato de nombre inválido.
            </span>
          )}
        </div>

        <fieldset className="lg:col-span-1">
          <legend className="text-[12px]">PAÍS</legend>
          <Autocomplete
            name="areaCode"
            id="areaCode"
            sx={{ width: "100%" }}
            options={countries}
            onChange={handleCountry}
            getOptionLabel={option =>
              option
                ? `${option.label} (${option.code}) +${option.phone}`
                : [countries.find(opt => opt.phone == input.areaCode)]?.map(
                    option =>
                      `${option.label} (${option.code}) +${option.phone}`
                  )[0]
            }
            renderOption={(props, option) => {
              // eslint-disable-next-line
              const { key, ...optionProps } = props;

              return (
                <Box
                  name="areaCode"
                  value={option.phone}
                  key={key}
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...optionProps}
                >
                  <img
                    loading="lazy"
                    width="20"
                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    alt={`Bandera de ${option.label}`}
                  />
                  {option.label} ({option.code}) +{option.phone}
                </Box>
              );
            }}
            renderInput={params => (
              <TextField
                sx={{
                  input: {
                    "&::placeholder": {
                      opacity: 1,
                    },
                  },
                }}
                id="customPlaceholder"
                variant="standard"
                {...params}
                placeholder={
                  input.areaCode
                    ? [countries.find(opt => opt.phone == input.areaCode)]?.map(
                        option =>
                          `${option.label} (${option.code}) +${option.phone}`
                      )[0]
                    : "Selecciona un código de area..."
                }
                slotProps={{
                  htmlInput: { ...params.inputProps, autoComplete: "areaCode" },
                }}
              />
            )}
          />
        </fieldset>

        <div className="lg:col-span-1">
          <label htmlFor="phone" className="text-[12px] block">
            NÚMERO DE CELULAR (sin 0 ni 15)
          </label>
          <Input
            id="phone"
            error={error.phone}
            name="phone"
            type="number"
            defaultValue={user.phone}
            inputProps={{ maxLength: 20 }}
            placeholder="Ej: 261 523 4567"
            onChange={handleInput}
            fullWidth
          />
          {error.phone && (
            <span className="text-[12px] text-red-500 font-bold">
              Formato de teléfono inválido.
            </span>
          )}
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="birthdate" className="text-[12px] block">
            FECHA DE NACIMIENTO
          </label>
          <input
            id="birthdate"
            name="birthdate"
            max={fecha18AtrasFormato}
            min={fecha100AtrasFormato}
            defaultValue={user.birthdate}
            type="date"
            onChange={handleInput}
            className={twMerge(
              error.birthdate ? " border-red-500" : " border-gray-400",
              "bg-transparent border-b pt-1 w-full outline-none"
            )}
          />
          {error.birthdate && (
            <span className="text-[12px] text-red-500 font-bold">
              Fecha de nacimiento inválida. Debes ser mayor de 18
            </span>
          )}
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="instagram" className="text-[12px] block">
            INSTAGRAM (opcional)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              @
            </span>
            <input
              id="instagram"
              name="instagram"
              defaultValue={user?.instagram}
              type="text"
              maxLength={40}
              onChange={handleInput}
              className={twMerge(
                error.instagram ? "border-red-500" : "border-gray-400",
                "bg-transparent border-b pt-1 w-full outline-none"
              )}
            />
          </div>
          {error.birthdate && (
            <span className="text-[12px] text-red-500 font-bold">
              Error al guardar
            </span>
          )}
        </div>

        <fieldset className="col-span-full">
          <legend className="text-[12px] mb-2">GÉNERO</legend>
          <div
            className="flex w-full flex-wrap gap-3 items-center justify-start"
            role="radiogroup"
          >
            <button
              type="button"
              name="Femenino"
              className={twMerge(
                input.gender == "Femenino"
                  ? "bg-[#94b477]"
                  : "bg-[#94b477]/50 hover:bg-[#94b477]",
                "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 text-sm"
              )}
              onClick={handleGender}
              role="radio"
              aria-checked={input.gender == "Femenino"}
            >
              Femenino
            </button>
            <button
              type="button"
              name="Masculino"
              className={twMerge(
                input.gender == "Masculino"
                  ? "bg-[#94b477]"
                  : "bg-[#94b477]/50 hover:bg-[#94b477]",
                "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 text-sm"
              )}
              onClick={handleGender}
              role="radio"
              aria-checked={input.gender == "Masculino"}
            >
              Masculino
            </button>
            <button
              type="button"
              name="No binario"
              className={twMerge(
                input.gender == "No binario"
                  ? "bg-[#94b477]"
                  : "bg-[#94b477]/50 hover:bg-[#94b477]",
                "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 text-sm"
              )}
              onClick={handleGender}
              role="radio"
              aria-checked={input.gender == "No binario"}
            >
              No binario
            </button>
            <button
              type="button"
              name="Prefiero no decirlo"
              className={twMerge(
                input.gender === null || input.gender == "Prefiero no decirlo"
                  ? "bg-[#94b477]"
                  : "bg-[#94b477]/50 hover:bg-[#94b477]",
                "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 text-sm"
              )}
              onClick={handleGender}
              role="radio"
              aria-checked={
                input.gender === null || input.gender == "Prefiero no decirlo"
              }
            >
              Prefiero no decirlo
            </button>
          </div>
        </fieldset>

        <div className="col-span-full flex items-center w-full justify-end">
          <Button
            type="submit"
            onClick={saveChanges}
            className="w-full lg:w-44"
            variant="contained"
            color="primary"
          >
            Guardar
          </Button>
        </div>
      </form>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <CheckCircle
            color="success"
            sx={{ height: "4rem", width: "4rem" }}
            aria-hidden="true"
          />
          <p id="modal-modal-title" className="text-center">
            ¡Los cambios se han guardado con éxito!
          </p>
          <div className="flex">
            <Button onClick={handleCloseModal}>Aceptar</Button>
          </div>
        </Box>
      </Modal>
    </section>
  );
}

PersonalData.propTypes = {
  user: propTypes.object,
};

const modalStyle = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2em",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "#fff",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};
