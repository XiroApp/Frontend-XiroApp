import "../Login/Login.css";
import { React } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";

export default function ResetSuccess() {
  3;
  const navigate = useNavigate();
  function handleClick(e) {
    navigate("/login");
  }
  return (
    <div className="flex flex-row h-full pb-5">
      <section
        id="svg-container"
        className="hidden md:hidden lg:flex   h-screen w-1/2  pl-16   "
      >
        {/* BACKGROUND CONTAINER */}
      </section>

      {/* ------------------------------------------------------------------------------------------------------------------------------------------ */}
      <section className="w-screen lg:w-1/2 flex flex-col justify-center items-center lg:gap-4 lg:pr-32">
        <div className="flex flex-col items-center lg:gap-4 gap-2 ">
          <CheckCircleIcon
            color="success"
            sx={{ height: "4rem", width: "4rem" }}
          />
          <span className="text-xl lg:text-3xl">
            Revisa tu bandeja de entrada
          </span>
          <div className="w-2/3 flex justify-center items-center">
            <span className="text-md text-center font-light opacity-90">
              Te hemos enviado un correo electrónico con los pasos a seguir para
              que puedas recuperar el accesso a tu cuenta.
            </span>
          </div>

          <Button variant="contained" onClick={(e) => handleClick(e)}>
            Iniciar Sesión
          </Button>
        </div>
      </section>
    </div>
  );
}
