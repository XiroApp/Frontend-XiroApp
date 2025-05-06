const ApiConstants = {
  /* --------------------- PROD --------------------- */
  BASE_URL_PROD:
    "https://us-central1-xiro-app-2ec87.cloudfunctions.net/api/xiro-app",
  FIREBASE_STORAGE_TOKEN: import.meta.env.VITE_FIREBASE_STORAGE_TOKEN,
  PDF_CONVERTER_API_URL: import.meta.env.VITE_PDF_CONVERTER_API_URL,
  MERCADOPAGO_PUBLIC_KEY: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY,
  STORAGE_URL_PROD:
    "https://firebasestorage.googleapis.com/v0/b/xiro-app-2ec87.firebasestorage.app/o/",
  STORAGE_TOKEN_QUERY_PROD:
    "?alt=media&token=e7b0f280-413a-4546-aa2b-da0cd3523289",
  /* ----------------------------------------------------- */
  /* --------------------- TESTING --------------------- */
  BASE_URL_TESTING:
    "https://us-central1-testing-xiro-app.cloudfunctions.net/api/xiro-app",
  MERCADOPAGO_TESTING: "",
  STORAGE_URL_TESTING:
    "https://firebasestorage.googleapis.com/v0/b/testing-xiro-app.firebasestorage.app/o/",
  STORAGE_TOKEN_QUERY_TESTING:
    "?alt=media&token=925e6b5a-540b-4915-8dfa-d1bbc2f319d8",
  /* ----------------------------------------------------- */
  /*--------------------- EMULADOR LOCAL ---------------------*/
  BASE_URL_LOCAL:
    "http://localhost:5001/xiro-app-2ec87/us-central1/api/xiro-app", //Emulador
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
