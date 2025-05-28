import { useState } from "react";
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
import { Settings } from "../config";
import propTypes from "prop-types";
import { setToast } from "../redux/actions";
import { useDispatch } from "react-redux";
const STORAGE_URL = Settings.STORAGE_URL;
const STORAGE_QUERY = Settings.STORAGE_TOKEN_QUERY;

export default function PDFViewer({
  newFile,
  resume,
  index,
  setResume,
  setLoading,
  setFilesDetail,
  filesDetail,
  handleDeleteFile,
}) {
  const [numPages, setNumPages] = useState();
  const dispatch = useDispatch();

  function onDocumentLoadSuccess(PDFMetadata) {
    try {
      const newFilesArray = [
        ...filesDetail,
        { name: newFile, pages: PDFMetadata.numPages },
      ];

      const totalPages = newFilesArray.reduce(
        (acc, file) => acc + file.pages,
        0
      );

      setNumPages(PDFMetadata.numPages);
      setResume({
        ...resume,
        ["totalPages"]: totalPages,
      });
      setFilesDetail(newFilesArray);
    } catch (err) {
      dispatch(setToast("Error cargando el archivo, reintentalo.", "error"));
      console.error(`Error cargando el archivo: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col  justify-center w-56  md:w-52 gap-2 bg-[#fff] p-2 rounded-lg">
      <section className=" relative flex flex-col justify-center items-center w-full">
        <span className="text-center w-full opacity-70">Vista previa</span>
        <div className="absolute top-0 right-0 flex items-center gap-1">
          <Tooltip placement="top" title="Ver en pantalla completa">
            <a
              rel="noreferrer"
              target="_blank"
              href={`${STORAGE_URL}${newFile}${STORAGE_QUERY}`}
              className="hover:bg-green-700 rounded-lg hover:text-white"
            >
              <VisibilityIcon sx={{ height: "0.9em", width: "0.9em" }} />
            </a>
          </Tooltip>
          <Tooltip placement="top" title="Eliminar documento">
            <DeleteIcon
              onClick={() => handleDeleteFile(newFile, index)}
              className="hover:bg-red-500 rounded-lg hover:text-white"
              sx={{ height: "0.9em", width: "0.9em" }}
            />
          </Tooltip>
        </div>

        <div className="flex items-center justify-center w-full  h-[14em] rounded-lg">
          <Document
            file={`${STORAGE_URL}${newFile}${STORAGE_QUERY}`}
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
        {newFile?.slice(20).length > 35
          ? `${newFile?.slice(20, 46)}...`
          : `${newFile?.slice(20, -4)}`}
      </span>
      <section className="flex justify-center items-center gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-center gap-1">
            <FileCopySharpIcon sx={{ height: "0.7em", width: "0.7em" }} />
            <span>{numPages}</span>
            <span className="text-[12px] lg:text-[14px]  text-center ">
              {numPages > 1 ? "Páginas" : numPages == 1 ? "Página" : null}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

PDFViewer.propTypes = {
  newFile: propTypes.string,
  resume: propTypes.object,
  index: propTypes.number,
  setResume: propTypes.func,
  setLoading: propTypes.func,
  setFilesDetail: propTypes.func,
  filesDetail: propTypes.array,
  handleDeleteFile: propTypes.func,
};
