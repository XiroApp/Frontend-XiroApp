function pricingSetter(pricing, config, numberOfFiles) {
  const {
    totalPages: totalDePaginas,
    numberOfCopies: numeroDeCopias,
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
    A3_simple_do,
    A3_simple_do_color,
    A3_double_does,
    A3_double_does_color,
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
    let precioPapel =
      size === "A4" && printWay === "Simple faz" && color === "BN"
        ? simple_do
        : size === "A4" && printWay === "Simple faz" && color === "Color"
        ? simple_do_color
        : size === "A4" && printWay === "Doble faz" && color === "BN"
        ? double_does
        : size === "A4" && printWay === "Doble faz" && color === "Color"
        ? double_does_color
        : size === "A3" && printWay === "Simple faz" && color === "BN"
        ? A3_simple_do
        : size === "A3" && printWay === "Simple faz" && color === "Color"
        ? A3_simple_do_color
        : size === "A3" && printWay === "Doble faz" && color === "BN"
        ? A3_double_does
        : size === "A3" && printWay === "Doble faz" && color === "Color"
        ? A3_double_does_color
        : size === "Oficio" && printWay === "Simple faz" && color === "BN"
        ? OF_simple_do
        : size === "Oficio" && printWay === "Simple faz" && color === "Color"
        ? OF_simple_do_color
        : size === "Oficio" && printWay === "Doble faz" && color === "BN"
        ? OF_double_does
        : size === "Oficio" && printWay === "Doble faz" && color === "Color"
        ? OF_double_does_color
        : simple_do;
    console.log(numberOfFiles);

    function getRingedPrice() {
      let ringedPrice = 0;
      console.log(finishing);

      if (finishing === "Agrupado") {
        if (totalDePaginas <= 300) {
          ringedPrice = SMALL_ringed;
        } else if (totalDePaginas > 300 && totalDePaginas <= 800) {
          ringedPrice = BIG_ringed;
        } else if (totalDePaginas > 800) {
          ringedPrice = SMALL_ringed * 2;
        } else {
          ringedPrice = BIG_ringed; // OJO PRECIO DEFAULT ??
        }
      }

      if (finishing === "Individual") {
        if (totalDePaginas <= 300) {
          ringedPrice = SMALL_ringed * numberOfFiles;
        } else if (totalDePaginas > 300 && totalDePaginas <= 800) {
          ringedPrice = BIG_ringed * numberOfFiles;
        } else if (totalDePaginas > 800) {
          ringedPrice = SMALL_ringed * 2 * numberOfFiles;
        } else {
          ringedPrice = BIG_ringed * numberOfFiles; // OJO PRECIO DEFAULT ??
        }
      }

      return ringedPrice;
    }

    let anillado = getRingedPrice();
    console.log(anillado);

    let copiasPorCarilla =
      copiesPerPage === "Normal"
        ? 1
        : copiesPerPage === "2 copias"
        ? 2
        : copiesPerPage === "4 copias"
        ? 4
        : 1;

    let price =
      // ((totalPages / NcopiesPerPage) * paper_price + ringed) * numberOfCopies;
      ((totalDePaginas / copiasPorCarilla) * precioPapel + anillado) *
      numeroDeCopias;

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

function getDeliveryPricingByDistance(km, pricing) {
  if (km >= 10) {
    return pricing["distance_10_to_15"];
  } else if (km < 10 && km > 5) {
    return pricing["distance_5_to_10"];
  } else if (km < 5) {
    return pricing["distance_0_to_5"];
  } else {
    return pricing["distance_0_to_5"];
  }
}

function validateFileSize(file, maxSizeMB) {
  const maxSize = maxSizeMB * 1024 * 1024; // Tamaño máximo en bytes

  if (file.size > maxSize) {
    // alert(
    //   `El archivo "${file.name}" excede el tamaño máximo permitido de ${maxSizeMB} MB.`
    // );
    return false; // Indica que la validación falló
  }

  return true; // Indica que la validación fue exitosa
}
export { pricingSetter, getDeliveryPricingByDistance, validateFileSize };
