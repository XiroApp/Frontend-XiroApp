import { useEffect, useState, useMemo, useCallback } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import PDFViewer from "../../../components/PDFViewer";
import { LoadingButton } from "@mui/lab";
import {
  FaStore as StoreIcon,
  FaRegFilePdf as FilesIcon,
  FaCopy as CopiesIcon,
  FaBookOpen as PagesIcon,
  FaMotorcycle as MopedIcon,
} from "react-icons/fa6";
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
  getRingedTotalPrice,
  pricingSetter,
  validateFileSize,
} from "../../../utils/controllers/pricing.controller.js";
import { formatPrice, len } from "../../../Common/helpers.js";
import {
  Create as CreatIcon,
  DeleteForever as RemoveFilesIcon,
} from "@mui/icons-material";
import BackBtn from "../../../components/BackBtn.jsx";
import BackgroundHueso from "../../../components/BackgroundHueso.jsx";

export default function NewOrder() {
  const dispatch = useDispatch(),
    navigate = useNavigate(),
    user = useSelector(state => state.dataBaseUser),
    cart = useSelector(state => state.cart),
    libraryCart = useSelector(state => state.libraryCart),
    labels = useSelector(state => state.labels),
    pricingState = useSelector(state => state.pricing),
    place = useSelector(state => state.place),
    [libraryModal, setLibraryModal] = useState(false),
    [showUnsavedModal, setShowUnsavedModal] = useState(false),
    [loadFileBtn, setLoadFileBtn] = useState(false),
    [state, setState] = useState({
      loading: false,
      resetModal: false,
      helpModal: false,
      choosePlace: !place,
      review: false,
      openColorAlertModal: false,
      currentSetting: "numberOfCopies",
    }),
    [files, setFiles] = useState({
      details: [],
      previews: [],
    }),
    [resume, setResume] = useState(initialResumeState),
    removeDuplicateDetails = currentFiles => {
      const uniqueDetails = [];
      const seenNames = new Set();

      currentFiles.details.forEach(file => {
        if (!seenNames.has(file.name)) {
          seenNames.add(file.name);
          uniqueDetails.push(file);
        }
      });

      return {
        ...currentFiles,
        details: uniqueDetails,
      };
    },
    pricing = useMemo(() => {
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
      const ringed_total = getRingedTotalPrice(
        basePricing,
        resume,
        files.details
      );
      return {
        ...basePricing,
        total: isNaN(total) ? 0 : Number(total),
        ringed_total: ringed_total,
      };
    }, [pricingState, resume, files.details]);

  useEffect(() => {
    if (state.loading) {
      setLoadFileBtn(true);
    } else setLoadFileBtn(false);

    const timer = setTimeout(() => updateState("loading", false), 8000);
    return () => clearTimeout(timer);
  }, [state.loading]);

  useEffect(() => {
    dispatch(getPricing());
  }, []);

  useEffect(() => {
    const cleanedFiles = removeDuplicateDetails(files);
    if (cleanedFiles.details.length !== files.details.length) {
      setFiles(cleanedFiles);
      return;
    }

    if (cleanedFiles.details.length === 0) {
      setResume(initialResumeState);
      updateState("loading", false);
    } else {
      const totalPages = cleanedFiles.details.reduce(
        (sum, file) => sum + file.pages,
        0
      );

      setResume(prev => ({
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

  const handleSetResume = useCallback((newResume, colorAlert = false) => {
    setResume(newResume);
    if (colorAlert) {
      updateState("openColorAlertModal", true);
    }
  }, []);

  const handleDeleteFile = useCallback(fileToDelete => {
    updateState("loading", true);
    setFiles(prevFiles => {
      const newDetails = prevFiles.details.filter(f => {
        return f.name !== fileToDelete;
      });
      const newPreviews = prevFiles.previews.filter(f => f !== fileToDelete);

      return { previews: newPreviews, details: newDetails };
    });
    updateState("loading", false);
  }, []);

  const handleSubmitLoadFile = useCallback(async function (e) {
    e.preventDefault();
    const filesInput = e.target.files;
    const maxSizeMB = 500;

    if (!filesInput || len(filesInput) == 0) return;
    if (!filesInput || len(filesInput) == 0) return;

    updateState("loading", true);

    try {
      const uploadPromises = Array.from(filesInput)
        .filter(file => {
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
        .map(async file => {
          if (validatePDFFile(file.name)) {
            const uploadedFile = await uploadFile(file);
            return { preview: uploadedFile };
          } else {
            const formData = new FormData();
            formData.append("files", file);
            const newDocuments = await dispatch(uploadMulter(formData)); // Este await es necesario.
            return newDocuments.map(doc => ({ preview: doc }));
          }
        });

      const results = await Promise.all(uploadPromises);
      const newFiles = results.flat();

      setFiles(prev => ({
        ...prev,
        previews: [...prev.previews, ...newFiles.map(f => f.preview)],
      }));
    } catch (err) {
      dispatch(
        setToast("Error al subir archivos, intenta nuevamente", "error")
      );
      console.error(`catch 'handleSubmitLoadFile' ${err.message}`);
      updateState("loading", false);
    }
  }, []);

  const handleResetOrder = useCallback(() => {
    setFiles({ details: [], previews: [] });
    setResume(initialResumeState);
    updateState("resetModal", false);
  }, []);

  const handleSetOrder = useCallback(() => {
    dispatch(
      addToCart(user, {
        ...resume,
        files: files.previews,
        total: pricing.total,
        ringed_total: pricing?.ringed_total || 0,
      })
    );
    setFiles({ details: [], previews: [] });
    setResume(initialResumeState);
    updateState("review", false);
  }, [dispatch, user, resume, files.previews, pricing.total]);

  const updateState = useCallback((key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleColorAlert = useCallback(() => {
    setState(prev => ({
      ...prev,
      openColorAlertModal: !prev.openColorAlertModal,
    }));
  }, []);

  const handleSettings = useCallback(e => {
    updateState("currentSetting", e.target.name);
  }, []);

  function handleLibraryAlert() {
    setLibraryModal(false);
    if (len(files.details) > 0) {
      setShowUnsavedModal(true);
    } else navigate("/?libreria");
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-between">
      {state.openColorAlertModal && (
        <Dialog open={state.openColorAlertModal} onClose={handleColorAlert}>
          <DialogTitle className="text-center relative">
            Cobertura de color superior al 50%
            <BackBtn close={handleColorAlert} />
          </DialogTitle>
          <DialogContent dividers className="flex flex-col gap-6">
            <Typography>
              Xiro se reserva el derecho de admisión con trabajos a color cuya
              cobertura sobre la hoja sea superior al 50% de la misma, pudiendo
              la empresa comunicarse por WhatsApp y realizar la devolución del
              dinero.
            </Typography>
            <Typography align="right">Muchas gracias</Typography>
          </DialogContent>
          <DialogActions>
            <button
              type="button"
              className="px-6 py-2 border rounded-md bg-green-400/70 hover:bg-green-400 duration-100"
              onClick={handleColorAlert}
            >
              Aceptar
            </button>
          </DialogActions>
        </Dialog>
      )}

      {state.choosePlace && (
        <ChoosePlaceModal
          choosePlace={state.choosePlace}
          setChoosePlace={value => updateState("choosePlace", value)}
        />
      )}

      <Navbar title="Nuevo pedido" loggedUser={user} cart={cart} />

      <section className="relative w-full h-full lg:flex">
        {state.loading && (
          <div className="absolute w-screen h-screen z-[9999] bg-gray-600/55 flex items-center justify-center">
            <div className="border-2 border-gray-300/15 flex flex-col items-center justify-center gap-y-5 bg-gray-800/40 p-6 rounded-[30px] backdrop-blur-sm mb-36">
              <CircularProgress color="secondary" size={50} />
              <span className="text-white text-3xl">Cargando</span>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-2 px-4 lg:px-0 h-full lg:w-9/12">
          <div className="lg:flex w-full pt-12 md:p-4">
            <section className="bg-[#fff] flex md:flex-row-reverse md:justify-around md:items-center items-around justify-center w-full p-4 gap-4 rounded-lg flex-wrap">
              <div className="flex items-center justify-center gap-1.5 sm:gap-1.5 flex-row">
                {place?.type == "Envío a domicilio" || !place ? (
                  <button
                    type="button"
                    onClick={() => updateState("choosePlace", true)}
                    className="flex flex-col gap-1.5 items-center justify-center text-black border-[1.4px] border-[#789360] rounded-md w-16 sm:w-20 h-20 hover:bg-green-400/30 hover:border-green-400/30 transition-colors"
                  >
                    <MopedIcon style={{ height: "1.8em", width: "1.8em" }} />
                    <span className="text-[12px] sm:text-[13px]">Envío</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateState("choosePlace", true)}
                    className="flex flex-col gap-y-1.5 items-center justify-center text-black border-[1.4px] border-[#789360] rounded-md w-20 h-20 hover:bg-green-400/30 hover:border-green-400/30 transition-colors"
                  >
                    <StoreIcon style={{ height: "1.5em", width: "1.5em" }} />
                    <span className="text-[14px]">Retiro</span>
                  </button>
                )}

                <section className="border-[1.4px] border-b-[#789360] rounded-md flex flex-col items-center justify-center px-2 gap-y-1.5 w-16 sm:w-20 h-20">
                  <div className="flex justify-center gap-x-2 items-center w-full">
                    <FilesIcon
                      className="hidden sm:block"
                      style={{ height: "1.5em", width: "1.5em" }}
                    />
                    <span>{files.previews.length}</span>
                  </div>
                  <span className="text-[11px] sm:text-[13px] w-full text-center">
                    Archivos
                  </span>
                </section>

                <section className="border-[1.4px] border-b-[#789360] rounded-md flex flex-col gap-1 items-center justify-center px-2 gap-y-1.5 w-16 sm:w-20 h-20">
                  <div className="flex justify-center gap-x-2 items-center w-full">
                    <CopiesIcon
                      className="hidden sm:block"
                      style={{ height: "1.5em", width: "1.5em" }}
                    />
                    <span>{resume.numberOfCopies}</span>
                  </div>
                  <span className="text-[12px] sm:text-[13px] w-full text-center">
                    Copias
                  </span>
                </section>

                <section className="border-[1.4px] border-b-[#789360] rounded-md flex flex-col gap-1 items-center justify-center px-2 gap-y-1.5 w-16 sm:w-20 h-20">
                  <div className="flex justify-center gap-x-2 items-center w-full">
                    <PagesIcon
                      className="hidden sm:block"
                      style={{ height: "1.5em", width: "1.5em" }}
                    />
                    <span>{resume.totalPages}</span>
                  </div>
                  <span className="text-[12px] sm:text-[13px] w-full text-center">
                    Páginas
                  </span>
                </section>

                <section className="flex flex-col items-center justify-center px-2 font-bold rounded-md p-2 bg-[#56713d] text-white shadow-xl gap-y-1 w-28 h-20">
                  <span className="w-full text-center">
                    ${formatPrice(pricing.total)}
                  </span>
                  <span className="text-[14px] sm:text-[15px] w-full text-center">
                    Precio
                  </span>
                </section>
              </div>

              <div className="flex w-max justify-center items-center flex-row-reverse gap-x-3 md:gap-x-5">
                {len(files.previews) > 0 && (
                  <button
                    type="button"
                    title="Quitar mis archivos"
                    onClick={() => updateState("resetModal", true)}
                  >
                    <RemoveFilesIcon
                      sx={{
                        fontSize: 38,
                        backgroundColor: "#fecaca",
                        color: "#dc2626",
                        borderRadius: "5px",
                        padding: "2px",
                        ":hover": {
                          backgroundColor: "#fca5a5",
                        },
                      }}
                    />
                  </button>
                )}
                <form
                  encType="multipart/form-data"
                  className="flex items-center justify-center w-full flex-col relative"
                >
                  <LoadingButton
                    disabled={loadFileBtn}
                    style={{
                      paddingTop: "1em",
                      paddingBottom: "1em",
                    }}
                    component="label"
                    variant="contained"
                    color="primary"
                    startIcon={
                      <UploadIcon
                        sx={{
                          height: "1.2em",
                          width: "1.2em",
                        }}
                      />
                    }
                  >
                    <span className="w-full md:px-1.5 text-lg sm:text-xl font-bold tracking-wide text-center">
                      Cargar Archivo
                    </span>
                    <VisuallyHiddenInput
                      type="file"
                      name="file"
                      id="uploadInput"
                      accept=".pdf, .doc, .docx, .xls, .xlsx, image/*, .txt"
                      onChange={handleSubmitLoadFile}
                    />
                  </LoadingButton>
                </form>

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleLibraryAlert}
                    className="bg-yellow-300/90 hover:bg-yellow-400/90 transition-colors px-[1rem] py-[0.9rem] font-semibold rounded-md flex gap-x-2 justify-center items-center shadow-md"
                  >
                    <CreatIcon />
                    <span className="text-center md:px-1.5 text-sm lg:text-lg">
                      Librería
                    </span>
                  </button>
                </div>
              </div>
            </section>

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
                  setHelpModal={value => updateState("helpModal", value)}
                  currentSetting={state.currentSetting}
                  resume={resume}
                  setResume={handleSetResume}
                />
              </section>
            </section>
          </div>
          <section className="w-full h-full relative">
            <BackgroundHueso />
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
                          setLoading={value => updateState("loading", value)}
                          setFilesDetail={detail =>
                            setFiles(prev => {
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
                        Pedido de Imprenta
                      </Typography>
                    </section>

                    <section className="flex flex-col px-5 py-10 gap-10">
                      <div className="flex justify-between">
                        <span className="font-[500]">Precio de impresión:</span>
                        <span className="opacity-70 font-[500]">
                          $
                          {formatPrice(
                            pricing.total - pricing.ringed_total ?? 0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-[500]">Precio de anillado:</span>
                        <span className="opacity-70 font-[500]">
                          ${formatPrice(pricing.ringed_total ?? 0)}
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
              <div className="w-full flex justify-center items-center hidden">
                <p className="max-w-xl rounded-lg text-lg md:text-2xl w-full text-center text-white mt-6 bg-green-700 py-2">
                  Carga los archivos que quieras imprimir
                </p>
              </div>
            )}
          </section>

          <section className="flex w-full justify-between max-w-3xl pb-8">
            <LoadingButton
              variant="contained"
              color="primary"
              sx={{
                border: "2px solid white",
                maxWidth: "300px",
              }}
              className={len(cart) ? "w-1/3" : "w-1/2"}
              disabled={len(files.details) == 0}
              onClick={() => updateState("review", true)}
            >
              <span className="font-bold text-lg">Añadir al carrito</span>
            </LoadingButton>

            {len(cart) > 0 && (
              <LoadingButton
                variant="contained"
                color="primary"
                sx={{
                  border: "2px solid white",
                  maxWidth: "300px",
                  width: "100%",
                }}
                onClick={() =>
                  len(libraryCart) == 0
                    ? setLibraryModal(true)
                    : navigate("/carrito")
                }
              >
                <span className="font-bold text-lg">Avanzar</span>
              </LoadingButton>
            )}
          </section>
          {libraryModal && (
            <div
              onClick={() => setLibraryModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 pb-14"
            >
              <div
                role="alert"
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-lg p-6 max-w-xl w-full h-56 shadow-xl relative flex flex-col justify-between items-start"
              >
                <p className="text-2xl font-semibold text-slate-800 w-full">
                  Aviso
                </p>
                <button
                  type="button"
                  onClick={() => setLibraryModal(false)}
                  className="absolute top-2 right-2 p-1 bg-slate-100 rounded-lg"
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
                <p className="text-slate-800 text-lg md:text-xl mt-4">
                  Recordá que también podés agregar artículos de librería
                </p>
                <div className="flex justify-between w-full items-center mt-6 md:mt-10">
                  <button
                    type="button"
                    onClick={() => navigate("/carrito")}
                    className="bg-green-300 border border-green-400 hover:bg-green-400 text-black font-medium py-2 px-4 md:px-6 rounded-lg transition-colors text-sm sm:text-xl"
                  >
                    Avanzar al carrito
                  </button>
                  <button
                    autoFocus
                    type="button"
                    className="bg-yellow-300/90 hover:bg-yellow-400/90 text-black font-medium py-2 px-6 md:px-10 rounded-lg transition-colors text-sm sm:text-xl border border-black"
                    onClick={handleLibraryAlert}
                  >
                    Ver librería
                  </button>
                </div>
              </div>
            </div>
          )}
          {showUnsavedModal && (
            <div
              onClick={() => setShowUnsavedModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 pb-14"
            >
              <div
                role="alert"
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-lg p-6 max-w-xl w-full h-[300px] shadow-xl relative flex flex-col justify-between items-start"
              >
                <p className="text-2xl font-semibold text-slate-800 w-full">
                  ¡Tienes archivos sin guardar!
                </p>
                <button
                  type="button"
                  onClick={() => setShowUnsavedModal(false)}
                  className="absolute top-2 right-2 p-1 bg-slate-100 rounded-lg"
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
                <p className="text-slate-800 text-lg md:text-xl">
                  Si vas a la librería, perderás los archivos y
                  personalizaciones que no hayas añadido al carrito.
                </p>
                <div className="flex flex-col justify-center gap-y-4 w-full items-center">
                  <button
                    type="button"
                    onClick={() => setShowUnsavedModal(false)}
                    className="bg-green-300 border border-green-400 hover:bg-green-400 text-black font-medium py-2 rounded-lg transition-colors text-sm sm:text-xl w-full"
                  >
                    Quedarme en la personalización
                  </button>
                  <button
                    autoFocus
                    type="button"
                    className="bg-yellow-300/90 hover:bg-yellow-400/90 text-black font-medium py-2 rounded-lg transition-colors text-sm sm:text-xl border border-black w-full"
                    onClick={() => {
                      setShowUnsavedModal(false);
                      navigate("/?libreria");
                    }}
                  >
                    Ver librería de todos modos
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <section className="hidden lg:flex lg:flex-col p-4">
          <NewOrderSettingsDesktop
            resume={resume}
            setResume={handleSetResume}
          />
        </section>
      </section>

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
              ¿Estás seguro que deseas eliminar los archivos cargados?
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
