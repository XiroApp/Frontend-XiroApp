import { useEffect } from "react";
import { InAppTextsAdapter } from "../../../Adapters/inAppTexts.adapter";
import { useState } from "react";
import TinyTextEditor from "../../../components/TextEditor/TinyTextEditor";
// import parse from "html-react-parser";

export default function TyCEditContent() {
  const [html, setHtml] = useState("");
  const [load, setLoad] = useState(false);

  useEffect(() => {
    (async function () {
      setLoad(true);
      InAppTextsAdapter.getTyCLabel()
        .then(data => setHtml(data))
        .finally(() => setLoad(false));
    })();
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
    <section className="w-ful flex justify-center items-center relative">
      <button
        onClick={saveData}
        type="button"
        className="absolute top-8 right-10 transition-colors hover:bg-green-400/80 hover:border-green-400/95 bg-green-400/95 text-2xl px-6 py-2 rounded-lg border-2 border-green-500"
      >
        Guardar
      </button>
      {load ? (
        <p className="text-2xl w-full text-center min-h-[250px] flex justify-center items-start pt-10">
          Cargando...
        </p>
      ) : (
        <div className="w-full max-w-3xl h-[500px] py-8">
          <TinyTextEditor
            initialValue={html}
            setValue={setHtml}
            disabled={load}
          />
        </div>
      )}
      {<div dangerouslySetInnerHTML={{ __html: html }} />}
    </section>
  );
}
