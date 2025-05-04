import { useEffect, useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import { setLibraryCart, setToast } from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatPrice, len, normalizeStr } from "../../../Common/helpers";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../../../config/firebase";

export default function LibraryStore() {
  const dispatch = useDispatch(),
    [products, setProducts] = useState([]),
    [loading, setLoading] = useState(false),
    [searchTerm, setSearchTerm] = useState(""),
    [quantities, setQuantities] = useState({}),
    filteredProducts = searchProducts(),
    productsCart = useSelector((state) => state.libraryCart || []),
    inCart = (prodId) => productsCart.some((p) => p.id == prodId);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((newProducts) => setProducts(newProducts))
      .finally(() => setLoading(false));
  }, []);

  function addProduct(prod) {
    const quantity = quantities[prod.id] || 1;
    const productWithQuantity = { ...prod, quantity };
    const updatedCart = [...productsCart, productWithQuantity];

    dispatch(setToast("Producto agregado al carrito", "success"));
    dispatch(setLibraryCart(updatedCart));
  }

  function searchProducts() {
    return searchTerm.trim() == ""
      ? products
      : products.filter((p) =>
          normalizeStr(p.name).includes(normalizeStr(searchTerm))
        );
  }

  function handleQuantity(prodId, val) {
    setQuantities((prev) => ({
      ...prev,
      [prodId]: Math.min(Math.max(1, val), 10),
    }));
  }

  return (
    <section className="w-full bg-white flex justify-start items-start rounded-2xl h-screen flex-col relative h-[82vh]">
      <div className="sticky rounded-2xl top-0 left-0 right-0 bg-white z-20 px-4 sm:px-8 py-4 border-b w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-8">
          <p className="text-3xl sm:text-4xl font-semibold text-slate-850 pl-2">
            Librería
          </p>
          <div className="flex jusify-center items-center gap-x-4">
            <Link
              to="/imprimir"
              className="text-lg font-semibold text-slate-800 bg-green-300 hover:bg-green-400 duration-75 h-12 border border-green-400 rounded-lg px-4 py-2"
            >
              Ir a Imprimir
            </Link>
            <div className="relative flex items-center justify-start">
              <SearchIcon className="absolute top-3 left-2.5 opacity-80 pointer-events-none" />
              <input
                autoFocus
                type="search"
                placeholder="Busca productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[280px] px-4 py-2 rounded-lg border-[1.5px] pl-10 bg-slate-200/90 placeholder:text-slate-600 border-green-400 focus:outline-none h-12"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 overflow-y-auto px-4 sm:px-8 py-4">
        {loading ? (
          <p className="w-full text-center p-2 text-lg">Cargando...</p>
        ) : (
          <ul className="w-full flex flex-wrap justify-start items-start gap-6">
            {len(filteredProducts) > 0 &&
              filteredProducts.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between flex-col items-center bg-[#fef9e9] p-2 rounded-xl border border-black w-[280px]  h-[340px] transition-all"
                >
                  <header className="w-full h-40 mb-3">
                    <img
                      src={p.cover}
                      alt={p.name}
                      className="w-full h-full object-cover rounded-md border-[0.1px] border-black"
                    />
                  </header>

                  <div className="flex flex-col items-center justify-between flex-grow px-2 w-full">
                    <p className="text-xl font-semibold text-green-900 w-full text-center line-clamp-2">
                      {p.name}
                    </p>
                    <p className="text-sm text-black w-full text-center line-clamp-2">
                      {p.description}
                    </p>
                    <span className="w-full text-center font-medium text-lg text-black">
                      ${formatPrice(p.price)}
                    </span>
                    <div className="flex items-end gap-2 w-full justify-between">
                      {p.visible && (
                        <div className="flex items-center gap-y-0.5 flex-col">
                          <label
                            title="Cantidad"
                            htmlFor={`quantity-${p.id}`}
                            className="text-sm text-[#303f23] whitespace-nowrap"
                          >
                            Cantidad
                          </label>
                          <input
                            disabled={inCart(p.id)}
                            id={`quantity-${p.id}`}
                            type="number"
                            min={1}
                            max={10}
                            value={quantities[p.id] || 1}
                            onChange={(e) =>
                              handleQuantity(p.id, parseInt(e.target.value))
                            }
                            className="w-[50px] p-1 text-center rounded border border-green-400 focus:outline-none focus:border-green-600"
                          />
                        </div>
                      )}

                      {p.visible ? (
                        inCart(p.id) ? (
                          <Link
                            to="/carrito"
                            className="bg-[#E3F9D6] brightness-110 hover:bg-[#d6ffbc] hover:border-[#d6ffbc] text-slate-900 font-medium py-2 rounded-lg transition-colors w-full border border-green-400/80 text-center text-sm sm:text-base"
                          >
                            En el Carrito
                          </Link>
                        ) : (
                          <button
                            className="bg-green-600 hover:bg-green-700 brightness-110 text-white font-medium py-2 rounded-lg transition-colors w-full text-center text-sm sm:text-base"
                            onClick={() => addProduct(p)}
                          >
                            Agregar al Carrito
                          </button>
                        )
                      ) : (
                        <div className="bg-red-600/70 brightness-110 text-white font-medium py-2 rounded-lg w-full text-center text-sm sm:text-base">
                          Agotado
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            {len(filteredProducts) == 0 && len(searchTerm) > 0 && (
              <p className="w-full text-center p-2 text-lg col-span-full">
                Sin coincidencias...
              </p>
            )}
          </ul>
        )}
      </div>
    </section>
  );
}

async function getProducts() {
  const PRODUCTS_TABLE = collection(db, "products");

  try {
    const query = await getDocs(PRODUCTS_TABLE);
    const data = query.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (err) {
    console.error(`catch 'getProducts' ${err.message}`);
    return [];
  }
}
