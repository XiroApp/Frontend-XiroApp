import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { FaClipboardUser as PersonIcon } from "react-icons/fa6";
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
import { AddCircle, ShoppingCart } from "@mui/icons-material";
import { len } from "../../../Common/helpers";

export default function MyAccount({ cart, dataBaseUser }) {
  const navigate = useNavigate(),
    dispatch = useDispatch(),
    user = useSelector(state => state.dataBaseUser),
    clientOrders = useSelector(state => state.clientOrders),
    [openCollapse, setOpenCollapse] = useState(false),
    cartRef = useLocation().search == "?libreria",
    [render, setRender] = useState(cartRef ? "library" : "personalData"),
    [state, setState] = useState({ left: false });
  let { photoURL, email, displayName } = user;

  useEffect(() => {
    dispatch(getOrdersByClientUid(dataBaseUser.uid));
  }, []);

  const toggleDrawer = (anchor, open) => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = anchor => (
    <Box
      sx={{
        borderRadius: "10px",
        ":hover": { backgroundColor: "#c9d9bb" },
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <section className="bg-white p-8 h-screen flex flex-col lg:hidden justify-around">
        <div className="flex flex-col justify-center items-center gap-3">
          <Avatar
            alt="Xiro Avatar"
            sx={{ height: "4rem", width: "4rem" }}
            src={photoURL}
          />
          <span className="text-2xl">{displayName}</span>
          <span className="text-[1em] opacity-60">{email}</span>
        </div>
        <List
          sx={{ opacity: 1 }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton
            onClick={() => setRender("personalData")}
            sx={
              render == "personalData"
                ? {
                    backgroundColor: "#9eae90",
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
          <ListItemButton
            onClick={() => setRender("library")}
            sx={
              render == "library"
                ? {
                    backgroundColor: "#9eae90",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    ":hover": {
                      backgroundColor: "#c9d9bb",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                    },
                  }
                : {
                    borderRadius: "10px",
                    transition: "all 0.3s ease",
                    ":hover": {
                      backgroundColor: "#c9d9bb",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    },
                  }
            }
            className="h-16"
          >
            <ListItemIcon>
              <ShoppingCart style={{ width: "2.5rem", height: "2.5rem" }} />
            </ListItemIcon>
            <ListItemText primary="Librería" />
          </ListItemButton>
          <ListItemButton
            onClick={() => setRender("accountData")}
            sx={
              render == "accountData"
                ? {
                    backgroundColor: "#9eae90",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    ":hover": {
                      backgroundColor: "#c9d9bb",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                    },
                  }
                : {
                    borderRadius: "10px",
                    transition: "all 0.3s ease",
                    ":hover": {
                      backgroundColor: "#c9d9bb",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    },
                  }
            }
            className="h-16"
          >
            <ListItemIcon>
              <FaMedal style={{ width: "2.5rem", height: "2.5rem" }} />
            </ListItemIcon>
            <ListItemText primary="Historial" />
          </ListItemButton>
          <ListItemButton
            onClick={() => setRender("addressData")}
            sx={
              render == "addressData"
                ? {
                    backgroundColor: "#9eae90",
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
            <ListItemText primary="Direcciones de envío" />
          </ListItemButton>
        </List>
        <div className="flex flex-col gap-y-2 justify-start items-center w-full pt-2">
          <button
            onClick={() => setRender("FAQ")}
            className="text-[13px] font-medium hover:underline"
          >
            Preguntas Frecuentes
          </button>
          <Link
            to="/terminosycondiciones"
            className="text-[13px] font-medium hover:underline"
          >
            Términos y Condiciones
          </Link>
          <p className="text-sm font-medium">XIRO®</p>
        </div>
      </section>
    </Box>
  );

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
        {render != "library" && <Chatbot />}
        <span className="lg:hidden fixed top-5 left-5 z-50">
          <MenuIcon onClick={toggleDrawer("left", true)} className="bg-white" />
          <Drawer
            anchor="left"
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
          >
            {list("left")}
          </Drawer>
        </span>
        <section className="bg-white border-2 border-green-100 rounded-2xl p-8 hidden lg:w-3/12 lg:flex lg:flex-col justify-start items-center gap-5">
          <div className="flex flex-col justify-center items-center gap-3">
            <Avatar
              alt="Xiro Avatar"
              sx={{ height: "4rem", width: "4rem" }}
              src={photoURL}
            />
            <span className="text-2xl">{displayName}</span>
            <span className="text-[1em] opacity-60">{email}</span>
          </div>
          <ul className="space-y-2 mt-6">
            <ListItemButton
              onClick={() => setRender("personalData")}
              sx={
                render == "personalData"
                  ? {
                      backgroundColor: "#9eae90",
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                      ":hover": {
                        backgroundColor: "#c9d9bb",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                      },
                    }
                  : {
                      borderRadius: "10px",
                      transition: "all 0.3s ease",
                      ":hover": {
                        backgroundColor: "#c9d9bb",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      },
                    }
              }
              className="h-16"
            >
              <ListItemIcon>
                <PersonIcon style={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Datos personales" />
            </ListItemButton>
            <ListItemButton
              onClick={() => setRender("library")}
              sx={
                render == "library"
                  ? {
                      backgroundColor: "#9eae90",
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                      ":hover": {
                        backgroundColor: "#c9d9bb",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                      },
                    }
                  : {
                      borderRadius: "10px",
                      transition: "all 0.3s ease",
                      ":hover": {
                        backgroundColor: "#c9d9bb",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      },
                    }
              }
              className="h-16"
            >
              <ListItemIcon>
                <ShoppingCart style={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Librería" />
            </ListItemButton>
            <ListItemButton
              onClick={() => setRender("accountData")}
              sx={
                render == "accountData"
                  ? {
                      backgroundColor: "#9eae90",
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                      ":hover": {
                        backgroundColor: "#c9d9bb",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                      },
                    }
                  : {
                      borderRadius: "10px",
                      transition: "all 0.3s ease",
                      ":hover": {
                        backgroundColor: "#c9d9bb",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      },
                    }
              }
              className="h-16"
            >
              <ListItemIcon>
                <FaMedal style={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Historial" />
            </ListItemButton>
            <ListItemButton
              onClick={() => setRender("addressData")}
              sx={
                render == "addressData"
                  ? {
                      backgroundColor: "#9eae90",
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                      ":hover": {
                        backgroundColor: "#c9d9bb",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                      },
                    }
                  : {
                      borderRadius: "10px",
                      transition: "all 0.3s ease",
                      ":hover": {
                        backgroundColor: "#c9d9bb",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      },
                    }
              }
              className="h-16"
            >
              <ListItemIcon>
                <LocationOnIcon style={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Direcciones de envío" />
            </ListItemButton>
          </ul>

          <div className="flex flex-col gap-y-2 justify-start items-center w-full pt-2">
            <button
              onClick={() => setRender("FAQ")}
              className="text-[13px] font-medium hover:underline"
            >
              Preguntas Frecuentes
            </button>
            <Link
              to="/terminosycondiciones"
              className="text-[13px] font-medium hover:underline"
            >
              Términos y Condiciones
            </Link>
            <p className="text-sm font-medium">XIRO®</p>
          </div>
        </section>

        <section className="flex flex-col gap-5 justify-start lg:w-9/12 z-10">
          <div
            className={twMerge(
              render == "library" ? "hidden" : "flex",
              "flex-col gap-5 bg-[#fff] rounded-2xl lg:h-1/3 p-5"
            )}
          >
            <div className="flex w-full">
              <div className="flex flex-col w-full gap-6 justify-center items-center lg:items-start">
                <span className="text-2xl lg:text-3xl w-full text-center lg:text-start">
                  ¡Bienvenid@ {displayName}!
                </span>
                <Button
                  variant="contained"
                  className="flex justify-between w-full h-20 lg:w-full lg:p-4 lg:h-24 max-w-xs"
                  sx={{
                    border: "1px solid white",
                    text: "white",
                    borderRadius: "10px",
                    ":hover": { backgroundColor: "#196925" },
                  }}
                  startIcon={<AddCircle sx={{ width: 30, height: 30 }} />}
                  color="primary"
                  onClick={e => handleNewOrderButton(e)}
                >
                  <span className="text-white text-lg lg:text-2xl font-bold">
                    Nuevo pedido
                  </span>
                </Button>
              </div>
              {render == "accountData" && (
                <div className="hidden lg:flex lg:flex-col w-full justify-center items-center gap-y-3">
                  <span className="text-3xl text-center w-full">
                    Mis pedidos
                  </span>
                  <div className="flex justify-start items-start gap-x-2">
                    <div className="flex flex-col gap-1 border-2 rounded-md py-3 w-[120px] items-center">
                      <span className="text-[14px] opacity-70">EN CURSO</span>
                      <span className="text-3xl ">
                        {len(
                          clientOrders?.filter(
                            order => order.orderStatus !== "received"
                          )
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 border-2 rounded-md py-3 w-[120px] items-center">
                      <span className="text-[14px] opacity-70">HISTÓRICOS</span>
                      <span className="text-3xl">{len(clientOrders)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {render == "accountData" && (
              <div className="lg:hidden">
                <List>
                  <ListItemButton onClick={handleOpenCollapse}>
                    <ListItemText primary="Mis pedidos" />
                    {openCollapse ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                    <div className="flex ml-2">
                      <div className="flex flex-col gap-1 items-start px-2 ">
                        <span className="text-sm opacity-70">EN CURSO</span>
                        <span className="text-xl ">
                          {len(
                            clientOrders?.filter(
                              order => order.orderStatus != "received"
                            )
                          )}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 items-start px-2 border-l border-white">
                        <span className="text-sm opacity-70">HISTÓRICOS</span>
                        <span className="text-xl"> {len(clientOrders)}</span>
                      </div>
                    </div>
                  </Collapse>
                </List>
              </div>
            )}
          </div>
          {render == "personalData" ? (
            <PersonalData user={user} />
          ) : render == "accountData" ? (
            <AccountData user={user} />
          ) : render == "addressData" ? (
            <AddressData user={user} />
          ) : render == "FAQ" ? (
            <FAQ />
          ) : render == "Notifications" ? (
            <Notifications user={user} />
          ) : render == "library" ? (
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
