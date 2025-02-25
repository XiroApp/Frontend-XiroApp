import { useEffect, useState } from "react";
import {
  Edit as EditIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Visibility as EyeIcon,
  VisibilityOff as EyeOffIcon,
} from "@mui/icons-material";
// import { collection, getDocs } from "firebase/firestore/lite";
// import { db } from "../../../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setLibraryCart, setToast } from "../../../redux/actions";
import propTypes from "prop-types";
// const PRODUCTS_TABLE = collection(db, "products");

export default function LibraryStore() {
  const dispatch = useDispatch(),
    [products, setProducts] = useState([]),
    [loading, setLoading] = useState(false),
    [searchTerm, setSearchTerm] = useState(""),
    [quantities, setQuantities] = useState({}),
    filteredProducts = searchProducts(),
    productsCart = useSelector(state => state.libraryCart || []),
    isInCart = prodId => productsCart.some(p => p.id == prodId);

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

    console.log("---- CARRITO ACTUALIZADO ----");
    console.log(updatedCart);
    console.log("-----------------------------");

    dispatch(setToast("Producto agregado al carrito", "success"));
    dispatch(setLibraryCart(updatedCart));
  }

  function searchProducts() {
    return products.filter(p =>
      normalize(p.name).includes(normalize(searchTerm))
    );
  }

  function handleQuantity(prodId, val) {
    setQuantities(prev => ({
      ...prev,
      [prodId]: Math.min(Math.max(1, val), 10),
    }));
  }

  // return (
  //   <section className="w-full bg-white flex justify-start items-start rounded-2xl h-screen flex-col relative">
  //     <div className="sticky rounded-2xl top-0 left-0 right-0 bg-white z-20 px-4 sm:px-8 py-4 border-b w-full">
  //       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-8">
  //         <p className="text-3xl sm:text-4xl font-semibold text-slate-850 pl-2">
  //           Librería
  //         </p>
  //         <div className="flex jusify-center items-center gap-x-4">
  //           <Link
  //             to="/imprimir"
  //             className="text-lg font-semibold text-slate-800 bg-green-300 hover:bg-green-400 duration-75 h-12 border border-green-400 rounded-lg px-4 py-2"
  //           >
  //             Ir a Imprimir
  //           </Link>
  //           <div className="relative flex items-center justify-start">
  //             <SearchIcon className="absolute top-3 left-2.5 opacity-80 pointer-events-none" />
  //             <input
  //               autoFocus
  //               type="search"
  //               placeholder="Busca productos..."
  //               value={searchTerm}
  //               onChange={e => setSearchTerm(e.target.value)}
  //               className="w-full sm:w-[280px] px-4 py-2 rounded-lg border-[1.5px] pl-10 bg-slate-200/90 placeholder:text-slate-600 border-green-400 focus:outline-none h-12"
  //             />
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="w-full flex-1 overflow-y-auto px-4 sm:px-8 py-4">
  //       {loading ? (
  //         <p className="w-full text-center p-2 text-lg">Cargando...</p>
  //       ) : (
  //         <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  //           {len(filteredProducts) > 0 &&
  //             filteredProducts.map(p => (
  //               <li
  //                 key={p.id}
  //                 className="flex justify-between flex-col items-center bg-[#fef9e9] p-2 rounded-xl border border-black w-[280px] mx-auto sm:w-full h-[320px] transition-all"
  //               >
  //                 <header className="w-full h-40 mb-3">
  //                   <img
  //                     src={p.cover}
  //                     alt={p.name}
  //                     className="w-full h-full object-cover rounded-md border-[0.1px] border-black"
  //                   />
  //                 </header>

  //                 <div className="flex flex-col items-center justify-between flex-grow px-2 w-full">
  //                   <p className="text-xl font-semibold text-green-900 w-full text-center line-clamp-1">
  //                     {p.name}
  //                   </p>
  //                   <p className="text-sm text-black w-full text-center line-clamp-2">
  //                     {p.description}
  //                   </p>
  //                   <span className="w-full text-center font-medium text-lg text-black">
  //                     ${formatPrice(p.price)}
  //                   </span>
  //                   <div className="flex items-center gap-2 w-full justify-between">
  //                     <div className="flex items-center gap-2">
  //                       <label
  //                         title="Cantidad"
  //                         htmlFor={`quantity-${p.id}`}
  //                         className="text-sm text-[#303f23] whitespace-nowrap"
  //                       >
  //                         Cant:
  //                       </label>
  //                       <input
  //                         disabled={isInCart(p.id)}
  //                         id={`quantity-${p.id}`}
  //                         type="number"
  //                         min={1}
  //                         max={10}
  //                         value={quantities[p.id] || 1}
  //                         onChange={e =>
  //                           handleQuantity(p.id, parseInt(e.target.value))
  //                         }
  //                         className="w-14 px-1 py-1 text-center rounded border border-green-400 focus:outline-none focus:border-green-600"
  //                       />
  //                     </div>

  //                     {isInCart(p.id) ? (
  //                       <Link
  //                         to="/carrito"
  //                         className="bg-[#E3F9D6] brightness-110 hover:bg-[#d6ffbc] hover:border-[#d6ffbc] text-slate-900 font-medium py-2 px-4 rounded-lg transition-colors w-full border border-green-400/80 text-center text-sm sm:text-base"
  //                       >
  //                         En el Carrito
  //                       </Link>
  //                     ) : (
  //                       <button
  //                         className="bg-green-600 hover:bg-green-700 brightness-110 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full text-center text-sm sm:text-base"
  //                         onClick={() => addProduct(p)}
  //                       >
  //                         Agregar al Carrito
  //                       </button>
  //                     )}
  //                   </div>
  //                 </div>
  //               </li>
  //             ))}
  //           {len(filteredProducts) == 0 && len(searchTerm) > 0 && (
  //             <p className="w-full text-center p-2 text-lg col-span-full">
  //               Sin coincidencias...
  //             </p>
  //           )}
  //         </ul>
  //       )}
  //     </div>
  //   </section>
  // );
  return (
    <section className="pt-10 w-full bg-white flex justify-start items-center rounded-2xl h-full flex-col relative">
      <div className="w-full flex-1 max-w-[800px] justify-start items-center">
        <div className="flex justify-between items-end mb-6">
          <div className="relative">
            <SearchIcon
              color="#000"
              size={20}
              className="absolute top-2.5 left-3"
            />
            <input
              onChange={e => console.log(e.target.value)}
              autoFocus
              type="search"
              placeholder="Busca un producto..."
              className="bg-slate-200 h-11 rounded-lg text-lg pl-10 pr-2 placeholder:text-slate-700 w-[300px] outline-0 placeholder:select-none text-black border-2 border-slate-500"
            />
          </div>
          <button
            onClick={() => console.log(true)}
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
                    key={p.id + "-"}
                    {...p}
                    // setShowDeleteModal={setShowDeleteModal}
                    // setProductSelected={setProductSelected}
                    // setShowEditModal={setShowEditModal}
                    // setShowVisibleModal={setShowVisibleModal}
                    // setShowHiddenModal={setShowHiddenModal}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <NoMatches />
          )}
        </div>
      </div>
    </section>
  );
}

async function getProducts() {
  try {
    // const query = await getDocs(PRODUCTS_TABLE);
    // const data = query.docs.map(doc => ({
    // id: doc.id,
    // ...doc.data(),
    // }));}
    // return data;
    return DEV_PRODUCTS;
  } catch (err) {
    console.error(`catch 'getProducts' ${err.message}`);
    return [];
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat("es-AR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function normalize(str) {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const len = str => str.length;

const DEV_PRODUCTS = [
  {
    id: "EEWi1FoD6r5D2kwJiYix",
    name: "Sacapuntas",
    price: "1150",
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739313018/t49dvfvxqjfcu0j9hep7.jpg",
    description: "Capaz de dejarle la punta más afilada del mundo",
  },
  {
    id: "KTHExldOTvQ9aTGoahm7",
    name: "Bloc de hojas A4",
    price: 5000,
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739312641/lzywou91hieb1stfydsf.webp",
    description: "Directo desde el Amazonas a tu casa",
  },
  {
    id: "MdqO9cChMIHTGjT8lDGt",
    name: "Lapicera trazo fino",
    price: 1000,
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1714770522/f1uc15e9qzttwemahtq8.webp",
    description: "Ideal para firmar contratos millonarios",
  },
  {
    id: "OSAThXJqepPGjS262oKN",
    name: "Goma de borrar",
    price: 1200,
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739312881/qnixavnxx847dkifbn4q.jpg",
    description: "No puede borrar tu pasado, pero sí el pasado de un lápiz",
  },
  {
    id: "i8Unlzz4xltUAC5XuLUE",
    name: "Comic del Hombre Araña",
    price: "4500",
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739312803/ra0t9gwnba1fzn769fpa.jpg",
    description: "Yo soy el araña hombre",
  },
  {
    id: "JZt4m8KN2Vg3FYXH5LqW",
    name: "Cuaderno Rayado",
    price: 3200,
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739313018/t49dvfvxqjfcu0j9hep7.jpg",
    description: "Perfecto para tomar notas o escribir tus memorias",
  },
  {
    id: "QVHf6N9TpWXA5KRzM8LY",
    name: "Resaltador Fluorescente",
    price: 1500,
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739313018/t49dvfvxqjfcu0j9hep7.jpg",
    description: "Haz que lo importante brille (literalmente)",
  },
  {
    id: "XBK2z7LpMgQT83WJ4NDV",
    name: "Regla de 30 cm",
    price: 1100,
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739313018/t49dvfvxqjfcu0j9hep7.jpg",
    description: "Mide todo con precisión milimétrica",
  },
  {
    id: "PWT5XQ6YKzN4Mg7J8VLD",
    name: "Tijeras de oficina",
    price: 2500,
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739313018/t49dvfvxqjfcu0j9hep7.jpg",
    description: "Corta lo que necesites con precisión y facilidad",
  },
  {
    id: "RMGQ7WXTN5KZ8Y6P4LVD",
    name: "Carpeta A4",
    price: 2700,
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739313018/t49dvfvxqjfcu0j9hep7.jpg",
    description: "Organiza tus documentos como un verdadero profesional",
  },
  {
    id: "ZTY9WXK57Q8NP4LVDM3G",
    name: "Set de lápices de colores",
    price: 3800,
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739313018/t49dvfvxqjfcu0j9hep7.jpg",
    description: "Dale vida a tus dibujos con una explosión de color",
  },
  {
    id: "GQXK7WTP9Z5YN48MLVD3",
    name: "Pegamento en barra",
    price: 900,
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739313018/t49dvfvxqjfcu0j9hep7.jpg",
    description: "Une lo que debe estar unido, sin hacer enchastres",
  },
  {
    id: "WXTQK79MPZ5YN4LVD3G6",
    name: "Cinta adhesiva transparente",
    price: 1300,
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739313018/t49dvfvxqjfcu0j9hep7.jpg",
    description: "La solución rápida para cualquier arreglo improvisado",
  },
  {
    id: "M79QXKTPZ5YN4LVD3G6W",
    name: "Marcadores permanentes",
    price: 2200,
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739313018/t49dvfvxqjfcu0j9hep7.jpg",
    description: "Deja tu marca en cualquier superficie, literalmente",
  },
  {
    id: "XK79QTPZ5YMLVD3G6WQ",
    name: "Corrector líquido",
    price: 950,
    cover:
      "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739313018/t49dvfvxqjfcu0j9hep7.jpg",
    description: "Corrige errores como si nunca hubieran existido",
  },
];

function ProductAdmin(props) {
  const {
      id,
      img,
      name,
      price,
      description,
      visible,
      setProductSelected,
      setShowDeleteModal,
      setShowEditModal,
      setShowHiddenModal,
      setShowVisibleModal,
    } = props,
    productProps = { name, description, price, img, id, visible };
  return (
    <tr className="border-b-2 border-slate-300 bg-gray-100 text-gray-900">
      <td className="px-4 py-2 text-center">{id}</td>
      <td className="px-4 py-2 text-center">{name}</td>
      <td className="px-4 py-2 text-center">{description}</td>
      <td className="px-4 py-2 text-center">${price}</td>
      <td className="px-4 py-2">
        <div className="flex gap-2 justify-center w-full items-center brightness-95">
          <EditIcon
            size={10}
            color="#fff"
            className="bg-blue-500 hover:bg-blue-600 w-9 h-9 p-2 rounded-lg duration-75 cursor-pointer"
            onClick={() => {
              setProductSelected(productProps);
              setShowEditModal(true);
            }}
          />
          {visible ? (
            <EyeIcon
              size={18}
              color="#fff"
              className="bg-slate-500 p-2 w-9 h-9 rounded-lg hover:bg-slate-600 duration-75 cursor-pointer"
              onClick={() => {
                setProductSelected(productProps);
                setShowVisibleModal(true);
              }}
            />
          ) : (
            <EyeOffIcon
              size={18}
              color="#fff"
              className="bg-slate-500 p-2 w-9 h-9 rounded-lg hover:bg-slate-600 duration-75 cursor-pointer"
              onClick={() => {
                setProductSelected(productProps);
                setShowHiddenModal(true);
              }}
            />
          )}
          <DeleteIcon
            size={10}
            color="#fff"
            className="bg-red-500 p-2 w-9 h-9 rounded-lg hover:bg-red-600 duration-75 cursor-pointer"
            onClick={() => {
              setProductSelected(productProps);
              setShowDeleteModal(true);
            }}
          />
        </div>
      </td>
    </tr>
  );
}

const NoMatches = () => (
  <p className="text-lg lg:text-2xl text-black tracking-tight w-full text-center">
    Sin coincidencias...
  </p>
);

ProductAdmin.propTypes = {
  name: propTypes.string,
  description: propTypes.string,
  price: propTypes.number,
  img: propTypes.string,
  id: propTypes.number,
  setShowDeleteModal: propTypes.func,
  setProductSelected: propTypes.func,
  setShowEditModal: propTypes.func,
  setShowHiddenModal: propTypes.func,
  setShowVisibleModal: propTypes.func,
  visible: propTypes.bool,
};
