import Navbar from "../Navbar/Navbar";
import ErrorIcon from "@mui/icons-material/Error";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import BackgroundHueso from "../BackgroundHueso";

export default function Failure({ loggedUser }) {
  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center relative">
      <Navbar title="Compra Fallida" loggedUser={loggedUser} />
      <BackgroundHueso />
      <section className="mt-20 rounded-xl scale-95 bg-slate-50 w-full max-w-xl h-full max-h-[380px] flex flex-col items-center justify-center">
        <ErrorIcon
          className="text-red-500"
          sx={{ height: "5rem", width: "5rem" }}
        />
        <span className="text-4xl font-[500] w-full text-center text-balance mt-2">
          Ocurrió un error con tu compra
        </span>
        <p className="text-xl text-center w-full max-w-lg font-[500] opacity-90 mt-4">
          Verifica tu método de pago o intenta nuevamente. Si sigues teniendo
          problemas contactanos:
          <br /> +54 9 261 636-2351
        </p>

        <Link
          to="/"
          className="text-2xl text-white bg-green-700 border border-green-950/40 duration-75 hover:bg-green-700/80 px-8 py-2.5 rounded-lg mt-10"
        >
          Volver al Inicio
        </Link>
      </section>
    </div>
  );
}

Failure.propTypes = {
  loggedUser: propTypes.object,
};
