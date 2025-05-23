import axios from "axios";
import { Settings } from "../../config/index";
import { utils, writeFileXLSX } from "xlsx";

const baseUrl = Settings.SERVER_URL;

export class OrdersAdapter {
  static async getAllOrders() {
    const url = `${baseUrl}/admin/orders`;
    const response = await axios.get(url);
    return response.data;
  }

  static async getOrdersPaginated(
    limit,
    startAfterValue,
    endBeforeValue,
    role,
    uid
  ) {
    console.log("en el adapter");
    let url = "";

    if (uid) {
      url = `${baseUrl}/${role}/orders/${uid}?limit=${limit}`; // Usamos el estado 'limit'
      if (startAfterValue !== null) {
        // Si vamos a la siguiente página, añadimos startAfter
        url += `&startAfter=${startAfterValue}`;
      } else if (endBeforeValue !== null) {
        // Si vamos a la página anterior, añadimos endBefore
        url += `&endBefore=${endBeforeValue}`;
      }
    } else {
      url = `${baseUrl}/${role}/orders/paginated?limit=${limit}`; // Usamos el estado 'limit'
      if (startAfterValue !== null) {
        // Si vamos a la siguiente página, añadimos startAfter
        url += `&startAfter=${startAfterValue}`;
      } else if (endBeforeValue !== null) {
        // Si vamos a la página anterior, añadimos endBefore
        url += `&endBefore=${endBeforeValue}`;
      }
    }

    const response = await axios.get(url);
    const data = response.data;

    const sortedOrders = data.orders.map((order) => {
      const fechaFormateada = order.created_at
        .split("T")[0]
        .split("-")
        .reverse()
        .join("/");

      return {
        uid: order.uid || order.id,
        order_number: order.order_number,
        orderStatus: order.orderStatus,
        cart: order.cart,
        paymentId: order.paymentData.id,
        paymentStatus: order.paymentData.status,
        transactionAmount:
          order.paymentData.transaction_details.total_paid_amount,
        statusDetail: order.paymentData.status_detail,
        clientUid: order.clientUid,
        uidPrinting: order.uidPrinting,
        uidDelivery: order.uidDelivery,
        uidDistribution: order.uidDistribution,
        uidPickup: order.uidPickup,
        deliveryUser: order.deliverUser,
        distributionUser: order.distributionUser,
        pickupUser: order.pickupUser,
        printingUser: order.printingUser,
        clientUser: order.clientUser,
        report: order.report,
        createdAt: fechaFormateada,
        place: order.place,
        shipment_price: order.shipment_price,
        subtotal_price: order.subtotal_price,
        total_price: order.total_price,
        availability: order.availability,
      };
    });

    return { ...data, orders: sortedOrders };
  }

  static async getUnassignedOrders() {
    const response = await axios.get(`${baseUrl}/delivery/orders-unassigned`);

    const data = response.data;
    console.log(data);

    return data;
  }

  static async setBatchToDelivery(batch, uidDelivery) {
    let { data } = await axios.post(`${baseUrl}/batch`, { batch, uidDelivery });
    console.log(data);
  }

  static async downloadOrdersExcel() {
    // Obtiene todos los pedidos
    const orders = await OrdersAdapter.getAllOrders();

    const flatOrders = orders.map((order) => {
      // Helper para manejar la extracción segura de valores anidados
      const getNestedValue = (obj, path, defaultValue = "") => {
        const keys = path.split(".");
        let current = obj;
        for (const key of keys) {
          if (current === null || current === undefined) {
            return defaultValue;
          }
          current = current[key];
        }
        return current !== null && current !== undefined
          ? current
          : defaultValue;
      };

      // Resumir los ítems del carrito
      const cartSummary =
        order.cart
          ?.map((item) => {
            // Asegúrate de que estos campos existan en tus ítems del carrito
            const filename = item.files?.join(", ") || "Sin archivos"; // Lista los nombres de archivo si hay varios
            const copies = item.numberOfCopies ?? 0;
            const size = item.size || "N/A";
            const color = item.color || "N/A";
            const printWay = item.printWay || "N/A";
            const finishing = item.finishing || "N/A";
            const totalPages = item.totalPages ?? 0;
            const itemSubtotal = item.subtotal_price ?? 0;

            // Formato para cada ítem del carrito
            return `[Archivo: ${filename}, Copias: ${copies}, Tamaño: ${size}, Color: ${color}, Impresión: ${printWay}, Acabado: ${finishing}, Páginas: ${totalPages}, Subtotal Ítem: ${itemSubtotal}]`;
          })
          .join("; ") || "Carrito vacío"; // Une los resúmenes de ítems con punto y coma

      // Resumir detalles de cargos/tarifas (ej. tarifas de Mercado Pago)
      const feesSummary =
        order.paymentData?.fee_details
          ?.map((fee) => {
            const amount = fee.amount ?? 0;
            const type = fee.type || "N/A";
            const feePayer = fee.fee_payer || "N/A";
            return `${type} (${feePayer}): ${amount}`;
          })
          .join("; ") || "Sin cargos/tarifas";

      // Resumir detalles de cargos de la transacción (ej. retenciones)
      const chargesSummary =
        order.paymentData?.charges_details
          ?.map((charge) => {
            const chargeId = charge.id || "N/A";
            const chargeName = charge.name || "N/A";
            const chargeAmount = getNestedValue(charge, "amounts.original", 0);
            const chargeType = charge.type || "N/A"; // O getNestedValue(charge, 'metadata.type', 'N/A') si el tipo está en metadata
            return `${chargeName} (${chargeType}): ${chargeAmount}`;
          })
          .join("; ") || "Sin detalles de cargos";

      // Lista de nombres de archivo principales (si hay una lista top-level 'files' además de la en el carrito)
      // Basado en tu estructura, 'files' parece estar DENTRO de cada ítem del carrito.
      // Si tuvieras una lista de archivos a nivel de orden, la procesarías aquí.
      // Si la estructura 'files' que mostraste es de UN ítem del carrito, la lógica está en cartSummary.
      // Asumimos que 'files' en tu estructura de ejemplo era parte del item de carrito.
      // Si tienes una lista de archivos A NIVEL DE ORDEN, descomenta y adapta esto:
      // const orderFilesList = order.files?.join(', ') || '';

      return {
        // --- Información General de la Orden ---
        "N° Pedido": order.order_number ?? "",
        "ID de Orden (Firebase)": order.id ?? "", // ID del documento de Firestore
        "ID de Orden (App)": order.orderUid ?? "", // orderUid si lo generas en la app
        "Estado de Orden": order.orderStatus ?? "",
        // "Editor (Quien la procesó?)": order.editor ?? "", // Si 'editor' es quien la procesó
        "Fecha Creación": order.created_at
          ? order.created_at.split("T")[0].split("-").reverse().join("/")
          : "",
        "Hora Creación": order.created_at
          ? order.created_at.split("T")[1]?.split(".")[0] || "" // Extrae solo la hora sin milisegundos/zona horaria
          : "",
        "Reporte Interno": order.report ?? "", // Estado de reporte interno si aplica

        // --- Información del Cliente ---
        "Cliente (App - DisplayName)":
          order.clientUser?.displayName || order.clientUser?.email || "", // Viene de tu lookup
        "Cliente UID": order.clientUid ?? "", // UID del usuario cliente

        // --- Información del Carrito / Productos ---
        "Resumen Carrito": cartSummary, // Resumen de los ítems del carrito
        // Si quieres campos específicos del PRIMER ítem del carrito (puede ser útil a veces):
      };
    });

    // Crea la hoja de cálculo
    const worksheet = utils.json_to_sheet(flatOrders);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Pedidos");

    // Descarga el archivo Excel
    writeFileXLSX(workbook, "pedidos.xlsx");
  }
}
