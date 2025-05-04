import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import logo from "/xiro-head.webp";
import { logout } from "../../redux/actions";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import { Button, DialogActions, DialogContent } from "@mui/material";
import {
  Mail as MailIcon,
  WhatsApp as WhatsAppIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Logout as LogoutIcon,
  Key as KeyIcon,
  Print as PrintIcon,
  Inventory as InventoryIcon,
  DeliveryDining as DeliveryIcon,
  AirlineStops as AirlineIcon,
} from "@mui/icons-material";
import propTypes from "prop-types";
import { len, roleIs } from "../../Common/helpers";
import { twMerge } from "tailwind-merge";

export default function Navbar({ loggedUser, title, hideLogo = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [contactModal, setContactModal] = useState(false);
  const cart = useSelector(state => state.cart);
  const closeContactModal = () => setContactModal(!contactModal);

  function handleLogout(e) {
    e.preventDefault();
    sessionStorage.clear();
    dispatch(logout());
    navigate("/login");
  }

  return (
    <AppBar
      position="sticky"
      sx={{ zIndex: "40" }}
      color="white"
      enableColorOnDark
    >
      <Container maxWidth="screen" sx={{ backgroundColor: "#fff" }}>
        <Toolbar disableGutters>
          <div className={hideLogo ? "hidden " : "flex items-center"}>
            <Link to="/">
              <img src={logo} alt="" className="h-10 ml-16 lg:m-0 " />
            </Link>
            <span className="text-[18px] lg:text-xl ml-12">{title}</span>
          </div>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}></Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              height: "",
            }}
          ></Box>

          {len(cart) > 0 && (
            <Link to="/carrito" className="mr-4">
              <button
                type="button"
                className={twMerge(
                  location?.pathname == "/carrito"
                    ? "bg-[#bad89b] cursor-default"
                    : "hover:bg-[#bad89b] cursor-pointer",
                  "flex gap-x-2 items-center text-xl px-4 py-1.5 rounded-xl transition-colors"
                )}
              >
                <ShoppingCartIcon sx={{ height: "1em", width: "1em" }} />{" "}
                <span className="mb-0.5">{len(cart)}</span>
              </button>
            </Link>
          )}

          <Tooltip title="Menú" sx={{ display: "flex" }}>
            <Box
              onClick={e => setAnchorElUser(e.currentTarget)}
              sx={{
                flexGrow: 0,
                padding: "0.3em",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                gap: "1em",
                ":hover": { backgroundColor: "#bad89b" },
              }}
            >
              <IconButton
                sx={{
                  p: 0,
                  display: "flex",
                  gap: "0.5rem",
                  backgroundColor: "black",
                }}
              >
                <Avatar
                  alt="Avatar"
                  sx={{ height: "2em", width: "2em" }}
                  src={loggedUser?.photoURL}
                />
              </IconButton>
            </Box>
          </Tooltip>

          <Menu
            sx={{ mt: "45px", width: "auto", padding: "1em" }}
            className="p-8"
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
          >
            <div className="p-2 flex flex-col gap-2 w-full">
              {roleIs("admin") && (
                <MenuItem
                  sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                  key="Admin"
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-x-2"
                >
                  <KeyIcon sx={{ height: "1em", width: "1em" }} />
                  <Typography textAlign="center">Administrador</Typography>
                </MenuItem>
              )}

              {roleIs("printing") && (
                <MenuItem
                  sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                  key="Printing"
                  onClick={() => navigate("/imprenta")}
                  className="flex items-center gap-x-2"
                >
                  <PrintIcon sx={{ height: "1em", width: "1em" }} />
                  <Typography textAlign="center">Imprenta</Typography>
                </MenuItem>
              )}

              {roleIs("pickup") && (
                <MenuItem
                  sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                  key="Pickup"
                  onClick={() => navigate("/pickup")}
                  className="flex items-center gap-x-2"
                >
                  <InventoryIcon sx={{ height: "0.8em", width: "0.8em" }} />
                  <Typography textAlign="center">Punto entrega</Typography>
                </MenuItem>
              )}

              {roleIs("distribution") && (
                <MenuItem
                  sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                  key={"Distribution"}
                  onClick={() => navigate("/distribucion")}
                  className="flex items-center gap-x-2"
                >
                  <AirlineIcon sx={{ height: "0.9em", width: "0.9em" }} />
                  <Typography textAlign="center">Distribución</Typography>
                </MenuItem>
              )}

              {roleIs("delivery") && (
                <MenuItem
                  sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                  key={"Delivery"}
                  onClick={() => navigate("/delivery")}
                  className="flex items-center gap-x-2"
                >
                  <DeliveryIcon sx={{ height: "0.9em", width: "0.9em" }} />
                  <Typography textAlign="center">Delivery</Typography>
                </MenuItem>
              )}

              <MenuItem
                sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                key="Cuenta"
                onClick={() => navigate("/")}
                className="flex gap-x-2 items-center"
              >
                <PersonIcon sx={{ height: "0.8em", width: "0.8em" }} />
                <Typography textAlign="center">Cuenta</Typography>
              </MenuItem>
              <MenuItem
                sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                key="Contacto"
                onClick={closeContactModal}
                className="flex gap-x-2 items-center"
              >
                <PhoneIcon sx={{ height: "0.8em", width: "0.8em" }} />
                <Typography textAlign="center">Contacto</Typography>
              </MenuItem>
              <MenuItem
                sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                key="logout"
                onClick={e => handleLogout(e)}
                className="flex gap-x-2 items-center"
              >
                <LogoutIcon sx={{ height: "0.8em", width: "0.8em" }} />
                <Typography textAlign="center">Cerrar sesión</Typography>
              </MenuItem>
            </div>
          </Menu>
        </Toolbar>
      </Container>

      <Dialog onClose={closeContactModal} open={contactModal}>
        <p className="text-2xl w-full text-center pt-4">Contacto</p>
        <DialogContent className="flex flex-col items-center gap-y-3">
          <p className="text-center w-full pb-4 px-2">
            ¿Necesitas ayuda?
            <br />
            Contacta con nuestro soporte por alguno de estos medios:
          </p>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://wa.me/5492616362351?text=Hola, deseo comunicarme con el soporte de XIRO."
            className="w-full max-w-[215px]"
          >
            <Button
              variant="outlined"
              className="flex items-start gap-x-2 justify-center w-full"
            >
              <WhatsAppIcon
                sx={{ borderRadius: "100%", height: "1.5em", width: "1.5em" }}
              />

              <p className="text-black w-full text-lg">
                +54&nbsp;9&nbsp;261&nbsp;636-2351
              </p>
            </Button>
          </a>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="mailto:appxiro@gmail.com"
            className="w-full max-w-[215px]"
          >
            <Button
              variant="outlined"
              className="flex items-start gap-x-2 justify-center w-full"
            >
              <MailIcon
                sx={{ borderRadius: "100%", height: "1.5em", width: "1.5em" }}
              />

              <address className="text-black w-full font-sans text-lg">
                appxiro@gmail.com
              </address>
            </Button>
          </a>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={closeContactModal}>
            <p className="text-lg">Cerrar</p>
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

Navbar.propTypes = {
  loggedUser: propTypes.object,
  title: propTypes.string,
  hideLogo: propTypes.bool,
};
