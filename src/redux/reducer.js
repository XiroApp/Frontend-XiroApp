import * as action from "../redux/actions/actionTypes";

const initialState = {
  loggedUser: null,
  dataBaseUser: null,
  addresses: null,
  cart: null,
  clientOrders: [],
  files: [],
  coupon: null,
  place: null,
  distance: null,
  pricing: null,
  shipment: null,
  toastAlert: {
    message: "",
    variant: "",
    open: false,
    vertical: "top",
    horizontal: "right",
  },
  usersApp: [],
  orders: [],
  adminCoupons: null,
  printingUsers: [],
};

export default function rootReducer(state = initialState, { type, payload }) {
  switch (type) {
    /* ADMIN ACTIONS */
    case action.UPDATE_ROLE: {
      return {
        ...state,
        usersApp: payload.users,
      };
    }
    case action.EDIT_STATUS_ORDERS: {
      return {
        ...state,
        orders: payload.orders,
      };
    }
    case action.GET_ALL_ORDERS: {
      return {
        ...state,
        orders: payload.orders,
      };
    }
    case action.EDIT_PRICE: {
      return {
        ...state,
        pricing: payload.pricing,
      };
    }
    case action.GET_PRINTING_USERS: {
      return {
        ...state,
        printingUsers: payload.printingUsers,
      };
    }
    case action.GET_ALL_USERS: {
      return {
        ...state,
        usersApp: payload.users,
      };
    }
    case action.DELETE_COUPON: {
      return {
        ...state,
        // adminCoupons: payload.coupons,
      };
    }
    case action.EDIT_COUPON: {
      return {
        ...state,
        // adminCoupons: payload.coupons,
      };
    }
    case action.CREATE_COUPON: {
      return {
        ...state,
        // adminCoupons: payload.coupons,
      };
    }
    case action.GET_ALL_COUPONS: {
      return {
        ...state,
        adminCoupons: payload.coupons,
      };
    }
    /* USERS ACTIONS */
    case action.SET_CLIENT_ORDERS: {
      return {
        ...state,
        clientOrders: payload.clientOrders,
      };
    }
    case action.CREATE_PAID_ORDER: {
      return {
        ...state,
        cart: payload.dataBaseCart,
        dataBaseUser: payload.dataBaseUser,
      };
    }
    case action.SET_PLACE: {
      return {
        ...state,
        place: payload.place,
        distance: payload.distance,
      };
    }
    case action.SET_PRICE: {
      return {
        ...state,
        pricing: payload.pricing,
        shipment: payload.shipment,
      };
    }
    case action.SET_COUPON: {
      return {
        ...state,
        coupon: payload.coupon,
      };
    }
    case action.DELETE_CART: {
      return {
        ...state,
        cart: payload.dataBaseCart,
        dataBaseUser: payload.dataBaseUser,
      };
    }
    case action.DELETE_ORDER: {
      return {
        ...state,
        cart: payload.dataBaseCart,
        dataBaseUser: payload.dataBaseUser,
      };
    }
    case action.EDIT_ORDER: {
      return {
        ...state,

        cart: payload.dataBaseCart,
      };
    }
    case action.ADD_TO_CART: {
      return {
        ...state,
        cart: payload.dataBaseCart,
      };
    }
    case action.TOAST_ALERT: {
      return {
        ...state,
        toastAlert: payload,
      };
    }
    case action.UPLOAD_MULTER: {
      return {
        ...state,
      };
    }
    case action.EDIT_ADDRESS: {
      return {
        ...state,
        dataBaseUser: payload.dataBaseUser,
        addresses: payload.dataBaseAddresses,
      };
    }
    case action.DELETE_ADDRESS: {
      return {
        ...state,
        // dataBaseUser: payload.dataBaseUser,
        addresses: payload.dataBaseAddresses,
      };
    }
    case action.ADD_ADDRESS: {
      return {
        ...state,
        // dataBaseUser: payload.dataBaseUser,
        addresses: payload.dataBaseAddresses,
      };
    }
    case action.PATCH_USER: {
      return {
        ...state,
        dataBaseUser: payload,
      };
    }
    case action.SEND_EMAIL: {
      return {
        ...state,
      };
    }
    case action.CREATE_USER: {
      return {
        ...state,
      };
    }

    case action.LOGIN: {
      return {
        ...state,
        loggedUser: payload.loggedUser,
        dataBaseUser: payload.dataBaseUser,
        addresses: payload.dataBaseAddresses,
        cart: payload.dataBaseCart,
      };
    }
    case action.LOGOUT: {
      return {
        ...state,
        loggedUser: null,
        dataBaseUser: null,
      };
    }

    case action.GET_USER_PROFILE: {
      return {
        ...state,
        loggedUser: payload.loggedUser,
        dataBaseUser: payload.dataBaseUser,
        addresses: payload.dataBaseAddresses,
        cart: payload.dataBaseCart,
      };
    }

    default:
      return state;
  }
}
