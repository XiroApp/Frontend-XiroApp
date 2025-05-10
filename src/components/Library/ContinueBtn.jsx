import { ArrowRight } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function ContinueBtn() {
  return (
    <footer className="fixed bottom-6 right-8">
      <Link to="/carrito">
        <Button variant="contained" endIcon={<ArrowRight />}>
          <span className="text-lg pb-0.5">Avanzar</span>
        </Button>
      </Link>
    </footer>
  );
}

export default ContinueBtn;
