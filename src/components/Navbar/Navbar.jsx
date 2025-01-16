import React, { useState } from "react";
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
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Button, DialogActions, DialogContent } from "@mui/material";
import { Mail, WhatsApp } from "@mui/icons-material";

export default function Navbar({ loggedUser, title, hideLogo = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [contactModal, setContactModal] = useState(false);
  const cart = useSelector((state) => state.cart);

  function handleLogout(e) {
    e.preventDefault();
    sessionStorage.clear();
    dispatch(logout());
    navigate("/login");
  }

  const handleOpenUserMenu = (event) => {
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
                key={"Cuenta"}
                onClick={handleContactModal}
              >
                <Typography textAlign="center">Contacto</Typography>
              </MenuItem>
              <MenuItem
                sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                key={"logout"}
                onClick={(e) => handleLogout(e)}
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
        <DialogTitle className="text-center">Contacto</DialogTitle>
        <DialogContent className="flex flex-col items-center gap-3">
          <Typography className="text-center">
            ¿Necesitas ayuda? Contactate con nuestro soporte por alguno de los
            siguientes medios:
          </Typography>
          <a
            target="_blank"
            href="https://wa.me/5492616362351?text=Hola, deseo comunicarme con el soporte de XIRO."
          >
            <Button
              variant="outlined"
              // sx={{ borderRadius: "100%", height: "5em", width: "5em" }}
            >
              <WhatsApp
                sx={{ borderRadius: "100%", height: "1.6em", width: "1.6em" }}
              />

              <Typography>+549-261-636-2351</Typography>
            </Button>
          </a>
          <a target="_blank" href="mailto:appxiro@gmail.com">
            <Button
              variant="outlined"
              color="error"
              // sx={{ borderRadius: "100%", height: "5em", width: "5em" }}
              className="flex items-center gap-2"
            >
              <Mail
                sx={{ borderRadius: "100%", height: "1.6em", width: "1.6em" }}
              />

              <Typography>appxiro@gmail.com</Typography>
            </Button>
          </a>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleContactModal}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
