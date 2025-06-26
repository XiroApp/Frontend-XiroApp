import axios from "axios";
import { Settings } from "../../config/index";
import { utils, writeFileXLSX } from "xlsx";

const baseUrl = Settings.SERVER_URL;

export class OrdersAdapter {
  
  static async getAllOrders(startDate, endDate) {
    let url = `${baseUrl}/admin/orders`;
    const params = new URLSearchParams();

    if (startDate) {
      params.append("startDate", startDate);
    }
    if (endDate) {
      params.append("endDate", endDate);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await axios.get(url);
    return response.data;
  }

  static async getOrdersPaginated(
    limit,
    startAfterValue,
    endBeforeValue,
    status_filter,
    role,
    uid
  ) {
    console.log("en el adapter");
    let url = "";

    if (uid) {
      url = `${baseUrl}/${role}/orders/${uid}?limit=${limit}&status=${status_filter}`; // Usamos el estado 'limit'
      if (startAfterValue !== null) {
        // Si vamos a la siguiente página, añadimos startAfter
        url += `&startAfter=${startAfterValue}`;
      } else if (endBeforeValue !== null) {
        // Si vamos a la página anterior, añadimos endBefore
        url += `&endBefore=${endBeforeValue}`;
      }
    } else {
      url = `${baseUrl}/${role}/orders/paginated?limit=${limit}&status=${status_filter}`; // Usamos el estado 'limit'
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
        transactionAmount: order.total_price,
        // transactionAmount:
        //   order.paymentData.transaction_details.total_paid_amount,
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
        library_cart: order.library_cart,
      };
    });

    console.log(sortedOrders);

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

  static async downloadOrdersExcel(startDate, endDate) {
    // Obtiene todos los pedidos
    const orders = await OrdersAdapter.getAllOrders(startDate, endDate);

    // Crea la hoja de cálculo
    const worksheet = utils.json_to_sheet(orders);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Pedidos");

    // Descarga el archivo Excel
    writeFileXLSX(workbook, "Listado de reporte.xlsx");
  }
}
