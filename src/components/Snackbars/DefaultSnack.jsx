import { useState } from "react";

export default function DefaultSnack({ content = [] }) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={open ? "flex justify-center w-full px-4" : "hidden"}>
      <div className="flex gap-2 items-center w-full justify-between bg-green-200/50  border-2 border-green-200 px-4 py-4 rounded-lg">
        <div>
          {content?.split("//").map((text, index) => (
            <p key={index} className="text-[13px]">
              {text}
            </p>
          ))}
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
