import propTypes from "prop-types";
import { initProd } from "../../Common/constants.js";
import { setToast } from "../../redux/actions/index.js";
import { useDispatch } from "react-redux";
import { doc, setDoc } from "firebase/firestore/lite";

function ModalVisible({
  setShowHiddenModal,
  setProductSelected,
  productSelected,
  COLLECTION,
  setLoadingModal,
  products,
  setProducts,
}) {
  const dispatch = useDispatch();

  function resetData() {
    setProductSelected(initProd);
    setShowHiddenModal(false);
  }

  async function toggleVisible() {
    const updatedProduct = {
      ...productSelected,
      visible: true,
    };

    try {
      setLoadingModal(true);
      await setDoc(doc(COLLECTION, productSelected.id), {
        ...productSelected,
        visible: true,
      });
      resetData();
      setProducts(
        products.map(p => (p.id == productSelected.id ? updatedProduct : p))
      );
    } catch (error) {
      dispatch(setToast("Error al quitar 'Agotado' del producto", "error"));
      console.error(`catch 'toggleVisible' ${error.message}`);
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
          ¿Estás seguro que quieres mostrar {productSelected.name}?
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
            onClick={toggleVisible}
            type="button"
            className="bg-slate-600 hover:bg-slate-500 duration-75 text-white px-8 py-1 text-lg rounded-lg border-2 border-slate-300"
          >
            Mostrar producto
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalVisible;

ModalVisible.propTypes = {
  setShowHiddenModal: propTypes.func,
  setProductSelected: propTypes.func,
  productSelected: propTypes.object,
  COLLECTION: propTypes.any,
  setLoadingModal: propTypes.func,
  products: propTypes.array,
  setProducts: propTypes.func,
};
