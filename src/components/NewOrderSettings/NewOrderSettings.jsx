import React from "react";
import HelpIcon from "@mui/icons-material/Help";
import NewOrderSettingsHelp from "../Help/NewOrderSettingsHelp";
import { setToast } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { Tooltip } from "@mui/material";

export default function NewOrderSettings({
  resume,
  setResume,
  currentSetting,
  setHelpModal,
  helpModal,
}) {
  const dispatch = useDispatch();

  const toast100handle = (e) => {
    if (
      resume.numberOfCopies === 100 ||
      resume.numberOfCopies === 200 ||
      resume.numberOfCopies === 200
    ) {
      dispatch(
        setToast(
          `Has superado las ${resume.numberOfCopies} copias!.`,
          "warning"
        )
      );
    }
    setResume({
      ...resume,
      ["numberOfCopies"]: resume.numberOfCopies + 1,
    });
  };

  return (
    <div className=" relative flex py-2 ">
      <HelpIcon
        color="white"
        className="absolute right-1/2 md:right-2/3 hover:opacity-50"
        onClick={() => setHelpModal(true)}
      />
      <NewOrderSettingsHelp
        helpModal={helpModal}
        setHelpModal={setHelpModal}
        currentSetting={currentSetting}
      />
      {currentSetting === "numberOfCopies" ? (
        <section className="flex  flex-col gap-3 items-start justify-start">
          <span className="text-md text-white">Cantidad de copias</span>
          <div className="flex gap-2 text-black">
            <button
              className="h-8 w-8 bg-[#fff] rounded-lg"
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["numberOfCopies"]:
                    resume.numberOfCopies > 2 ? resume.numberOfCopies - 1 : 1,
                })
              }
            >
              <span className="text-2xl ">{"<"}</span>
            </button>
            <div className="h-8 w-12 bg-[#fff] rounded-md flex items-center justify-center">
              <span>{resume.numberOfCopies}</span>
            </div>
            <button
              className="h-8 w-8 bg-[#fff] rounded-lg"
              onClick={(e) => toast100handle(e)}
            >
              <span className="text-2xl ">{">"}</span>
            </button>
          </div>
        </section>
      ) : currentSetting === "color" ? (
        <section className="flex  flex-col gap-3 items-start justify-start">
          <span className="text-md text-white">Color de copias</span>
          <div className="flex gap-2">
            <button
              className={
                resume.color === "BN"
                  ? "flex flex-col items-center w-24 justify-center px-1  border-2 border-white bg-[#61774d] text-white rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-1  bg-white hover:bg-[#61774d] hover:text-white rounded-lg"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["color"]: "BN",
                })
              }
            >
              <span className="text-[12px] ">BN</span>
              <span className="text-[10px] opacity-70 ">Blanco y negro</span>
            </button>

            <button
              className={
                resume.color === "Color"
                  ? "flex flex-col items-center w-24 justify-center px-1  border-2 border-white bg-[#61774d] text-white rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-1  bg-white hover:bg-[#61774d] hover:text-white rounded-lg"
              }
              onClick={(e) =>
                setResume(
                  {
                    ...resume,
                    ["color"]: "Color",
                  },
                  true
                )
              }
            >
              <span className="text-[12px] ">Color</span>
              <span className="text-[10px] opacity-70 ">Colores CYMK</span>
            </button>
          </div>
        </section>
      ) : currentSetting === "size" ? (
        <section className="flex  flex-col gap-3 items-start justify-start">
          <span className="text-md text-white">Tamaño de copias</span>
          <div className="flex gap-1  overflow-x-auto overscroll-auto">
            <button
              className={
                resume.size === "A4"
                  ? "flex flex-col items-center w-24 justify-center px-1  border-2 border-white bg-[#61774d] text-white rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-1  bg-white hover:bg-[#61774d] hover:text-white rounded-lg"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["size"]: "A4",
                })
              }
            >
              <span className="text-[12px] ">A4</span>
              <span className="text-[10px] opacity-70 ">297 x 210 mm</span>
            </button>
            {/* <button
              className={
                resume.size === "A3"
                  ? "flex flex-col items-center w-24 justify-center px-1  border-2 border-white bg-[#61774d] text-white rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-1  bg-white hover:bg-[#61774d] hover:text-white rounded-lg"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["size"]: "A3",
                })
              }
            >
              <span className="text-[12px] ">A3</span>
              <span className="text-[10px] opacity-70 ">420 x 297 mm</span>
            </button> */}
            <button
              className={
                resume.size === "Oficio"
                  ? "flex flex-col items-center w-24 justify-center px-1  border-2 border-white bg-[#61774d] text-white rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-1  bg-white hover:bg-[#61774d] hover:text-white rounded-lg"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["size"]: "Oficio",
                })
              }
            >
              <span className="text-[12px] ">Oficio</span>
              <span className="text-[10px] opacity-70 ">220 x 340 mm</span>
            </button>
          </div>
        </section>
      ) : currentSetting === "printWay" ? (
        <section className="flex  flex-col gap-3 items-start justify-start">
          <span className="text-md text-white">Forma de impresión</span>
          <div className="flex gap-2">
            <button
              className={
                resume.printWay === "Simple faz"
                  ? "flex flex-col items-center w-24 justify-center px-2  border-2 border-white bg-[#61774d] text-white rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-2  bg-white hover:bg-[#61774d] hover:text-white rounded-lg"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["printWay"]: "Simple faz",
                })
              }
            >
              <span className="text-[12px] ">Simple faz</span>
              <span className="text-[10px] opacity-70 ">Una sola cara</span>
            </button>
            {resume?.totalPages > 1 ? (
              <button
                className={
                  resume.printWay === "Doble faz"
                    ? "flex flex-col items-center w-24 justify-center px-2  border-2 border-white bg-[#61774d] text-white rounded-lg"
                    : "flex flex-col items-center w-24 justify-center px-2  bg-white hover:bg-[#61774d] hover:text-white rounded-lg"
                }
                onClick={(e) =>
                  setResume({
                    ...resume,
                    ["printWay"]: "Doble faz",
                  })
                }
              >
                <span className="text-[12px] ">Doble faz</span>
                <span className="text-[10px] opacity-70 ">Ambas caras</span>
              </button>
            ) : (
              <button
                disabled
                className="flex flex-col cursor-not-allowed items-center w-24 justify-center px-2  bg-[#61774d]/70 rounded-lg"
              >
                <span className="text-[12px] ">Doble faz</span>
                <span className="text-[10px] opacity-70 ">Ambas caras</span>
              </button>
            )}
          </div>
        </section>
      ) : currentSetting === "copiesPerPage" ? (
        <section className="flex  flex-col gap-3 items-start justify-start">
          <span className="text-md text-white">Copias por carilla</span>
          <div className="flex gap-2">
            <button
              className={
                resume.copiesPerPage === "Normal"
                  ? "flex flex-col items-center w-24 justify-center px-2  border-2 border-white bg-[#61774d] text-white rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-2  bg-white hover:bg-[#61774d] hover:text-white rounded-lg"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["copiesPerPage"]: "Normal",
                })
              }
            >
              <span className="text-[12px] ">Normal</span>
              <span className="text-[10px] opacity-70 ">Una por carilla</span>
            </button>
            {resume?.totalPages > 1 ? (
              <button
                className={
                  resume.copiesPerPage === "2 copias"
                    ? "flex flex-col items-center w-24 justify-center px-2  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                    : "flex flex-col items-center w-24 justify-center px-2  border border-[#000] text-black bg-[#fff] hover:bg-[#61774d]/80 rounded-lg"
                }
                onClick={(e) =>
                  setResume({
                    ...resume,
                    ["copiesPerPage"]: "2 copias",
                    ["orientacion"]: "Horizontal",
                  })
                }
              >
                <span className="text-[12px] ">2 copias</span>
                <span className="text-[10px] opacity-70 ">Por carilla</span>
              </button>
            ) : (
              <button
                disabled
                className="flex flex-col cursor-not-allowed items-center w-24 justify-center px-2  bg-[#61774d]/70 rounded-lg"
              >
                <span className="text-[12px] ">2 copias</span>
                <span className="text-[10px] opacity-70 ">Por carilla</span>
              </button>
            )}

            {resume?.totalPages > 3 ? (
              <button
                className={
                  resume.copiesPerPage === "4 copias"
                    ? "flex flex-col items-center w-24 justify-center px-2  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                    : "flex flex-col items-center w-24 justify-center px-2  border border-[#000] text-black bg-[#fff] hover:bg-[#61774d]/80 rounded-lg"
                }
                onClick={(e) =>
                  setResume({
                    ...resume,
                    ["copiesPerPage"]: "4 copias",
                    ["orientacion"]: "Horizontal",
                  })
                }
              >
                <span className="text-[12px] ">4 copias</span>
                <span className="text-[10px] opacity-70 ">Por carilla</span>
              </button>
            ) : (
              <button
                disabled
                className="flex flex-col cursor-not-allowed items-center w-24 justify-center px-2  bg-[#61774d]/70 rounded-lg"
              >
                <span className="text-[12px] ">4 copias</span>
                <span className="text-[10px] opacity-70 ">Por carilla</span>
              </button>
            )}
          </div>
        </section>
      ) : currentSetting === "orientacion" ? (
        <section className="flex  flex-col gap-3 items-start justify-start">
          <span className="text-md text-white">Orientación</span>
          <div className="flex gap-2">
            {resume.copiesPerPage !== "Normal" ? (
              <button
                disabled
                className={
                  resume.orientacion === "Vertical"
                    ? "flex flex-col items-center w-24 justify-center px-2  py-2  border-2 border-white bg-[#61774d] text-white rounded-lg"
                    : "flex flex-col items-center w-24 justify-center px-2  py-2  bg-[#313131] rounded-lg"
                }
                // onClick={(e) =>
                //   setResume({
                //     ...resume,
                //     ["orientacion"]: "Vertical",
                //   })
                // }
              >
                <span className="text-[12px] ">Vertical</span>
              </button>
            ) : (
              <button
                className={
                  resume.orientacion === "Vertical"
                    ? "flex flex-col items-center w-24 justify-center px-2  py-2  border-2 border-white bg-[#61774d] text-white rounded-lg"
                    : "flex flex-col items-center w-24 justify-center px-2  py-2  bg-white hover:bg-[#61774d] hover:text-white rounded-lg"
                }
                onClick={(e) =>
                  setResume({
                    ...resume,
                    ["orientacion"]: "Vertical",
                  })
                }
              >
                <span className="text-[12px] ">Vertical</span>
              </button>
            )}
            <button
              className={
                resume.orientacion === "Horizontal"
                  ? "flex flex-col items-center w-24 justify-center px-2  py-2 border-2 border-white bg-[#61774d] text-white rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-2  py-2  bg-white hover:bg-[#61774d] hover:text-white rounded-lg"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["orientacion"]: "Horizontal",
                })
              }
            >
              <span className="text-[12px] ">Horizontal</span>
            </button>
          </div>
        </section>
      ) : currentSetting === "finishing" ? (
        <section className="flex  flex-col gap-3 items-start justify-start">
          <span className="text-md text-white">Anillado</span>
          <div className="flex gap-2">
            {/* Sin anillado */}
            <button
              className={
                resume.finishing === "Sin anillado"
                  ? "flex flex-col items-center w-24 justify-center px-2  py-2  border-2 border-white bg-[#61774d] text-white rounded-lg"
                  : "flex flex-col items-center w-26 justify-center px-2  border border-[#000] text-black bg-[#fff] hover:bg-[#61774d]/80 rounded-lg"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["finishing"]: "Sin anillado",
                })
              }
            >
              <span className="text-[12px] ">Sin Anillado</span>
              <span className="text-[10px] opacity-70 ">Solo impresión</span>
            </button>
            {/* Abrochado */}
            <button
              className={
                resume.finishing === "Abrochado"
                  ? "flex flex-col items-center w-24 justify-center px-2  py-2  border-2 border-white bg-[#61774d] text-white rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-2  border border-[#000] text-black bg-[#fff] hover:bg-[#61774d]/80 rounded-lg"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["finishing"]: "Abrochado",
                  ["group"]: "Individual",
                })
              }
            >
              <span className="text-[12px] ">Abrochado</span>
              <span className="text-[10px] opacity-70 ">Sin cargo</span>
            </button>
            {/* Anillado */}
            <button
              className={
                resume.finishing === "Anillado"
                  ? "flex flex-col items-center w-24 justify-center px-2  py-2  border-2 border-white bg-[#61774d] text-white rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-2  border border-[#000] text-black bg-[#fff] hover:bg-[#61774d]/80 rounded-lg"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["finishing"]: "Anillado",
                  ["group"]: "Individual",
                })
              }
            >
              <span className="text-[12px] ">Anillado</span>
              <span className="text-[10px] opacity-70 ">Con anillado</span>
            </button>
          </div>
        </section>
      ) : currentSetting === "group" ? (
        <section className="flex  flex-col gap-3 items-start justify-start">
          <span className="text-md text-white">Agrupación</span>
          <div className="flex gap-2">
            {resume?.finishing === "Anillado" ||
            resume.finishing === "Abrochado" ? (
              <>
                <button
                  className={
                    resume.group === "Individual"
                      ? "flex flex-col items-center w-24 justify-center px-2  py-2  border-2 border-white bg-[#61774d] text-white rounded-lg"
                      : "flex flex-col items-center w-24 justify-center px-2  border border-[#000] text-black bg-[#fff] hover:bg-[#61774d]/80 rounded-lg"
                  }
                  onClick={(e) =>
                    setResume({
                      ...resume,
                      ["group"]: "Individual",
                    })
                  }
                >
                  <span className="text-[12px] ">Individual</span>
                  <span className="text-[10px] opacity-70 ">
                    Un anillado por archivo
                  </span>
                </button>
                <button
                  className={
                    resume.group === "Agrupado"
                      ? "flex flex-col items-center w-24 justify-center px-2  py-2  border-2 border-white bg-[#61774d] text-white rounded-lg"
                      : "flex flex-col items-center w-24 justify-center px-2  border border-[#000] text-black bg-[#fff] hover:bg-[#61774d]/80 rounded-lg"
                  }
                  onClick={(e) =>
                    setResume({
                      ...resume,
                      ["group"]: "Agrupado",
                    })
                  }
                >
                  <span className="text-[12px] ">Agrupado</span>
                  <span className="text-[10px] opacity-70 ">
                    Anillado todo junto
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  disabled
                  className="flex flex-col cursor-not-allowed items-center w-24 justify-center px-2  bg-[#61774d]/70 rounded-lg"
                >
                  <span className="text-[12px] ">Individual</span>
                  <span className="text-[10px] opacity-70 ">
                    Un anillado por archivo
                  </span>
                </button>
                <button
                  disabled
                  className="flex flex-col cursor-not-allowed  items-center w-24 justify-center px-2  bg-[#61774d]/70 rounded-lg"
                >
                  <span className="text-[12px] ">Agrupado</span>
                  <span className="text-[10px] opacity-70 ">
                    Anillado todo junto
                  </span>
                </button>
              </>
            )}
          </div>
        </section>
      ) : (
        false
      )}
    </div>
  );
}
