import "./Login.css";
import { React, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import logoWhite from "../../../utils/assets/images/logo-white.png";
import logoGoogle from "../../../utils/assets/images/icon-google.png";
import loginImage from "../../../utils/assets/images/ciro-login.png";
import amico from "../../../utils/assets/images/amico.svg";
import blueCircle from "../../../utils/assets/images/bg-blue-mobile.svg";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";
//firbase imports
import { getAdditionalUserInfo } from "firebase/auth";
import {
  Checkbox,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { registerValidator } from "../../../utils/inputValidator";
import { useDispatch } from "react-redux";
import { createUser, limoLogin } from "../../../redux/actions";
import { startSession } from "../../../utils/controllers";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signUp, loginWithGoogle } = useAuth();
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    verifyPassword: "",
    conditionsChecked: true,
  });
  const [allowRegister, setAllowRegister] = useState(false);
  const [error, setError] = useState(false);

  async function handleGoogleLogin() {
    try {
      if (input.conditionsChecked) {
        setError({ ...error, conditionsChecked: false });
        const loginResponse = await loginWithGoogle();
        const {
          email,
          displayName,
          providerData,
          photoURL = null,
          phoneNumber = null,
          uid,
          reloadUserInfo,
        } = loginResponse.user;
        const user = loginResponse.user;

        startSession(user);
        const { isNewUser } = getAdditionalUserInfo(loginResponse);
        if (isNewUser) {
          dispatch(
            createUser({
              email,
              displayName,
              photoURL,
              uid,
              phoneNumber,
              providerData,
              createdAt: new Date(),
            })
          );
        }
        dispatch(limoLogin(user));
        navigate("/registrocompletadoexitosamente");
      } else {
        setError({ ...error, conditionsChecked: true });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    let results = registerValidator(input);

    setError(results.error);
    let continueRegister = results.allowRegister;

    if (continueRegister) {
      try {
        let registerResponse = await signUp(
          input.email,
          input.password,
          input.name
        );
        // console.log(registerResponse);
        if (registerResponse.error) {
          setError({ ...error, ...registerResponse.error });
          setAllowRegister(false);
          continueRegister = false;
        }

        if (continueRegister) {
          const {
            email,
            displayName,
            photoURL = null,
            phoneNumber = null,
            uid,
            providerData,
            reloadUserInfo,
          } = registerResponse.user;

          // startSession(user);
          const { isNewUser } = getAdditionalUserInfo(registerResponse);
          const adInfo = getAdditionalUserInfo(registerResponse);

          if (isNewUser) {
            dispatch(
              createUser({
                email,
                displayName,
                photoURL,
                phoneNumber,
                uid,
                providerData,
                createdAt: new Date(),
              })
            );
          }
        }

        continueRegister && navigate("/registrocompletadoexitosamente");
        // continueRegister && console.log("BIENVENIDO");
      } catch (error) {
        console.error(error);
      }
    }
  }

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function handleInput(e) {
    const { name, value, checked } = e.target;

    e.target.type === "checkbox"
      ? setInput({ ...input, [name]: checked })
      : setInput({ ...input, [name]: value });
  }

  return (
    <div className="bg-white flex flex-row h-full pb-5">
      <section
        id="svg-container"
        className="hidden md:hidden lg:flex h-screen w-1/2 pl-16"
      >
        {/* BACKGROUND CONTAINER */}
      </section>

      {/* ------------------------------------------------------------------------------------------------------------------------------------------ */}
      <section className="w-screen lg:w-1/2 flex flex-col justify-center items-center lg:gap-4 lg:pr-32">
        <section
          // id="svg-mobile-container"
          className="flex flex-col justify-start lg:hidden h-56 w-screen    "
        >
          {/* BACKGROUND CONTAINER */}
          <img
            src={blueCircle}
            alt="limo-logo"
            className="object-contain absolute top-[-5%] w-96  md:hidden"
          />
          <span className="absolute left-2 top-2 text-[12px] font-bold md:hidden w-40">
            Hecho por estudiantes para estudiantes
          </span>
          <div className=" absolute w-screen top-12 flex justify-center">
            <img src={amico} alt="limo-logo" className="object-contain h-32 " />
          </div>
        </section>
        <div className="flex flex-col lg:gap-4 gap-2 ">
          <div>
            <section className="flex flex-col items-center justify-center gap-2">
              <img src={loginImage} alt="" className="h-56 object-contain " />

              {/* <h1 className="text-3xl">¡Bienvenido a LIMO!</h1> */}
              <h2 className="text-lg font-md opacity-60">
                Para comenzar, ingresa tus datos
              </h2>
            </section>
            {/* INPUT SECTION */}

            <section className="flex flex-col gap-1 lg:gap-4 mt-6">
              <TextField
                className=""
                error={error.name}
                helperText={
                  error.name
                    ? "El nombre no puede contener caracteres especiales y/ó numeros."
                    : ""
                }
                name="name"
                label="Nombre completo"
                type="text"
                autoComplete="current-name"
                variant="standard"
                fullWidth
                onChange={(e) => handleInput(e)}
              />

              <TextField
                error={error.email}
                helperText={
                  error.email
                    ? "La cuenta de email ingresada no es válida ó ya esta en uso."
                    : ""
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
                  onChange={(e) => handleInput(e)}
                  name="password"
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
                    La contraseña debe contener 6 caracteres o más.
                  </span>
                ) : (
                  false
                )}
              </FormControl>

              <FormControl sx={{}} variant="standard">
                <InputLabel
                  variant={error.verifyPassword ? "error" : "standard"}
                  htmlFor="standard-adornment-password"
                >
                  Confirmar contraseña
                </InputLabel>
                <Input
                  error={error.verifyPassword}
                  onChange={(e) => handleInput(e)}
                  name="verifyPassword"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        color={error.verifyPassword ? "error" : "standard"}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {error.verifyPassword ? (
                  <span className="text-[12px] text-red-500 font-bold">
                    Las contraseñas no coinciden.
                  </span>
                ) : (
                  false
                )}
              </FormControl>
            </section>
          </div>

          {/* BOTONES LOGIN */}
          <div className="flex flex-col items-center gap-2 ">
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
                    defaultChecked
                    name="conditionsChecked"
                    checked={input.conditionsChecked}
                    onChange={(e) => handleInput(e)}
                  />
                  <span className="font-extralight mx-2 ">
                    Acepto los{" "}
                    <Link to="/terminosycondiciones">
                      <span className="text-green-700 font-medium hover:underline">
                        Términos y condiciones.
                      </span>
                    </Link>
                  </span>
                </div>
                {error.conditionsChecked && (
                  <span className="text-[12px] text-red-500 font-bold">
                    Debes aceptar los términos y condiciones.
                  </span>
                )}
              </section>
            </div>
            <Button
              onClick={(e) => handleRegister(e)}
              variant="contained"
              disableElevation
              className="w-full"
            >
              <span>Registrar</span>
            </Button>
            <span className="text-sm">ó</span>
            <Button
              variant="outlined"
              className="w-full flex gap-2"
              disableElevation
              onClick={handleGoogleLogin}
            >
              <img src={logoGoogle} alt="google-icon" className="h-5" />
              <span>Registrarse con Google</span>
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <Typography>
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" underline="none" className="text-green-700">
                Ingresar
              </Link>
            </Typography>
          </div>
        </div>
      </section>
    </div>
  );
}
