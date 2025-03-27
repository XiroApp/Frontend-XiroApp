import React from "react";

export default function SettingButtons({ currentSetting, handleSettings }) {
  return (
    <div className="flex gap-2 md:flex-wrap items-center justfy-center overflow-x-auto overscroll-contain py-3">
      {" "}
      <button
        name="numberOfCopies"
        className={
          currentSetting === "numberOfCopies"
            ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#61774d] border-2 border-white text-white text-sm"
            : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-white hover:bg-[#61774d] hover:text-white text-sm"
        }
        onClick={(e) => handleSettings(e)}
      >
        Copias
      </button>
      <button
        name="color"
        className={
          currentSetting === "color"
            ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#61774d] border-2 border-white text-white text-sm"
            : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-white hover:bg-[#61774d] hover:text-white text-sm"
        }
        onClick={(e) => handleSettings(e)}
      >
        Color
      </button>
      <button
        name="size"
        className={
          currentSetting === "size"
            ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#61774d] border-2 border-white text-white text-sm"
            : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-white hover:bg-[#61774d] hover:text-white text-sm"
        }
        onClick={(e) => handleSettings(e)}
      >
        Tamaño
      </button>
      <button
        name="printWay"
        className={
          currentSetting === "printWay"
            ? "rounded-full whitespace-nowrap w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#61774d] border-2 border-white text-white text-sm"
            : "rounded-full whitespace-nowrap w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-white hover:bg-[#61774d] hover:text-white text-sm"
        }
        onClick={(e) => handleSettings(e)}
      >
        Formas de impresión
      </button>
      <button
        name="copiesPerPage"
        className={
          currentSetting === "copiesPerPage"
            ? "rounded-full whitespace-nowrap w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#61774d] border-2 border-white text-white text-sm"
            : "rounded-full whitespace-nowrap w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-white hover:bg-[#61774d] hover:text-white text-sm"
        }
        onClick={(e) => handleSettings(e)}
      >
        Copias por carilla
      </button>
      <button
        name="orientacion"
        className={
          currentSetting === "orientacion"
            ? "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#61774d] border-2 border-white text-white text-sm"
            : "rounded-full w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-white hover:bg-[#61774d] hover:text-white text-sm"
        }
        onClick={(e) => handleSettings(e)}
      >
        Orientación
      </button>
      <button
        name="finishing"
        className={
          currentSetting === "finishing"
            ? "rounded-full whitespace-nowrap w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#61774d] border-2 border-white text-white text-sm"
            : "rounded-full whitespace-nowrap w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-white hover:bg-[#61774d] hover:text-white text-sm"
        }
        onClick={(e) => handleSettings(e)}
      >
        Anillado
      </button>
      <button
        name="group"
        className={
          currentSetting === "group"
            ? "rounded-full whitespace-nowrap w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-[#61774d] border-2 border-white text-white text-sm"
            : "rounded-full whitespace-nowrap w-fit h-8 px-2 lg:w-30 lg:px-4 lg:py-1 bg-white hover:bg-[#61774d] hover:text-white text-sm"
        }
        onClick={(e) => handleSettings(e)}
      >
        Agrupación
      </button>
    </div>
  );
}
