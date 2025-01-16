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

  async function countPagesByColor(pdfURL) {
    try {
      const response = await fetch(pdfURL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // const blob = await response.blob();
      const arrayBuffer = await response.arrayBuffer();

      const loadingTask = PDFJS.getDocument({ data: arrayBuffer });
      const doc = await loadingTask.promise;

      let colorPages = 0;
      let bwPages = 0;
      let grayPages = 0;

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 1 });

        // Render the page to a canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport: viewport })
          .promise;

        // Analyze the page for color
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        let isColor = false;
        let isGray = false;
        for (let j = 0; j < imageData.data.length; j += 4) {
          // Iterate over RGBA pixels
          const r = imageData.data[j];
          const g = imageData.data[j + 1];
          const b = imageData.data[j + 2];
          if (r !== g || g !== b) {
            // If R, G, or B values differ, it's color
            isColor = true;
            break;
          } else if (r === g && g === b && r !== 0) {
            // If R, G, and B are equal and not all 0 (black), it's grayscale
            isGray = true;
          }
        }

        if (isColor) {
          colorPages++;
        } else if (isGray) {
          grayPages++;
        } else {
          bwPages++;
        }
      }

      return { colorPages, bwPages, grayPages };
    } catch (error) {
      console.error("Error:", error);
      // Handle errors appropriately (e.g., display an error message to the user)
    }
  }

  useEffect(() => {
    let url = `https://firebasestorage.googleapis.com/v0/b/xiro-app-2ec87.firebasestorage.app/o/${newFile}?alt=media&token=e7b0f280-413a-4546-aa2b-da0cd3523289`;
    countPagesByColor(url).then((res) => console.log(res));
  }, [newFile]);
  return (
    <>
      <div className="flex flex-col  justify-center w-56  md:w-52 gap-2 bg-[#fff] p-2 rounded-lg">
        <section className="flex flex-col justify-center items-center w-full">
          <span className="text-[12px] opacity-80 pb-1">Vista previa</span>
          <div className="flex w-full justify-end items-center gap-2">
            <Tooltip placement="top" title="Ver en pantalla completa">
              <a
                target="_blank"
                href={`https://firebasestorage.googleapis.com/v0/b/xiro-app-2ec87.firebasestorage.app/o/${newFile}?alt=media&token=e7b0f280-413a-4546-aa2b-da0cd3523289`}
              >
                <VisibilityIcon
                  className="hover:bg-gray-500 rounded-lg"
                  sx={{ height: "0.7em", width: "0.7em" }}
                />
              </a>
            </Tooltip>
            <Tooltip placement="top" title="Eliminar documento">
              <DeleteIcon
                onClick={(e) => handleDeleteFile()}
                className="hover:bg-gray-500 rounded-lg"
                sx={{ height: "0.7em", width: "0.7em", zIndex: "10" }}
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
        <span className="text-[10px] opacity-70">
          {newFile?.slice(20).length > 37
            ? `${newFile?.slice(20, 50)}...`
            : `${newFile?.slice(20)}`}
        </span>
        <section className="flex justify-center items-center gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center gap-1">
              <FileCopySharpIcon sx={{ height: "0.7em", width: "0.7em" }} />
              <span>{numPages}</span>
            </div>
            <span className="text-[12px] lg:text-[14px]  text-center ">
              {numPages > 1 ? `Páginas` : `Página`}
            </span>
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
