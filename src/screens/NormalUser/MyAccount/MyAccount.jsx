import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import PersonIcon from "@mui/icons-material/Person";
import { FaClipboardUser as PersonIcon } from "react-icons/fa6";

// import LocationOnIcon from "@mui/icons-material/LocationOn";
import { FaMapLocationDot as LocationOnIcon } from "react-icons/fa6";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { FaMedal } from "react-icons/fa6";
import { Avatar, Box, Button, Collapse, Drawer } from "@mui/material";

import PersonalData from "./PersonalData";
import AccountData from "./AccountData";
import AddressData from "./AddressData";
import Navbar from "../../../components/Navbar/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FAQ from "./FAQ";
import Notifications from "./Notifications";
import Chatbot from "../../../components/Chatbot/Chatbot";
import { useEffect } from "react";
import { getOrdersByClientUid, setToast } from "../../../redux/actions";
import LibraryStore from "./LibraryStore";
import { twMerge } from "tailwind-merge";
import propTypes from "prop-types";
import { ShoppingCart } from "@mui/icons-material";
// import AlertModal from "../../../components/Alerts/AlertModal";

export default function MyAccount({ cart, dataBaseUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.dataBaseUser);
  const clientOrders = useSelector((state) => state.clientOrders);
  let { photoURL, email, displayName } = user;
  const [openCollapse, setOpenCollapse] = useState(false);
  const cartReferral = useLocation().search == "?libreria";
  /* Lógica de hamburguesa */
  const [dataRender, setDataRender] = useState(
    cartReferral ? "libraryStore" : "personalData"
  );
  const [state, setState] = useState({
    left: false,
  });

  useEffect(() => {
    dispatch(getOrdersByClientUid(dataBaseUser.uid));
  }, []); // eslint-disable-line

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{
        borderRadius: "10px",
        ":hover": { backgroundColor: "#c9d9bb" },
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <section className="bg-[#fff] p-8 h-screen flex flex-col lg:hidden justify-around">
        {/* DATOS SESION */}
        <div className="flex flex-col justify-center items-center gap-3">
          <Avatar
            alt="Xiro Avatar"
            sx={{ height: "4rem", width: "4rem" }}
            src={photoURL}
          />
          <span className="text-2xl">{displayName}</span>
          <span className="text-[1em] opacity-60">{email}</span>
        </div>
        {/* MENU */}
        <div className="">
          <List
            sx={{ opacity: 1 }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            MI PERFIL
            <ListItemButton
              onClick={() => setDataRender("personalData")}
              sx={
                dataRender === "personalData"
                  ? {
                      backgroundColor: "#81A165",
                      borderRadius: "10px",
                      ":hover": { backgroundColor: "#c9d9bb" },
                    }
                  : {
                      borderRadius: "10px",
                      ":hover": { backgroundColor: "#c9d9bb" },
                    }
              }
              className="h-20 m-5"
            >
              <ListItemIcon>
                <PersonIcon style={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Datos personales" />
            </ListItemButton>
            {/* <ListItemButton
              onClick={() => setDataRender("libraryStore")}
              sx={
                dataRender === "libraryStore"
                  ? {
                      backgroundColor: "#81A165",
                      borderRadius: "10px",
                      ":hover": { backgroundColor: "#c9d9bb" },
                    }
                  : {
                      borderRadius: "10px",
                      ":hover": { backgroundColor: "#c9d9bb" },
                    }
              }
              className="h-16"
            >
              <ListItemIcon>
                <ShoppingCart style={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText style={{}} primary="Librería" />
            </ListItemButton> */}
            <ListItemButton
              onClick={() => setDataRender("accountData")}
              sx={
                dataRender === "accountData"
                  ? {
                      backgroundColor: "#81A165",
                      borderRadius: "10px",
                      ":hover": { backgroundColor: "#c9d9bb" },
                    }
                  : {
                      borderRadius: "10px",
                      ":hover": { backgroundColor: "#c9d9bb" },
                    }
              }
              className="h-16 "
            >
              <ListItemIcon>
                <FaMedal style={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Historial" />
            </ListItemButton>
            <ListItemButton
              onClick={() => setDataRender("addressData")}
              sx={
                dataRender === "addressData"
                  ? {
                      backgroundColor: "#81A165",
                      borderRadius: "10px",
                      ":hover": { backgroundColor: "#c9d9bb" },
                    }
                  : {
                      borderRadius: "10px",
                      ":hover": { backgroundColor: "#c9d9bb" },
                    }
              }
              className="h-16"
            >
              <ListItemIcon>
                <LocationOnIcon style={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText style={{}} primary="Direcciones de envío" />
            </ListItemButton>
          </List>
        </div>
        <button
          onClick={() => setDataRender("FAQ")}
          className="hover:bg-[#81A165] hover:text-white self-center flex items-center justify-around rounded-lg p-2 w-fit  border border-gray-300"
        >
          <div className="flex gap-1">
            <span className="text-sm md:text-[12px] font-[400]">
              Preguntas Frecuentes
            </span>
          </div>
        </button>
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-medium self-center hover:underline">
            XIRO®
          </h4>
          <Link
            to={"/terminosycondiciones"}
            className="text-sm font-medium self-center hover:underline"
          >
            Términos y condiciones de uso
          </Link>
        </div>
      </section>
    </Box>
  );
  /*  */
  function handleOpenCollapse() {
    setOpenCollapse(!openCollapse);
  }

  function handleNewOrderButton() {
    if (dataBaseUser.phone) {
      navigate("/imprimir");
    } else {
      dispatch(
        setToast(
          "Debes completar tu número de teléfono y/o fecha de nacimiento para continuar.",
          "warning"
        )
      );
    }
  }

  return (
    <>
      <Navbar cart={cart} loggedUser={dataBaseUser} title={"Cuenta"} />
      <div className="flex justify-center gap-5 p-5 ">
        <Chatbot />
        {/* HAMBURGUESA - MENU MOBILE*/}
        <span className="lg:hidden fixed top-5 left-5 z-50 ">
          <MenuIcon onClick={toggleDrawer("left", true)} className="" />
          <Drawer
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
          >
            {list("left")}
          </Drawer>
        </span>
        {/* ---MENU EN VISTA PC------- */}
        <section className="bg-[#fff] rounded-2xl p-8 hidden lg:w-3/12 lg:flex lg:flex-col justify-around gap-5">
          {/* DATOS SESION */}
          <div className="flex flex-col justify-center items-center gap-3">
            <Avatar
              alt="Xiro Avatar"
              sx={{ height: "4rem", width: "4rem" }}
              src={photoURL}
            />
            <span className="text-2xl">{displayName}</span>
            <span className="text-[1em] opacity-60">{email}</span>
          </div>
          {/* MENU */}
          <div className="">
            <List
              sx={{ opacity: 0.8 }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              MI PERFIL
              <ListItemButton
                onClick={() => setDataRender("personalData")}
                sx={
                  dataRender === "personalData"
                    ? {
                        backgroundColor: "#81A165",
                        borderRadius: "10px",
                        ":hover": { backgroundColor: "#c9d9bb" },
                      }
                    : {
                        borderRadius: "10px",
                        ":hover": { backgroundColor: "#c9d9bb" },
                      }
                }
                className="h-16 "
              >
                <ListItemIcon>
                  <PersonIcon style={{ width: "2.5rem", height: "2.5rem" }} />
                </ListItemIcon>
                <ListItemText primary="Datos personales" />
              </ListItemButton>
              {/* <ListItemButton
                onClick={() => setDataRender("libraryStore")}
                sx={
                  dataRender === "libraryStore"
                    ? {
                        backgroundColor: "#81A165",
                        borderRadius: "10px",
                        ":hover": { backgroundColor: "#c9d9bb" },
                      }
                    : {
                        borderRadius: "10px",
                        ":hover": { backgroundColor: "#c9d9bb" },
                      }
                }
                className="h-16"
              >
                <ListItemIcon>
                  <ShoppingCart style={{ width: "2.5rem", height: "2.5rem" }} />
                </ListItemIcon>
                <ListItemText style={{}} primary="Librería" />
              </ListItemButton> */}
              <ListItemButton
                onClick={() => setDataRender("accountData")}
                sx={
                  dataRender === "accountData"
                    ? {
                        backgroundColor: "#81A165",
                        borderRadius: "10px",
                        ":hover": { backgroundColor: "#c9d9bb" },
                      }
                    : {
                        borderRadius: "10px",
                        ":hover": { backgroundColor: "#c9d9bb" },
                      }
                }
                className="h-16 "
              >
                <ListItemIcon>
                  <FaMedal style={{ width: "2.5rem", height: "2.5rem" }} />
                </ListItemIcon>
                <ListItemText primary="Historial" />
              </ListItemButton>
              <ListItemButton
                onClick={() => setDataRender("addressData")}
                sx={
                  dataRender === "addressData"
                    ? {
                        backgroundColor: "#81A165",
                        borderRadius: "10px",
                        ":hover": { backgroundColor: "#c9d9bb" },
                      }
                    : {
                        borderRadius: "10px",
                        ":hover": { backgroundColor: "#c9d9bb" },
                      }
                }
                className="h-16 "
              >
                <ListItemIcon>
                  <LocationOnIcon
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  />
                </ListItemIcon>
                <ListItemText style={{}} primary="Direcciones de envío" />
              </ListItemButton>
            </List>
          </div>

          <button
            onClick={() => setDataRender("FAQ")}
            className="hover:bg-[#81A165] self-center flex items-center justify-around rounded-lg p-2 w-fit  border border-gray-300"
          >
            <div className="flex gap-1">
              <span className="text-sm md:text-[12px] font-[400]">
                Preguntas frecuentes
              </span>
              <span className="text-sm md:text-[14px] font-[600]"> </span>
            </div>
          </button>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-medium self-center hover:underline">
              XIRO®
            </h4>
            <Link
              to={"/terminosycondiciones"}
              className="text-sm font-medium self-center hover:underline"
            >
              Términos y condiciones de uso
            </Link>
          </div>
        </section>
        {/* --------- */}

        {/* ALL DATA */}
        <section className="flex flex-col gap-5 justify-start lg:w-9/12 z-10">
          <div
            className={twMerge(
              dataRender == "libraryStore" ? "hidden" : "flex",
              "flex-col gap-5 bg-[#fff] rounded-2xl lg:h-1/3 p-5"
            )}
          >
            <div className="flex">
              {/* NUEVO PEDIDO */}
              <div className="flex flex-col w-full lg:w-1/3 gap-6 ">
                <span className="text-2xl lg:text-3xl w-52">¡Bienvenid@!</span>
                <Button
                  variant="contained"
                  className="flex flex-col-reverse md:flex-row justify-between w-full lg:w-full lg:p-4 lg:h-24"
                  sx={{
                    border: "1px solid white",
                    text: "white",
                    borderRadius: "10px",
                    ":hover": { backgroundColor: "#c9d9bb" },
                  }}
                  color="primary"
                  onClick={(e) => handleNewOrderButton(e)}
                >
                  <span className="text-white lg:text-lg font-bold">
                    Nuevo pedido
                  </span>
                </Button>
                {/* <AlertModal /> */}
              </div>
              {/* MIS PEDIDOS VISTA PC */}
              {dataRender === "accountData" && (
                <div className="hidden w-1/3 lg:flex lg:flex-col items-center">
                  <div className="px-2 py-5">
                    <span className="text-3xl">Mis pedidos</span>
                  </div>
                  <div className="flex">
                    <div className="flex flex-col gap-3 items-start px-2 ">
                      <span className="text-[14px] opacity-70">
                        PEDIDOS EN CURSO
                      </span>
                      <span className="text-3xl ">
                        {
                          clientOrders?.filter(
                            (order) => order.orderStatus !== "received"
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 items-start px-2 border-l border-white">
                      <span className="text-[14px] opacity-70">HISTÓRICOS</span>
                      <span className="text-3xl"> {clientOrders?.length}</span>
                    </div>
                  </div>
                </div>
              )}
              {/* CUATE */}
              <div className="hidden lg:w-1/3 md:flex justify-end">
                {/* <img
                  src={cuate}
                  alt="fotocopia"
                  className="w-64 lg:w-48 p-2 object-contain"
                /> */}
              </div>
            </div>
            {/* MIS PEDIDOS VISTA MOBILE */}
            {dataRender == "accountData" && (
              <div className="lg:hidden">
                <List>
                  <ListItemButton onClick={handleOpenCollapse}>
                    <ListItemText primary="Mis pedidos" />
                    {openCollapse ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                    <div className="flex ml-2">
                      <div className="flex flex-col gap-1 items-start px-2 ">
                        <span className="text-sm opacity-70">
                          PEDIDOS EN CURSO
                        </span>
                        <span className="text-xl ">
                          {
                            clientOrders?.filter(
                              (order) => order.orderStatus !== "received"
                            ).length
                          }
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 items-start px-2 border-l border-white">
                        <span className="text-sm opacity-70">HISTÓRICOS</span>
                        <span className="text-xl"> {clientOrders?.length}</span>
                      </div>
                    </div>
                  </Collapse>
                </List>
              </div>
            )}
          </div>
          {dataRender == "personalData" ? (
            <PersonalData user={user} />
          ) : dataRender == "accountData" ? (
            <AccountData user={user} />
          ) : dataRender == "addressData" ? (
            <AddressData user={user} />
          ) : dataRender == "FAQ" ? (
            <FAQ />
          ) : dataRender == "Notifications" ? (
            <Notifications user={user} />
          ) : dataRender == "libraryStore" ? (
            <LibraryStore />
          ) : (
            <PersonalData user={user} />
          )}
        </section>
      </div>
    </>
  );
}

MyAccount.propTypes = {
  cart: propTypes.array,
  dataBaseUser: propTypes.object,
};
