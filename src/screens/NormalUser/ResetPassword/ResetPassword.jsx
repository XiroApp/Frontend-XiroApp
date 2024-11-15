import React, { useState } from "react";

import { Button, Input } from "@mui/material";
import { useAuth } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../../utils/inputValidator";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { sendPasswordResetEmailService } = useAuth();
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    let continueReset = true;

    if (validateEmail(input)) {
      continueReset = true;
      setError(false);
      sendPasswordResetEmailService(input);
      navigate("/reset-success");
    } else {
      continueReset = false;
      setError(true);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-24">
      <div className="flex flex-col items-center justify-center h-1/2 bg-[#1e1e1e] p-10 lg:px-24 gap-10  rounded-lg">
        <h1 className="text-3xl">¿Has olvidado tu contraseña?</h1>
        <p className=" text-center">
          No te preocupes! Te enviaremos un correo electrónico con un link para
          que puedas recuperar tu contraseña.
        </p>
        <div className="w-full">
          <Input
            // error={error.number}
            name="email"
            type="email"
            error={error}
            inputProps={{ maxLength: 50 }}
            placeholder="Ingresa tu mail aquí..."
            // defaultValue={user.displayName}
            onChange={(e) => setInput(e.target.value)}
            className="w-full"
          />
          {error && (
            <span className="text-red-500 text-sm">
              Formato de correo electrónico no válido.
            </span>
          )}
        </div>
        <Button variant="contained" onClick={handleSubmit} disabled={!input}>
          Enviar email de recuperación
        </Button>
      </div>
    </div>
  );
}
