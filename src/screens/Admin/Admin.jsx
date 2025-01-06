import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import EmailIcon from "@mui/icons-material/Email";
import { Avatar, Box, Drawer } from "@mui/material";
import contactCuate from "../../utils/assets/images/contact-cuate.svg";
import UsersApp from "./Menu/UsersApp";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import FAQ from "./FAQ";
import Notifications from "./Notifications";
import Chatbot from "../../components/Chatbot/Chatbot";
import Coupons from "./Menu/Coupons";
import { getAllOrders, getAllUsers } from "../../redux/actions/adminActions";
import Pricing from "./Menu/Pricing";
import Orders from "./Menu/Orders";

export default function Admin({ cart, dataBaseUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.dataBaseUser);

  const users = useSelector((state) => state.usersApp);

  useEffect(() => {
    dispatch(getAllUsers());
    // dispatch(getAllOrders());
  }, []);

  let { photoURL, email, displayName } = user;

  const [openCollapse, setOpenCollapse] = useState(false);
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
      <section className="bg-[#fff] p-8 h-screen flex flex-col  justify-around">
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
            // subheader={
            //   <ListSubheader component="div" id="nested-list-subheader">
            //     Nested List Items
            //   </ListSubheader>
            // }
          >
            DATOS
            <ListItemButton
              onClick={(e) => setDataRender("users")}
              sx={
                dataRender === "users"
                  ? { backgroundColor: "#458552", borderRadius: "10px" }
                  : { borderRadius: "10px" }
              }
              className="h-16"
            >
              <ListItemIcon>
                <PersonIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Usuarios" />
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
              <ListItemText primary="Pedidos" />
            </ListItemButton>
            <ListItemButton
              onClick={(e) => setDataRender("pricing")}
              sx={
                dataRender === "pricing"
                  ? { backgroundColor: "#458552", borderRadius: "10px" }
                  : { borderRadius: "10px" }
              }
              className="h-16"
            >
              <ListItemIcon>
                <PriceChangeIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Precios" />
            </ListItemButton>
            <ListItemButton
              onClick={(e) => setDataRender("coupons")}
              sx={
                dataRender === "coupons"
                  ? { backgroundColor: "#458552", borderRadius: "10px" }
                  : { borderRadius: "10px" }
              }
              className="h-16"
            >
              <ListItemIcon>
                <ConfirmationNumberIcon
                  sx={{ width: "2.5rem", height: "2.5rem" }}
                />
              </ListItemIcon>
              <ListItemText style={{}} primary="Cupones" />
            </ListItemButton>
            {/* CAMPAÑAS
            <ListItemButton
              onClick={(e) => setDataRender("Notifications")}
              sx={
                dataRender === "Notifications"
                  ? { backgroundColor: "#458552", borderRadius: "10px" }
                  : { borderRadius: "10px" }
              }
              className="h-16"
            >
              <ListItemIcon>
                <EmailIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Mailing" />
            </ListItemButton> */}
          </List>
        </div>
      </section>
    </Box>
  );

  return (
    <>
      <Navbar
        loggedUser={dataBaseUser}
        title={"Modo Administrador"}
        hideLogo={true}
      />
      <div className="flex justify-center gap-5 p-5 ">
        {/* <Chatbot /> */}
        {/* HAMBURGUESA - MENU MOBILE*/}
        <span className=" fixed top-5 left-5 z-50 ">
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
        {/* <section className="bg-[#fff] rounded-2xl p-8 hidden lg:w-3/12 lg:flex lg:flex-col justify-around gap-5">
          <div className="flex flex-col justify-center items-center gap-3">
            <Avatar
              alt="Xiro Avatar"
              sx={{ height: "4rem", width: "4rem" }}
              src={photoURL}
            />
            <span className="text-2xl">{displayName}</span>
            <span className="text-[1em] opacity-60">{email}</span>
          </div>

          <div className="">
            <List
              sx={{ opacity: 0.8 }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              // subheader={
              //   <ListSubheader component="div" id="nested-list-subheader">
              //     Nested List Items
              //   </ListSubheader>
              // }
            >
              DATOS
              <ListItemButton
                onClick={(e) => setDataRender("users")}
                sx={
                  dataRender === "users"
                    ? { backgroundColor: "#458552", borderRadius: "10px" }
                    : { borderRadius: "10px" }
                }
                className="h-16"
              >
                <ListItemIcon>
                  <PersonIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
                </ListItemIcon>
                <ListItemText primary="Usuarios" />
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
                <ListItemText primary="Pedidos" />
              </ListItemButton>
              <ListItemButton
                onClick={(e) => setDataRender("pricing")}
                sx={
                  dataRender === "pricing"
                    ? { backgroundColor: "#458552", borderRadius: "10px" }
                    : { borderRadius: "10px" }
                }
                className="h-16"
              >
                <ListItemIcon>
                  <PriceChangeIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
                </ListItemIcon>
                <ListItemText primary="Precios" />
              </ListItemButton>
              <ListItemButton
                onClick={(e) => setDataRender("coupons")}
                sx={
                  dataRender === "coupons"
                    ? { backgroundColor: "#458552", borderRadius: "10px" }
                    : { borderRadius: "10px" }
                }
                className="h-16"
              >
                <ListItemIcon>
                  <ConfirmationNumberIcon
                    sx={{ width: "2.5rem", height: "2.5rem" }}
                  />
                </ListItemIcon>
                <ListItemText style={{}} primary="Cupones" />
              </ListItemButton>
            </List>
          </div>
        </section> */}
        {/* --------- */}

        {/* ALL DATA */}
        <section className="bg-[#fff] rounded-2xl flex flex-col gap-5 justify-center  z-10 overflow-auto">
          {dataRender === "users" ? (
            <UsersApp users={users} />
          ) : dataRender === "orders" ? (
            <Orders editor={"adminUser"} />
          ) : dataRender === "pricing" ? (
            <Pricing user={user} />
          ) : dataRender === "coupons" ? (
            <Coupons user={user} />
          ) : (
            <UsersApp user={user} />
          )}
        </section>
      </div>
    </>
  );
}
