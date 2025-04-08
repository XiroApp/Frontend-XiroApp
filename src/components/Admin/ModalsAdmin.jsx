import ModalAdd from "./ModalAdd";
import propTypes from "prop-types";
import ModalDelete from "./ModalDelete";
import ModalEdit from "./ModalEdit";
import ModalHidden from "./ModalHidden";
import ModalVisible from "./ModalVisible";
import { useState } from "react";

export default function ModalsAdmin(props) {
  const {
      COLLECTION,
      setShowAddModal,
      showDeleteModal,
      setShowDeleteModal,
      showAddModal,
      newProduct,
      setNewProduct,
      productSelected,
      setProductSelected,
      showEditModal,
      setShowEditModal,
      showVisibleModal,
      setShowVisibleModal,
      showHiddenModal,
      setShowHiddenModal,
      setProducts,
      products,
    } = props,
    [loadingModal, setLoadingModal] = useState(false);

  if (loadingModal)
    return (
      <div
        role="alert"
        className="fixed inset-0 pb-24 bg-slate-200 flex items-center justify-center z-50"
      >
        <p className="w-full text-2xl lg:text-3xl text-center">Cargando...</p>;
      </div>
    );

  return (
    <>
      {showAddModal && (
        <ModalAdd
          COLLECTION={COLLECTION}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          setShowAddModal={setShowAddModal}
          products={products}
          setProducts={setProducts}
          setLoadingModal={setLoadingModal}
        />
      )}

      {showDeleteModal && (
        <ModalDelete
          COLLECTION={COLLECTION}
          productSelected={productSelected}
          setProductSelected={setProductSelected}
          setShowDeleteModal={setShowDeleteModal}
          products={products}
          setProducts={setProducts}
          setLoadingModal={setLoadingModal}
        />
      )}

      {showEditModal && (
        <ModalEdit
          COLLECTION={COLLECTION}
          productSelected={productSelected}
          setProductSelected={setProductSelected}
          setShowEditModal={setShowEditModal}
          products={products}
          setProducts={setProducts}
          setLoadingModal={setLoadingModal}
        />
      )}

      {showVisibleModal && (
        <ModalHidden
          COLLECTION={COLLECTION}
          setShowVisibleModal={setShowVisibleModal}
          setProductSelected={setProductSelected}
          productSelected={productSelected}
          products={products}
          setProducts={setProducts}
          setLoadingModal={setLoadingModal}
        />
      )}

      {showHiddenModal && (
        <ModalVisible
          COLLECTION={COLLECTION}
          setShowHiddenModal={setShowHiddenModal}
          setProductSelected={setProductSelected}
          productSelected={productSelected}
          products={products}
          setProducts={setProducts}
          setLoadingModal={setLoadingModal}
        />
      )}
    </>
  );
}

ModalsAdmin.propTypes = {
  setShowAddModal: propTypes.func,
  showAddModal: propTypes.bool,
  newProduct: propTypes.object,
  setNewProduct: propTypes.func,
  setShowDeleteModal: propTypes.func,
  showDeleteModal: propTypes.bool,
  productSelected: propTypes.object,
  setProductSelected: propTypes.func,
  COLLECTION: propTypes.any,
  showEditModal: propTypes.bool,
  setShowEditModal: propTypes.func,
  showVisibleModal: propTypes.bool,
  setShowVisibleModal: propTypes.func,
  showHiddenModal: propTypes.bool,
  setShowHiddenModal: propTypes.func,
  setProducts: propTypes.func,
  products: propTypes.array,
};
