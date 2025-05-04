import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="mt-56 flex  flex-col justify-center items-center">
      <p className="text-4xl uppercase bg-green-200 px-6 py-3 rounded-lg">
        Página no encontrada
      </p>

      <Link
        className="mt-10 bg-green-400 hover:bg-green-300 transition-colors border-2 border-green-300 text-2xl px-6 py-4 rounded-lg "
        to="/login"
      >
        Ir al inicio
      </Link>
    </div>
  );
}
