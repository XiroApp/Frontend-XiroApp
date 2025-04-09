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
import logo from "../../utils/assets/images/xiro-head.png";
import { logout } from "../../redux/actions";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import { Button, DialogActions, DialogContent } from "@mui/material";
import {
  Mail as MailIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import propTypes from "prop-types";

Navbar.propTypes = {
  loggedUser: propTypes.object,
  title: propTypes.string,
  hideLogo: propTypes.bool,
};

export default function Navbar({ loggedUser, title, hideLogo = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [contactModal, setContactModal] = useState(false);
  const cart = useSelector(state => state.cart);

  function handleLogout(e) {
    e.preventDefault();
    sessionStorage.clear();
    dispatch(logout());
    navigate("/login");
  }

  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleContactModal = () => {
    setContactModal(!contactModal);
  };

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
            <span className="text-[18px] lg:text-xl ml-12 ">{title}</span>
          </div>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}></Box>

          {/* el medio de todo */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              height: "",
            }}
          ></Box>

          <Tooltip title="Menú" sx={{ display: "flex" }}>
            <Box
              onClick={handleOpenUserMenu}
              sx={{
                flexGrow: 0,
                padding: "0.3rem",
                borderRadius: "0.3rem",
                display: "flex",
                alignItems: "center",
                gap: "1em",
                ":hover": { backgroundColor: "#81A165 " },
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
                  alt="XIRO profile"
                  sx={{ height: "2rem", width: "2rem" }}
                  src={loggedUser?.photoURL}
                />
              </IconButton>
              <span className="text-[0.8rem] hidden md:block lg:block">
                {" "}
                {loggedUser?.displayName}
              </span>
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
            onClose={handleCloseUserMenu}
          >
            <div className="px-4 py-2 flex flex-col gap-2">
              <Typography textAlign="center">
                {loggedUser?.displayName}
              </Typography>
              <Typography textAlign="center">{loggedUser?.email}</Typography>
              {loggedUser?.roles?.includes("admin") && (
                <MenuItem
                  sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                  key={"Admin"}
                  onClick={() => navigate("/admin")}
                >
                  <Typography textAlign="center">
                    Vista de administrador
                  </Typography>
                </MenuItem>
              )}
              {loggedUser?.roles?.includes("printing") && (
                <MenuItem
                  sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                  key={"Printing"}
                  onClick={() => navigate("/imprenta")}
                >
                  <Typography textAlign="center">Vista de imprenta</Typography>
                </MenuItem>
              )}
              {loggedUser?.roles?.includes("pickup") && (
                <MenuItem
                  sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                  key={"Pickup"}
                  onClick={() => navigate("/pickup")}
                >
                  <Typography textAlign="center">
                    Vista de punto entrega
                  </Typography>
                </MenuItem>
              )}
              {loggedUser?.roles?.includes("distribution") && (
                <MenuItem
                  sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                  key={"Distribution"}
                  onClick={() => navigate("/distribucion")}
                >
                  <Typography textAlign="center">
                    Vista de distribución
                  </Typography>
                </MenuItem>
              )}
              {loggedUser?.roles?.includes("delivery") && (
                <MenuItem
                  sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                  key={"Delivery"}
                  onClick={() => navigate("/delivery")}
                >
                  <Typography textAlign="center">Vista de delivery</Typography>
                </MenuItem>
              )}

              <MenuItem
                sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                key={"Cuenta"}
                onClick={() => navigate("/")}
              >
                <Typography textAlign="center">Cuenta</Typography>
              </MenuItem>
              <MenuItem
                sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                key={"Contacto"}
                onClick={handleContactModal}
              >
                <Typography textAlign="center">Contacto</Typography>
              </MenuItem>
              <MenuItem
                sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                key={"logout"}
                onClick={e => handleLogout(e)}
              >
                <Typography textAlign="center">Cerrar sesión</Typography>
              </MenuItem>
            </div>
          </Menu>

          {cart?.length ? (
            <Link to="/carrito">
              <button className="flex gap-2 items-center bg-[#fff]  px-4 py-1 rounded-2xl ml-3 hover:bg-[#84A165]">
                <ShoppingCartIcon sx={{ height: "0.8em", width: "0.8em" }} />{" "}
                {cart?.length}
              </button>
            </Link>
          ) : (
            false
          )}
        </Toolbar>
      </Container>

      <Dialog onClose={handleContactModal} open={contactModal}>
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
          <Button color="inherit" onClick={handleContactModal}>
            <p className="text-lg">Cerrar</p>
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
