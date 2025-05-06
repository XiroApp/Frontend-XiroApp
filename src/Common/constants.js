const ApiConstants = {
  MERCADOPAGO_PUBLIC_KEY: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY,
  FIREBASE_STORAGE_TOKEN: import.meta.env.VITE_FIREBASE_STORAGE_TOKEN,
  PDF_CONVERTER_API_URL: import.meta.env.VITE_PDF_CONVERTER_API_URL,
  BASE_URL_LOCAL:
    "http://localhost:5001/xiro-app-2ec87/us-central1/api/xiro-app",
  BASE_URL_TESTING:
    "https://us-central1-xiro-app-2ec87.cloudfunctions.net/api/xiro-app",
  BASE_URL_PROD:
    "https://us-central1-xiro-app-2ec87.cloudfunctions.net/api/xiro-app",
};

const initLibraryProd = {
  id: "",
  code: "",
  name: "",
  price: 0,
  cover: "",
  visible: true,
};

export { ApiConstants, initLibraryProd };
