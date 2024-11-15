import React from "react";
import Navbar from "../Navbar/Navbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Success({ loggedUser }) {
  const navigate = useNavigate();

  function handleButton() {
    navigate("/");
  }

  return (
    <div className={"h-screen w-screen flex flex-col items-center"}>
      <Navbar title="Compra exitosa" loggedUser={loggedUser} />

      <section className="w-full h-full flex flex-col items-center justify-center">
        <CheckCircleIcon
          className="text-green-500"
          sx={{ height: "5rem", width: "5rem" }}
        />
        <span className="text-[25px] font-[500]">¡Felicitaciones!</span>
        <span className="text-[20px] font-[500] opacity-70">
          Tu pago fue realizado correctamente
        </span>
        <Button onClick={(e) => handleButton()}>Continuar</Button>
      </section>
    </div>
  );
}
