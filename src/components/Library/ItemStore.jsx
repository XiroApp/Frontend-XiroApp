import { twMerge } from "tailwind-merge";
import { formatPrice, len } from "../../Common/helpers";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import logo from "/xiro-head.webp";

export default function ItemStore(props) {
  const { product, inCart, handleQuantity, addProdToCart, quantities } = props;
  return (
    <li
      title={product.name}
      className="flex justify-between flex-col items-center bg-[#fef9e9] p-3 rounded-md border border-black w-full max-w-[280px] h-[330px] relative"
    >
      {!product.visible && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-md z-10">
          Agotado
        </div>
      )}
      {product.visible && inCart(product.id) && (
        <Link
          to="/carrito"
          className="absolute top-2 right-2 bg-green-600 hover:bg-green-500 transition-colors text-white text-xs font-bold px-2.5 py-1.5 rounded-md z-10"
        >
          En Carrito
        </Link>
      )}
      <div className="w-full h-32 mb-2 overflow-hidden rounded-md bg-white">
        <img
          src={product.cover || logo.src}
          alt={"Imágen de " + product.name}
          className="w-full h-full object-contain object-center rounded-md border-[0.1px] border-black"
        />
      </div>

      <div className="flex flex-col items-center justify-between flex-grow w-full">
        <div className="h-[90px] flex items-center justify-center w-full text-green-900 flex-col gap-y-1 my-2">
          <p
            className={twMerge(
              len(product.name) > 26 ? "text-lg" : "text-xl",
              "font-semibold w-full text-center line-clamp-2 text-balance"
            )}
          >
            {product.name}
          </p>
          <p className="opacity-90 text-sm w-full text-center line-clamp-2 text-balance">
            {product.description ?? "-"}
          </p>
        </div>

        <span
          style={{ fontFamily: "Arial" }}
          className="w-full text-center font-medium text-lg text-black mb-2 bg-green-200/35 py-1 rounded-md"
        >
          ${formatPrice(product.price)}
        </span>

        {/* <div className="flex items-center justify-center w-full mt-2">
          {product.visible ? (
            <div className="flex items-center gap-x-2">
              <label
                title="Cantidad del producto"
                htmlFor={`quantity-${product.code}`}
                className="text-[13px] text-[#303f23] whitespace-nowrap"
              >
                Cantidad:
              </label>

              <div className="flex items-center border-[1.3px] border-green-400 rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    handleQuantity(
                      product.id,
                      (quantities[product.id] || 1) - 1
                    )
                  }
                  className="text-xl hover:bg-green-200/90 cursor-default size-7 pb-1 bg-green-100 flex items-center justify-center text-green-800 font-bold"
                >
                  -
                </button>
                <span
                  id={`quantity-${product.code}`}
                  className="w-[30px] text-[14.5px] select-none h-7 flex items-center justify-center bg-white text-center pb-0.5"
                >
                  {quantities[product.id] || 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleQuantity(
                      product.id,
                      (quantities[product.id] || 1) + 1
                    )
                  }
                  className="text-xl cursor-default hover:bg-green-200/90 size-7 pb-1 bg-green-100 flex items-center justify-center text-green-800 font-bold"
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
                htmlFor={`quantity-${product.code}`}
                className="text-[13px] text-[#303f23] whitespace-nowrap"
              >
                Cantidad:
              </label>
              <div className="flex items-center border-[1.3px] border-green-400 rounded-md overflow-hidden">
                <button
                  type="button"
                  disabled
                  className="text-xl size-7 pb-1 bg-green-50 flex items-center justify-center text-green-800 font-bold cursor-not-allowed"
                >
                  -
                </button>
                <span
                  id={`quantity-${product.code}`}
                  className="w-[30px] text-[14.5px] select-none h-7 flex items-center justify-center bg-white text-center pb-0.5"
                >
                  0
                </span>
                <button
                  type="button"
                  disabled
                  className="text-xl size-7 pb-1 bg-green-50 flex items-center justify-center text-green-800 font-bold cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div> */}

        <div className="w-full mt-3">
          {product.visible ? (
            inCart(product.id) ? (
              <div className="flex items-center justify-center w-full gap-x-2 h-10">
                <label
                  title="Cantidad del producto"
                  htmlFor={`quantity-${product.code}`}
                  className="text-[13px] text-[#303f23] whitespace-nowrap"
                >
                  Cantidad:
                </label>

                <div className="flex items-center border-[1.3px] border-green-400 rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantity(
                        product.id,
                        (quantities[product.id] || 1) - 1
                      )
                    }
                    className="text-xl hover:bg-green-200/90 cursor-default size-7 pb-1 bg-green-100 flex items-center justify-center text-green-800 font-bold"
                  >
                    -
                  </button>
                  <span
                    id={`quantity-${product.code}`}
                    className="w-[30px] text-[14.5px] select-none h-7 flex items-center justify-center bg-white text-center pb-0.5"
                  >
                    {quantities[product.id] || 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantity(
                        product.id,
                        (quantities[product.id] || 1) + 1
                      )
                    }
                    className="text-xl cursor-default hover:bg-green-200/90 size-7 pb-1 bg-green-100 flex items-center justify-center text-green-800 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="bg-green-600/90 hover:bg-green-500 text-white font-medium h-10 rounded-md transition-colors w-full text-center text-sm sm:text-base"
                onClick={() => addProdToCart(product)}
              >
                Agregar al Carrito
              </button>
            )
          ) : (
            <div className="bg-[#ede7d4] text-slate-700 font-medium py-2 rounded-md w-full text-center text-sm sm:text-base select-none">
              Agotado
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

ItemStore.propTypes = {
  product: propTypes.object,
  inCart: propTypes.func,
  handleQuantity: propTypes.func,
  addProdToCart: propTypes.func,
  quantities: propTypes.object,
};
