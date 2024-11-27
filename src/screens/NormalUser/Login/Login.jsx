import "./Login.css";
import { React, useState } from "react";
import { useAuth } from "../../../context/authContext";
import logoGoogle from "../../../utils/assets/images/icon-google.png";
import loginImage from "../../../utils/assets/images/xiro-head.png";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { getAdditionalUserInfo } from "firebase/auth";
import {
  Backdrop,
  Checkbox,
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { validateEmail } from "../../../utils/inputValidator";
import { useDispatch } from "react-redux";
import { createUserGoogle, limoLogin } from "../../../redux/actions";
import { Navigate } from "react-router-dom";

export default function Login({ loggedUser, dataBaseUser }) {
  const dispatch = useDispatch();

  if (loggedUser && dataBaseUser) {
    return <Navigate to={"/"} />;
  }
  const [loader, setLoader] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const [input, setInput] = useState({ rememberMe: true });
  const [error, setError] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  async function handleGoogleLogin(e) {
    try {
      setLoader(true);
      let loginResponse = await loginWithGoogle();
      console.log(loginResponse);
      const {
        email,
        displayName,
        providerData,
        photoURL = null,
        uid,
        phoneNumber = null,
        // reloadUserInfo,
      } = loginResponse.user;

      let user = loginResponse.user;
      console.log(user);
      const { isNewUser } = getAdditionalUserInfo(loginResponse);

      if (isNewUser) {
        dispatch(
          createUserGoogle({
            email,
            displayName,
            photoURL,
            phoneNumber,
            uid,
            providerData,
            createdAt: new Date(),
          })
        );
      } else dispatch(limoLogin(user, input.rememberMe));
      setLoader(false);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  }
  async function handleLogin(e) {
    setError({ email: false, password: false });
    validateEmail(input.email)
      ? setError({ ...error, email: false })
      : setError({ ...error, email: true, password: true });

    try {
      setLoader(true);
      let loginResponse = await login(input.email, input.password);

      if (loginResponse.error) {
        setError(loginResponse.error);
      } else {
        let user = loginResponse.user;

        dispatch(limoLogin(user, input.rememberMe));
      }
      setLoader(false);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  }
  function handleInput(e) {
    const { name, value, checked } = e.target;

    e.target.type === "checkbox"
      ? setInput({ ...input, [name]: checked })
      : setInput({ ...input, [name]: value });
  }

  return (
    <div className="bg-white flex flex-row h-full pb-5">
      <span className=" text-sm absolute bottom-0 left-0">V 2.0.0</span>
      {/* LOADER */}
      {loader ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        false
      )}
      {/* --------- */}

      <section
        id="svg-container"
        className="hidden md:hidden lg:flex h-screen w-1/2 pl-16"
      >
        {/* BACKGROUND CONTAINER */}
      </section>

      {/* ------------------------------------------------------------------------------------------------------------------------------------------ */}
      <section className="w-screen lg:w-1/2 flex flex-col justify-center items-center lg:gap-4 lg:pr-32">
        <div className="flex flex-col lg:gap-4 gap-2">
          <div>
            <section className="flex flex-col items-center justify-center gap-2">
              <img src={loginImage} alt="" className="h-56 object-contain " />

              {/* <h1 className="text-3xl ">¡Bienvenido!</h1> */}
              <h2 className="text-lg font-md opacity-60">
                Ingresa tus datos para continuar
              </h2>
            </section>
            {/* INPUT SECTION */}
            <section className="flex flex-col gap-4 mt-6">
              <TextField
                className="popi"
                error={error.email}
                helperText={
                  error.email ? "La cuenta de mail ingresada no es válida." : ""
                }
                name="email"
                label="E-mail"
                type="text"
                autoComplete="current-email"
                variant="standard"
                fullWidth
                onChange={(e) => handleInput(e)}
              />

              <FormControl sx={{}} variant="standard">
                <InputLabel
                  variant={error.password ? "error" : "standard"}
                  htmlFor="standard-adornment-password"
                >
                  Contraseña
                </InputLabel>
                <Input
                  name="password"
                  onChange={(e) => handleInput(e)}
                  error={error.password}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        color={error.password ? "error" : "standard"}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {error.password ? (
                  <span className="text-[12px] text-red-500 font-bold">
                    Contraseña incorrecta.
                  </span>
                ) : (
                  false
                )}
              </FormControl>
            </section>
          </div>

          {/* BOTONES LOGIN */}
          <div className="flex flex-col items-center gap-4 ">
            <div className="flex justify-between items-center gap-3">
              <section className="flex gap-5 items-center">
                <div className="flex items-center">
                  <Checkbox
                    sx={{ fontWeight: "normal", margin: 0, paddingRight: 0.5 }}
                    color="primary"
                    name="rememberMe"
                    onChange={(e) => handleInput(e)}
                    defaultChecked
                    checked={input.rememberMe}
                  />
                  <span className="font-light ">Recordarme</span>
                </div>
                <Link href="/recuperar-contraseña">
                  {" "}
                  <span className="font-medium ">Olvidé mi contraseña</span>
                </Link>
              </section>
            </div>
            <Button
              onClick={(e) => handleLogin(e)}
              variant="contained"
              disableElevation
              className="w-full"
            >
              <span>Ingresar</span>
            </Button>
            <Button
              variant="outlined"
              className="w-full flex gap-2"
              disableElevation
              onClick={(e) => handleGoogleLogin(e)}
            >
              <img src={logoGoogle} alt="google-icon" className="h-5" />
              <span>Continuar con Google</span>
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <Typography>
              ¿Primera vez aquí?{" "}
              <Link href="/registro" underline="none">
                Crear cuenta
              </Link>
            </Typography>
          </div>
        </div>
      </section>
    </div>
  );
}
