import React, { useEffect, useState, useMemo, useCallback } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import PDFViewer from "../../../components/PDFViewer";
import { LoadingButton } from "@mui/lab";
import { FaMotorcycle as MopedIcon } from "react-icons/fa6";
import { FaStore as StoreIcon } from "react-icons/fa6";
import { FaRegFilePdf as DescriptionIcon } from "react-icons/fa6";
import { FaCopy as CopiesIcon } from "react-icons/fa6";
import { FaBookOpen as FileCopySharpIcon } from "react-icons/fa6";
import { FaFileInvoiceDollar as PrintSharpIcon } from "react-icons/fa6";
import UploadIcon from "@mui/icons-material/UploadOutlined";
import ErrorIcon from "@mui/icons-material/ErrorOutlined";
import { styled } from "@mui/material/styles";
import {
  addToCart,
  getPricing,
  setToast,
  uploadMulter,
} from "../../../redux/actions";
import { validatePDFFile } from "../../../utils/inputValidator";
import { uploadFile } from "../../../config/firebase";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Typography,
} from "@mui/material";
import NewOrderSettings from "../../../components/NewOrderSettings/NewOrderSettings";
import SettingButtons from "../../../components/NewOrderSettings/SettingButtons";
import ChoosePlaceModal from "../../../components/ChoosePlaceModal/ChoosePlaceModal";
import NewOrderSettingsDesktop from "../../../components/NewOrderSettings/NewOrderSettingsDesktop";
import DefaultSnack from "../../../components/Snackbars/DefaultSnack";
import { useNavigate } from "react-router-dom";
import {
  pricingSetter,
  validateFileSize,
} from "../../../utils/controllers/pricing.controller.js";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#fff",
  borderRadius: "8px",
  boxShadow: 24,
};

const initialResumeState = {
  totalPages: 0,
  numberOfCopies: 1,
  color: "BN",
  size: "A4",
  printWay: "Simple faz",
  copiesPerPage: "Normal",
  orientacion: "Vertical",
  finishing: "Sin anillado",
  group: "Sin agrupar",
};

export default function NewOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.dataBaseUser);
  const cart = useSelector((state) => state.cart);
  const labels = useSelector((state) => state.labels);
  const pricingState = useSelector((state) => state.pricing);
  const place = useSelector((state) => state.place);

  // Estados consolidados
  const [state, setState] = useState({
    loading: false,
    resetModal: false,
    helpModal: false,
    choosePlace: !place,
    review: false,
    openColorAlertModal: false,
    currentSetting: "numberOfCopies",
  });

  const [files, setFiles] = useState({
    details: [], // { name, pages, etc }
    previews: [], // solo nombres para preview
  });

  const [resume, setResume] = useState(initialResumeState);

  const removeDuplicateDetails = (currentFiles) => {
    const uniqueDetails = [];
    const seenNames = new Set();

    // Filtrar details para mantener solo los únicos
    currentFiles.details.forEach((file) => {
      if (!seenNames.has(file.name)) {
        seenNames.add(file.name);
        uniqueDetails.push(file);
      }
    });

    return {
      ...currentFiles,
      details: uniqueDetails,
    };
  };

  // Pricing calculado
  const pricing = useMemo(() => {
    const basePricing = {
      BIG_ringed: Number(pricingState?.BIG_ringed) || 0,
      SMALL_ringed: Number(pricingState?.SMALL_ringed) || 0,
      A3_simple_do: Number(pricingState?.A3_simple_do) || 0,
      A3_simple_do_color: Number(pricingState?.A3_simple_do_color) || 0,
      A3_double_does: Number(pricingState?.A3_double_does) || 0,
      A3_double_does_color: Number(pricingState?.A3_double_does_color) || 0,
      OF_simple_do: Number(pricingState?.OF_simple_do) || 0,
      OF_simple_do_color: Number(pricingState?.OF_simple_do_color) || 0,
      OF_double_does: Number(pricingState?.OF_double_does) || 0,
      OF_double_does_color: Number(pricingState?.OF_double_does_color) || 0,
      simple_do: Number(pricingState?.simple_do) || 0,
      simple_do_color: Number(pricingState?.simple_do_color) || 0,
      double_does: Number(pricingState?.double_does) || 0,
      double_does_color: Number(pricingState?.double_does_color) || 0,
      ringed: Number(1500),
      total: 0,
    };

    const total = pricingSetter(basePricing, resume, files.details);
    return { ...basePricing, total: isNaN(total) ? 0 : Number(total) };
  }, [pricingState, resume, files.details]);

  // Efectos optimizados
  useEffect(() => {
    dispatch(getPricing());
  }, [dispatch]);

  useEffect(() => {
    const cleanedFiles = removeDuplicateDetails(files);
    if (cleanedFiles.details.length !== files.details.length) {
      setFiles(cleanedFiles);
      return; // Salir temprano porque setFiles disparará otro efecto
    }
    // Resto de tu lógica actual
    if (cleanedFiles.details.length === 0) {
      setResume(initialResumeState);
      setState((prev) => ({ ...prev, loading: false }));
    } else {
      const totalPages = cleanedFiles.details.reduce(
        (sum, file) => sum + file.pages,
        0
      );

      setResume((prev) => ({
        ...prev,
        printWay: totalPages > 1 ? prev.printWay : "Simple faz",
        totalPages,
        finishing:
          totalPages * prev.numberOfCopies < 20
            ? "Sin anillado"
            : prev.finishing,
        group:
          totalPages * prev.numberOfCopies < 20 ? "Sin agrupar" : prev.group,
      }));
    }
  }, [files.details]);

  // Handlers optimizados con useCallback
  const handleSetResume = useCallback((newResume, colorAlert = false) => {
    setResume(newResume);
    if (colorAlert) {
      setState((prev) => ({ ...prev, openColorAlertModal: true }));
    }
  }, []);

  const handleDeleteFile = useCallback((fileToDelete) => {
    setState((prev) => ({ ...prev, loading: true }));
    setFiles((prevFiles) => {
      const newDetails = prevFiles.details.filter((f) => {
        console.log(f.name);
        return f.name !== fileToDelete;
      });
      const newPreviews = prevFiles.previews.filter((f) => f !== fileToDelete);

      return { previews: newPreviews, details: newDetails };
    });
    setState((prev) => ({ ...prev, loading: false }));
  }, []);

  const handleSubmitLoadFile = useCallback(
    async (e) => {
      e.preventDefault();
      const filesInput = e.target.files;
      const maxSizeMB = 500;

      if (!filesInput || filesInput.length === 0) return;

      setState((prev) => ({ ...prev, loading: true }));

      try {
        const uploadPromises = Array.from(filesInput)
          .filter((file) => {
            if (!validateFileSize(file, maxSizeMB)) {
              dispatch(
                setToast(
                  `El archivo no puede superar los ${maxSizeMB}MB`,
                  "error"
                )
              );
              return false;
            }
            return true;
          })
          .map(async (file) => {
            if (validatePDFFile(file.name)) {
              const uploadedFile = await uploadFile(file);
              return { preview: uploadedFile };
            } else {
              const formData = new FormData();
              formData.append("files", file);
              const newDocuments = await dispatch(uploadMulter(formData));
              console.log("new dowcuments", newDocuments);

              return newDocuments.map((doc) => ({ preview: doc }));
            }
          });

        const results = await Promise.all(uploadPromises);
        const newFiles = results.flat();

        setFiles((prev) => ({
          ...prev,
          previews: [...prev?.previews, ...newFiles.map((f) => f.preview)],
        }));
      } catch (error) {
        dispatch(setToast("Error al subir archivos", "error"));
        console.error("Error:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [dispatch]
  );

  const handleResetOrder = useCallback(() => {
    setFiles({ details: [], previews: [] });
    setResume(initialResumeState);
    setState((prev) => ({ ...prev, resetModal: false }));
  }, []);

  const handleSetOrder = useCallback(() => {
    dispatch(
      addToCart(user, {
        ...resume,
        files: files.previews,
        total: pricing.total,
      })
    );
    setFiles({ details: [], previews: [] });
    setResume(initialResumeState);
    setState((prev) => ({ ...prev, review: false }));
  }, [dispatch, user, resume, files.previews, pricing.total]);

  const updateState = useCallback((key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleColorAlert = useCallback(() => {
    setState((prev) => ({
      ...prev,
      openColorAlertModal: !prev.openColorAlertModal,
    }));
  }, []);

  const handleSettings = useCallback((e) => {
    setState((prev) => ({ ...prev, currentSetting: e.target.name }));
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col justify-between">
      {/* Modales y diálogos */}
      {state.openColorAlertModal && (
        <Dialog open={state.openColorAlertModal} onClose={handleColorAlert}>
          <DialogTitle className="text-center relative">
            Aviso cobertura color de mayor 50%
            <Button
              onClick={handleColorAlert}
              variant="text"
              sx={{ position: "absolute", right: 0 }}
            >
              X
            </Button>
          </DialogTitle>
          <DialogContent dividers className="flex flex-col gap-6">
            <Typography>
              Xiro se reserva el derecho de admisión con trabajos a color cuya
              cobertura sobre la hoja sea superior al 50% de la misma, pudiendo
              la empresa comunicarse por WhatsApp y realizar la devolución del
              dinero.
            </Typography>
            <Typography align="right">Muchas gracias.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleColorAlert} variant="outlined">
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {state.choosePlace && (
        <ChoosePlaceModal
          choosePlace={state.choosePlace}
          setChoosePlace={(value) => updateState("choosePlace", value)}
        />
      )}

      <Navbar title="Nuevo pedido" loggedUser={user} cart={cart} />

      <section className="relative w-full h-full lg:flex">
        {/* Overlay de carga */}
        {state.loading && (
          <div className="absolute w-screen h-screen z-[9999] bg-gray-600/50 flex flex-col items-center justify-center">
            <CircularProgress color="primary" size={50} />
            <span className="text-white">...Cargando...</span>
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-2 px-4 lg:px-0 h-full lg:w-9/12">
          <div className="lg:flex w-full md:p-4">
            <section className="bg-[#fff] flex flex-col md:flex-row-reverse md:justify-around md:items-center items-around justify-center w-full p-4 gap-4 rounded-lg">
              <div className="flex items-center justify-around h-1/2 md:h-full">
                {place?.type === "Envío a domicilio" || !place ? (
                  <button
                    onClick={() => updateState("choosePlace", true)}
                    className="flex flex-col gap-1 items-center justify-center px-2 text-black rounded-md border-2 border-[#789360] hover:bg-[#61774d]"
                  >
                    <MopedIcon style={{ height: "1.5em", width: "1.5em" }} />
                    <span className="text-[14px]">Envío</span>
                  </button>
                ) : (
                  <button
                    onClick={() => updateState("choosePlace", true)}
                    className="flex flex-col gap-1 items-center justify-center px-2 rounded-md text-black hover:bg-[#61774d] border-2 border-[#789360]"
                  >
                    <StoreIcon style={{ height: "1.5em", width: "1.5em" }} />
                    <span className="text-[14px]">Retiro</span>
                  </button>
                )}

                <section className="flex flex-col gap-1 items-center justify-center px-2">
                  <div className="flex justify-center items-center gap-1">
                    <DescriptionIcon
                      style={{ height: "1.5em", width: "1.5em" }}
                    />
                    <span>{files.previews.length}</span>
                  </div>
                  <span className="text-[14px]">Archivos</span>
                </section>

                <section className="flex flex-col gap-1 items-center justify-center px-2">
                  <div className="flex justify-center items-center gap-1">
                    <CopiesIcon style={{ height: "1.5em", width: "1.5em" }} />
                    <span>{resume.numberOfCopies}</span>
                  </div>
                  <span className="text-[14px]">Copias</span>
                </section>

                <section className="flex flex-col gap-1 items-center justify-center px-2">
                  <div className="flex justify-center items-center gap-1">
                    <FileCopySharpIcon
                      style={{ height: "1.5em", width: "1.5em" }}
                    />
                    <span>{resume.totalPages}</span>
                  </div>
                  <span className="text-[14px]">Páginas</span>
                </section>

                <section className="flex flex-col gap-1 items-center justify-center px-2 font-bold border-2 rounded-lg p-2 bg-[#799361] text-white shadow-xl">
                  <div className="flex justify-center items-center gap-1">
                    <PrintSharpIcon
                      style={{ height: "1.5em", width: "1.5em" }}
                    />
                    <span>${pricing.total}</span>
                  </div>
                  <span className="text-[14px]">Precio</span>
                </section>
              </div>

              <div className="flex h-1/2 md:h-full md:justify-center md:gap-1 justify-between md:flex-col">
                <form encType="multipart/form-data">
                  <div className="flex items-center justify-center">
                    <LoadingButton
                      loading={state.loading}
                      component="label"
                      variant="contained"
                      color="primary"
                      startIcon={
                        <UploadIcon sx={{ height: "1em", width: "1em" }} />
                      }
                    >
                      <span className="text-lg font-bold">Cargar archivos</span>
                      <VisuallyHiddenInput
                        type="file"
                        name="file"
                        id="uploadInput"
                        accept=".pdf, .doc, .docx, .xls, .xlsx, image/*, .txt"
                        onChange={handleSubmitLoadFile}
                        disabled={state.loading}
                      />
                    </LoadingButton>
                  </div>
                </form>

                <div className="flex items-center justify-center">
                  <button
                    className="hover:opacity-80 hover:underline"
                    onClick={() => updateState("resetModal", true)}
                    disabled={files.previews.length === 0}
                  >
                    <span className="text-[15px] underline text-black">
                      Eliminar mis archivos
                    </span>
                  </button>
                </div>
              </div>
            </section>

            {/* Configuración móvil */}
            <section className="lg:hidden flex flex-col lg:w-1/2">
              <section className="w-full">
                <SettingButtons
                  handleSettings={handleSettings}
                  currentSetting={state.currentSetting}
                />
              </section>

              <section className="w-full">
                <NewOrderSettings
                  helpModal={state.helpModal}
                  setHelpModal={(value) => updateState("helpModal", value)}
                  currentSetting={state.currentSetting}
                  resume={resume}
                  setResume={handleSetResume}
                />
              </section>
            </section>
          </div>

          {/* Visor de PDF */}
          <section className="w-full h-full">
            <DefaultSnack content={labels?.snackbar_new_order_info} />

            {files.previews.length > 0 ? (
              <div className="flex flex-col items-center justify-center">
                <section className="flex justify-center w-screen h-full rounded-lg lg:px-6 lg:w-full">
                  <div className="flex flex-col items-start rounded-lg overflow-x-auto w-full md:w-full px-6 py-4">
                    <div className="flex justify-start gap-8">
                      {files.previews.map((filePreview, index) => (
                        <PDFViewer
                          key={`${filePreview}-${index}`}
                          newFile={filePreview}
                          index={index}
                          resume={resume}
                          setResume={setResume}
                          setLoading={(value) => updateState("loading", value)}
                          setFilesDetail={(detail) =>
                            setFiles((prev) => {
                              console.log(detail);
                              return {
                                ...prev,
                                details: [...detail],
                              };
                            })
                          }
                          filesDetail={files.details}
                          handleDeleteFile={handleDeleteFile}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                {/* Modal de revisión */}
                <Modal
                  open={state.review}
                  onClose={() => updateState("review", false)}
                  aria-labelledby="parent-modal-title"
                  aria-describedby="parent-modal-description"
                >
                  <Box sx={modalStyle}>
                    <section className="border-b border-gray-600 p-4">
                      <Typography
                        variant="h6"
                        id="parent-modal-title"
                        className="text-center"
                      >
                        Tu pedido
                      </Typography>
                    </section>

                    <section className="flex flex-col px-5 py-10 gap-10">
                      <div className="flex justify-between">
                        <span className="font-[500]">Precio de impresión:</span>
                        <span className="opacity-70 font-[500]">
                          ${pricing?.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[500]">Copias</span>
                        <span className="opacity-70 font-[500]">
                          {resume.numberOfCopies}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[500]">Color</span>
                        <span className="opacity-70 font-[500]">
                          {resume.color}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[500]">Tamaño</span>
                        <span className="opacity-70 font-[500]">
                          {resume.size}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[500]">Forma de impresión</span>
                        <span className="opacity-70 font-[500]">
                          {resume.printWay}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[500]">Copias por carilla</span>
                        <span className="opacity-70 font-[500]">
                          {resume.copiesPerPage}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[500]">Orientación</span>
                        <span className="opacity-70 font-[500]">
                          {resume.orientacion}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[500]">Anillado</span>
                        <span className="opacity-70 font-[500]">
                          {resume.finishing}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[500]">Agrupación</span>
                        <span className="opacity-70 font-[500]">
                          {resume.group}
                        </span>
                      </div>
                    </section>

                    <section className="flex justify-between items-center px-5 pb-5">
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => updateState("review", false)}
                      >
                        {"< "}Editar mi pedido
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSetOrder}
                      >
                        Aceptar y agregar
                      </Button>
                    </section>
                  </Box>
                </Modal>
              </div>
            ) : (
              <div className="text-white mt-2 flex flex-col justify-center px-6 items-center gap-2 overflow-x-auto overscroll-contain w-full">
                Selecciona los archivos que quieras imprimir.
              </div>
            )}
          </section>

          {/* Botones de acción */}
          <section className="flex w-full justify-around pb-4">
            <LoadingButton
              loading={state.loading}
              variant="contained"
              color="primary"
              sx={{ border: "2px solid white" }}
              className={cart?.length ? "w-1/3" : "w-1/2"}
              disabled={files.details.length === 0}
              onClick={() => updateState("review", true)}
            >
              <span className="font-bold text-lg">Añadir al carrito</span>
            </LoadingButton>

            {cart?.length > 0 && (
              <LoadingButton
                loading={state.loading}
                variant="contained"
                color="primary"
                sx={{ border: "2px solid white" }}
                className="w-1/3"
                onClick={() => navigate("/carrito")}
              >
                <span className="font-bold text-lg">Avanzar</span>
              </LoadingButton>
            )}
          </section>
        </div>

        {/* Configuración desktop */}
        <section className="hidden lg:flex lg:flex-col p-4">
          <NewOrderSettingsDesktop
            resume={resume}
            setResume={handleSetResume}
          />
        </section>
      </section>

      {/* Modal de confirmación para eliminar archivos */}
      <Dialog
        open={state.resetModal}
        onClose={() => updateState("resetModal", false)}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="flex flex-col justify-center items-center">
          <DialogTitle
            id="responsive-dialog-title"
            className="flex flex-col items-center gap-5 text-center"
          >
            <ErrorIcon color="warning" sx={{ height: "4em", width: "4em" }} />
            <span className="text-xl lg:text-xl">
              ¿Está seguro que desea eliminar los archivos cargados?
            </span>
          </DialogTitle>

          <DialogContent className="flex justify-center">
            <DialogContentText className="text-center">
              <span className="text-md lg:text-md">
                Esta acción es permanente
              </span>
            </DialogContentText>
          </DialogContent>

          <div className="flex justify-end items-end w-full">
            <DialogActions>
              <Button
                color="primary"
                autoFocus
                onClick={() => updateState("resetModal", false)}
              >
                <span className="text-md font-[200]">Cancelar</span>
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={handleResetOrder}
                autoFocus
              >
                <span className="text-md font-[400]">Borrar</span>
              </Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
