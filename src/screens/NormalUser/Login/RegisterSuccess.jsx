import "./Login.css";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";

export default function RegisterSuccess() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1e1e1e] flex flex-row h-full pb-5 text-white">
      <section
        id="svg-container"
        className="hidden md:hidden lg:flex h-[98vh] w-1/2  pl-16   "
      />

      <section className="w-screen lg:w-1/2 flex flex-col justify-center items-center lg:gap-4 lg:pr-32">
        <div className="flex flex-col items-center lg:gap-4 gap-2 ">
          <CheckCircleIcon
            color="success"
            sx={{ height: "4rem", width: "4rem" }}
          />
          <span className="text-3xl lg:text-6xl">¡Bienvenido!</span>
          <div className="flex justify-center items-center w-full mt-4 mb-10">
            <span className="text-2xl text-center font-light opacity-90 w-full">
              Te registraste exitosamente
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
