import axios from "axios";
import { Settings } from "../../config/index";

const baseUrl = Settings.SERVER_URL;

export class OrdersAdapter {
  static async getOrdersPaginated(
    pageSize,
    nextVisible,
    prevVisible,
    direction,
    role,
    uid
  ) {
    let url = "";
    if (uid) {
      url = `${baseUrl}/${role}/orders/${uid}?pageSize=${pageSize}`;
    } else {
      url = `${baseUrl}/${role}/orders?pageSize=${pageSize}`;
    }
    // Agregar parámetros según la dirección de la paginación
    if (direction === "next" && nextVisible) {
      url += `&lastVisible=${nextVisible}&direction=next`;
    } else if (direction === "prev" && prevVisible) {
      url += `&firstVisible=${prevVisible}&direction=prev`;
    }

    const response = await axios.get(url);
    const data = response.data;

    // Formatear las órdenes
    const sortedOrders = data.orders.map((order) => {
      const fechaStr = order.created_at;
      const fecha = new Date(fechaStr);
      const dia = fecha.getDate().toString().padStart(2, "0");
      const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
      const año = fecha.getFullYear();

      const fechaFormateada = `${dia}/${mes}/${año}`;

      return {
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
}
