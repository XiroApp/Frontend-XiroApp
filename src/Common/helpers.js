import store from "../redux/store";

const sortByDateDesc = (a, b) => {
  const dateA = new Date(a.createdAt.split("/").reverse().join("-"));
  const dateB = new Date(b.createdAt.split("/").reverse().join("-"));
  return dateB - dateA;
};

const len = (item) => (item?.length ? item.length : 0);

const tLC = (str) => str.toString().toLowerCase().trim();

function formatPrice(price) {
  return new Intl.NumberFormat("es-AR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function normalizeStr(str) {
  return str
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function roleIs(permission) {
  const user = store.getState().dataBaseUser;
  return user?.roles?.includes(permission);
}

const normalize = (text) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function cleanUpResources(APP_VERSION) {
  console.log("Iniciando limpieza de recursos...");

  // Desregistrar todos los Service Workers
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration
            .unregister()
            .then(() => {
              console.log("Service Worker desregistrado con éxito.");
            })
            .catch((error) => {
              console.error("Error al desregistrar el Service Worker:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error al obtener los Service Workers:", error);
      });
  }

  // Eliminar todos los caches, incluyendo workbox-precache
  if ("caches" in window) {
    caches
      .keys()
      .then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (cacheName.includes("workbox-precache")) {
            console.log(`Eliminando cache específico: ${cacheName}`);
          }
          caches
            .delete(cacheName)
            .then(() => {
              console.log(`Cache eliminado: ${cacheName}`);
            })
            .catch((error) => {
              console.error(`Error al eliminar el cache ${cacheName}:`, error);
            });
        });
      })
      .catch((error) => {
        console.error("Error al obtener los nombres de los caches:", error);
      });
  }

  // Limpieza de almacenamiento local y cookies si cambia la versión
  try {
    const storedVersion = localStorage.getItem("app-version");
    if (storedVersion !== APP_VERSION) {
      console.log(
        "Versión de la aplicación actualizada. Limpiando almacenamiento..."
      );

      // Limpia almacenamiento local y sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // Limpia cookies
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Almacena la nueva versión
      localStorage.setItem("app-version", APP_VERSION);
      console.log("Almacenamiento local, sessionStorage y cookies limpiados.");
    } else {
      console.log(
        "La versión de la aplicación no ha cambiado. No se requiere limpieza."
      );
    }
  } catch (error) {
    console.error("Error al limpiar almacenamiento local o cookies:", error);
  }
}

function pathIs(path, options) {
  const pathname = window?.location?.pathname;
  if (options?.exact) return pathname === path;
  return pathname.includes(path);
}

export {
  sortByDateDesc,
  len,
  formatPrice,
  normalizeStr,
  roleIs,
  tLC,
  cleanUpResources,
  pathIs,
  normalize,
};
