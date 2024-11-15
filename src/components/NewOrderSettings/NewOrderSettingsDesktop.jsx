import React, { useState } from "react";
import HelpIcon from "@mui/icons-material/Help";
import NewOrderSettingsHelpDesktop from "../Help/NewOrderSettingsHelpDesktop";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/actions";

export default function NewOrderSettingsDesktop({ resume, setResume }) {
  const [helpModalDesktop, setHelpModalDesktop] = useState(false);
  const [currentSetting, setCurrentSetting] = useState("");

  const dispatch = useDispatch();
  function handleHelp(setting) {
    setCurrentSetting(setting);
    setHelpModalDesktop(true);
  }
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
    <div className="bg-[#fff] relative h-full w-full p-4 flex flex-col gap-4 rounded-xl text-white">
      <NewOrderSettingsHelpDesktop
        helpModal={helpModalDesktop}
        setHelpModal={setHelpModalDesktop}
        currentSetting={currentSetting}
      />
      <span className="text-xl text-black">Personalización</span>
      <div className="flex flex-col gap-3">
        <section className="flex  flex-col gap-2 items-start justify-start">
          <div className="flex gap-2 items-center">
            <span className="text-black">Cantidad de copias</span>
            <HelpIcon
              color="primary"
              className="hover:opacity-50"
              sx={{ width: "0.8em", height: "0.8em" }}
              onClick={(e) => handleHelp("numberOfCopies")}
            />
          </div>
          <div className="flex gap-2 items-center">
            <button
              className="h-8 w-8 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg hover:bg-[#61774d] hover:bg-[#61774d]/80/80"
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
            <div className="h-8 w-12 bg-[#61774d] hover:bg-[#61774d]/80 rounded-md flex items-center justify-center">
              <span>{resume.numberOfCopies}</span>
            </div>
            <button
              className="h-8 w-8 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg hover:bg-[#61774d]"
              onClick={(e) => toast100handle(e)}
            >
              <span className="text-2xl ">{">"}</span>
            </button>
          </div>
        </section>
        <section className="flex  flex-col gap-2 items-start justify-start">
          <div className="flex gap-2 items-center">
            <span className="text-black">Color de copias</span>

            <HelpIcon
              color="primary"
              className="hover:opacity-50"
              sx={{ width: "0.8em", height: "0.8em" }}
              onClick={(e) => handleHelp("color")}
            />
          </div>
          <div className="flex gap-2 items-center">
            <button
              className={
                resume.color === "BN"
                  ? "flex flex-col items-center w-24 justify-center px-1  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-1  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
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
                  ? "flex flex-col items-center w-24 justify-center px-1  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-1  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["color"]: "Color",
                })
              }
            >
              <span className="text-[12px] ">Color</span>
              <span className="text-[10px] opacity-70 ">Colores CYMK</span>
            </button>
          </div>
        </section>
        <section className="flex  flex-col gap-2 items-start justify-start">
          <div className="flex gap-2 items-center">
            <span className="text-black">Tamaño de copias</span>

            <HelpIcon
              color="primary"
              className="hover:opacity-50"
              sx={{ width: "0.8em", height: "0.8em" }}
              onClick={(e) => handleHelp("size")}
            />
          </div>
          <div className="flex flex-wrap gap-1  overflow-x-auto overscroll-auto">
            <button
              className={
                resume.size === "A4"
                  ? "flex flex-col items-center w-24 justify-center px-1  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-1  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
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
                  ? "flex flex-col items-center w-24 justify-center px-1  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-1  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
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
                  ? "flex flex-col items-center w-24 justify-center px-1  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-1  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["size"]: "Oficio",
                })
              }
            >
              <span className="text-[12px] ">Oficio</span>
              <span className="text-[10px] opacity-70 ">216 x 330 mm</span>
            </button>
          </div>
        </section>
        <section className="flex  flex-col gap-2 items-start justify-start">
          <div className="flex gap-2 items-center">
            <span className="text-black">Forma de impresión</span>
            <HelpIcon
              color="primary"
              className="hover:opacity-50"
              sx={{ width: "0.8em", height: "0.8em" }}
              onClick={(e) => handleHelp("printWay")}
            />
          </div>
          <div className="flex gap-2 items-center">
            <button
              className={
                resume.printWay === "Simple faz"
                  ? "flex flex-col items-center w-24 justify-center px-2  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-2  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
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

            <button
              className={
                resume.printWay === "Doble faz"
                  ? "flex flex-col items-center w-24 justify-center px-2  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-2  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
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
          </div>
        </section>
        <section className="flex  flex-col gap-2 items-start justify-start">
          <div className="flex gap-2 items-center">
            <span className="text-black">Copias por carilla</span>
            <HelpIcon
              color="primary"
              className="hover:opacity-50"
              sx={{ width: "0.8em", height: "0.8em" }}
              onClick={(e) => handleHelp("copiesPerPage")}
            />
          </div>
          <div className="flex gap-2 items-center">
            <button
              className={
                resume.copiesPerPage === "Normal"
                  ? "flex flex-col items-center w-24 justify-center px-2  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-2  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
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

            <button
              className={
                resume.copiesPerPage === "2 copias"
                  ? "flex flex-col items-center w-24 justify-center px-2  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-2  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
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
            <button
              className={
                resume.copiesPerPage === "4 copias"
                  ? "flex flex-col items-center w-24 justify-center px-2  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-2  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
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
          </div>
        </section>
        <section className="flex  flex-col gap-2 items-start justify-start">
          <div className="flex gap-2 items-center">
            <span className="text-black">Orientación</span>
            <HelpIcon
              color="primary"
              className="hover:opacity-50"
              sx={{ width: "0.8em", height: "0.8em" }}
              onClick={(e) => handleHelp("orientacion")}
            />
          </div>
          <div className="flex gap-2 items-center">
            {resume.copiesPerPage !== "Normal" ? (
              <button
                disabled
                className={
                  resume.orientacion === "Vertical"
                    ? "flex flex-col items-center w-24 justify-center px-2  py-2  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                    : "flex flex-col items-center w-24 justify-center px-2  py-2  bg-[#61774d]/70 rounded-lg"
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
                    ? "flex flex-col items-center w-24 justify-center px-2  py-2  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                    : "flex flex-col items-center w-24 justify-center px-2  py-2  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
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
                  ? "flex flex-col items-center w-24 justify-center px-2  py-2 border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-2  py-2  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
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
        <section className="flex  flex-col gap-2 items-start justify-start">
          <div className="flex gap-2 items-center">
            <span className="text-black">Anillado</span>
            <HelpIcon
              color="primary"
              className="hover:opacity-50"
              sx={{ width: "0.8em", height: "0.8em" }}
              onClick={(e) => handleHelp("finishing")}
            />
          </div>
          <div className="flex gap-2 items-center">
            <button
              className={
                resume.finishing === "Sin anillado"
                  ? "flex flex-col items-center w-24 justify-center px-2  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                  : "flex flex-col items-center w-24 justify-center px-2  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
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
            {resume?.totalPages * resume?.numberOfCopies >= 20 ? (
              <button
                className={
                  resume.finishing === "Anillado"
                    ? "flex flex-col items-center w-24 justify-center px-2  border-[#000] border-2 bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                    : "flex flex-col items-center w-24 justify-center px-2  bg-[#61774d] hover:bg-[#61774d]/80 rounded-lg"
                }
                onClick={(e) =>
                  setResume({
                    ...resume,
                    ["finishing"]: "Anillado",
                  })
                }
              >
                <span className="text-[12px] ">Anillado</span>
                <span className="text-[10px] opacity-70 ">Lado largo</span>
              </button>
            ) : (
              <button
                disabled
                className="flex flex-col items-center w-24 justify-center px-2  bg-[#61774d]/70 rounded-lg"
              >
                <span className="text-[12px] ">Anillado</span>
                <span className="text-[10px] opacity-70 ">Lado largo</span>
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
