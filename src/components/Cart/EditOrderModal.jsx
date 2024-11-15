import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import PDFViewer from "../../components/PDFViewer";
import { LoadingButton } from "@mui/lab";
import MopedIcon from "@mui/icons-material/Moped";
import DescriptionIcon from "@mui/icons-material/Description";
import FileCopySharpIcon from "@mui/icons-material/FileCopySharp";
import ErrorIcon from "@mui/icons-material/Error";
import PrintSharpIcon from "@mui/icons-material/PrintSharp";
import UploadIcon from "@mui/icons-material/Upload";
import { styled } from "@mui/material/styles";
import {
  editOrderFromCart,
  getPricing,
  uploadMulter,
} from "../../redux/actions";
import { validatePDFFile } from "../../utils/inputValidator";
import { uploadFile } from "../../config/firebase";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import NewOrderSettings from "../../components/NewOrderSettings/NewOrderSettings";
import SettingButtons from "../../components/NewOrderSettings/SettingButtons";
import ChoosePlaceModal from "../../components/ChoosePlaceModal/ChoosePlaceModal";
import NewOrderSettingsDesktop from "../../components/NewOrderSettings/NewOrderSettingsDesktop";
import DefaultSnack from "../Snackbars/DefaultSnack";
import { pricingSetter } from "../../utils/controllers/pricing.controller";

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
  bgcolor: "#1e1e1e",
  borderRadius: "8px",
  boxShadow: 24,
};

export default function EditOrderModal({ orderToEdit, setShowEditModal }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.dataBaseUser);
  const cart = useSelector((state) => state.cart);
  const pricingState = useSelector((state) => state.pricing);
  const place = useSelector((state) => state.place);
  const [resetModal, setResetModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [choosePlace, setChoosePlace] = useState(false);
  const [review, setReview] = useState(false);
  const [newFiles, setNewFiles] = useState(
    orderToEdit ? orderToEdit.files : null
  ); //files converted to PDF.
  const [currentSetting, setCurrentSetting] = useState("numberOfCopies");
  const [pricing, setPricing] = useState({
    BIG_ringed: Number(pricingState?.BIG_ringed),
    SMALL_ringed: Number(pricingState?.SMALL_ringed),
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
    numberOfCopies: orderToEdit.numberOfCopies,
    color: orderToEdit.color,
    size: orderToEdit.size,
    printWay: orderToEdit.printWay,
    copiesPerPage: orderToEdit.copiesPerPage,
    orientacion: orderToEdit.orientacion,
    finishing: orderToEdit.finishing,
  });

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
    if (newTotal !== NaN) {
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

    const formData = new FormData();

    try {
      setLoading(true);
      let newArray = [];
      for (let i = 0; i < files.length; i++) {
        let result = validatePDFFile(files[i].name);

        if (result === false) {
          formData.append("files", files[i]);
          await dispatch(uploadMulter(formData))
            .then((newDocumentsName) =>
              newDocumentsName.map((doc) => newArray.push(doc))
            )
            .catch((error) => console.log(error))
            .finally(() => {
              // setLoading(false);
            });
        } else {
          let uploadedFile = await uploadFile(files[i]);

          newArray.unshift(uploadedFile);
          // setLoading(false);
        }
      }
      setNewFiles([...newFiles, newArray].flat(4));
      // setLoading(false)
    } catch (error) {
      console.error(error);
      alert("error subiendo archivo");
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
      editOrderFromCart(user, orderToEdit.orderUid, {
        ...resume,
        files: newFiles,
        total: pricing.total,
      })
    );

    setShowEditModal({ show: false, orderToEdit: null });
  }

  return (
    <div className="absolute h-screen w-screen flex flex-col justify-between ">
      {choosePlace ? (
        <ChoosePlaceModal
          choosePlace={choosePlace}
          setChoosePlace={setChoosePlace}
        />
      ) : (
        false
      )}

      <Navbar title="Editar pedido" loggedUser={user} cart={cart} />
      <section className="w-full h-full lg:flex">
        <div className="flex flex-col items-center gap-2 px-4 lg:px-0  h-full lg:w-9/12">
          <div className="lg:flex  w-full md:p-4">
            <section className="bg-[#4675C0] flex flex-col md:flex-row-reverse md:justify-around md:items-cemter items-around  justify-center w-full p-4 gap-4 rounded-lg">
              <div className="flex items-center justify-around h-1/2 md:h-full">
                {place?.type === "Envío a domicilio" ? (
                  <button
                    onClick={(e) => setChoosePlace(true)}
                    className="flex flex-col gap-1 items-center justify-center px-2 rounded-md bg-[#6a9bea] hover:bg-[#476493]"
                  >
                    <div className="flex justify-center items-center gap-1">
                      <MopedIcon sx={{ height: "1.3em", width: "1.2em" }} />
                    </div>
                    <span className="text-[14px]">Envío</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => setChoosePlace(true)}
                    className="flex flex-col gap-1 items-center justify-center px-2 rounded-md hover:bg-[#5e89ce] bg-[#6a9bea]"
                  >
                    <div className="flex justify-center items-center gap-1">
                      <StoreIcon sx={{ height: "1.3em", width: "1.2em" }} />
                    </div>
                    <span className="text-[14px]">Retiro</span>
                  </button>
                )}
                <section className="flex flex-col gap-1 items-center justify-center px-2 ">
                  <div className="flex justify-center items-center gap-1">
                    <DescriptionIcon sx={{ height: "1.3em", width: "1.2em" }} />
                    <span>{newFiles?.length}</span>
                  </div>
                  <span className="text-[14px]">Archivos</span>
                </section>
                <section className="flex flex-col gap-1 items-center justify-center px-2 ">
                  <div className="flex justify-center items-center gap-1">
                    <DescriptionIcon sx={{ height: "1.3em", width: "1.2em" }} />
                    <span>{resume?.numberOfCopies}</span>
                  </div>
                  <span className="text-[14px]">Copias</span>
                </section>
                <section className="flex flex-col gap-1 items-center justify-center px-2 ">
                  <div className="flex justify-center items-center gap-1">
                    <FileCopySharpIcon
                      sx={{ height: "1.3em", width: "1.2em" }}
                    />
                    <span>{resume?.totalPages}</span>
                  </div>
                  <span className="text-[14px]">Páginas</span>
                </section>
                <section className="flex flex-col gap-1 items-center justify-center px-2 ">
                  <div className="flex justify-center items-center gap-1">
                    <PrintSharpIcon sx={{ height: "1.3em", width: "1.2em" }} />
                    <span>${pricing?.total}</span>
                  </div>
                  <span className="text-[14px]">Precio</span>
                </section>
              </div>
              <div className="flex h-1/2 md:h-full md:justify-center md:gap-1 justify-between md:flex-col ">
                <form
                  encType="multipart/form-data"
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <div className="flex items-center justify-center">
                    <LoadingButton
                      loading={loading}
                      component="label"
                      variant="outlined"
                      color="white"
                      startIcon={
                        <UploadIcon sx={{ height: "0.8em", width: "0.8em" }} />
                      }
                      className=" h-8 "
                    >
                      <span className="text-[14px] font-light">
                        Cargar archivos
                      </span>
                      {!loading ? (
                        <VisuallyHiddenInput
                          multiple
                          type="file"
                          name="file"
                          id="uploadInput"
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
                    className="hover:opacity-70"
                    name="deleteFiles"
                    onClick={(e) => handleResetOrderModal(e)}
                  >
                    <span className="text-[13px] font-light underline ">
                      Eliminar mis archivos
                    </span>
                  </button>
                </div>
              </div>
            </section>
            <section className="lg:hidden flex flex-col lg:w-1/2 ">
              {/* -------------SETTING BUTTONS-------------- */}
              <section className="w-full ">
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
                  setResume={setResume}
                />
              </section>
            </section>
          </div>
          {/* ------------------------------------------PDF VIEWER------------------------------ */}
          <section className="w-full h-full">
            <DefaultSnack />
            {newFiles && newFiles?.length > 0 ? (
              <div className="flex flex-col items-center justify-center h-[26em] lg:h-[32em]">
                <section className="flex justify-center w-full h-full rounded-lg px-6">
                  <div className="flex flex-col items-start rounded-lg overflow-x-auto w-full md:w-full ">
                    <div className="flex justify-start md:justify-center gap-8 md:flex-wrap">
                      {newFiles.map((newFile, index) => (
                        <>
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
                        </>
                      ))}
                    </div>
                  </div>
                </section>

                <Modal
                  open={review}
                  onClose={() => setReview(false)}
                  aria-labelledby="parent-modal-title"
                  aria-describedby="parent-modal-description"
                >
                  <Box sx={{ ...style, width: 400 }}>
                    <section className="border-b border-gray-600 p-4 ">
                      <h2 id="parent-modal-title" className="text-center ">
                        Tu pedido
                      </h2>
                    </section>
                    <section className="flex flex-col px-5 py-10 gap-10">
                      VER PLACE
                      <div className="flex justify-between">
                        <span className="font-[300]">Copias</span>
                        <span className="opacity-70 font-[300]">
                          {" "}
                          {resume.numberOfCopies}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[300]">Color</span>
                        <span className="opacity-70 font-[300]">
                          {resume.color}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[300]">Tamaño</span>
                        <span className="opacity-70 font-[300]">
                          {resume.size}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[300]">Forma de impresión</span>
                        <span className="opacity-70 font-[300]">
                          {resume.printWay}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[300]">Copias por carilla</span>
                        <span className="opacity-70 font-[300]">
                          {resume.copiesPerPage}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[300]">Orientación</span>
                        <span className="opacity-70 font-[300]">
                          {resume.orientacion}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[300]">Anillado</span>
                        <span className="opacity-70 font-[300]">
                          {resume.finishing}
                        </span>
                      </div>
                    </section>
                    <section className="flex justify-between items-center px-5 pb-5">
                      <Button
                        variant="text"
                        color="primary"
                        className="text-sm font-light"
                        onClick={(e) => setReview(false)}
                      >
                        <span className="text-[#4675C0]">
                          Editar mi pedido {">"}
                        </span>
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        className="text-sm font-light"
                        onClick={(e) => handleSetOrder(e)}
                      >
                        <span className="text-sm font-light">
                          Aceptar y agregar
                        </span>
                      </Button>
                    </section>
                  </Box>
                </Modal>
              </div>
            ) : (
              <div className="opacity-60  mt-2 flex flex-col  justify-center px-6 items-center gap-2 overflow-x-auto overscroll-contain w-full ">
                Selecciona los archivos que quieras imprimir.
                {/* <img src={cuate} alt="" className="bg-[#4675C0] rounded-lg" /> */}
              </div>
            )}
          </section>
          <section className="flex w-full justify-center pb-4">
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              className="w-1/2"
              disabled={newFiles?.length === 0}
              onClick={(e) => handleSetOrder(e)}
            >
              <span className="font-light">Volver al carrito</span>
            </LoadingButton>
          </section>
        </div>
        <section className="hidden lg:flex lg:flex-col p-4">
          <NewOrderSettingsDesktop
            helpModal={helpModal}
            setHelpModal={setHelpModal}
            currentSetting={currentSetting}
            handleSettings={handleSettings}
            resume={resume}
            setResume={setResume}
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
                color="white"
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
