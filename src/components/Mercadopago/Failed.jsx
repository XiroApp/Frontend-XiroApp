import React from "react";
import Navbar from "../Navbar/Navbar";
import ErrorIcon from "@mui/icons-material/Error";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Failed({ loggedUser }) {
  const navigate = useNavigate();

  function handleButton() {
    navigate("/");
  }
  return (
    <div className={"h-screen w-screen flex flex-col items-center"}>
      <Navbar title="Compra fallida" loggedUser={loggedUser} />

      <section className="w-full h-full flex flex-col items-center justify-center">
        <ErrorIcon
          className="text-red-500"
          sx={{ height: "5rem", width: "5rem" }}
        />
        <span className="text-[25px] font-[500]">
          Ha ocurrido un error con tu pago.
        </span>
        <span className="text-[20px] font-[500] opacity-70">
          Verifica tu método de pago e intenta nuevamente.
        </span>
        <Button onClick={(e) => handleButton()}>Continuar</Button>
      </section>
    </div>
  );
}
