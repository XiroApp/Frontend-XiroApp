import Navbar from "../Navbar/Navbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import BackgroundHueso from "../BackgroundHueso";

export default function Success({ loggedUser }) {
  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center relative">
      <Navbar title="Compra Exitosa" loggedUser={loggedUser} />
      <BackgroundHueso />
      <section className="mt-20 rounded-xl scale-95 bg-slate-50 w-full max-w-xl h-full max-h-[380px] flex flex-col items-center justify-center">
        <CheckCircleIcon
          className="text-green-500"
          sx={{ height: "5rem", width: "5rem" }}
        />
        <span className="text-4xl font-[500] w-full text-center mt-2">
          ¡Compra Exitosa!
        </span>
        <p className="text-xl text-center w-full max-w-lg font-[500] opacity-90 mt-8">
          Puedes ver el estado de tu pedido en el historial,
          <br /> también te enviaremos un email con los detalles a
        </p>
        <address
          className="text-xl mb-6 mt-0.5 opacity-95"
          style={{ fontFamily: "Arial" }}
        >
          {loggedUser?.email ?? "@"}
        </address>
        <Link
          to="/?historial"
          className="text-2xl text-white bg-green-700 border border-green-950/40 duration-75 hover:bg-green-700/80 px-8 py-2.5 rounded-lg mt-4"
        >
          Ir al Historial
        </Link>
      </section>
    </div>
  );
}

Success.propTypes = {
  loggedUser: propTypes.object,
};
