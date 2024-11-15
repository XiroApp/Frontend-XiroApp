import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import logo from "../../utils/assets/images/ciro-login.png";
import { logout } from "../../redux/actions";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar({ loggedUser, title }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
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

  return (
    <AppBar
      position="sticky"
      sx={{ zIndex: "40" }}
      color="white"
      enableColorOnDark
    >
      <Container maxWidth="screen" sx={{ backgroundColor: "#fff" }}>
        <Toolbar disableGutters>
          <Link to="/">
            <img src={logo} alt="" className="h-10  hidden md:hidden lg:flex" />
          </Link>
          <span className="text-sm lg:text-xl ml-12 ">{title}</span>

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
                  alt="Ciro profile"
                  sx={{ height: "2rem", width: "2rem" }}
                  src={loggedUser?.photoURL}
                />
              </IconButton>
              <span className="text-[0.8rem]"> {loggedUser?.displayName}</span>
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
                  key={"Admin"}
                  onClick={() => navigate("/imprenta")}
                >
                  <Typography textAlign="center">Vista de imprenta</Typography>
                </MenuItem>
              )}
              {loggedUser?.roles?.includes("delivery") && (
                <MenuItem
                  sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                  key={"Admin"}
                  onClick={() => navigate("/delivery")}
                >
                  <Typography textAlign="center">Vista de delivery</Typography>
                </MenuItem>
              )}

              <MenuItem
                sx={{ ":hover": { backgroundColor: "#c9d9bb" } }}
                key={"Mi cuenta"}
                onClick={() => navigate("/")}
              >
                <Typography textAlign="center">Mi cuenta</Typography>
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
    </AppBar>
  );
}
