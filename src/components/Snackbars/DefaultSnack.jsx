import { useState } from "react";

export default function DefaultSnack() {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={open ? "flex justify-center w-full px-4" : "hidden"}>
      <div className="flex gap-2 items-center w-full justify-between bg-green-200/50  border-2 border-green-200 px-4 py-4 rounded-lg">
        <div>
          <p className="text-[13px]">
            Se aplicará la misma personalización a todos los archivos subidos
            juntos en esta pantalla. Si quieres puedes agregar al carrito el
            primero y volver a subir y personalizar otro.
          </p>
          <p className="text-[13px]">
            Las entregas se coordinan por WhatsApp en los días y horarios
            previstos.
          </p>
        </div>
        <button
          onClick={handleClose}
          className="px-2 text-black bg-green-200 hover:bg-green-200/50 rounded-lg"
        >
          X
        </button>
      </div>
    </div>
  );
}
