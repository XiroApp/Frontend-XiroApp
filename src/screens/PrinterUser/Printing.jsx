import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { Avatar, Box, Drawer } from "@mui/material";
import contactCuate from "../../utils/assets/images/contact-cuate.svg";
import Navbar from "../../components/Navbar/Navbar";
import FAQ from "./FAQ";
import Chatbot from "../../components/Chatbot/Chatbot";
import { getAllUsers } from "../../redux/actions/adminActions";
import Orders from "./Menu/Orders";

export default function Printing({ cart, dataBaseUser }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.dataBaseUser);

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

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
      sx={{ width: "80vw", borderRadius: "10px" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <section className="bg-[#1e1e1e] p-8 h-screen flex flex-col lg:hidden justify-around">
        {/* DATOS SESION */}
        <div className="flex flex-col justify-center items-center gap-3">
        <Avatar
            alt="Limo Avatar"
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
                  ? { backgroundColor: "#272727", borderRadius: "10px" }
                  : { borderRadius: "10px" }
              }
              className="h-16"
            >
              <ListItemIcon>
                <PriceChangeIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Pedidos" />
            </ListItemButton>
          </List>
        </div>
        {/* <button
          onClick={(e) => setDataRender("FAQ")}
          className="bg-[#4675C0]  flex items-center justify-between rounded-2xl h-24 p-5"
        >
          {" "}
          <div className="flex flex-col">
            <span className="text-[12px] font-[400]">¿Tenés dudas?</span>
            <span className="text-[16px] font-[600]"> Hace click acá</span>
          </div>
          <div className="flex justify-end">
            <img src={contactCuate} alt="" className="h-20" />
          </div>
        </button> */}
      </section>
    </Box>
  );

  return (
    <>
      <Navbar loggedUser={dataBaseUser} title={"Modo Imprenta"} />
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
        <section className="bg-[#1e1e1e] rounded-2xl p-8 hidden lg:w-3/12 lg:flex lg:flex-col justify-around gap-5">
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
              DATOS
              <ListItemButton
                onClick={(e) => setDataRender("orders")}
                sx={
                  dataRender === "orders"
                    ? { backgroundColor: "#272727", borderRadius: "10px" }
                    : { borderRadius: "10px" }
                }
                className="h-16"
              >
                <ListItemIcon>
                  <PriceChangeIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
                </ListItemIcon>
                <ListItemText primary="Pedidos" />
              </ListItemButton>
            </List>
          </div>

          {/* <button
            onClick={(e) => setDataRender("FAQ")}
            className="bg-[#4675C0] flex items-center justify-around rounded-2xl h-24 p-5"
          >
            {" "}
            <div className="flex flex-col">
              <span className="text-sm md:text-[12px] font-[400]">
                ¿Tenés dudas?
              </span>
              <span className="text-sm md:text-[16px] font-[600]">
                {" "}
                Hace click acá
              </span>
            </div>
            <div className="flex justify-end">
              <img src={contactCuate} alt="" className="h-20" />
            </div>
          </button> */}
        </section>
        {/* --------- */}

        {/* ALL DATA */}
        <section className="bg-[#1e1e1e] rounded-2xl flex flex-col gap-5 justify-center lg:w-9/12 z-10  overflow-auto">
          {dataRender === "orders" ? (
            <Orders editor={"printingUser"} />
          ) : dataRender === "FAQ" ? (
            <FAQ />
          ) : (
            <Orders />
          )}
        </section>
      </div>
      
    </>
  );
}
