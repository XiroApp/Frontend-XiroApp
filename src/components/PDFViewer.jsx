import React, { useEffect, useState } from "react";
import FileCopySharpIcon from "@mui/icons-material/FileCopySharp";
import PDFRender from "./PDFRender";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Tooltip } from "@mui/material";
import { Document } from "react-pdf";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Spinner } from "@react-pdf-viewer/core";
import { useDispatch } from "react-redux";
import { setToast } from "../redux/actions";
import * as PDFJS from "pdfjs-dist"; // Asegúrate de instalarlo con npm install pdfjs-dist

const PDFViewer = ({
  newFile,
  resume,
  setResume,
  setNewFiles,
  newFiles,
  index,
  setLoading,
}) => {
  const dispatch = useDispatch();
  const [numPages, setNumPages] = useState();

  function onDocumentLoadSuccess(PDFMetadata) {
    try {
      setNumPages(PDFMetadata.numPages);
      setResume({
        ...resume,
        ["totalPages"]: resume.totalPages + PDFMetadata.numPages,
      });
    } catch (error) {
      console.log(error);
    }
    // finally {
    //   setLoading(false);
    // }
  }

  function handleDeleteFile() {
    try {
      setLoading(true);
      let array = new Array(newFiles.slice()).flat(1);
      array.splice(index, 1);
      setNewFiles(array);
      setResume({
        ...resume,
        ["totalPages"]: resume.totalPages - numPages,
      });
    } catch (error) {
      dispatch(setToast("Error al eliminar el archivo", "error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col  justify-center w-56  md:w-52 gap-2 bg-[#fff] p-2 rounded-lg">
        <section className=" relative flex flex-col justify-center items-center w-full">
          <span className="text-center w-full opacity-70">Vista previa</span>
          <div className="absolute top-0 right-0 flex items-center gap-1">
            <Tooltip placement="top" title="Ver en pantalla completa">
              <a
                target="_blank"
                href={`https://firebasestorage.googleapis.com/v0/b/xiro-app-2ec87.firebasestorage.app/o/${newFile}?alt=media&token=e7b0f280-413a-4546-aa2b-da0cd3523289`}
                className="hover:bg-green-700 rounded-lg hover:text-white"
              >
                <VisibilityIcon sx={{ height: "0.9em", width: "0.9em" }} />
              </a>
            </Tooltip>
            <Tooltip placement="top" title="Eliminar documento">
              <DeleteIcon
                onClick={(e) => handleDeleteFile()}
                className="hover:bg-red-500 rounded-lg hover:text-white"
                sx={{ height: "0.9em", width: "0.9em" }}
              />
            </Tooltip>
          </div>

          <div className="flex items-center justify-center w-full  h-[14em] rounded-lg">
            {/* <div id={newFile} className="hidden"></div> */}

            <Document
              file={`https://firebasestorage.googleapis.com/v0/b/xiro-app-2ec87.firebasestorage.app/o/${newFile}?alt=media&token=e7b0f280-413a-4546-aa2b-da0cd3523289`}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<Spinner />}
              error={"Error"}
              className={"w-full h-full"}
              renderMode="custom"
            >
              <PDFRender newFile={newFile} setLoading={setLoading} />
            </Document>
          </div>
        </section>
        <span className="text-[10px] ">
          {newFile?.slice(20).length > 37
            ? `${newFile?.slice(20, 40)}...`
            : `${newFile?.slice(20, -4)}`}
        </span>
        <section className="flex justify-center items-center gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center gap-1">
              <FileCopySharpIcon sx={{ height: "0.7em", width: "0.7em" }} />
              <span>{numPages}</span>
              <span className="text-[12px] lg:text-[14px]  text-center ">
                {numPages > 1 ? `Páginas` : numPages == 1 ? `Página` : null}
              </span>
            </div>
          </div>
          {/* <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center ">
              <div className="flex items-center justify-center gap-1">
                <SdCardIcon sx={{ height: "0.7em", width: "0.7em" }} />
              </div>

              <span>{(PDFMetadata?.fileSize / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <span className="text-[12px]  lg:text-[14px] text-center">
              Tamaño
            </span>
          </div> */}
        </section>
      </div>
    </>
  );
};

export default PDFViewer;
