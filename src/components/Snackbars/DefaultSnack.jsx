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
            Días de entrega delivery: martes y viernes de 9 a 13 (turno mañana)
            y de 16 a 20hs (turno tarde).
          </p>
          <p className="text-[13px]">
            Días de retiro en punto cercano: lunes a viernes de 9 a 13:30 y de
            16 a 20hs.
          </p>
          <p className="text-[13px]">
            Las entregas y retiros se coordinarán por WhatsApp en los días y
            horarios previstos..
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
