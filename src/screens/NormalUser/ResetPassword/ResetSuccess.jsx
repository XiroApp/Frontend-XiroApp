import "../Login/Login.css";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";

export default function ResetSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row h-full pb-5 bg-slate-100">
      <section
        id="svg-container"
        className="hidden md:hidden lg:flex h-[98vh] w-1/2 pl-16"
      />

      <section className="w-screen lg:w-1/2 flex flex-col justify-center items-center lg:gap-4 lg:pr-32">
        <div className="flex flex-col items-center lg:gap-4 gap-2 ">
          <CheckCircleIcon
            color="success"
            sx={{ height: "4rem", width: "4rem" }}
          />
          <span className="text-xl lg:text-3xl">
            Revisa tu bandeja de entrada
          </span>
          <div className="w-2/3 flex justify-center items-center mt-4 mb-10">
            <span className="text-lg text-center opacity-90 w-full text-pretty">
              Te enviamos un correo electrónico con los pasos a seguir para
              recuperar el accesso a tu cuenta.
            </span>
          </div>

          <Button
            className="lg:scale-150"
            variant="contained"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </Button>
        </div>
      </section>
    </div>
  );
}
