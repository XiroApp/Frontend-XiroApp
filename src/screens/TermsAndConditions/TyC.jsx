import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import useLoad from "../../utils/hooks/useLoad.js";

export default function TyC() {
  const [html, setHtml] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoad();

  useEffect(() => {
    startLoading();
    getTyC()
      .then((data) => setHtml(data))
      .catch((err) => {
        console.error(err.message);
        setHtml(
          "<p className='text-2xl py-16 w-full text-center'>Ocurrió un error cargando los Términos y Condiciones</p>"
        );
      })
      .finally(() => stopLoading());
  }, []);

  return (
    <section className="w-full justify-center items-center flex">
      {isLoading ? (
        <p className="text-2xl py-16 w-full text-center bg-white">
          Cargando...
        </p>
      ) : (
        <div
          className="bg-gray-50 text-gray-800 w-full max-w-[900px] py-20 px-10"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </section>
  );
}

async function getTyC() {
  try {
    const query = await getDocs(collection(db, "tyc"));
    const data = query.docs.at(0).data();
    return data.html;
  } catch (err) {
    console.error(`catch 'getTyc' ${err.message}`);
    return;
  }
}
