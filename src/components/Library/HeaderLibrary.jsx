import { Search as SearchIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

HeaderLibrary.propTypes = {
  term: PropTypes.string.isRequired,
  setTerm: PropTypes.func.isRequired,
};

function HeaderLibrary({ term, setTerm }) {
  return (
    <div className="sticky rounded-t-2xl top-0 left-0 right-0 bg-white z-20 px-4 sm:px-8 py-4 border-b w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-8">
        <p className="text-3xl sm:text-4xl font-semibold text-slate-850 pl-2">
          Librería
        </p>
        <div className="flex jusify-center items-center gap-x-4">
          <Link
            to="/imprimir"
            className="text-sm sm:text-lg font-semibold text-slate-800 border-green-400 bg-green-300 hover:bg-green-400 duration-75 flex items-center justify-center h-12 border rounded-lg px-2 sm:px-4 py-2"
          >
            Ir a Imprimir
          </Link>
          <div className="relative flex items-center justify-start">
            <SearchIcon className="absolute top-3 left-2.5 opacity-80 pointer-events-none" />
            <input
              autoFocus
              type="search"
              placeholder="Busca productos..."
              value={term}
              onChange={e => setTerm(e.target.value)}
              className="w-full sm:w-[280px] px-4 py-2 rounded-lg border-[1.5px] pl-10 bg-slate-100/90 placeholder:text-slate-600 border-green-300 focus:outline-none h-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderLibrary;
