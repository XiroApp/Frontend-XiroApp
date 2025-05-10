import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import useLoad from "../../utils/hooks/useLoad.js";
import { Link } from "react-router-dom";

export default function TyC() {
  const [html, setHtml] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoad();

  useEffect(() => {
    startLoading();
    getTyC()
      .then(data => setHtml(data))
      .catch(err => {
        console.error(`catch 'getTyC' ${err.message}`);
        setHtml(
          "<p className='text-2xl py-16 w-full text-center'>Ocurrió un error cargando los Términos y Condiciones</p>"
        );
      })
      .finally(() => stopLoading());
  }, []);

  return (
    <section className="w-full justify-center items-center flex flex-col">
      {isLoading ? (
        <p className="text-2xl py-16 w-full text-center bg-white">
          Cargando...
        </p>
      ) : (
        <>
          <Link
            to="/"
            className="w-full text-2xl underline pt-10 text-center bg-white max-w-[900px]"
          >
            Volver
          </Link>
          <div
            className="bg-gray-50 text-gray-800 w-full max-w-[900px] py-20 px-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <Link
            to="/"
            className="w-full text-2xl underline pb-10 text-center bg-white max-w-[900px]"
          >
            Volver
          </Link>
        </>
      )}
    </section>
  );
}

async function getTyC() {
  const query = await getDocs(collection(db, "tyc"));
  const data = query.docs.at(0).data();
  return data.html;
}
