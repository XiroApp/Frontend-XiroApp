import propTypes from "prop-types";
import { useState } from "react";
import { len } from "../../Common/helpers";
import { setToast } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { doc, setDoc } from "firebase/firestore/lite";

export default function ModalAdd(props) {
  const {
      setShowAddModal,
      newProduct,
      setNewProduct,
      COLLECTION,
      products,
      setProducts,
      setLoadingModal,
    } = props,
    dispatch = useDispatch(),
    [errors, setErrors] = useState({}),
    regexp =
      /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/;

  function validateFields() {
    const newErrors = {};

    if (!newProduct.code || len(newProduct.code) == 0) {
      newErrors.code = "El código es obligatorio.";
    }

    if (!newProduct.name || len(newProduct.name) == 0) {
      newErrors.name = "El nombre es obligatorio.";
    } else if (len(newProduct.name) > 129) {
      newErrors.name = "El nombre no debe exceder 129 caracteres.";
    }

    if (!newProduct.price || newProduct.price <= 0) {
      newErrors.price = "El precio no puede ser 0.";
    }

    if (!newProduct.cover || !regexp.test(newProduct.cover)) {
      newErrors.cover = "Link inválido.";
    }

    setErrors(newErrors);

    if (len(Object.keys(newErrors)) > 0) {
      const time = setTimeout(() => setErrors({}), 3000);
      return clearTimeout(time);
    }

    return len(Object.keys(newErrors)) == 0;
  }

  function handleCode(e) {
    const code = String(e.target.value).trim();
    setNewProduct({ ...newProduct, code });
  }

  function handleName(e) {
    const name = String(e.target.value).trim();
    setNewProduct({ ...newProduct, name });
  }

  function handlePrice(e) {
    // Verificar si el valor es numérico antes de procesarlo
    if (e.target.value === "") {
      // Si el campo está vacío, establecer a 0
      e.target.value = "0";
      setNewProduct({ ...newProduct, price: 0 });
    } else if (e.target.validity.valid) {
      const price = Number(e.target.value);
      setNewProduct({ ...newProduct, price });
    } else {
      // Si no es válido, mantener el valor anterior o establecer a 0
      e.target.value = newProduct.price || 0;
    }
  }

  function handleImg(e) {
    const cover = String(e.target.value).trim();
    setNewProduct({ ...newProduct, cover });
  }

  async function handleAdd() {
    const newID = crypto.randomUUID();
    const productToDB = { ...newProduct, id: newID };

    if (!validateFields()) return;

    try {
      setLoadingModal(true);
      await setDoc(doc(COLLECTION, newID), productToDB);
      setProducts([...(products ?? []), productToDB]);
      setShowAddModal(false);
    } catch (err) {
      dispatch(setToast("Error al agregar producto", "error"));
      console.error(`catch 'handleAdd' ${err.message}`);
    } finally {
      setLoadingModal(false);
    }
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
              autoFocus
              onChange={handleCode}
              id="code"
              type="text"
              placeholder="Ingresa el código"
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code}</p>
            )}
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="name" className="font-medium text-lg">
              Nombre del producto
            </label>
            <input
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
              onInput={e => {
                // Si está vacío, establecer a 0
                if (e.target.value === "") {
                  e.target.value = "0";
                  setNewProduct({ ...newProduct, price: 0 });
                }
                // Asegurar que solo se permitan números y un punto decimal
                else if (!/^\d*\.?\d*$/.test(e.target.value)) {
                  e.target.value = e.target.value.replace(/[^\d.]/g, "");
                }
              }}
              id="price"
              type="number"
              pattern="[0-9]"
              defaultValue={0}
              placeholder="Ingresa el precio"
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              min={0}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
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
            onClick={() => setShowAddModal(false)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="bg-green-600 hover:bg-green-500 duration-75 text-white px-8 py-1 text-lg rounded-lg border-2 border-green-300"
            onClick={handleAdd}
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}

ModalAdd.propTypes = {
  setShowAddModal: propTypes.func,
  newProduct: propTypes.object,
  setNewProduct: propTypes.func,
  COLLECTION: propTypes.any,
  setProducts: propTypes.func,
  products: propTypes.array,
  setLoadingModal: propTypes.func,
};
