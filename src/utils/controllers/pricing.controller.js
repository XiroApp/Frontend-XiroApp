function pricingSetter(pricing, config, filesDetail) {
  const {
    totalPages,
    numberOfCopies: numeroDeCopias,
    color,
    size,
    printWay,
    copiesPerPage,
    orientacion,
    finishing,
    group,
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
    let copiasPorCarilla =
      copiesPerPage === "Normal"
        ? 1
        : copiesPerPage === "2 copias"
        ? 2
        : copiesPerPage === "4 copias"
        ? 4
        : 1;

    const totalDePaginas = totalPages / copiasPorCarilla;

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

    function getRingedPrice() {
      let totalRingedPrice = 0;

      if (group === "Agrupado" && finishing == "Anillado") {
        if (totalDePaginas <= 300) {
          totalRingedPrice = SMALL_ringed;
        } else if (totalDePaginas > 300 && totalDePaginas <= 800) {
          totalRingedPrice = BIG_ringed;
        } else if (totalDePaginas > 800) {
          totalRingedPrice = SMALL_ringed * 2;
        } else {
          totalRingedPrice = BIG_ringed; // OJO PRECIO DEFAULT ??
        }
      }

      if (group === "Individual" && finishing == "Anillado") {
        let arrayDePrecios =
          filesDetail.length &&
          filesDetail.map((file) => {
            let totalDePaginas = file.pages;
            let ringedPrice = 0;

            if (totalDePaginas <= 300) {
              ringedPrice = SMALL_ringed;
            } else if (totalDePaginas > 300 && totalDePaginas <= 800) {
              ringedPrice = BIG_ringed;
            } else if (totalDePaginas > 800) {
              ringedPrice = SMALL_ringed * 2;
            } else {
              ringedPrice = BIG_ringed; // OJO PRECIO DEFAULT ??
            }

            return ringedPrice;
          });

        totalRingedPrice = arrayDePrecios.length
          ? arrayDePrecios.reduce(
              (acumulador, valorActual) => acumulador + valorActual,
              0
            )
          : 0;
      }

      return totalRingedPrice;
    }

    let anillado = getRingedPrice();

    let price = (totalDePaginas * precioPapel + anillado) * numeroDeCopias;

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
