import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./context/ProtectedRoute";
import Login from "./screens/NormalUser/Login/Login";

import { ThemeProvider } from "@mui/material";
import { mainTheme } from "./utils/themes/main-theme";
import Register from "./screens/NormalUser/Login/Register";
import {
  getLoggedUser,
  getOrdersByClientUid,
  getPricing,
} from "./redux/actions";
import { getSession } from "./utils/controllers";
import MyAccount from "./screens/NormalUser/MyAccount/MyAccount";
import "./utils/assets/Fonts/Poppins-Light.ttf";
import Error404 from "./screens/Error/Error404";
import RegisterSuccess from "./screens/NormalUser/Login/RegisterSuccess";
import NewOrder from "./screens/NormalUser/Orders/NewOrder";
import ToastAlert from "./components/Alerts/ToastAlert";
import Cart from "./screens/NormalUser/Cart/Cart";
import Pending from "./components/Mercadopago/Pending";
import Success from "./components/Mercadopago/Success";
import Failed from "./components/Mercadopago/Failed";
import Admin from "./screens/Admin/Admin";
import ResetPassword from "./screens/NormalUser/ResetPassword/ResetPassword";
import ChangePassword from "./screens/NormalUser/ResetPassword/ChangePassword";
import ResetSuccess from "./screens/NormalUser/ResetPassword/ResetSuccess";
import Printing from "./screens/PrinterUser/Printing";
import Delivery from "./screens/DeliveryUser/Delivery";
import TyC from "./screens/TermsAndConditions/TyC";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser);
  const dataBaseUser = useSelector((state) => state.dataBaseUser);
  const cart = useSelector((state) => state.cart);
  const sessionUser = getSession();

  useEffect(() => {
    if (sessionUser) {
      dispatch(getLoggedUser(sessionUser));
      // dispatch(getOrdersByClientUid(sessionUser.uid));
    }
  }, []);

  useEffect(() => {
    if (sessionUser) {
      dispatch(getPricing());
    }
  }, [cart]);

  useEffect(() => {
    if (dataBaseUser) {
      dataBaseUser.roles.includes("admin")
        ? navigate("/admin")
        : dataBaseUser.roles.includes("printing")
        ? navigate("/imprenta")
        : dataBaseUser.roles.includes("delivery")
        ? navigate("/delivery")
        : navigate("/");
    }
  }, [dataBaseUser]);

  return (
    <ThemeProvider theme={mainTheme}>
      <div className="relative flex flex-col h-screen">
        <ToastAlert />

        <Routes>
          <Route
            path="/login"
            element={
              <Login loggedUser={loggedUser} dataBaseUser={dataBaseUser} />
            }
          />
          <Route path="/terminosycondiciones" element={<TyC />} />
          <Route path="/recuperar-contraseña" element={<ResetPassword />} />
          <Route path="/restablecer-contraseña" element={<ChangePassword />} />
          <Route path="/reset-success" element={<ResetSuccess />} />
          <Route
            path="/success"
            element={<Success loggedUser={loggedUser} />}
          />
          <Route path="/failure" element={<Failed loggedUser={loggedUser} />} />
          <Route
            path="/pending"
            element={<Pending loggedUser={loggedUser} />}
          />
          <Route path="/registro" element={<Register />} />
          <Route
            path="/registrocompletadoexitosamente"
            element={<RegisterSuccess />}
          />
          <Route
            element={
              <ProtectedRoute isAllowed={!!loggedUser} redirectTo={"/login"} />
            }
          >
            <Route
              path="/"
              element={
                <MyAccount
                  loggedUser={loggedUser}
                  cart={cart}
                  dataBaseUser={dataBaseUser}
                />
              }
            />
            <Route
              path="/imprimir"
              element={<NewOrder loggedUser={loggedUser} />}
            />
            <Route path="/carrito" element={<Cart loggedUser={loggedUser} />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute
                isAllowed={
                  !!loggedUser && dataBaseUser?.roles?.includes("admin")
                }
                redirectTo={"/login"}
              >
                <Admin dataBaseUser={dataBaseUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/imprenta"
            element={
              <ProtectedRoute
                isAllowed={
                  !!loggedUser && dataBaseUser?.roles?.includes("printing")
                }
                redirectTo={"/login"}
              >
                <Printing dataBaseUser={dataBaseUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery"
            element={
              <ProtectedRoute
                isAllowed={
                  !!loggedUser && dataBaseUser?.roles?.includes("delivery")
                }
                redirectTo={"/login"}
              >
                <Delivery dataBaseUser={dataBaseUser} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
