import React, { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Button, Input, Modal } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../redux/actions";
import { updateUserValidator } from "../../../utils/inputValidator";

export default function PersonalData({ user }) {
  // Obtener la fecha actual
  const fechaActual = new Date();

  // Calcular la fecha límite para ser mayor de 18 años
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(fechaActual.getFullYear() - 18);
  // Calcular la fecha límite para ser menor de 100 años
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(fechaActual.getFullYear() - 100);

  // Formatear la fecha 100 atras al formato YYYY-MM-DD
  const fecha100AtrasFormato =
    hundredYearsAgo.getFullYear() +
    "-" +
    (hundredYearsAgo.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    hundredYearsAgo.getDate().toString().padStart(2, "0");
  // Formatear la fecha 18 atras al formato YYYY-MM-DD
  const fecha18AtrasFormato =
    eighteenYearsAgo.getFullYear() +
    "-" +
    (eighteenYearsAgo.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    eighteenYearsAgo.getDate().toString().padStart(2, "0");

  // Formatear la fecha actual al formato YYYY-MM-DD
  const fechaActualFormato =
    fechaActual.getFullYear() +
    "-" +
    (fechaActual.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    fechaActual.getDate().toString().padStart(2, "0");

  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [input, setInput] = useState({ ...user });
  const [error, setError] = useState(false);

  function handleCloseModal() {
    setOpenModal(!openModal);
  }
  async function handleSaveChanges(e) {
    e.preventDefault();
    let results = updateUserValidator(
      input.displayName,
      input.phone,
      input.bio,
      input.birthdate
    );

    setError(results.error);

    let continueRegister = results.allowUpdate;

    if (continueRegister) {
      dispatch(updateUser(input)).then(setOpenModal(!openModal));
    }
  }
  function handleInput(e) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }
  function handleGender(e) {
    setInput({ ...input, gender: e.target.name });
  }

  return (
    <div className="flex flex-col bg-[#fff] rounded-2xl lg:h-2/3 p-6 gap-5">
      <span className="text-2xl opacity-80">Datos personales</span>

      <div className="flex flex-col w-full">
        <span className="text-[12px]">NOMBRE(S)</span>
        <Input
          error={error.displayName}
          name="displayName"
          defaultValue={user.displayName}
          inputProps={{ max: 99999, min: 0, maxLength: 50 }}
          onChange={(e) => handleInput(e)}
        />
        {error.displayName ? (
          <span className="text-[12px] text-red-500 font-bold">
            Formato de nombre inválido.
          </span>
        ) : (
          false
        )}
      </div>
      <div className="flex gap-5 lg:w-full">
        <section className="flex flex-col w-24">
          <span className="text-[12px]">CÓDIGO</span>
          <Input
            name="areaCode"
            type="number"
            placeholder={"549"}
            inputProps={{ max: 99999, min: 999, maxLength: 4 }}
            defaultValue={user.areaCode}
            onChange={(e) => handleInput(e)}
          />
        </section>
        <section className="flex flex-col w-full">
          <span className="text-[12px]">NUMERO DE CELULAR</span>
          <Input
            error={error.phone}
            name="phone"
            type="number"
            defaultValue={user.phone}
            inputProps={{ maxLength: 15 }}
            placeholder="123 456 7891"
            onChange={(e) => handleInput(e)}
          />
          {error.phone ? (
            <span className="text-[12px] text-red-500 font-bold">
              Formato de teléfono inválido.
            </span>
          ) : (
            false
          )}
        </section>
      </div>
      <div className="flex flex-col  lg:flex-row gap-8 lg:flex  lg:gap-5 ">
        <div className="flex flex-col lg:w-full">
          <span className="text-[12px]">FECHA DE NACIMIENTO</span>
          <input
            name="birthdate"
            max={fecha18AtrasFormato}
            min={fecha100AtrasFormato}
            defaultValue={user.birthdate}
            type="date"
            onChange={(e) => handleInput(e)}
            className= {error.birthdate ?"bg-transparent border-b border-red-500 pt-1" :"bg-transparent border-b border-gray-400 pt-1"}
          />
          {error.birthdate ? (
            <span className="text-[12px] text-red-500 font-bold">
              Fecha de nacimiento inválida. Debes ser mayor de 18
            </span>
          ) : (
            false
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-[12px]">¿A QUÉ TE DEDICAS? (OPCIONAL)</span>
        <Input
          error={error.bio}
          name="bio"
          defaultValue={user.bio}
          inputProps={{ maxLength: 200 }}
          placeholder="Nos encantaría saber mas de tí..."
          onChange={(e) => handleInput(e)}
        />
        {error.bio ? (
          <span className="text-[12px] text-red-500 font-bold">
            La descripción solo puede contener hasta 200 caracteres.
          </span>
        ) : (
          false
        )}
      </div>
      <div className="flex flex-col  gap-2">
        <span className="text-[12px]">¿CON QUÉ GÉNERO TE IDENTIFICAS?</span>
        <div className="flex flex-wrap gap-5">
          <button
            name="Femenino"
            className={
              input.gender === "Femenino"
                ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#94b477] text-sm"
                : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-[#94b477]/50 hover:bg-[#94b477] text-sm"
            }
            onClick={(e) => handleGender(e)}
          >
            Femenino
          </button>
          <button
            name="Masculino"
            className={
              input.gender === "Masculino"
                ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#94b477] text-sm"
                : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-[#94b477]/50 hover:bg-[#94b477] text-sm"
            }
            onClick={(e) => handleGender(e)}
          >
            Masculino
          </button>
          <button
            name="No binario"
            className={
              input.gender === "No binario"
                ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#94b477] text-sm"
                : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-[#94b477]/50 hover:bg-[#94b477] text-sm"
            }
            onClick={(e) => handleGender(e)}
          >
            No binario
          </button>
          <button
            name="Prefiero no decirlo"
            className={
              input.gender === null || input.gender === "Prefiero no decirlo"
                ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#94b477] text-sm"
                : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1  bg-[#94b477]/50 hover:bg-[#94b477] text-sm"
            }
            onClick={(e) => handleGender(e)}
          >
            Prefiero no decirlo
          </button>
        </div>
      </div>
      <div className="flex lg:justify-end lg:mr-12">
        <Button
          onClick={(e) => handleSaveChanges(e)}
          className="w-full lg:w-44"
          variant="contained"
          color="primary"
        >
          Guardar
        </Button>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <CheckCircleIcon
              color="success"
              sx={{ height: "4rem", width: "4rem" }}
            />
            <span className="text-center">
              ¡Los cambios se han guardado con éxito!
            </span>
            <div className="flex">
              <Button onClick={handleCloseModal}>Aceptar</Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
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
  // border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};
