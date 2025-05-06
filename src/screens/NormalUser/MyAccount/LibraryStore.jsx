import { useEffect, useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import { setLibraryCart, setToast } from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatPrice, len, normalizeStr } from "../../../Common/helpers";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../../../config/firebase";
import { twMerge } from "tailwind-merge";

export default function LibraryStore() {
  const dispatch = useDispatch(),
    userCart = useSelector(state => state.libraryCart),
    [products, setProducts] = useState([]),
    [loading, setLoading] = useState(false),
    [searchTerm, setSearchTerm] = useState(""),
    [quantities, setQuantities] = useState({}),
    [showModal, setShowModal] = useState(false),
    filteredProducts = searchProducts(),
    productsCart = useSelector(state => state.libraryCart || []),
    inCart = prodId => productsCart.some(p => p.id == prodId);

  useEffect(() => {
    console.log("🟢 CARRITO 🟢");
    console.log(userCart);
    console.log("--------------");
  }, [userCart]);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(newProducts => setProducts(newProducts))
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
      : products.filter(p =>
          normalizeStr(p.name).includes(normalizeStr(searchTerm))
        );
  }

  function handleQuantity(prodId, val) {

    const maxStock = 10;
    if (inCart(prodId)) return setShowModal(true);
    setQuantities(prev => ({
      ...prev,
      [prodId]: Math.min(Math.max(1, val), maxStock),
    }));
  }

  return (


    <section className="w-full bg-white flex justify-start items-start rounded-2xl flex-col relative">
      <div className="sticky rounded-t-2xl top-0 left-0 right-0 bg-white z-20 px-4 sm:px-8 py-4 border-b w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-8">
          <p className="text-3xl sm:text-4xl font-semibold text-slate-850 pl-2">
            Librería
          </p>
          <div className="flex jusify-center items-center gap-x-4">
            <Link
              to="/imprimir"
              className="text-sm sm:text-lg font-semibold text-slate-800 bg-green-300 hover:bg-green-400 duration-75 flex items-center justify-center h-12 border border-green-400 rounded-lg px-2 sm:px-4 py-2"
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
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full sm:w-[280px] px-4 py-2 rounded-lg border-[1.5px] pl-10 bg-slate-100/90 placeholder:text-slate-600 border-green-300 focus:outline-none h-12"
              />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            role="alert"
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
          >
            <p className="text-2xl font-semibold text-slate-800 mb-3">Aviso</p>
            <p className="text-slate-700 text-lg mb-5">
              Para modificar la cantidad o quitar productos, hazlo desde la
              página del{" "}
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
                onClick={() => setShowModal(false)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors text-xl"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex-1 px-4 sm:px-8 py-4 h-full min-h-[650px]">
        {loading ? (
          <p className="w-full text-center p-2 text-xl pt-4">
            Cargando productos...
          </p>
        ) : (
          <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 place-items-center">
            {len(filteredProducts) > 0 &&
              filteredProducts.map(p => (
                <li
                  key={p.id}
                  className="flex justify-between flex-col items-center bg-[#fef9e9] p-3 rounded-xl border border-black w-full max-w-[280px] h-[330px] relative"
                >
                  {!p.visible && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-full z-10">
                      Agotado
                    </div>
                  )}
                  {p.visible && inCart(p.id) && (
                    <Link
                      to="/carrito"
                      className="absolute top-2 right-2 bg-green-600 hover:bg-green-500 transition-colors text-white text-xs font-bold px-2.5 py-1.5 rounded-full z-10"
                    >
                      En Carrito
                    </Link>
                  )}
                  <header className="w-full h-32 mb-2 overflow-hidden rounded-md">
                    <img
                      src={p.cover}
                      alt={p.name}
                      className="w-full h-full object-cover rounded-md border-[0.1px] border-black"
                    />
                  </header>

                  <div className="flex flex-col items-center justify-between flex-grow w-full">
                    <div
                      title={p.name}
                      className="h-[60px] flex items-center justify-center w-full my-2"
                    >
                      <p
                        className={twMerge(
                          len(p.name) > 26 ? "text-lg" : "text-xl",
                          "font-semibold text-green-900 w-full text-center line-clamp-2"
                        )}
                      >
                        {p.name}
                      </p>
                    </div>

                    <span className="w-full text-center font-medium text-lg text-black mb-2 bg-green-200/35 py-1 rounded-md">
                      ${formatPrice(p.price)}
                    </span>

                    <div className="flex items-center justify-center w-full mt-2">
                      {p.visible ? (
                        <div className="flex items-center gap-x-2">
                          <label
                            title="Cantidad del producto"
                            htmlFor={`quantity-${p.code}`}
                            className="text-[13px] text-[#303f23] whitespace-nowrap"
                          >
                            Cantidad:
                          </label>

                          <div className="flex items-center border-[1.3px] border-green-400 rounded overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantity(
                                  p.id,
                                  (quantities[p.id] || 1) - 1
                                )
                              }
                              className={twMerge(
                                inCart(p.id)
                                  ? "cursor-default"
                                  : "cursor-pointer hover:bg-green-200/90",
                                "text-xl w-7 h-7 pb-1 bg-green-100 flex items-center justify-center text-green-800 font-bold"
                              )}
                            >
                              -
                            </button>
                            <span
                              id={`quantity-${p.code}`}
                              className="w-[30px] text-[14.5px] select-none h-7 flex items-center justify-center bg-white text-center pb-0.5"
                            >
                              {quantities[p.id] || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantity(
                                  p.id,
                                  (quantities[p.id] || 1) + 1
                                )
                              }
                              className={twMerge(
                                inCart(p.id)
                                  ? "cursor-default"
                                  : "cursor-pointer hover:bg-green-200/90",
                                "text-xl w-7 h-7 pb-1 bg-green-100 flex items-center justify-center text-green-800 font-bold"
                              )}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          title="Producto agotado"
                          className="flex items-center gap-x-2 opacity-70 select-none"
                        >
                          <label
                            htmlFor={`quantity-${p.code}`}
                            className="text-[13px] text-[#303f23] whitespace-nowrap"
                          >
                            Cantidad:
                          </label>
                          <div className="flex items-center border-[1.3px] border-green-400 rounded overflow-hidden">
                            <button
                              type="button"
                              disabled
                              className="text-xl w-7 h-7 pb-1 bg-green-50 flex items-center justify-center text-green-800 font-bold cursor-not-allowed"
                            >
                              -
                            </button>
                            <span
                              id={`quantity-${p.code}`}
                              className="w-[30px] text-[14.5px] select-none h-7 flex items-center justify-center bg-white text-center pb-0.5"
                            >
                              0
                            </span>
                            <button
                              type="button"
                              disabled
                              className="text-xl w-7 h-7 pb-1 bg-green-50 flex items-center justify-center text-green-800 font-bold cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-full mt-3">
                      {p.visible ? (
                        inCart(p.id) ? (
                          <Link
                            to="/carrito"
                            className="bg-[#E3F9D6] brightness-110 hover:bg-[#d6ffbc] hover:border-[#d6ffbc] text-slate-900 font-medium py-2 rounded-lg transition-colors w-full border border-green-400/80 text-center text-sm sm:text-base flex items-center justify-center gap-x-2"
                          >
                            <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                            Ver Carrito
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
                        <div className="bg-[#ede7d4] text-slate-700 font-medium py-2 rounded-lg w-full text-center text-sm sm:text-base select-none">
                          Agotado
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            {len(filteredProducts) == 0 && len(searchTerm) > 0 && (
              <p className="w-full text-center p-4 text-lg col-span-full bg-slate-100 rounded-lg">
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
    const data = query.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (err) {
    console.error(`catch 'getProducts' ${err.message}`);
    return [];
  }
}
