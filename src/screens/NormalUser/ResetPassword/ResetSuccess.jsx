import "../Login/Login.css";
import { React } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import amico from "../../../utils/assets/images/amico.svg";
import blueCircle from "../../../utils/assets/images/bg-blue-mobile.svg";
import Button from "@mui/material/Button";

export default function ResetSuccess() {
  3;
  const navigate = useNavigate();
  function handleClick(e) {
    navigate("/login");
  }
  return (
    <div className="bg-[#1e1e1e] flex flex-row h-full pb-5">
      <section
        id="svg-container"
        className="hidden md:hidden lg:flex   h-screen w-1/2  pl-16   "
      >
        {/* BACKGROUND CONTAINER */}
      </section>

      {/* ------------------------------------------------------------------------------------------------------------------------------------------ */}
      <section className="w-screen lg:w-1/2 flex flex-col justify-center items-center lg:gap-4 lg:pr-32">
        <section
          // id="svg-mobile-container"
          className="flex flex-col justify-start lg:hidden h-56 w-screen    "
        >
          {/* BACKGROUND CONTAINER */}
          <img
            src={blueCircle}
            alt="limo-logo"
            className="object-contain absolute top-[-5%] w-96 sm:hidden md:hidden"
          />
          <span className="absolute left-2 top-2 text-sm font-bold w-40">
            Hecho por estudiantes para estudiantes
          </span>
          <div className=" absolute w-screen top-12 flex justify-center">
            <img src={amico} alt="limo-logo" className="object-contain h-36 " />
          </div>
        </section>
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
