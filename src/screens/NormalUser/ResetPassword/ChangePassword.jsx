import React, { useState } from "react";
import { Button, IconButton, Input, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../../../utils/inputValidator";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { sendMail, setToast } from "../../../redux/actions";

export default function ResetPassword() {
  const querystring = window.location.search;
  const params = new URLSearchParams(querystring);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    newPassword: "",
    oobCode: params.get("oobCode"),
    mail: params.get("email"),
    subject: "LIMO: Contraseña restablecida",
    text: "Tu contraseña de Limo se reestableció correctamente, puedes dirigirte a <a href='https://limoapp.com.ar' target:'_blank'>limoapp.com.ar</a> para continuar navegando.",
  });
  const [error, setError] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    let continueReset = true;

    if (validatePassword(input.newPassword)) {
      continueReset = true;
      setError(false);

      if (input.oobCode) {
        confirmPasswordReset(auth, input.oobCode, input.newPassword)
          .then((res) => {
          
            dispatch(
              setToast("La contraseña se restableció con éxito.", "success")
            );
            dispatch(sendMail(params.get("email"), input.subject, input.text));
          })
          .then(navigate("/login"))
          .catch((err) => {
            console.log(err);
            return alert(
              "Código de reestablecimiento expirado, debes solicitar un nuevo email de reestablecimiento de contraseña para tu usuario LIMO. "
            );
          });

        // navigate("/login");
      } else {
        alert(
          "A ourrido un error inesperado, debes solicitar un nuevo email de reestablecimiento de contraseña para tu usuario LIMO."
        );
      }
    } else {
      continueReset = false;
      setError(true);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-24">
      <div className="flex flex-col items-center justify-center h-1/2 bg-[#1e1e1e] p-10 lg:px-24 gap-10  rounded-lg">
        <h1 className="text-3xl">Reestablecé tu contraseña</h1>
        <p className=" text-center">Debes indicar tu nueva contraseña</p>
        <div className="w-full">
          <Input
            onChange={(e) => handleInput(e)}
            name="newPassword"
            error={error}
            inputProps={{ maxLength: 50 }}
            placeholder="Ingresa tu nueva contraseña aquí..."
            type={showPassword ? "text" : "password"}
            className="w-full"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  color={error ? "error" : "standard"}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {error ? (
            <span className="text-[12px] text-red-500 font-bold">
              La contraseña debe contener 6 caracteres o más.
            </span>
          ) : (
            false
          )}
        </div>
        <Button variant="contained" onClick={handleSubmit} disabled={!input}>
          Aceptar
        </Button>
      </div>
    </div>
  );
}
