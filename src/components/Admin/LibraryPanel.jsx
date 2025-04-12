import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import ProductAdmin from "./ProductAdmin";
import { len, normalizeStr } from "../../Common/helpers";
import { collection, getDocs } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import ModalsAdmin from "./ModalsAdmin";
import { db } from "../../config/firebase";
import { initProd } from "../../Common/constants";

const PRODUCTS_TABLE = collection(db, "products");

export default function LibraryPanel() {
  const [products, setProducts] = useState([]),
    [loadingProducts, setLoadingProducts] = useState(false),
    [searchTerm, setSearchTerm] = useState(""),
    filteredProducts = searchProducts(),
    [showAddModal, setShowAddModal] = useState(false),
    [showEditModal, setShowEditModal] = useState(false),
    [showVisibleModal, setShowVisibleModal] = useState(false),
    [showHiddenModal, setShowHiddenModal] = useState(false),
    [showDeleteModal, setShowDeleteModal] = useState(false),
    [productSelected, setProductSelected] = useState(initProd),
    [newProduct, setNewProduct] = useState(initProd);

  useEffect(() => {
    setLoadingProducts(true);
    getProducts()
      .then(newProducts => setProducts(newProducts))
      .finally(() => setLoadingProducts(false));
  }, []);

  function searchProducts() {
    if (!searchTerm.trim()) return products;
    return products.filter(
      p =>
        normalizeStr(p.name).includes(normalizeStr(searchTerm)) ||
        normalizeStr(p.code).includes(normalizeStr(searchTerm)) ||
        normalizeStr(String(p.price)).includes(normalizeStr(searchTerm))
    );
  }

  return (
    <section className="pt-10 w-full bg-white flex justify-start items-center rounded-2xl h-full flex-col relative">
      {loadingProducts ? (
        <p>Cargando...</p>
      ) : (
        <div className="w-full flex-1 max-w-[900px] justify-start items-center">
          <div className="flex justify-between items-end mb-6">
            <div className="relative">
              <SearchIcon
                color="#000"
                size={20}
                className="absolute top-2.5 left-3"
              />
              <input
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
                type="search"
                placeholder="Busca un producto..."
                className="bg-slate-200 h-11 rounded-lg text-lg pl-10 pr-2 placeholder:text-slate-700 w-[300px] outline-0 placeholder:select-none text-black border-2 border-slate-500"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-slate-700 hover:bg-slate-600 duration-100 border-2 border-slate-500 text-slate-50 text-lg px-4 h-11 rounded-md hover:bg-primary-500 flex justify-center items-center gap-x-3"
            >
              <AddIcon color="#fff" size={22} />
              <p>Añadir producto</p>
            </button>
          </div>
          <div>
            {len(filteredProducts) > 0 ? (
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 w-full">
                    <th className="py-2 w-[80px]">Código</th>
                    <th className="py-2 w-[80px]">Nombre</th>
                    <th className="py-2 w-[80px]">Descripción</th>
                    <th className="py-2 w-[80px]">Precio</th>
                    <th className="py-2 w-[80px]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <ProductAdmin
                      key={p.id}
                      {...p}
                      setProductSelected={setProductSelected}
                      setShowDeleteModal={setShowDeleteModal}
                      setShowEditModal={setShowEditModal}
                      setShowVisibleModal={setShowVisibleModal}
                      setShowHiddenModal={setShowHiddenModal}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-lg lg:text-xl text-black tracking-tight w-full text-center">
                Sin coincidencias...
              </p>
            )}
          </div>
        </div>
      )}
      <ModalsAdmin
        COLLECTION={PRODUCTS_TABLE}
        products={products}
        setProducts={setProducts}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        setShowAddModal={setShowAddModal}
        showAddModal={showAddModal}
        productSelected={productSelected}
        setProductSelected={setProductSelected}
        setShowDeleteModal={setShowDeleteModal}
        showDeleteModal={showDeleteModal}
        setShowEditModal={setShowEditModal}
        showEditModal={showEditModal}
        showVisibleModal={showVisibleModal}
        setShowVisibleModal={setShowVisibleModal}
        showHiddenModal={showHiddenModal}
        setShowHiddenModal={setShowHiddenModal}
      />
    </section>
  );
}

async function getProducts() {
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
