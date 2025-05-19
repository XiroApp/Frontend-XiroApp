import propTypes from "prop-types";
import { Link } from "react-router-dom";

AlertProd.propTypes = {
  close: propTypes.func,
};

function AlertProd({ close }) {
  return (
    <div
      onClick={close}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        role="alert"
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
      >
        <p className="text-2xl font-semibold text-slate-800 mb-3">Aviso</p>
        <p className="text-slate-700 text-lg mb-5">
          Para quitar este producto, hazlo desde la sección del{" "}
          <Link
            to="/carrito"
            className="underline text-blue-700 hover:text-blue-600 font-semibold"
          >
            carrito
          </Link>
          .
        </p>
        <div className="flex justify-end">
          <button
            onClick={close}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors text-xl"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertProd;
