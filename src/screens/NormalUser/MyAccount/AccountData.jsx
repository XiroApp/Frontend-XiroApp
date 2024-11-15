import React, { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Modal,
} from "@mui/material";
import { resetPassword } from "../../../config/firebase";
import { updatePasswordValidator } from "../../../utils/inputValidator";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function AccountData({ user }) {
  const [openModal, setOpenModal] = useState(false);
  const [input, setInput] = useState({
    email: user.email,
    currentPassword: "",
    newPassword: "",
    verifyNewPassword: "",
  });
  const [error, setError] = useState(false);
  const [firebaseError, setFirebaseError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const handleClickShowCurrentPassword = () =>
    setShowCurrentPassword((show) => !show);
  const handleMouseDownCurrentPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function handleCloseModal() {
    setOpenModal(!openModal);
  }
  async function handleSaveChanges(e) {
    e.preventDefault();

    let results = updatePasswordValidator(input);
    setError(results.error);
    setFirebaseError(false);

    let continueRegister = results.allowRegister;

    if (continueRegister) {
      let response = await resetPassword(
        input.email,
        input.currentPassword,
        input.newPassword
      );

      if (
        response === "Firebase: Error (auth/wrong-password)." ||
        response === "Firebase: Error (auth/user-mismatch)."
      ) {
        setFirebaseError("wrongPassword");
        return;
      } else {
        setOpenModal(!openModal);
        document.getElementById("passwordForm").reset();
        setInput({
          email: user.email,
          currentPassword: "",
          newPassword: "",
          verifyNewPassword: "",
        });
      }
    }
  }

  function handleInput(e) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  return (
    <div className="flex flex-col bg-[#fff] rounded-2xl lg:h-2/3 p-6 gap-4">
      <span className="text-3xl opacity-80">Datos de la cuenta</span>

      <div className="flex gap-8">
        <div className="flex flex-col">
          <span className="text-[12px] opacity-80">MAIL ACTUAL</span>
          <span>{user.email}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] opacity-80">FECHA DE CREACIÓN</span>
          <span>
            {user.createdAt.split("T")[0].split("-").reverse().join("-")}
          </span>
        </div>
      </div>
      {/* CAMBIAR CONTRASEÑA */}
      {user.providerData[0].providerId === "password" ? (
        <>
          <span className="text-2xl opacity-80">Cambiar contraseña</span>
          <form id="passwordForm" action="" className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span
                className={
                  error.currentPassword || firebaseError
                    ? "text-[12px] opacity-80 text-red-500"
                    : "text-[12px] opacity-80"
                }
              >
                CONTRASEÑA ACTUAL
              </span>
              <Input
                error={error.currentPassword || firebaseError}
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                inputProps={{ maxLength: 50 }}
                onChange={(e) => handleInput(e)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowCurrentPassword}
                      onMouseDown={handleMouseDownCurrentPassword}
                      color={error.currentPassword ? "error" : "standard"}
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {error.currentPassword ? (
                <span className="text-[12px] text-red-500">
                  Tu contraseña tiene menos de 6 caracteres.
                </span>
              ) : (
                false
              )}

              {firebaseError === "wrongPassword" ? (
                <span className="text-[12px] text-red-500">
                  Contraseña incorrecta.
                </span>
              ) : (
                false
              )}
            </div>

            <div className="flex flex-col">
              <span
                className={
                  error.newPassword
                    ? "text-[12px] opacity-80 text-red-500"
                    : "text-[12px] opacity-80"
                }
              >
                {" "}
                NUEVA CONTRASEÑA
              </span>
              <Input
                error={error.newPassword}
                type={showPassword ? "text" : "password"}
                name="newPassword"
                onChange={(e) => handleInput(e)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      color={error.newPassword ? "error" : "standard"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {error.newPassword ? (
                <span className="text-[12px] text-red-500">
                  La contraseña debe tener al menos 6 caracteres.
                </span>
              ) : (
                false
              )}
            </div>
            <div className="flex flex-col">
              <span
                className={
                  error.verifyNewPassword
                    ? "text-[12px] opacity-80 text-red-500"
                    : "text-[12px] opacity-80"
                }
              >
                CONFIRMAR CONTRASEÑA
              </span>
              <Input
                error={error.verifyNewPassword}
                type={showPassword ? "text" : "password"}
                name="verifyNewPassword"
                onChange={(e) => handleInput(e)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      color={error.verifyNewPassword ? "error" : "standard"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {error.verifyNewPassword ? (
                <span className="text-[12px] text-red-500">
                  Las contraseñas no coinciden.
                </span>
              ) : (
                false
              )}
            </div>
          </form>

          <div className="flex lg:justify-end">
            <Button
              onClick={(e) => handleSaveChanges(e)}
              className="w-full lg:w-32"
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
        </>
      ) : (
        false
      )}

      {/*  */}
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
  bgcolor: "#1e1e1e",
  // border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};
