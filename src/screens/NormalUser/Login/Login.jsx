import "./Login.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import logoGoogle from "../../../utils/assets/images/icon-google.png";
import loginImage from "/xiro-head.webp";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { getAdditionalUserInfo } from "firebase/auth";
import { Link } from "react-router-dom";
import {
  Backdrop,
  Checkbox,
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { validateEmail } from "../../../utils/inputValidator";
import { useDispatch } from "react-redux";
import { createUserGoogle, xiroLogin, setToast } from "../../../redux/actions";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import { Settings } from "../../../config";

export default function Login({ loggedUser, dataBaseUser }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const [input, setInput] = useState({
    rememberMe: true,
    conditionsChecked: true,
  });
  const [error, setError] = useState({
    email: false,
    password: false,
    conditionsChecked: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (loggedUser && dataBaseUser) {
      setLoader(true);
      navigate("/");
    }
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  async function handleGoogleLogin() {
    if (input.conditionsChecked) {
      try {
        setLoader(true);
        setError({ email: false, password: false, conditionsChecked: false });
        let loginResponse = await loginWithGoogle();

        const {
          email,
          displayName,
          providerData,
          photoURL = null,
          uid,
          phoneNumber = null,
        } = loginResponse.user;

        let user = loginResponse.user;

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
        } else dispatch(xiroLogin(user, input.rememberMe));
      } catch (error) {
        console.error(error);
        dispatch(setToast("Error al iniciar sesión", "error"));
      } finally {
        setLoader(false);
      }
    } else {
      setError({ ...error, conditionsChecked: true });
    }
  }
  async function handleLogin() {
    setError({ email: false, password: false, conditionsChecked: false });
    if (input.conditionsChecked) {
      validateEmail(input.email)
        ? setError({ ...error, email: false })
        : setError({ ...error, email: true, password: true });

      try {
        setLoader(true);
        let loginResponse = await login(input.email, input.password);
        if (loginResponse?.error) {
          setError(loginResponse.error);
        } else if (loginResponse?.user) {
          let user = loginResponse.user;

          dispatch(xiroLogin(user, input.rememberMe));
        } else {
          dispatch(
            setToast(
              "Error al iniciar sesión, revise sus credenciales",
              "error"
            )
          );
        }
        setLoader(false);
      } catch (error) {
        console.log(error);
        dispatch(
          setToast("Error al iniciar sesión, revise sus credenciales", "error")
        );
        setLoader(false);
      }
    } else {
      setError({ ...error, conditionsChecked: true });
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
      <span className=" text-sm absolute bottom-0 left-0">
        {Settings.FRONTEND_VERSION}
      </span>
      {/* LOADER */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <section
        id="svg-container"
        className="hidden md:hidden lg:flex h-[98vh] w-1/2 pl-16 "
      />

      <section className="w-screen lg:w-1/2 flex flex-col justify-center items-center lg:gap-4 lg:pr-32">
        <div className="flex flex-col lg:gap-4 gap-2">
          <div>
            <section className="flex flex-col items-center justify-center gap-2">
              <img
                src={loginImage}
                alt="logo"
                className="h-56 object-contain "
              />

              <h2 className="text-lg font-md opacity-60">
                Ingresa tus datos para continuar
              </h2>
            </section>
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
                  <span className="text-[11px] text-red-500">
                    Credenciales incorrectas.
                  </span>
                ) : (
                  false
                )}
              </FormControl>
            </section>
          </div>
          {/* BOTONES LOGIN */}
          <div className="flex flex-col items-center gap-4 ">
            <div className="flex flex-col items-start">
              <div className="flex justify-between items-center">
                <section className="flex gap-3 items-center">
                  <div className="flex items-center">
                    <Checkbox
                      sx={{
                        fontWeight: "normal",
                        margin: 0,
                        paddingRight: 0.5,
                      }}
                      color="primary"
                      name="rememberMe"
                      onChange={(e) => handleInput(e)}
                      // defaultChecked
                      checked={input.rememberMe}
                      id="rememberMe"
                    />
                    <label htmlFor="rememberMe" className="font-light">
                      Recordarme
                    </label>
                  </div>

                  <Link href="/recuperar-contraseña">
                    {" "}
                    <span className="text-green-700 font-medium hover:underline">
                      Olvidé mi contraseña
                    </span>
                  </Link>
                </section>
              </div>

              <div className="flex flex-col justify-between items-center">
                <section
                  className={
                    error.conditionsChecked
                      ? "flex flex-col items-center underline text-red-500"
                      : "flex flex-col items-center"
                  }
                >
                  <div className="flex items-center">
                    <Checkbox
                      sx={{ fontWeight: "normal", margin: 0 }}
                      color="primary"
                      // defaultChecked
                      name="conditionsChecked"
                      checked={input.conditionsChecked}
                      onChange={(e) => handleInput(e)}
                      id="TyC"
                    />
                    <label htmlFor="TyC" className="font-light w-fit mr-1">
                      Acepto los
                    </label>

                    <Link to="/terminosycondiciones">
                      <span className="text-green-700 font-medium hover:underline">
                        Términos y condiciones.
                      </span>
                    </Link>
                  </div>
                  {error.conditionsChecked && (
                    <span className="text-[12px] text-red-500 font-bold">
                      Debes aceptar los términos y condiciones.
                    </span>
                  )}
                </section>
              </div>
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
              <Link to="/registro" underline="none">
                <span className="text-green-700 font-medium hover:underline">
                  Crear cuenta
                </span>
              </Link>
            </Typography>
          </div>
        </div>
      </section>
    </div>
  );
}

Login.propTypes = {
  loggedUser: propTypes.object,
  dataBaseUser: propTypes.object,
};
