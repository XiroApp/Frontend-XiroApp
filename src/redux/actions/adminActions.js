import * as action from "../actions/actionTypes";
import { Settings } from "../../config";
import axios from "axios";

const baseUrl = Settings.SERVER_URL;

//--------------- GET ALL USERS --------------------
export function getAllUsers() {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${baseUrl}/admin/users`);

      dispatch({
        type: action.GET_ALL_USERS,
        payload: {
          users: response.data,
        },
      });
      return;
      // return dispatch({
      //   type: action.TOAST_ALERT,
      //   payload: {
      //     message: "Usuarios cargados correctamente.",
      //     variant: "success",
      //     vertical: "top",
      //     horizontal: "right",
      //     open: true,
      //   },
      // });
    } catch (error) {
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Los usuarios no se han cargado.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}

//--------------- GET USER BY UID --------------------
export async function getUserByUid(uid) {
  try {
    let response = await axios.get(`${baseUrl}/users/${uid}`);

    return response.data[0];
  } catch (error) {
    return alert("No se puede obtener info del usuario");
  }
}

//--------------- GET COUPONS --------------------
export function getAllCoupons() {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${baseUrl}/coupons`);

      dispatch({
        type: action.GET_ALL_COUPONS,
        payload: {
          coupons: response.data,
        },
      });
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Cupones cargados correctamente.",
          variant: "success",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    } catch (error) {
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Los cupones no se han cargado.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}

//--------------- GET ALL ORDERS --------------------
export function getAllOrders(pageToken) {
  return async function (dispatch) {
    try {
      let url = `${baseUrl}/orders`;

      if (pageToken) {
        url += `?pageToken=${pageToken}`;
      }

      let response = await axios.get(url);

      let sortedOrders = response.data
        .map((order) => {
          console.log(order);

          const fechaStr = order.paymentData.date_created;
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
            uidPickup: order.uidPickup,
            uidDistribution: order.uidDistribution,
            report: order.report,
            createdAt: fechaFormateada,
            place: order.place,
            shipment_price: order.shipment_price,
            subtotal_price: order.subtotal_price,
            total_price: order.total_price,
          };
        })
        .sort((a, b) => b.order_number - a.order_number);

      dispatch({
        type: action.GET_ALL_ORDERS,
        payload: {
          orders: sortedOrders,
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

      return sortedOrders;
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

//--------------- DELETE COUPONS --------------------
export function deleteCoupon(idCoupon) {
  return async function (dispatch) {
    try {
      let response = await axios.delete(
        `${baseUrl}/coupons/delete/${idCoupon}`
      );

      dispatch({
        type: action.DELETE_COUPON,
      });
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Cupón eliminado correctamente.",
          variant: "success",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    } catch (error) {
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Error al eliminar cupón.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}

//--------------- EDIT ORDER STATUS --------------------
export function changeOrderStatus({
  idOrder,
  orderStatus,
  uidPrinting,
  uidDelivery,
  uidDistribution,
  uidPickup,
  uidClient,
  report,
  editor,
  order_number,
}) {
  return async function (dispatch) {
    try {
      let response = await axios.post(
        `${baseUrl}/orders/edit/status/${idOrder}`,
        {
          idOrder,
          orderStatus,
          uidPrinting,
          uidDelivery,
          uidDistribution,
          uidPickup,
          uidClient,
          report,
          editor,
          order_number,
        }
      );

      // let formatedOrders = response.data.map((order) => {
      //   const fechaStr = order.paymentData.date_created;
      //   const fecha = new Date(fechaStr);

      //   const dia = fecha.getDate().toString().padStart(2, "0");
      //   const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
      //   const año = fecha.getFullYear();

      //   const fechaFormateada = `${dia}/${mes}/${año}`;

      //   return {
      //     clientUid: order.clientUid,
      //     orderStatus: order.orderStatus,
      //     cart: order.cart,
      //     paymentId: order.paymentData.id,
      //     paymentStatus: order.paymentData.status,
      //     transactionAmount:
      //       order.paymentData.transaction_details.total_paid_amount,
      //     statusDetail: order.paymentData.status_detail,
      //     uidPrinting: order.uidPrinting,
      //     uidDelivery: order.uidDelivery,
      //     report: order.report,
      //     createdAt: fechaFormateada,
      //     place: order.place,
      //   };
      // });

      dispatch({
        type: action.EDIT_STATUS_ORDERS,
        payload: { orders: [] },
      });

      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Orden editada correctamente.",
          variant: "success",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    } catch (error) {
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Error al editar orden.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}

//--------------- EDIT COUPONS --------------------
export function editCoupon(idCoupon, coupon) {
  return async function (dispatch) {
    try {
      let response = await axios.post(`${baseUrl}/coupons/edit`, {
        ...coupon,
        idCoupon,
      });

      dispatch({
        type: action.EDIT_COUPON,
      });
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Cupón editado correctamente.",
          variant: "success",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    } catch (error) {
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Error al editar cupón.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}

//--------------- CREATE COUPONS --------------------
export function createCoupon(coupon) {
  return async function (dispatch) {
    try {
      let response = await axios.post(`${baseUrl}/coupons/create`, coupon);

      dispatch({
        type: action.CREATE_COUPON,
      });
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Cupones cargados correctamente.",
          variant: "success",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    } catch (error) {
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Los cupones no se han cargado.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}

//--------------- GET PRICING --------------------
export function getPricing() {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${baseUrl}/pricing/paper`);

      return dispatch({
        type: action.SET_PRICE,
        payload: {
          pricing: response.data,
        },
      });
    } catch (error) {
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "No se han establecido precios.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}

//--------------- EDIT PRICING --------------------
export function editPricing(pricing, collection) {
  return async function (dispatch) {
    try {
      let response = await axios.post(
        `${baseUrl}/pricing/${collection}`,
        pricing
      );

      dispatch({
        type: action.EDIT_PRICE,
        payload: {
          pricing: response.data,
        },
      });

      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Precios modificados correctamente.",
          variant: "success",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    } catch (error) {
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Error modificado los precios.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//--------------- EDIT USER ROLES --------------------

//---------------UpdateUser--------------------
export function updateUserRole(uidUser, roles) {
  return async function (dispatch) {
    try {
      let response = await axios.patch(`${baseUrl}/users/${uidUser}`, roles);
      let responseUsers = await axios.get(`${baseUrl}/admin/users`);

      dispatch({
        type: action.UPDATE_ROLE,
        payload: { users: responseUsers.data },
      });

      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Roles actualizados exitosamente.",
          variant: "success",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    } catch (error) {
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Hubo un error al actualizar roles, intente nuevamente.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
