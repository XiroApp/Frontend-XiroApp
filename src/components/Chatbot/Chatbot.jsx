import { WhatsApp as WhatsAppIcon } from "@mui/icons-material";

export default function Chatbot() {
  return (
    <a
      rel="noreferrer"
      target="_blank"
      href="https://wa.me/5492616362351?text=Hola, deseo comunicarme con el soporte de XIRO..."
      className="fixed z-30 bottom-6 right-8 transition-colors hover:bg-green-500 bg-green-400 rounded-full p-2 border-2 border-green-500 outline-none"
    >
      <WhatsAppIcon
        sx={{
          color: "#fff",
          borderRadius: "100%",
          height: "2.3em",
          width: "2.3em",
        }}
      />
    </a>
  );
}
