import Navbar from "../Navbar/Navbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import propTypes from "prop-types";
import { Link } from "react-router-dom";

Success.propTypes = {
  loggedUser: propTypes.object,
};

export default function Success({ loggedUser }) {
  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center">
      <Navbar title="Compra exitosa" loggedUser={loggedUser} />

      <section className="mt-20 rounded-xl bg-slate-50 w-full max-w-xl h-full max-h-[350px] flex flex-col items-center justify-center gap-y-3">
        <CheckCircleIcon
          className="text-green-500"
          sx={{ height: "5rem", width: "5rem" }}
        />
        <span className="text-3xl font-[500] w-full text-center">
          ¡Compra exitosa!
        </span>
        <span className="text-xl text-center w-full font-[500] opacity-85 mt-1">
          Te enviaremos un email con los detalles de tu pedido a
          <br />
          <address className="pt-1 font-[500]" style={{ fontFamily: "Arial" }}>
            {loggedUser?.email ?? ""}
          </address>
        </span>
        <Link
          to="/"
          className="text-xl text-green-900 bg-green-300/50 duration-75 hover:bg-green-300/90 px-6 py-2 rounded-lg mt-4"
        >
          Aceptar
        </Link>
      </section>
    </div>
  );
}
