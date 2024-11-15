function pricingSetter(pricing, config) {
  const {
    totalPages,
    numberOfCopies,
    color,
    size,
    printWay,
    copiesPerPage,
    orientacion,
    finishing,
  } = config;
  const {
    BIG_ringed,
    SMALL_ringed,
    OF_simple_do,
    OF_simple_do_color,
    OF_double_does,
    OF_double_does_color,
    simple_do,
    simple_do_color,
    double_does,
    double_does_color,
  } = pricing;

  try {
    let paper_price =
      size === "A4" && printWay === "Simple faz" && color === "BN"
        ? simple_do
        : size === "A4" && printWay === "Simple faz" && color === "Color"
        ? simple_do_color
        : size === "A4" && printWay === "Doble faz" && color === "BN"
        ? double_does
        : size === "A4" && printWay === "Doble faz" && color === "Color"
        ? double_does_color
        : size === "Oficio" && printWay === "Simple faz" && color === "BN"
        ? OF_simple_do
        : size === "Oficio" && printWay === "Simple faz" && color === "Color"
        ? OF_simple_do_color
        : size === "Oficio" && printWay === "Doble faz" && color === "BN"
        ? OF_double_does
        : size === "Oficio" && printWay === "Doble faz" && color === "Color"
        ? OF_double_does_color
        : simple_do;

    let ringed =
      finishing === "Anillado"
        ? totalPages <= 300
          ? SMALL_ringed
          : totalPages > 300 && totalPages <= 800
          ? BIG_ringed
          : totalPages > 800
          ? SMALL_ringed * 2
          : BIG_ringed /* OJO PRECIO DEFAULT ?? */
        : 0;

    let NcopiesPerPage =
      copiesPerPage === "Normal"
        ? 1
        : copiesPerPage === "2 copias"
        ? 2
        : copiesPerPage === "4 copias"
        ? 4
        : 1;

    let price =
      ((totalPages / NcopiesPerPage) * paper_price + ringed) * numberOfCopies;

    // console.log(paper_price);
    // console.log(ringed);
    // console.log(NcopiesPerPage);
    // console.log(price);

    if (price !== NaN) {
      return price.toFixed();
    } else {
      throw new Error("Error al calcular el precio");
    }
  } catch (error) {
    throw new Error(error);
  }
}

export { pricingSetter };
