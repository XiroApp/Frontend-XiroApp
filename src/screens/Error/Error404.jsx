import React from "react";
import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="mt-56 flex  flex-col justify-center items-center">
      <span>Upps página no encontrada</span>

      <Link to={"/login"}>
        <button className="bg-gray-500 p-5 m-5 rounded-xl">Ir al inicio</button>
      </Link>
    </div>
  );
}
