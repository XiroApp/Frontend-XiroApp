import { useEffect, useState } from "react";
import { setLibraryCart, setToast } from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { len, normalizeStr } from "../../../Common/helpers";
import ItemStore from "../../../components/Library/ItemStore";
import AlertProd from "../../../components/Library/AlertProd";
import LoadingProds from "../../../components/Library/LoadingProds";
import NoMatches from "../../../components/NoMatches";
import HeaderLibrary from "../../../components/Library/HeaderLibrary";
import { LibraryService } from "../../../Services/library.service";
import ContinueBtn from "../../../components/Library/ContinueBtn";

export default function LibraryStore() {
  const dispatch = useDispatch(),
    libraryCart = useSelector(state => state.libraryCart),
    [products, setProducts] = useState([]),
    [loading, setLoading] = useState(false),
    [searchTerm, setSearchTerm] = useState(""),
    [showModal, setShowModal] = useState(false),
    [tempQuantities, setTempQuantities] = useState({}),
    filteredProducts = searchProducts(),
    productsCart = useSelector(state => state.libraryCart || []),
    inCart = prodId => productsCart.some(p => p.id == prodId);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    LibraryService.getProducts()
      .then(loadedProducts => setProducts(loadedProducts))
      .finally(() => setLoading(false));
  }, []);

  function addProdToCart(prod) {
    // Usar la cantidad preseleccionada o 1 por defecto
    const quantity = tempQuantities[prod.id] || 1;
    const productWithQuantity = { ...prod, quantity };
    const updatedCart = [...productsCart, productWithQuantity];

    dispatch(setToast("Producto agregado al carrito", "success"));
    dispatch(setLibraryCart(updatedCart));

    // Limpiar la cantidad temporal después de añadir al carrito
    const newTempQuantities = { ...tempQuantities };
    delete newTempQuantities[prod.id];
    setTempQuantities(newTempQuantities);
  }

  function searchProducts() {
    return searchTerm.trim() == ""
      ? products
      : products.filter(p =>
          normalizeStr(p.name).includes(normalizeStr(searchTerm))
        );
  }

  function handleQuantity(prodId, val) {
    if (val <= 0) {
      if (inCart(prodId)) return setShowModal(true);
      return;
    }

    const newQuantity = Math.min(Math.max(1, val), 10);

    if (inCart(prodId)) {
      const updatedCart = productsCart.map(item => {
        if (item.id === prodId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      dispatch(setLibraryCart(updatedCart));
    } else {
      setTempQuantities({
        ...tempQuantities,
        [prodId]: newQuantity,
      });
    }
  }

  return (
    <section className="w-full bg-white flex justify-start items-start rounded-2xl flex-col relative">
      {showModal && <AlertProd close={() => setShowModal(false)} />}
      <HeaderLibrary term={searchTerm} setTerm={setSearchTerm} />
      <div className="w-full flex-1 px-4 sm:px-8 py-4 h-full min-h-[650px]">
        {loading ? (
          <LoadingProds />
        ) : (
          <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 place-items-center">
            {len(filteredProducts) > 0 &&
              filteredProducts.map(product => (
                <ItemStore
                  key={product.id}
                  product={product}
                  inCart={inCart}
                  handleQuantity={handleQuantity}
                  addProdToCart={addProdToCart}
                  quantities={{
                    ...tempQuantities,
                    ...productsCart.reduce((acc, item) => {
                      acc[item.id] = item.quantity;
                      return acc;
                    }, {}),
                  }}
                />
              ))}
            {len(filteredProducts) == 0 && len(searchTerm) > 0 && <NoMatches />}
          </ul>
        )}
        {len(libraryCart) > 0 && <ContinueBtn />}
      </div>
    </section>
  );
}
