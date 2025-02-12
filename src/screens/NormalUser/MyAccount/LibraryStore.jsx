import { useEffect, useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../../../config/firebase";

const PRODUCTS_TABLE = collection(db, "products");

function LibraryStore() {
  const [products, setProducts] = useState([]),
    [loading, setLoading] = useState(false),
    [searchTerm, setSearchTerm] = useState(""),
    filteredProducts = products.filter(p =>
      normalizeStr(p.name).includes(normalizeStr(searchTerm))
    );

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(newProducts => setProducts(newProducts))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-white flex justify-start items-start p-6 rounded-2xl h-full max-h-[700px] lg:max-h-[380px] lg:h-2/3 overflow-y-scroll flex-col gap-y-6">
      {loading ? (
        <p className="w-full lg:text-start text-center p-2 text-lg">
          Cargando...
        </p>
      ) : (
        <>
          <div className="w-full min-w-[330px] max-w-[760px] relative flex items-center justify-start">
            <SearchIcon className="absolute top-2.5 left-2.5 opacity-80 pointer-events-none" />
            <input
              type="search"
              placeholder="Busca productos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-[1.5px] pl-10 bg-slate-100 placeholder:text-slate-600 border-green-400 focus:outline-none max-w-[280px]"
            />
          </div>

          <ul className="w-full flex flex-wrap justify-center lg:justify-start items-center gap-4 lg:gap-10">
            {filteredProducts.length > 0 &&
              filteredProducts.map(p => (
                <li
                  key={p.id}
                  className="flex justify-between flex-col items-center bg-green-200/80 p-2 rounded-xl border border-green-2 scale-90 lg:scale-100 w-[240px] h-[320px] transition-all"
                >
                  <header className="w-full h-44 mb-3">
                    <img
                      src={p.cover}
                      alt={p.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </header>

                  <div className="flex flex-col items-center justify-between flex-grow px-2 w-full">
                    <p className="text-lg font-semibold text-green-900 w-full text-center">
                      {p.name}
                    </p>
                    <p className="text-sm text-green-900 w-full text-center text-pretty">
                      {p.description}
                    </p>
                    <span className="w-full text-center font-medium text-md text-green-900">
                      ${formatPrice(p.price)}
                    </span>
                    <button
                      className="bg-green-600 hover:bg-green-700 brightness-110 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full"
                      onClick={() => console.log("Agregar al carrito: " + p.id)}
                    >
                      Agregar al Carrito
                    </button>
                  </div>
                </li>
              ))}
            {filteredProducts.length == 0 && searchTerm.length > 0 && (
              <p className="w-full lg:text-start text-center p-2 text-lg">
                Sin coincidencias...
              </p>
            )}
          </ul>
        </>
      )}
    </section>
  );
}

export default LibraryStore;

async function getProducts() {
  try {
    const query = await getDocs(PRODUCTS_TABLE);
    const data = query.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
    // return PENE;
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

function normalizeStr(str) {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// const PENE = [
//   {
//     id: "EEWi1FoD6r5D2kwJiYix",
//     name: "Sacapuntas",
//     price: "1150",
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739313018/t49dvfvxqjfcu0j9hep7.jpg",
//     description: "Capaz de dejarle la punta más afilada del mundo",
//   },
//   {
//     id: "KTHExldOTvQ9aTGoahm7",
//     name: "Bloc de hojas A4",
//     price: 5000,
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739312641/lzywou91hieb1stfydsf.webp",
//     description: "Directo desde el Amazonas a tu casa",
//   },
//   {
//     id: "MdqO9cChMIHTGjT8lDGt",
//     name: "Lapicera trazo fino",
//     price: 1000,
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1714770522/f1uc15e9qzttwemahtq8.webp",
//     description: "Ideal para firmar contratos millonarios",
//   },
//   {
//     id: "OSAThXJqepPGjS262oKN",
//     name: "Goma de borrar",
//     price: 1200,
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739312881/qnixavnxx847dkifbn4q.jpg",
//     description: "No puede borrar tu pasado, pero sí el pasado de un lápiz",
//   },
//   {
//     id: "i8Unlzz4xltUAC5XuLUE",
//     name: "Comic del Hombre Araña",
//     price: "4500",
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739312803/ra0t9gwnba1fzn769fpa.jpg",
//     description: "Yo soy el araña hombre",
//   },
//   {
//     id: "JZt4m8KN2Vg3FYXH5LqW",
//     name: "Cuaderno Rayado",
//     price: 3200,
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739315001/cuaderno_rayado.jpg",
//     description: "Perfecto para tomar notas o escribir tus memorias",
//   },
//   {
//     id: "QVHf6N9TpWXA5KRzM8LY",
//     name: "Resaltador Fluorescente",
//     price: 1500,
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739315002/resaltador.jpg",
//     description: "Haz que lo importante brille (literalmente)",
//   },
//   {
//     id: "XBK2z7LpMgQT83WJ4NDV",
//     name: "Regla de 30 cm",
//     price: 1100,
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739315003/regla.jpg",
//     description: "Mide todo con precisión milimétrica",
//   },
//   {
//     id: "PWT5XQ6YKzN4Mg7J8VLD",
//     name: "Tijeras de oficina",
//     price: 2500,
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739315004/tijeras.jpg",
//     description: "Corta lo que necesites con precisión y facilidad",
//   },
//   {
//     id: "RMGQ7WXTN5KZ8Y6P4LVD",
//     name: "Carpeta A4",
//     price: 2700,
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739315005/carpeta.jpg",
//     description: "Organiza tus documentos como un verdadero profesional",
//   },
//   {
//     id: "ZTY9WXK57Q8NP4LVDM3G",
//     name: "Set de lápices de colores",
//     price: 3800,
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739315006/lapices_colores.jpg",
//     description: "Dale vida a tus dibujos con una explosión de color",
//   },
//   {
//     id: "GQXK7WTP9Z5YN48MLVD3",
//     name: "Pegamento en barra",
//     price: 900,
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739315007/pegamento.jpg",
//     description: "Une lo que debe estar unido, sin hacer enchastres",
//   },
//   {
//     id: "WXTQK79MPZ5YN4LVD3G6",
//     name: "Cinta adhesiva transparente",
//     price: 1300,
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739315008/cinta_adhesiva.jpg",
//     description: "La solución rápida para cualquier arreglo improvisado",
//   },
//   {
//     id: "M79QXKTPZ5YN4LVD3G6W",
//     name: "Marcadores permanentes",
//     price: 2200,
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739315009/marcador.jpg",
//     description: "Deja tu marca en cualquier superficie, literalmente",
//   },
//   {
//     id: "XK79QTPZ5YMLVD3G6WQ",
//     name: "Corrector líquido",
//     price: 950,
//     cover:
//       "https://res.cloudinary.com/dgs55s8qh/image/upload/v1739315010/corrector.jpg",
//     description: "Corrige errores como si nunca hubieran existido",
//   },
// ];
