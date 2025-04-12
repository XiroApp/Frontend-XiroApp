import { useState } from "react";
import { useSelector } from "react-redux";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { Avatar, Box, Drawer } from "@mui/material";
import UsersApp from "./Menu/UsersApp";
import Navbar from "../../components/Navbar/Navbar";
import Coupons from "./Menu/Coupons";
import Pricing from "./Menu/Pricing";
import Orders from "./Menu/Orders";
import { StickyNote2 } from "@mui/icons-material";
import Texts from "./Menu/Texts";
import LibraryPanel from "../../components/Admin/LibraryPanel";

export default function Admin({ cart, dataBaseUser }) {
  const user = useSelector(state => state.dataBaseUser);

  const users = useSelector(state => state.usersApp);

  let { photoURL, email, displayName } = user;

  /* Lógica de hamburguesa */
  const [dataRender, setDataRender] = useState("orders");
  const [state, setState] = useState({
    left: false,
  });
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
          >
            DATOS
            <ListItemButton
              onClick={e => setDataRender("users")}
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
            {/* <ListItemButton
              onClick={() => setDataRender("library")}
              sx={
                dataRender === "library"
                  ? { backgroundColor: "#458552", borderRadius: "10px" }
                  : { borderRadius: "10px" }
              }
              className="h-16"
            >
              <ListItemIcon>
                <ShoppingBag sx={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText style={{}} primary="Librería" />
            </ListItemButton> */}
            <ListItemButton
              onClick={e => setDataRender("orders")}
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
              onClick={e => setDataRender("pricing")}
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
              onClick={e => setDataRender("coupons")}
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
            TEXTOS IN APP
            <ListItemButton
              onClick={e => setDataRender("Texts")}
              sx={
                dataRender === "Texts"
                  ? { backgroundColor: "#458552", borderRadius: "10px" }
                  : { borderRadius: "10px" }
              }
              className="h-16"
            >
              <ListItemIcon>
                <StickyNote2 sx={{ width: "2.5rem", height: "2.5rem" }} />
              </ListItemIcon>
              <ListItemText primary="Textos" />
            </ListItemButton>
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

        {/* ALL DATA */}
        <section className="bg-[#fff] rounded-2xl flex flex-col gap-5 justify-center  z-10 overflow-auto w-full">
          {dataRender === "users" ? (
            <UsersApp users={users} />
          ) : dataRender === "orders" ? (
            <Orders editor={"adminUser"} />
          ) : dataRender === "pricing" ? (
            <Pricing user={user} />
          ) : dataRender === "coupons" ? (
            <Coupons user={user} />
          ) : dataRender === "Texts" ? (
            <Texts user={user} />
          ) : dataRender === "library" ? (
            <LibraryPanel />
          ) : (
            <UsersApp user={user} />
          )}
        </section>
      </div>
    </>
  );
}
