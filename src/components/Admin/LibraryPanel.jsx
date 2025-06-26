import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import ProductAdmin from "./ProductAdmin";
import { len, normalizeStr } from "../../Common/helpers";
import { useEffect, useState } from "react";
import ModalsAdmin from "./ModalsAdmin";
import { initLibraryProd } from "../../Common/constants";
import { LibraryService } from "../../Infra/Services/library.service";

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
    [productSelected, setProductSelected] = useState(initLibraryProd),
    [newProduct, setNewProduct] = useState(initLibraryProd);

  useEffect(() => {
    setLoadingProducts(true);
    LibraryService.getProducts()
      .then(newProducts => setProducts(newProducts))
      .finally(() => setLoadingProducts(false));
  }, []);

  function searchProducts() {
    if (!searchTerm.trim()) return products;
    return products.filter(
      p =>
        normalizeStr(p.name).includes(normalizeStr(searchTerm)) ||
        normalizeStr(p.code).includes(normalizeStr(searchTerm))
    );
  }

  return (
    <section className="pt-10 w-full bg-white flex justify-start items-center rounded-2xl h-full flex-col relative">
      {loadingProducts ? (
        <p className="text-2xl pb-20 pt-10">Cargando...</p>
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
                type="text"
                placeholder="Busca un producto..."
                className="bg-slate-200 h-11 rounded-lg text-lg pl-10 pr-2 placeholder:text-slate-700 w-[300px] outline-0 text-black border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    <th className="py-2 w-1/5">Código</th>
                    <th className="py-2 w-1/5">Nombre</th>
                    <th className="py-2 w-1/5">Descripción</th>
                    <th className="py-2 w-1/5">Precio</th>
                    <th className="py-2 w-1/5">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts
                    .sort((a, b) => {
                      const getNum = code =>
                          parseInt(code.replace(/\D/g, ""), 10),
                        prefixA = a.code.replace(/\d/g, ""),
                        prefixB = b.code.replace(/\d/g, "");
                      if (prefixA !== prefixB)
                        return prefixA.localeCompare(prefixB);
                      return getNum(a.code) - getNum(b.code);
                    })
                    .map(p => (
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
              <p className="text-lg lg:text-2xl py-20 text-black tracking-tight w-full text-center">
                Sin coincidencias...
              </p>
            )}
          </div>
        </div>
      )}
      <ModalsAdmin
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
