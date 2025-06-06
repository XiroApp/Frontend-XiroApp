import React, { useState } from "react";
import { useSelector } from "react-redux";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TurnSharpRightIcon from "@mui/icons-material/TurnSharpRight";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { Avatar, Box, Drawer } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Orders from "./Menu/Orders";
import DeliveryRoutes from "./Menu/DeliveryRoutes";
import OrdersPool from "./Menu/OrdersPool";
import { AddBusiness } from "@mui/icons-material";

export default function Delivery({ cart, dataBaseUser }) {
  const user = useSelector((state) => state.dataBaseUser);

  let { photoURL, email, displayName } = user;

  /* Lógica de hamburguesa */
  const [dataRender, setDataRender] = useState("orders");
  const [state, setState] = useState({
    left: false,
  });

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
            MENÚ
            <ListItemButton
              onClick={(e) => setDataRender("orders")}
              sx={
                dataRender === "orders"
                  ? { backgroundColor: "#458552", borderRadius: "10px" }
                  : { borderRadius: "10px" }
              }
              className="h-16"
            >
              <ListItemIcon>
                <PriceChangeIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Pedidos" />
            </ListItemButton>
            <ListItemButton
              onClick={(e) => setDataRender("pool")}
              sx={
                dataRender === "pool"
                  ? { backgroundColor: "#458552", borderRadius: "10px" }
                  : { borderRadius: "10px" }
              }
              className="h-16"
            >
              <ListItemIcon>
                <AddBusiness sx={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Buscar pedidos" />
            </ListItemButton>
            <ListItemButton
              onClick={(e) => setDataRender("entregas")}
              sx={
                dataRender === "entregas"
                  ? { backgroundColor: "#458552", borderRadius: "10px" }
                  : { borderRadius: "10px" }
              }
              className="h-16"
            >
              <ListItemIcon>
                <TurnSharpRightIcon
                  sx={{ width: "2.5rem", height: "2.5rem" }}
                />
              </ListItemIcon>
              <ListItemText primary="Rutas de Entrega" />
            </ListItemButton>
          </List>
        </div>
      </section>
    </Box>
  );

  return (
    <>
      <Navbar loggedUser={dataBaseUser} title={"Modo Delivery"} />
      <div className="flex justify-center gap-5 p-5 ">
        {/* <Chatbot /> */}
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
              alt="Remy Sharp"
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
           MENÚ

              <ListItemButton
                onClick={(e) => setDataRender("pool")}
                sx={
                  dataRender === "pool"
                    ? { backgroundColor: "#458552", borderRadius: "10px" }
                    : { borderRadius: "10px" }
                }
                className="h-16"
              >
                <ListItemIcon>
                  <AddBusiness sx={{ width: "2.5rem", height: "2.5rem" }} />
                </ListItemIcon>
                <ListItemText primary="Asignar lote de pedidos" />
              </ListItemButton>
              <ListItemButton
                onClick={(e) => setDataRender("orders")}
                sx={
                  dataRender === "orders"
                    ? { backgroundColor: "#458552", borderRadius: "10px" }
                    : { borderRadius: "10px" }
                }
                className="h-16"
              >
                <ListItemIcon>
                  <PriceChangeIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
                </ListItemIcon>
                <ListItemText primary="Pedidos Asignados" />
              </ListItemButton>
              <ListItemButton
                onClick={(e) => setDataRender("entregas")}
                sx={
                  dataRender === "entregas"
                    ? { backgroundColor: "#458552", borderRadius: "10px" }
                    : { borderRadius: "10px" }
                }
                className="h-16"
              >
                <ListItemIcon>
                  <TurnSharpRightIcon
                    sx={{ width: "2.5rem", height: "2.5rem" }}
                  />
                </ListItemIcon>
                <ListItemText primary="Rutas de Entrega" />
              </ListItemButton>
            </List>
          </div>
        </section>
        {/* --------- */}

        {/* ALL DATA */}
        <section className="bg-[#fff] rounded-2xl flex flex-col gap-5 justify-center lg:w-9/12 z-10  overflow-auto">
          {dataRender === "orders" ? (
            <Orders editor={"deliveryUser"} />
          ) : dataRender === "pool" ? (
            <OrdersPool />
          ) : (
            <DeliveryRoutes />
          )}
        </section>
      </div>
    </>
  );
}
