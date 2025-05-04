import store from "../redux/store";

const sortByDateDesc = (a, b) => {
  const dateA = new Date(a.createdAt.split("/").reverse().join("-"));
  const dateB = new Date(b.createdAt.split("/").reverse().join("-"));
  return dateB - dateA;
};

const len = item => (item?.length ? item.length : 0);

const tLC = str => str.toString().toLowerCase().trim();

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

const normalize = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export {
  sortByDateDesc,
  len,
  formatPrice,
  normalizeStr,
  roleIs,
  tLC,
  normalize,
};
