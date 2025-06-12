import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./context/ProtectedRoute";
import Login from "./screens/NormalUser/Login/Login";
import { ThemeProvider } from "@mui/material";
import { mainTheme } from "./utils/themes/main-theme";
import Register from "./screens/NormalUser/Login/Register";
import { getLoggedUser, getInAppLabels, getPricing } from "./redux/actions";
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
import PickUp from "./screens/PickUpUser/Pickup";
import Distribution from "./screens/DistributionUser/Distribution";
import { roleIs } from "./Common/helpers";

function App() {
  // const APP_VERSION = Settings.FRONTEND_VERSION;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = getSession();
  const cart = useSelector(state => state.cart);
  const loggedUser = useSelector(state => state.loggedUser);
  const dataBaseUser = useSelector(state => state.dataBaseUser);

  // useEffect(() => {
  //   cleanUpResources(APP_VERSION);
  // }, [APP_VERSION]);pathname

  useEffect(() => {
    if (sessionUser) {
      dispatch(getLoggedUser(sessionUser));
      dispatch(getInAppLabels());
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (sessionUser) {
      dispatch(getPricing());
    }
  }, [cart]);

  useEffect(() => handleRole(), [dataBaseUser]);

  function handleRole() {
    if (location.pathname == "/success") return;

    if (!dataBaseUser) {
      navigate("/login");
      return;
    }

    const roleRoutes = {
      admin: "/admin",
      printing: "/imprenta",
      distribution: "/distribucion",
      delivery: "/delivery",
      pickup: "/pickup",
    };

    const route = Object.keys(roleRoutes).find(role => roleIs(role)) || "/";
    navigate(route);
  }

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
              <ProtectedRoute isAllowed={!!loggedUser} redirectTo="/login" />
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
                isAllowed={!!loggedUser && roleIs("admin")}
                redirectTo="/login"
              >
                <Admin dataBaseUser={dataBaseUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/imprenta"
            element={
              <ProtectedRoute
                isAllowed={!!loggedUser && roleIs("printing")}
                redirectTo="/login"
              >
                <Printing dataBaseUser={dataBaseUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/distribucion"
            element={
              <ProtectedRoute
                isAllowed={!!loggedUser && roleIs("distribution")}
                redirectTo="/login"
              >
                <Distribution dataBaseUser={dataBaseUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pickup"
            element={
              <ProtectedRoute
                isAllowed={!!loggedUser && roleIs("pickup")}
                redirectTo="/login"
              >
                <PickUp dataBaseUser={dataBaseUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery"
            element={
              <ProtectedRoute
                isAllowed={!!loggedUser && roleIs("delivery")}
                redirectTo="/login"
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
