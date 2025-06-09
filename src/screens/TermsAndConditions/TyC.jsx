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
    <section
      style={{ fontFamily: "Arial" }}
      className="w-full justify-center items-center flex flex-col bg-gray-50 text-black"
    >
      {isLoading ? (
        <p className="text-2xl py-16 w-full text-center">Cargando...</p>
      ) : (
        <>
          <GoToHome />
          <h3 className="text-2xl font-semibold md:text-3xl w-full max-w-[900px] text-start px-10 py-10 bg-gray-100">
            Términos y Condiciones de XIRO APP
          </h3>
          <div
            className="w-full max-w-[900px] px-10 text-lg bg-gray-100"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <GoToHome />
        </>
      )}
    </section>
  );
}

const GoToHome = () => (
  <div className="w-full justify-center items-center flex my-10">
    <Link
      to="/"
      className="text-green-800 w-max text-2xl lg:text-3xl underline text-center bg-transparent"
    >
      Volver a XIRO
    </Link>
  </div>
);

async function getTyC() {
  const query = await getDocs(collection(db, "tyc"));
  const data = query.docs.at(0).data();
  return data.html;
}
