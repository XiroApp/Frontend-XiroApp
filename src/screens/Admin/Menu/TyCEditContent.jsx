import { useEffect } from "react";
import { InAppTextsAdapter } from "../../../Infra/Adapters/inAppTexts.adapter";
import { useState } from "react";
import TinyTextEditor from "../../../components/TextEditor/TinyTextEditor";
import { Button, Typography } from "@mui/material";
// import parse from "html-react-parser";

export default function TyCEditContent() {
  const [html, setHtml] = useState("");
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    InAppTextsAdapter.getTyCLabel()
      .then((data) => setHtml(data.html))
      .finally(() => setLoad(false));
  }, []);

  async function saveData() {
    try {
      await InAppTextsAdapter.updateTyCLabel(html);
      alert("Contenido guardado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el contenido");
    }
  }

  return (
    <section className="w-full h-[80vh] flex flex-col justify-center p-4">
      <Typography variant="h3" className="pb-4">
        Términos y condiciones
      </Typography>
      <TinyTextEditor initialValue={html} setValue={setHtml} disabled={load} />

      <Button
        variant="contained"
        onClick={saveData}
        type="button"
        className="w-full"
      >
        Guardar
      </Button>
    </section>
  );
}
