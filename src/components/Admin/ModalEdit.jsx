import propTypes from "prop-types";
import { useState } from "react";
import { len } from "../../Common/helpers.js";
import { initProd } from "../../Common/constants.js";
import { doc, setDoc } from "firebase/firestore/lite";
import { setToast } from "../../redux/actions/index.js";
import { useDispatch } from "react-redux";

function ModalEdit(props) {
  const [errors, setErrors] = useState({}),
    dispatch = useDispatch(),
    {
      setShowEditModal,
      productSelected,
      setProductSelected,
      COLLECTION,
      products,
      setProducts,
      setLoadingModal,
    } = props,
    regexp =
      /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/;

  function validateFields() {
    const newErrors = {};

    if (!productSelected.name || len(productSelected.name) == 0) {
      newErrors.name = "El nombre es obligatorio.";
    } else if (len(productSelected.name) > 129) {
      newErrors.name = "El nombre no debe exceder 129 caracteres.";
    }

    if (productSelected.description && len(productSelected.description) > 299) {
      newErrors.description = "La descripción no debe exceder 299 caracteres.";
    }

    if (!productSelected.price || productSelected.price <= 0) {
      newErrors.price = "El precio no puede ser 0.";
    }

    if (!productSelected.cover || !regexp.test(productSelected.cover)) {
      newErrors.cover = "Link inválido.";
    }

    setErrors(newErrors);

    if (len(Object.keys(newErrors)) > 0) {
      const time = setTimeout(() => setErrors({}), 3000);
      return clearTimeout(time);
    }

    return len(Object.keys(newErrors)) == 0;
  }

  async function editProduct() {
    if (!validateFields()) return;

    try {
      setLoadingModal(true);
      await setDoc(doc(COLLECTION, productSelected.id), productSelected);
      setProducts(
        products.map(p => (p.id == productSelected.id ? productSelected : p))
      );
      setShowEditModal(false);
    } catch (error) {
      dispatch(setToast("Error al editar producto", "error"));
      console.error(`catch 'editProduct' ${error.message}`);
    } finally {
      setLoadingModal(false);
    }
  }

  function handleCode(e) {
    const code = String(e.target.value).trim();
    setProductSelected({ ...productSelected, code });
  }

  function handleName(e) {
    const name = String(e.target.value).trim();
    setProductSelected({ ...productSelected, name });
  }

  function handleDescription(e) {
    const description = String(e.target.value).trim();
    setProductSelected({ ...productSelected, description });
  }

  function handlePrice(e) {
    const price = Number(e.target.value);
    setProductSelected({ ...productSelected, price });
  }

  function handleImg(e) {
    const cover = String(e.target.value).trim();
    setProductSelected({ ...productSelected, cover });
  }

  return (
    <div
      role="alert"
      className="fixed inset-0 pt-10 backdrop-blur-sm bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg flex-col flex justify-start items-center w-full max-w-2xl">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="code" className="font-medium text-lg">
              Código
            </label>
            <input
              defaultValue={productSelected.code}
              autoFocus
              onChange={handleCode}
              id="code"
              type="text"
              placeholder="Ingresa el nombre"
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="name" className="font-medium text-lg">
              Nombre
            </label>
            <input
              defaultValue={productSelected.name}
              onChange={handleName}
              id="name"
              type="text"
              placeholder="Ingresa el nombre"
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="price" className="font-medium text-lg">
              Precio
            </label>
            <input
              onChange={handlePrice}
              id="price"
              type="number"
              defaultValue={productSelected.price}
              placeholder="Ingresa el precio"
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              min={0}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="description" className="font-medium text-lg">
              Descripción
            </label>
            <input
              onChange={handleDescription}
              defaultValue={productSelected.description}
              id="description"
              type="text"
              placeholder="Ingresa la descripción"
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none resize-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <a
              href="https://imagen-a-link.netlify.app"
              target="_blank"
              rel="noreferrer"
              htmlFor="cover"
              className="font-medium text-lg hover:underline w-max"
            >
              Link de la imagen
            </a>
            <input
              onChange={handleImg}
              id="cover"
              type="text"
              defaultValue={productSelected.cover}
              placeholder="Ingresa el link de la imagen"
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.cover && (
              <p className="text-red-500 text-sm">{errors.cover}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-8 justify-end items-center w-full">
          <button
            className="bg-slate-300 duration-100 text-slate-900 text-lg px-4 py-1 rounded-lg hover:bg-gray-200 border-2"
            onClick={() => {
              setProductSelected(initProd);
              setShowEditModal(false);
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-500 duration-75 text-white px-8 py-1 text-lg rounded-lg border-2 border-blue-300"
            onClick={editProduct}
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEdit;

ModalEdit.propTypes = {
  setShowEditModal: propTypes.func,
  productSelected: propTypes.object,
  setProductSelected: propTypes.func,
  COLLECTION: propTypes.any,
  setLoadingModal: propTypes.func,
  products: propTypes.array,
  setProducts: propTypes.func,
};
