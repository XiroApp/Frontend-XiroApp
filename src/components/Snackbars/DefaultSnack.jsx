import propTypes from "prop-types";
import { useState } from "react";

export default function DefaultSnack({ content = "" }) {
  const [open, setOpen] = useState(true);

  if (content.trim() == "") return <></>;

  return (
    <div
      className={
        open ? "flex justify-center items-center w-full px-4" : "hidden"
      }
    >
      <div className="flex gap-2 items-start w-full max-w-2xl justify-between bg-white font-bold  border-[1.5px] border-green-700 pl-4 pb-4 rounded-lg">
        <div className="w-full flex flex-col justify-start items-start gap-y-3 pt-4">
          <p className="text-2xl text-center w-full text-pretty">IMPORTANTE</p>
          {content?.split("//").map((text, index) => (
            <p key={index} className="text-[13px] w-full text-pretty">
              {text}
            </p>
          ))}
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1 mt-1 mr-1 text-black  hover:scale-105 transition-transform rounded-lg"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

DefaultSnack.propTypes = {
  content: propTypes.string,
};
