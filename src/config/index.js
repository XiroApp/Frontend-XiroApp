let _env = "PROD"; // PRODUCCION
// let _env = "TESTING"; // AMBIENTE DE PRUEBAS
// let _env = "LOCAL"; // "DESARROLLO LOCAL CON EMULADOR BACKEND"

import { ApiConstants } from "../Common/constants";

const URL_MESSAGES = "messages";
const URL_PICTURES = "pictures";

export class Settings {
  static get FRONTEND_VERSION() {
    return "v6.0.3 (beta)"; //! Cambiar en cada despliegue.
  }

  static get SERVER_URL() {
    switch (_env) {
      case "LOCAL":
        return ApiConstants.BASE_URL_LOCAL;

      case "TESTING":
        return ApiConstants.BASE_URL_TESTING;

      case "PROD":
        return ApiConstants.BASE_URL_PROD;

      default:
        return ApiConstants.BASE_URL_TESTING;
    }
  }

  static get STORAGE_URL() {
    switch (_env) {
      case "LOCAL":
        return ApiConstants.STORAGE_URL_TESTING;

      case "TESTING":
        return ApiConstants.STORAGE_URL_TESTING;

      case "PROD":
        return ApiConstants.STORAGE_URL_PROD;

      default:
        return ApiConstants.STORAGE_URL_TESTING;
    }
  }

  static get STORAGE_TOKEN_QUERY() {
    switch (_env) {
      case "LOCAL":
        return ApiConstants.STORAGE_TOKEN_QUERY_TESTING;

      case "TESTING":
        return ApiConstants.STORAGE_TOKEN_QUERY_TESTING;

      case "PROD":
        return ApiConstants.STORAGE_TOKEN_QUERY_PROD;

      default:
        return ApiConstants.STORAGE_TOKEN_QUERY_TESTING;
    }
  }

  static get MERCADOPAGO_KEY() {
    switch (_env) {
      case "LOCAL":
        return ApiConstants.MERCADOPAGO_TESTING;

      case "TESTING":
        return ApiConstants.MERCADOPAGO_TESTING;

      case "PROD":
        return ApiConstants.MERCADOPAGO_PUBLIC_KEY;

      default:
        return ApiConstants.MERCADOPAGO_TESTING;
    }
  }

  static getDefaultConfig() {
    switch (_env) {
      case "LOCAL":
        return {
          apiKey: "AIzaSyCFHRqijYpi8qxik_UsfxGpd6k4r9fPs60",
          authDomain: "testing-xiro-app.firebaseapp.com",
          projectId: "testing-xiro-app",
          storageBucket: "testing-xiro-app.firebasestorage.app",
          messagingSenderId: "1041638889688",
          appId: "1:1041638889688:web:1a5997f8929d3fb0e6dfad",
          measurementId: "G-6XT50QQ9M7",
        };
      case "TESTING":
        return {
          apiKey: "AIzaSyCFHRqijYpi8qxik_UsfxGpd6k4r9fPs60",
          authDomain: "testing-xiro-app.firebaseapp.com",
          projectId: "testing-xiro-app",
          storageBucket: "testing-xiro-app.firebasestorage.app",
          messagingSenderId: "1041638889688",
          appId: "1:1041638889688:web:1a5997f8929d3fb0e6dfad",
          measurementId: "G-6XT50QQ9M7",
        };
      case "PROD":
        return {
          apiKey: "AIzaSyC0yeDOJlWXV5rTc3V5vtNyG9VT_BzVH7Y",
          authDomain: "xiro-app-2ec87.firebaseapp.com",
          projectId: "xiro-app-2ec87",
          storageBucket: "xiro-app-2ec87.firebasestorage.app",
          messagingSenderId: "795770640225",
          appId: "1:795770640225:web:194d64648d2caea6e8d720",
          measurementId: "G-NV3WGWXXM6",
        };
      default:
        return {
          apiKey: "AIzaSyCFHRqijYpi8qxik_UsfxGpd6k4r9fPs60",
          authDomain: "testing-xiro-app.firebaseapp.com",
          projectId: "testing-xiro-app",
          storageBucket: "testing-xiro-app.firebasestorage.app",
          messagingSenderId: "1041638889688",
          appId: "1:1041638889688:web:1a5997f8929d3fb0e6dfad",
          measurementId: "G-6XT50QQ9M7",
        };
    }
  }

  static getDefaultAdobeConfig() {
    switch (_env) {
      case "LOCAL":
        return {
          clientId: "8c0cd670273d451cbc9b351b11d22318", //  DEFAULT ADOBE ID FOR LOCAL (?)
        };
      case "PROD":
        return {
          clientId: "175a37c322904bfa803952dd4a3bc9bb", //  CIRO ID FOR deploy  (?)
        };
      default:
        return {
          /* Pass your registered client id */
          // clientId: "8c0cd670273d451cbc9b351b11d22318", //  DEFAULT ADOBE ID FOR LOCAL (?)
          clientId: "8c0cd670273d451cbc9b351b11d22318", //  CIRO ID FOR deploy  (?)
        };
    }
  }

  static getDefaultConverterConfig() {
    switch (_env) {
      case "LOCAL":
        return {
          path: "http://localhost:1212/",
        };
      case "PROD":
        return {
          path: "http://34.176.135.142:1212",
        };
      default:
        return {
          path: "http://34.176.135.142:1212",
        };
    }
  }

  static get environment() {
    return _env;
  }

  static get messagesEndpoint() {
    return URL_MESSAGES;
  }

  static get picturesEndpoint() {
    return URL_PICTURES;
  }
}
