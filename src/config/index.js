import { ApiConstants } from "../Common/constants";

// let _env = "DEV"; //PARA STAGGING
let _env = "LOCAL"; // PARA EMULADOR F CLI

const URL_MESSAGES = "messages";
const URL_PICTURES = "pictures";

export class Settings {
  static get SERVER_URL() {
    switch (_env) {
      case "LOCAL":
        return ApiConstants.BASE_URL_LOCAL;

      case "DEV":
        return ApiConstants.BASE_URL_PROD;

      default:
        return ApiConstants.BASE_URL_PROD;
    }
  }

  static getDefaultConfig() {
    switch (_env) {
      case "LOCAL":
        return {
          apiKey: "AIzaSyC0yeDOJlWXV5rTc3V5vtNyG9VT_BzVH7Y",
          authDomain: "xiro-app-2ec87.firebaseapp.com",
          projectId: "xiro-app-2ec87",
          storageBucket: "xiro-app-2ec87.firebasestorage.app",
          messagingSenderId: "795770640225",
          appId: "1:795770640225:web:194d64648d2caea6e8d720",
          measurementId: "G-NV3WGWXXM6",
        };
      case "DEV":
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
          apiKey: "AIzaSyC0yeDOJlWXV5rTc3V5vtNyG9VT_BzVH7Y",
          authDomain: "xiro-app-2ec87.firebaseapp.com",
          projectId: "xiro-app-2ec87",
          storageBucket: "xiro-app-2ec87.firebasestorage.app",
          messagingSenderId: "795770640225",
          appId: "1:795770640225:web:194d64648d2caea6e8d720",
          measurementId: "G-NV3WGWXXM6",
        };
    }
  }
  static getDefaultAdobeConfig() {
    switch (_env) {
      case "LOCAL":
        return {
          clientId: "8c0cd670273d451cbc9b351b11d22318", //  DEFAULT ADOBE ID FOR LOCAL (?)
        };
      case "DEV":
        return {
          clientId: "175a37c322904bfa803952dd4a3bc9bb", //  CIRO ID FOR deploy  (?)
        };
      default:
        return {
          /* Pass your registered client id */
          // clientId: "8c0cd670273d451cbc9b351b11d22318", //  DEFAULT ADOBE ID FOR LOCAL (?)
          clientId: "175a37c322904bfa803952dd4a3bc9bb", //  CIRO ID FOR deploy  (?)
        };
    }
  }
  static getDefaultConverterConfig() {
    switch (_env) {
      case "LOCAL":
        return {
          path: "http://localhost:1212/",
        };
      case "DEV":
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
