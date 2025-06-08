import propTypes from "prop-types";
import { initLibraryProd } from "../../Common/constants.js";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/actions/index.js";
import { LibraryService } from "../../Infra/Services/library.service";

function ModalDeleteAdmin(props) {
  const {
      setShowDeleteModal,
      setProductSelected,
      productSelected,
      setLoadingModal,
      products,
      setProducts,
    } = props,
    dispatch = useDispatch();

  function resetData() {
    setProductSelected(initLibraryProd);
    setShowDeleteModal(false);
  }

  async function removeProduct() {
    try {
      setLoadingModal(true);
      await LibraryService.deleteProduct(productSelected.id);
      setProducts(products.filter(p => p.id != productSelected.id));
      resetData();
    } catch (err) {
      dispatch(setToast("Error al eliminar producto", "error"));
      console.error(`catch 'removeProduct' ${err.message}`);
    } finally {
      setLoadingModal(false);
    }
  }

  return (
    <div
      role="alert"
      className="fixed inset-0 pb-20 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg flex-col flex justify-center items-center w-full max-w-lg">
        <p className="text-xl font-semibold w-full text-pretty">
          ¿Estás seguro que quieres eliminar {productSelected.name}?
        </p>
        <div className="flex gap-2 mt-8 justify-end items-center w-full">
          <button
            type="button"
            className="bg-slate-300 duration-100 text-slate-900 text-lg px-4 py-1 rounded-lg hover:bg-gray-200 border-2"
            onClick={resetData}
          >
            Cancelar
          </button>
          <button
            onClick={removeProduct}
            type="button"
            className="bg-red-600 hover:bg-red-500 duration-75 text-white px-8 py-1 text-lg rounded-lg border-2 border-red-300"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDeleteAdmin;

ModalDeleteAdmin.propTypes = {
  setShowDeleteModal: propTypes.func,
  setProductSelected: propTypes.func,
  productSelected: propTypes.object,
  setLoadingModal: propTypes.func,
  products: propTypes.array,
  setProducts: propTypes.func,
};
