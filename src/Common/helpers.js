// Función para ordenar por fecha (descendente)
export const sortByDateDesc = (a, b) => {
  /* DD/MM/AAAA */
  const fechaA = new Date(a.createdAt.split("/").reverse().join("-"));
  const fechaB = new Date(b.createdAt.split("/").reverse().join("-"));
  return fechaB - fechaA;
};
