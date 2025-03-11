import React, { useEffect, useState } from "react";
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
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#fff",
  borderRadius: "8px",
  boxShadow: 24,
};

export default function NewOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.dataBaseUser);
  const cart = useSelector((state) => state.cart);
  const labels = useSelector((state) => state.labels);
  const pricingState = useSelector((state) => state.pricing);
  const place = useSelector((state) => state.place);
  const [resetModal, setResetModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [choosePlace, setChoosePlace] = useState(false);
  const [review, setReview] = useState(false);
  const [newFiles, setNewFiles] = useState([]); //files converted to PDF.
  const [currentSetting, setCurrentSetting] = useState("numberOfCopies");
  const [openColorAlertModal, setOpenColorAlertModal] = useState(false);
  const handleColorAlert = () => {
    setOpenColorAlertModal(!openColorAlertModal);
  };

  const [pricing, setPricing] = useState({
    BIG_ringed: Number(pricingState?.BIG_ringed),
    SMALL_ringed: Number(pricingState?.SMALL_ringed),
    A3_simple_do: Number(pricingState?.A3_simple_do),
    A3_simple_do_color: Number(pricingState?.A3_simple_do_color),
    A3_double_does: Number(pricingState?.A3_double_does),
    A3_double_does_color: Number(pricingState?.A3_double_does_color),
    OF_simple_do: Number(pricingState?.OF_simple_do),
    OF_simple_do_color: Number(pricingState?.OF_simple_do_color),
    OF_double_does: Number(pricingState?.OF_double_does),
    OF_double_does_color: Number(pricingState?.OF_double_does_color),
    simple_do: Number(pricingState?.simple_do),
    simple_do_color: Number(pricingState?.simple_do_color),
    double_does: Number(pricingState?.double_does),
    double_does_color: Number(pricingState?.double_does_color),
    ringed: Number(1500), //🚒🚒🚑CAMBIAR URGENTE!!!
    total: Number(0),
  });

  const [resume, setResume] = useState({
    totalPages: 0,
    numberOfCopies: 1,
    color: "BN",
    size: "A4",
    printWay: "Simple faz",
    copiesPerPage: "Normal",
    orientacion: "Vertical",
    finishing: "Sin anillado",
  });

  const handleSetResume = (newResume, colorAlert) => {
    setResume(newResume);
    if (colorAlert) {
      setOpenColorAlertModal(true);
    }
  };

  useEffect(() => {
    dispatch(getPricing());
    if (!place) {
      setChoosePlace(true);
    }
  }, []);

  useEffect(() => {
    /* PONERLO JUNTO CON TODOS! */
    if (resume.totalPages * resume.numberOfCopies < 20) {
      setResume({
        ...resume,
        ["finishing"]: "Sin anillado",
      });
    }
    if (newFiles.length === 0) {
      setResume({
        totalPages: 0,
        numberOfCopies: 1,
        color: "BN",
        size: "A4",
        printWay: "Simple faz",
        copiesPerPage: "Normal",
        orientacion: "Vertical",
        finishing: "Sin anillado",
      });
    }
  }, [newFiles]);

  useEffect(() => {
    let newTotal = pricingSetter(pricing, resume);
    if (!isNaN(newTotal)) {
      setPricing({ ...pricing, ["total"]: Number(newTotal) });
    } else {
      navigate("/");
    }
  }, [resume]);

  function handleSettings(e) {
    setCurrentSetting(e.target.name);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    e.persist();
    const files = e.target.files;
    const maxSizeMB = 2; // Tamaño máximo permitido en megabytes

    try {
      setLoading(true);
      let newArray = [];

      const uploadPromises = Array.from(files).map(async (file) => {
        if (!validateFileSize(file, maxSizeMB)) {
          dispatch(setToast(`El archivo no puede superar los ${maxSizeMB}MB`, "error"));
          return; // Salta este archivo si la validación falla
        }

        const formData = new FormData();
        let result = validatePDFFile(file.name);

        if (result === false) {
          formData.append("files", file);
          try {
            const newDocumentsName = await dispatch(uploadMulter(formData));
            newDocumentsName.map((doc) => newArray.push(doc));
          } catch (error) {
            dispatch(setToast("Error al subir el archivo", "error"));
            console.error("Error al subir el archivo:", error);
            // throw error; // Re-lanza el error para que el catch principal lo capture
          }
        } else {
          try {
            const uploadedFile = await uploadFile(file);
            newArray.unshift(uploadedFile);
          } catch (error) {
            console.error("Error al cargar el archivo localmente:", error);
            // throw error; // Re-lanza el error para que el catch principal lo capture
          }
        }
      });

      await Promise.all(uploadPromises); // Espera a que todas las cargas se completen

      setNewFiles([...newFiles, newArray].flat(4));
    } catch (error) {
      alert("Error general al subir archivos. Consulta la consola.");
      console.error("Error general:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleResetOrderModal(e) {
    setResetModal(true);
  }
  async function handleResetOrder(e) {
    setNewFiles([]);
    setResume({
      totalPages: 0,
      numberOfCopies: 1,
      color: "BN",
      size: "A4",
      printWay: "Simple faz",
      copiesPerPage: "Normal",
      orientacion: "Vertical",
      finishing: "Sin anillado",
    });
    setPricing({ ...pricing, total: 0 });
    setResetModal(false);
  }
  async function handleSetOrder(e) {
    dispatch(
      addToCart(user, { ...resume, files: newFiles, total: pricing.total })
    );
    setNewFiles([]);
    setResume({
      totalPages: 0,
      numberOfCopies: 1,
      color: "BN",
      size: "A4",
      printWay: "Simple faz",
      copiesPerPage: "Normal",
      orientacion: "Vertical",
      finishing: "Sin anillado",
    });
    setPricing({ ...pricing, total: 0 });
    setReview(false);
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-between ">
      {/* {loading ? <FilesLoader progressValue={newFiles?.length || 0} /> : false} */}

      {openColorAlertModal ? (
        <Dialog open={openColorAlertModal} onClose={handleColorAlert}>
          <DialogTitle className="text-center relative">
            Aviso cobertura color mayor 50%
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
              Xiro se reserva el derecho de admisión con trabajos color cuya
              cobertura sobre la hoja sea superior al 50% de la misma, pudiendo
              la empresa hacer la devolución del dinero sin mediar comunicación
              al respecto.
            </Typography>
            <Typography align="right">Muchas gracias.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleColorAlert} variant="outlined">
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
      {choosePlace ? (
        <ChoosePlaceModal
          choosePlace={choosePlace}
          setChoosePlace={setChoosePlace}
        />
      ) : null}

      <Navbar title="Nuevo pedido" loggedUser={user} cart={cart} />
      {/* <Chatbot /> */}
      <section className="relative w-full h-full lg:flex">
        <div
          className={
            loading
              ? "absolute w-screen h-screen z-[9999] bg-gray-600/50"
              : null
          }
        >
          <div
            className={
              loading ? "w-full h-full flex items-center justify-center" : null
            }
          >
            <CircularProgress
              color="primary"
              size={"50px"}
              sx={loading ? { display: "block" } : { display: "none" }}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 px-4 lg:px-0  h-full lg:w-9/12">
          <div className="lg:flex  w-full md:p-4">
            <section className="bg-[#fff] flex flex-col md:flex-row-reverse md:justify-around md:items-cemter items-around  justify-center w-full p-4 gap-4 rounded-lg">
              <div className="flex items-center justify-around h-1/2 md:h-full">
                {place?.type === "Envío a domicilio" ||
                place?.type === undefined ? (
                  <button
                    onClick={(e) => setChoosePlace(true)}
                    className="flex flex-col gap-1 items-center justify-center px-2 text-white rounded-md bg-[#789360] hover:bg-[#61774d]"
                  >
                    <div className="flex justify-center items-center gap-1">
                      <MopedIcon style={{ height: "1.5em", width: "1.5em" }} />
                    </div>
                    <span className="text-[14px]">Envío</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => setChoosePlace(true)}
                    className="flex flex-col gap-1 items-center justify-center px-2 rounded-md text-white hover:bg-[#61774d] bg-[#789360]"
                  >
                    <div className="flex justify-center items-center gap-1">
                      <StoreIcon style={{ height: "1.5em", width: "1.5em" }} />
                    </div>
                    <span className="text-[14px]">Retiro</span>
                  </button>
                )}
                <section className="flex flex-col gap-1 items-center justify-center px-2 ">
                  <div className="flex justify-center items-center gap-1">
                    <DescriptionIcon
                      style={{ height: "1.5em", width: "1.5em" }}
                    />
                    <span>{newFiles?.length}</span>
                  </div>
                  <span className="text-[14px]">Archivos</span>
                </section>
                <section className="flex flex-col gap-1 items-center justify-center px-2 ">
                  <div className="flex justify-center items-center gap-1">
                    <CopiesIcon style={{ height: "1.5em", width: "1.5em" }} />
                    <span>{resume.numberOfCopies}</span>
                  </div>
                  <span className="text-[14px]">Copias</span>
                </section>
                <section className="flex flex-col gap-1 items-center justify-center px-2 ">
                  <div className="flex justify-center items-center gap-1">
                    <FileCopySharpIcon
                      style={{ height: "1.5em", width: "1.5em" }}
                    />
                    <span>{resume.totalPages}</span>
                  </div>
                  <span className="text-[14px]">Páginas</span>
                </section>
                <section className="flex flex-col gap-1 items-center justify-center px-2 ">
                  <div className="flex justify-center items-center gap-1">
                    <PrintSharpIcon
                      style={{ height: "1.5em", width: "1.5em" }}
                    />
                    <span>${pricing.total}</span>
                  </div>
                  <span className="text-[14px]">Precio</span>
                </section>
              </div>
              <div className="flex h-1/2 md:h-full md:justify-center md:gap-1 justify-between md:flex-col ">
                <form encType="multipart/form-data">
                  <div className="flex items-center justify-center">
                    <LoadingButton
                      loading={loading}
                      component="label"
                      variant="contained"
                      color="primary"
                      startIcon={
                        <UploadIcon sx={{ height: "1em", width: "1em" }} />
                      }
                    >
                      <span className="text-lg font-bold">Cargar archivos</span>
                      {!loading ? (
                        <VisuallyHiddenInput
                          type="file"
                          name="file"
                          id="uploadInput"
                          accept=".pdf, .doc, .docx, .xls, .xlsx, image/*, .txt"
                          onChange={(e) => handleSubmit(e)}
                        />
                      ) : (
                        false
                      )}
                    </LoadingButton>
                  </div>
                </form>
                <div className="flex items-center justify-center">
                  <button
                    className="hover:opacity-80 hover:underline"
                    name="deleteFiles"
                    onClick={(e) => handleResetOrderModal(e)}
                  >
                    <span className="text-[15px] underline text-black">
                      Eliminar mis archivos
                    </span>
                  </button>
                </div>
              </div>
            </section>
            <section className="lg:hidden flex flex-col lg:w-1/2 ">
              {/* -------------SETTING BUTTONS-------------- */}
              <section className="w-full">
                <SettingButtons
                  handleSettings={handleSettings}
                  currentSetting={currentSetting}
                />
              </section>
              {/* -------------SETTING OPTIONS-------------- */}
              <section className="w-full">
                <NewOrderSettings
                  helpModal={helpModal}
                  setHelpModal={setHelpModal}
                  currentSetting={currentSetting}
                  resume={resume}
                  setResume={handleSetResume}
                />
              </section>
            </section>
          </div>
          {/* ------------------------------------------PDF VIEWER------------------------------ */}
          <section className="w-full h-full">
            <DefaultSnack content={labels?.snackbar_new_order_info} />
            {/* {loadingCard?.length > 0 ? (
              <div className="pulse bg-red-500">Cargando</div>
            ) : (
              false
            )} */}
            {newFiles && newFiles?.length > 0 ? (
              <div className="flex flex-col items-center justify-center">
                <section className="flex justify-center w-screen h-full rounded-lg lg:px-6 lg:w-full">
                  <div className="flex flex-col items-start rounded-lg overflow-x-auto w-full md:w-full px-6 py-4">
                    <div className="flex justify-start  gap-8">
                      {newFiles.map((newFile, index) => (
                        <PDFViewer
                          key={index + newFile}
                          index={index}
                          newFile={newFile}
                          resume={resume}
                          setResume={setResume}
                          setNewFiles={setNewFiles}
                          newFiles={newFiles}
                          setLoading={setLoading}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                <Modal
                  open={review}
                  onClose={() => setReview(false)}
                  aria-labelledby="parent-modal-title"
                  aria-describedby="parent-modal-description"
                  className=""
                >
                  <Box sx={{ ...style, width: 400 }}>
                    <section className="border-b border-gray-600 p-4 ">
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
                        <span className="font-[500]">Copias</span>
                        <span className="opacity-70 font-[500]">
                          {" "}
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
                    </section>
                    <section className="flex justify-between items-center px-5 pb-5">
                      <Button
                        variant="text"
                        color="primary"
                        onClick={(e) => setReview(false)}
                      >
                        {"< "}Editar mi pedido
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => handleSetOrder(e)}
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
                {/* <img src={cuate} alt="" className="bg-[#fff] rounded-lg" /> */}
              </div>
            )}
          </section>

          <section className="flex w-full justify-around pb-4">
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              sx={{ border: "2px solid white" }}
              className={cart?.length ? "w-1/3" : "w-1/2"}
              disabled={newFiles?.length === 0}
              onClick={(e) => setReview(true)}
            >
              <span className="font-bold text-lg">Añadir al carrito</span>
            </LoadingButton>
            {cart?.length ? (
              <LoadingButton
                loading={loading}
                variant="contained"
                color="primary"
                sx={{ border: "2px solid white" }}
                className="w-1/3"
                onClick={(e) => navigate("/carrito")}
              >
                <span className="font-bold text-lg">Avanzar</span>
              </LoadingButton>
            ) : (
              false
            )}
          </section>
        </div>
        {/* MENÚ DESKTOP */}
        <section className="hidden lg:flex lg:flex-col p-4">
          <NewOrderSettingsDesktop
            resume={resume}
            setResume={handleSetResume}
          />
        </section>
      </section>

      {/* MODAL RESET ORDER */}
      <Dialog
        // fullScreen={fullScreen}
        open={resetModal}
        onClose={(e) => setResetModal(false)}
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
                onClick={(e) => setResetModal(false)}
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
