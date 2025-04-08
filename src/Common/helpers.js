// Función para ordenar por fecha (descendente)
const sortByDateDesc = (a, b) => {
  /* DD/MM/AAAA */
  const fechaA = new Date(a.createdAt.split("/").reverse().join("-"));
  const fechaB = new Date(b.createdAt.split("/").reverse().join("-"));
  return fechaB - fechaA;
};

const len = str => str.length;

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

export { sortByDateDesc, len, formatPrice, normalizeStr };
