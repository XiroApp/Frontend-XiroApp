import * as action from "../actions/actionTypes";
import { Settings } from "../../config";
import axios from "axios";

const baseUrl = Settings.SERVER_URL;

//--------------- GET PRINTING ORDERS --------------------
export function getDeliveryOrders() {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${baseUrl}/delivery/orders`);

      let formatedOrders = response.data
        .map((order) => {
          const fechaStr = order.paymentData.date_created;
          const fecha = new Date(fechaStr);

          const dia = fecha.getDate().toString().padStart(2, "0");
          const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
          const año = fecha.getFullYear();

          const fechaFormateada = `${dia}/${mes}/${año}`;

          return {
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
            report: order.report,
            createdAt: fechaFormateada,
            place: order.place,
          };
        })
        .reverse();
      dispatch({
        type: action.GET_ALL_ORDERS,
        payload: {
          orders: formatedOrders,
        },
      });
      dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Ordenes cargadas correctamente.",
          variant: "success",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
      return formatedOrders;
    } catch (error) {
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Las ordenes no se han cargado.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
