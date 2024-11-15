import * as action from "../actions/actionTypes";
import { Settings } from "../../config";
import axios from "axios";
import { endSession, getSession, startSession } from "../../utils/controllers";
import { ApiConstants } from "../../Common/constants";

// import { setAuthToken } from "../../components/BrowserHistory/setAuthToken";

const baseUrl = Settings.SERVER_URL;

// console.log("BASEURL ", baseUrl);
/*   -----------------LOGIN------- */
export function limoLogin(user, rememberMe) {
  return async function (dispatch) {
    try {
      let response = await axios
        .get(`${baseUrl}/users/${user.uid}`)
        .then(startSession(user));

      startSession(user);
      dispatch({
        type: action.LOGIN,
        payload: {
          loggedUser: getSession(),
          dataBaseUser: response.data[0],
          dataBaseAddresses: response.data.addresses,
          dataBaseCart: response.data.cart,
        },
      });

      if (!rememberMe) {
        localStorage.removeItem("loggedUser");
      }

      return console.log("Bienvenido a CIRO!");
    } catch (error) {
      return console.error(error);
    }
  };
}
//------------GET LOGGED USER (INITIALIZATION APP)------------
export function getLoggedUser(user) {
  return async function (dispatch) {
    try {
      if (user) {
        let response = await axios.get(`${baseUrl}/users/${user.uid}`);

        startSession(user);

        dispatch({
          type: action.GET_USER_PROFILE,
          payload: {
            loggedUser: getSession(),
            dataBaseUser: response.data[0],
            dataBaseAddresses: response.data.addresses,
            dataBaseCart: response.data.cart,
          },
        });

        return user;
      } else console.log("No hay usuario logueado");
    } catch (error) {
      return console.log({ error: error.message });
    }
  };
}
/* LOGOUT */
export function logout() {
  return async function (dispatch) {
    endSession();
    try {
      dispatch({
        type: action.LOGOUT,
      });

      return console.log("usuario deslogueado");
    } catch (error) {
      return console.error(error);
    }
  };
}
//-----------Create User from google LOGIN - HOT LOGIN---------
export function createUserGoogle(user) {
  return async function (dispatch) {
    try {
      let data = await axios.post(`${baseUrl}/users`, {
        ...user,
        photoURL: user.photoURL || null,
        areaCode: 549,
        phone: user.phoneNumber || null,
        birthdate: null,
        address: null,
        bio: null,
        notifications: { whatsapp: true, mail: true },
        gender: null,

        orders: null,
        permissions: ["user"],
        roles: ["user"],
      });

      let response = await axios.get(`${baseUrl}/users/${user.uid}`);

      response.data[0] && startSession(user);
      dispatch({
        type: action.LOGIN,
        payload: {
          loggedUser: getSession(),
          dataBaseUser: response.data[0],
        },
      });

      return console.log(data);
    } catch (error) {
      return console.error(error);
    }
  };
}
//-------------Create User from Form -------------------------------------
export function createUser(user) {
  return async function (dispatch) {
    try {
      let data = await axios.post(`${baseUrl}/users`, {
        ...user,
        photoURL: user.photoURL || null,
        areaCode: 549,
        phone: user.phoneNumber || null,
        birthdate: null,
        address: null,
        bio: null,
        notifications: { whatsapp: true, mail: true },
        gender: null,
        orders: null,
        permissions: ["user"],
        roles: ["user"],
      });

      dispatch({
        type: action.CREATE_USER,
      });

      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Usuario creado exitosamente",
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
          message: "Error al crear usuario",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//---------------UpdateUser--------------------
export function updateUser(user) {
  return async function (dispatch) {
    try {
      let response = await axios.patch(`${baseUrl}/users/${user.uid}`, user);

      dispatch({
        type: action.PATCH_USER,
        payload: response.data[0],
      });

      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Datos actualizados exitosamente.",
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
          message:
            "Hubo un error al actualizar sus datos, intente nuevamente en unos minutos.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//---------------Add Address--------------------
export function addAddress(user, address) {
  return async function (dispatch) {
    try {
      let response = await axios.post(
        `${baseUrl}/users/${user.uid}/newAddress`,
        { user, address }
      );

      dispatch({
        type: action.ADD_ADDRESS,
        payload: {
          dataBaseUser: response.data[0],
          dataBaseAddresses: response.data.addresses,
        },
      });

      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "La dirección se creó exitosamente.",
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
          message: "Error al crear la dirección.",
          variant: "success",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//---------------Edit Address--------------------
export function editAddress(user, address) {
  return async function (dispatch) {
    try {
      console.log("bodyadres", address);
      let response = await axios.post(
        `${baseUrl}/users/${user.uid}/editAddress`,
        address
      );
      console.log(response.data);
      dispatch({
        type: action.EDIT_ADDRESS,
        payload: {
          dataBaseUser: response.data[0],
          dataBaseAddresses: response.data.addresses,
        },
      });

      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "La dirección se actualizó exitosamente",
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
          message: error.message,
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//--------------- Delete Address --------------------
export function deleteAddress(address) {
  return async function (dispatch) {
    try {
      let response = await axios.post(
        `${baseUrl}/users/${address.userUid}/deleteAddress`,
        address
      );
      dispatch({
        type: action.DELETE_ADDRESS,
        payload: {
          // dataBaseUser: response.data[0],
          dataBaseAddresses: response.data.addresses,
        },
      });

      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "La dirección se eliminó exitosamente",
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
          message:
            "La dirección no se pudo eliminar, intente nuevamente en unos minutos.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//--------------- UPLOAD FILE MULTER --------------------
export function uploadMulter(file) {
  return async function (dispatch) {
    try {
      let response = await axios.post(ApiConstants.PDF_CONVERTER_API_URL, file);

      let newDocumentsName = response.data;

      dispatch({
        type: action.UPLOAD_MULTER,
      });

      return newDocumentsName;
    } catch (error) {
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message:
            "Error al subir archivo. Verifica el tamaño y extensión del archivo.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//--------------- ADD TO CART --------------------
export function addToCart(user, order) {
  return async function (dispatch) {
    try {
      let response = await axios.post(`${baseUrl}/users/${user.uid}/cart`, {
        user,
        order,
      });

      dispatch({
        type: action.ADD_TO_CART,
        payload: {
          dataBaseCart: response.data.cart,
        },
      });

      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "La orden se agregó al carrito exitosamente.",
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
          message: "Error al crear orden.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//--------------- GET CART ORDER TO EDIT --------------------
// export function getCartOrder(user, order) {
//   return async function (dispatch) {
//     try {
//       // let response = await axios.get(
//       //   `${baseUrl}/users/${user.uid}/cart/${idOrder}`
//       // );

//       // console.log("LA RESPONSE", response.data);

//       return dispatch({
//         type: action.EDIT_ORDER,
//         payload: {
//           orderToEdit: order,
//         },
//       });
//     } catch (error) {
//       console.log(error);
//       return dispatch({
//         type: action.TOAST_ALERT,
//         payload: {
//           message: "Error al buscar orden para editar.",
//           variant: "error",
//           vertical: "top",
//           horizontal: "right",
//           open: true,
//         },
//       });
//     }
//   };
// }

//--------------- EDIT ORDER FROM CART --------------------
export function editOrderFromCart(user, idOrder, order) {
  return async function (dispatch) {
    try {
      let response = await axios.post(
        `${baseUrl}/users/${user.uid}/cart/${idOrder}`,
        order
      );

      dispatch({
        type: action.EDIT_ORDER,
        payload: {
          dataBaseCart: response.data,
        },
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
          message: "Error al buscar orden para editar.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//--------------- DELETE ALL CART --------------------
export function deleteAllCart(user) {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${baseUrl}/users/${user.uid}/deleteCart`);

      dispatch({
        type: action.DELETE_CART,
        payload: {
          dataBaseCart: null,
          dataBaseUser: response.data.user[0],
        },
      });

      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "El carrito se vació correctamente.",
          variant: "success",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    } catch (error) {
      console.log(error);
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Error al vaciar carrito.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//--------------- DELETE ORDER FROM CART --------------------
export function deleteOrderFromCart(user, idOrder) {
  return async function (dispatch) {
    try {
      let response = await axios.delete(
        `${baseUrl}/users/${user.uid}/cart/${idOrder}`
      );

      dispatch({
        type: action.DELETE_ORDER,
        payload: {
          dataBaseCart: response.data.cartRef,
          dataBaseUser: response.data.user[0],
        },
      });

      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Orden eliminada correctamente.",
          variant: "success",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    } catch (error) {
      console.log(error);
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Error al buscar orden para editar.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//--------------- SET TOAST --------------------
// export function addNewPaidOrder(user, idPay) {
//   return async function (dispatch) {
//     try {
//       let response = await axios.post(
//         `${baseUrl}/payment/${user.uid}/paidOrder/${idPay}`
//       );

//       console.log(response.data);
//       dispatch({
//         type: action.CREATE_PAID_ORDER,
//         payload: {
//           dataBaseCart: null,
//           dataBaseUser: response.data.userRef,
//         },
//       });

//       return dispatch({
//         type: action.TOAST_ALERT,
//         payload: {
//           message: "Pedido cargado exitosamente.",
//           variant: "success",
//           vertical: "top",
//           horizontal: "right",
//           open: true,
//         },
//       });
//     } catch (error) {
//       console.log(error);
//       return dispatch({
//         type: action.TOAST_ALERT,
//         payload: {
//           message: "Error al crear el pedido.",
//           variant: "error",
//           vertical: "top",
//           horizontal: "right",
//           open: true,
//         },
//       });
//     }
//   };
// }
//--------------- ACTIVATE TOAST --------------------
export function setToast(message, variant) {
  return async function (dispatch) {
    try {
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: message,
          variant: variant,
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    } catch (error) {
      console.log(error);
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Error inesperado",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//--------------- SEND MAIL --------------------
// export function addNewPaidOrder(user, idPay) {
//   return async function (dispatch) {
//     try {
//       let response = await axios.post(
//         `${baseUrl}/payment/${user.uid}/paidOrder/${idPay}`
//       );

//       console.log(response.data);
//       dispatch({
//         type: action.CREATE_PAID_ORDER,
//         payload: {
//           dataBaseCart: null,
//           dataBaseUser: response.data.userRef,
//         },
//       });

//       return dispatch({
//         type: action.TOAST_ALERT,
//         payload: {
//           message: "Pedido cargado exitosamente.",
//           variant: "success",
//           vertical: "top",
//           horizontal: "right",
//           open: true,
//         },
//       });
//     } catch (error) {
//       console.log(error);
//       return dispatch({
//         type: action.TOAST_ALERT,
//         payload: {
//           message: "Error al crear el pedido.",
//           variant: "error",
//           vertical: "top",
//           horizontal: "right",
//           open: true,
//         },
//       });
//     }
//   };
// }
//--------------- ACTIVATE TOAST --------------------
export function sendMail(mail, subject, text) {
  return async function (dispatch) {
    try {
      let response = await axios.post(`${baseUrl}/mail`, {
        mail,
        subject,
        text,
      });

      return dispatch({
        type: action.SEND_EMAIL,
        payload: {
          message: subject,
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
          message: "Error inesperado",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//--------------- GET COUPONS --------------------
export function verifyCoupon(idCoupon) {
  return async function (dispatch) {
    try {
      let response = await axios.post(`${baseUrl}/coupons?${idCoupon}`, {
        idCoupon,
      });

      dispatch({
        type: action.SET_COUPON,
        payload: {
          coupon: response.data,
        },
      });
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Cupón agregado correctamente.",
          variant: "success",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    } catch (error) {
      dispatch({
        type: action.SET_COUPON,
        payload: {
          coupon: null,
        },
      });

      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "Código de cupón inválido.",
          variant: "error",
          vertical: "top",
          horizontal: "right",
          open: true,
        },
      });
    }
  };
}
//--------------- SET PLACE --------------------
export function setOrderPlace(place) {
  return async function (dispatch) {
    try {
      const { name, number, zipCode, locality, city } = place.address;
      let destinationAddress = `${name} ${number}, ${zipCode}, ${city}`;

      let { data } = await axios.get(
        `${baseUrl}/maps/distance?destinations=${destinationAddress}`
      );
      return dispatch({
        type: action.SET_PLACE,
        payload: {
          place: place,
          distance: data,
        },
      });
    } catch (error) {
      return dispatch({
        type: action.TOAST_ALERT,
        payload: {
          message: "No se ha podido establecer el lugar de envío.",
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
//--------------- GET ORDERS --------------------
export function getOrdersByClientUid(clientUid) {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${baseUrl}/orders/${clientUid}`);

      return dispatch({
        type: action.SET_CLIENT_ORDERS,
        payload: {
          clientOrders: response.data,
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
