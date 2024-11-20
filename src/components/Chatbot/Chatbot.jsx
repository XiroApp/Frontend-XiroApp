import { Button } from "@mui/material";
import React from "react";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { WhatsApp } from "@mui/icons-material";

export default function Chatbot() {
  return (
    <a
      target="_blank"
      href="https://wa.me/5492616362351?text=Hola, deseo comunicarme con el soporte de XIRO."
      className="fixed z-30 bottom-5 right-5"
    >
      <Button
        variant="contained"
        sx={{ borderRadius: "100%", height: "5em", width: "5em" }}
      >
        <WhatsApp
          sx={{ borderRadius: "100%", height: "1.6em", width: "1.6em" }}
        />
      </Button>
    </a>
  );
}
