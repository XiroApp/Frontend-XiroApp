import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import xiro_outline_green from "../../../utils/assets/images/xiro-head-outline-green.png";
import EditIcon from "@mui/icons-material/Edit";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FaMotorcycle as MopedIcon } from "react-icons/fa6";
import { FaStore as StoreIcon } from "react-icons/fa6";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../../components/Cart/OrderCard";
import LibraryItemCart from "../../../components/Cart/LibraryItemCart";
import {
  deleteAllCart,
  setLibraryCart,
  setOrderPlace,
  verifyCoupon,
} from "../../../redux/actions";
import ChoosePlaceModal from "../../../components/ChoosePlaceModal/ChoosePlaceModal";
import { Settings } from "../../../config";
import axios from "axios";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { getDeliveryPricingByDistance } from "../../../utils/controllers/pricing.controller";
import { formatPrice, len } from "../../../Common/helpers";
import { ArrowRight } from "@mui/icons-material";
import AddMoreLink from "../../../components/AddMoreLink";
import BackBtn from "../../../components/BackBtn";
const steps = ["Detalles", "Resumen", "Pago"];
const baseUrl = Settings.SERVER_URL;
const PUBLIC_KEY = Settings.MERCADOPAGO_KEY;

export default function Cart() {
  const dispatch = useDispatch(),
    navigate = useNavigate(),
    user = useSelector(state => state.dataBaseUser),
    place = useSelector(state => state.place),
    cart = useSelector(state => state.cart),
    coupon = useSelector(state => state.coupon),
    pricing = useSelector(state => state.pricing),
    distance = useSelector(state => state.distance),
    libraryCart = useSelector(state => state.libraryCart),
    [shipment, setShipment] = useState(null),
    [delivery_distance, setDelivery_distance] = useState({
      text: null,
      value: null,
      uidDistribution: null,
      uidPickup: null,
    }),
    [mpModal, setMPModal] = useState(false),
    closeMPModal = () => setMPModal(false),
    totalCart = cart?.reduce((acc, order) => acc + Number(order.total), 0) || 0,
    ringedTotal =
      cart?.reduce((acc, order) => acc + Number(order?.ringed_total), 0) || 0,
    subtotalLibrary = () =>
      libraryCart?.reduce(
        (acc, order) => acc + Number(order.price) * Number(order.quantity),
        0
      ) || 0,
    [total, setTotal] = useState(0),
    [choosePlace, setChoosePlace] = useState(false),
    [editComment, setEditComment] = useState(false),
    [cuponInput, setCuponInput] = useState(false),
    [preferenceId, setPreferenceId] = useState(null),
    [activeStep, setActiveStep] = useState(0),
    [skipped, setSkipped] = useState(new Set()),
    [orderToSend, setOrderTosend] = useState({
      orders: cart,
      place: place,
      availability: "Mañana",
      description: "",
      coupon: coupon || "Sin cupones agregados.",
    }),
    backToRoot = () => navigate("/"),
    handleReset = () => setActiveStep(0),
    isStepOptional = step => step === 4,
    isStepSkipped = step => skipped.has(step),
    handleEditPlace = () => setChoosePlace(true),
    handleCupon = () => dispatch(verifyCoupon(cuponInput));

  useEffect(() => {
    window.scrollTo(0, 0);
    initMercadoPago(PUBLIC_KEY, { locale: "es-AR" });
  }, []);

  useEffect(() => {
    setOrderTosend({ ...orderToSend, place: place });
    if (place?.type === "Retiro") {
      setShipment(600); //! PELIGRO CAMBIAR POR PRECIO DE DB NUEVO DE RETIROS EN PUNTO DE ENTREGA
      setDelivery_distance(distance);
    } else {
      let km_value = distance?.value / 1000;
      let price_per_km = getDeliveryPricingByDistance(km_value, pricing);
      setShipment(price_per_km);
      setDelivery_distance(distance);
    }
  }, [place]);

  useEffect(() => {
    if (coupon?.type[0] === "%") {
      const withPercentage =
        totalCart +
        shipment -
        ((totalCart - ringedTotal) * (coupon?.ammount / 100) || 0);
      setTotal(Number(withPercentage) + Number(subtotalLibrary()));
    } else {
      const withAmmount = totalCart - (coupon?.ammount || 0) + shipment;
      setTotal(Number(withAmmount) + Number(subtotalLibrary()));
    }
  }, [shipment, coupon, activeStep]);

  function handleNext() {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    window.scrollTo(0, 0);
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  }

  function handleBack() {
    window.scrollTo(0, 0);
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  function handleSkip() {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  }

  function handleDeleteCart(e) {
    e.preventDefault();
    dispatch(deleteAllCart(user));
    dispatch(setOrderPlace(null));
    dispatch(setLibraryCart([]));
    navigate("/");
  }

  function handleInput(e) {
    setOrderTosend({
      ...orderToSend,
      [e.target.name]: e.target.value,
    });
  }

  async function handleBuy() {
    const id = await createPreference();
    if (id) {
      setMPModal(true);
      setPreferenceId(id);
    }
  }

  async function createPreference() {
    try {
      const response = await axios.post(`${baseUrl}/payment/newpayment`, {
        client_uid: user.uid,
        title: "Pedido Xiro",
        quantity: 1,
        unit_price: total,
        place: place,
        details: orderToSend,
        shipment_price: shipment,
        subtotal_price: total,
        coupon_used: coupon,
        description: orderToSend.description,
        distance: delivery_distance,
        availability: orderToSend.availability,
        subtotal_library: Number(subtotalLibrary()),
        subtotal_printing: totalCart,
        library_cart: libraryCart,
      });
      const id = response.data;
      return id;
    } catch (err) {
      console.error(`catch 'createPreference' ${err.message}`);
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center">
      {/* {showEditModal.show ? (
        <EditOrderModal
          orderToEdit={showEditModal.orderToEdit}
          showEditModal={showEditModal.show}
          setShowEditModal={setShowEditModal}
        />
      ) : (
        <> */}
      <Navbar title="Carrito" loggedUser={user} cart={cart} />
      <section className="pt-6 w-11/12 flex justify-center items-center pb-28 mt-3">
        {choosePlace && (
          <ChoosePlaceModal
            choosePlace={choosePlace}
            setChoosePlace={setChoosePlace}
          />
        )}
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel
                    sx={{
                      "& .MuiStepIcon-root.Mui-completed": {
                        fill: "green",
                        stroke: "white",
                        strokeWidth: "1.2px",
                        width: "28px",
                        height: "20px",
                      },
                      "& .MuiStepIcon-root.Mui-active": {
                        color: "green",
                        backgroundColor: "white",
                      },
                      "& .MuiStepIcon-root": {
                        color: "gray",
                        backgroundColor: "white",
                      },
                    }}
                    {...labelProps}
                  >
                    <span className="text-black text-sm py-1 px-4 rounded-md bg-white">
                      {label}
                    </span>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Todos los pasos completados
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Resetear</Button>
              </Box>
            </>
          ) : (
            <>
              <section className="flex flex-col bg-[#fff] p-5 mt-4 rounded-t-md">
                {activeStep === 0 ? (
                  <div className="flex  flex-col gap-4">
                    <div className="flex flex-col gap-3">
                      <section className="flex items-center border-b border-[#789360] pb-2 gap-2">
                        <img
                          src={xiro_outline_green}
                          alt="logo"
                          className="w-8 h-8 object-contain"
                        />
                        <Typography variant="h6">1</Typography>
                        <Typography variant="h6">
                          Personalización de archivos
                        </Typography>
                      </section>
                      <section className="flex h-full gap-4 overflow-auto">
                        {len(cart) > 0 ? (
                          cart?.map((order, index) => (
                            <OrderCard key={index} order={order} user={user} />
                          ))
                        ) : (
                          <p className="border-2 px-6 py-2 rounded-md border-slate-300">
                            No tienes impresiones agregadas
                          </p>
                        )}
                      </section>
                      <AddMoreLink
                        to="/imprimir"
                        text={`Agregar ${
                          len(cart) > 0 ? "más " : ""
                        }impresiones`}
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <section className="flex items-center border-b border-[#789360] pb-2 gap-2">
                        <img
                          src={xiro_outline_green}
                          alt="logo"
                          className="w-8 h-8 object-contain"
                        />
                        <Typography variant="h6">2</Typography>
                        <Typography variant="h6">
                          Artículos de librería
                        </Typography>
                      </section>
                      <div className="flex flex-col justify-start items-start gap-y-2 pt-2">
                        {len(libraryCart) > 0 ? (
                          <ul className="w-full max-w-xl space-y-2">
                            {libraryCart?.map(item => (
                              <LibraryItemCart key={item.id} item={item} />
                            ))}
                          </ul>
                        ) : (
                          <p className="border-2 px-6 py-2 rounded-md border-slate-300">
                            No tienes artículos agregados
                          </p>
                        )}
                      </div>
                      <AddMoreLink
                        to="/?libreria"
                        text={`Agregar ${
                          len(libraryCart) > 0 ? "más " : ""
                        }artículos de librería`}
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <section className="flex items-center border-b border-[#789360] pb-2 gap-2">
                        <img
                          src={xiro_outline_green}
                          alt="logo"
                          className="w-8 h-8 object-contain"
                        />
                        <Typography variant="h6">3</Typography>
                        <Typography variant="h6">Forma de entrega</Typography>
                      </section>
                      <section
                        onClick={handleEditPlace}
                        className="flex flex-col gap-5 w-full max-w-3xl cursor-pointer hover:bg-green-300/20"
                      >
                        <div className="flex flex-col gap-1 border-2 border-[#789360] rounded-md p-3 shadow-xl drop-shadow-xl">
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col justify-center">
                              <span className="text-[16px] text-black ">
                                {place?.address?.name ||
                                  "No tienes direcciones agregadas"}{" "}
                                {place?.address?.number}
                              </span>
                              <span className="text-[14px] font-[400] ">
                                {place?.address?.city}
                              </span>
                            </div>
                            <EditIcon
                              className={
                                place?.address
                                  ? "text-green-700"
                                  : "text-red-500"
                              }
                            />
                          </div>
                          <div
                            className={
                              place?.address
                                ? "border-t border-[#393939]"
                                : "border-t border-red-500"
                            }
                          >
                            {place?.type === "Envío a domicilio" ? (
                              <div className="flex items-center gap-1 mt-2">
                                <MopedIcon />
                                <span className="text-[16px]">
                                  {place?.type}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 mt-2">
                                <StoreIcon />
                                <span className="text-[16px]">
                                  {place?.type}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </section>
                    </div>

                    <div className="flex flex-col gap-3">
                      <section className="flex items-center border-b border-[#789360] pb-2 gap-2">
                        <img
                          src={xiro_outline_green}
                          alt="logo"
                          className="w-8 h-8 object-contain"
                        />
                        <Typography variant="h6">4</Typography>
                        <Typography variant="h6">Comentarios</Typography>
                      </section>
                      <section className="flex flex-col justify-start w-full max-w-3xl">
                        <span className="text-[14px] font-[400]">
                          Notas adicionales para el pedido
                        </span>
                        <TextField
                          onChange={e => handleInput(e)}
                          id="standard-basic"
                          label="Añadir un comentario"
                          name="description"
                          variant="standard"
                          value={orderToSend.description}
                          inputProps={{ maxLength: 250 }}
                        />
                      </section>
                    </div>
                  </div>
                ) : activeStep === 1 ? (
                  <section className="flex flex-col gap-6 ">
                    <span className="text-[20px] font-[400]">
                      Resumen del pedido
                    </span>
                    <div className="flex flex-col gap-6 pl-4">
                      <section className="flex flex-col">
                        <span className="underline text-[16px] font-[400]">
                          Detalles de impresión
                        </span>
                        <ul className="flex flex-col">
                          {orderToSend.orders.map((order, index) => (
                            <li key={index} className="text-[14px] font-[400]">
                              * Impresión{" "}
                              {order.color == "BN"
                                ? "en blanco y negro"
                                : "a color"}
                              {" " + order.size}
                              {`- x${order.numberOfCopies} copia${
                                order.numberOfCopies > 1 ? "s" : ""
                              }`}
                            </li>
                          ))}
                        </ul>
                        <AddMoreLink
                          to="/imprimir"
                          text="Agregar impresiones"
                          styles="mt-1"
                        />
                      </section>

                      <section className="flex flex-col">
                        <span className="underline text-[16px] font-[400]">
                          Artículos de librería
                        </span>
                        <ul className="flex flex-col">
                          {libraryCart.map(order => (
                            <li
                              key={order.id}
                              className="text-[14px] font-[400]"
                            >
                              * {order.name} - x{order.quantity}{" "}
                              {`unidad${order.quantity > 1 ? "es" : ""}`}
                            </li>
                          ))}
                        </ul>
                        <AddMoreLink
                          to="/?libreria"
                          text="Agregar artículos de librería"
                          styles="mt-1"
                        />
                      </section>

                      <section className="flex flex-col">
                        <span className="underline text-[16px] font-[400]">
                          Forma de entrega
                        </span>

                        <span className="text-[14px] font-[400]">
                          {orderToSend?.place?.type}
                        </span>
                      </section>
                      <section className="flex flex-col">
                        <span className="underline text-[16px] font-[400]">
                          Dirección
                        </span>

                        <span className="text-[14px] font-[400]">
                          {`${orderToSend?.place?.address?.name} N°${orderToSend?.place?.address?.number}, ${orderToSend?.place?.address?.locality}, ${orderToSend?.place?.address?.city}`}
                        </span>
                      </section>

                      <section className="flex flex-col w-full max-w-2xl pr-4">
                        <div className="flex justify-between">
                          <span className="underline text-[16px] font-[400] mb-1">
                            Instrucciones de entrega
                          </span>
                          <button onClick={() => setEditComment(!editComment)}>
                            <EditIcon className="hover:text-green-700" />
                          </button>
                        </div>
                        {editComment ? (
                          <TextField
                            onChange={e => handleInput(e)}
                            id="standard-basic"
                            label="Editar comentario"
                            name="description"
                            variant="standard"
                            value={orderToSend?.description}
                          />
                        ) : (
                          <span className="text-[14px] font-[400]">
                            {orderToSend.description
                              ? orderToSend.description
                              : "No hay comentarios agregados"}
                          </span>
                        )}
                      </section>
                    </div>
                    <div className="flex flex-col pl-4 w-full max-w-2xl">
                      <span className="underline text-[16px] font-[400] mb-1">
                        Cupones (solo válido para impresiones)
                      </span>
                      <section className="flex justify-between gap-4">
                        <TextField
                          onChange={e => setCuponInput(e.target.value)}
                          id="standard-basic"
                          label={"Código de cupón"}
                          name="cupon"
                          inputProps={{ maxLength: 12 }}
                          variant="standard"
                          className="w-full"
                        />
                        <Button
                          variant="outlined"
                          color="primary"
                          className="w-1/2 n-w-full flex items-center gap-1"
                          onClick={e => handleCupon(e)}
                        >
                          <LocalOfferIcon
                            sx={{ width: "1rem", height: "1rem" }}
                          />
                          <span className="text-[12px]">Agregar</span>
                        </Button>
                      </section>
                    </div>
                    {coupon ? (
                      <>
                        <div className="flex flex-col gap-2 pl-4">
                          <div className="flex justify-between">
                            <span className="text-[16px] font-[400]">
                              Subtotal de librería
                            </span>
                            <span>${formatPrice(subtotalLibrary())}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[16px] font-[400]">
                              Subtotal de impresiones
                            </span>
                            <span>${formatPrice(totalCart - ringedTotal)}</span>
                          </div>
                          <section className="flex justify-between">
                            <span className="text-[16px] font-[400]">
                              Cupón de descuento: {coupon?.code}
                            </span>
                            <span className="text-green-500">
                              {coupon.type[0] === "%"
                                ? `     - $${formatPrice(
                                    (totalCart - ringedTotal) *
                                      (coupon?.ammount / 100)
                                  )}`
                                : `  - $${formatPrice(coupon?.ammount)}`}
                            </span>
                          </section>
                          <div className="flex justify-between">
                            <span className="text-[16px] font-[400]">
                              Subtotal de anillado
                            </span>
                            <span>${formatPrice(ringedTotal)}</span>
                          </div>

                          <section className="flex justify-between">
                            <span className="text-[16px] font-[400]">
                              Forma de entrega: {orderToSend.place.type}
                            </span>
                            <span>
                              <span className="text-[13px] ">
                                {`(${delivery_distance?.text || 0}) `}
                              </span>
                              ${formatPrice(shipment)}{" "}
                            </span>
                          </section>
                        </div>
                        <div className="border-t border-gray-400 pt-4">
                          <section className="flex justify-between">
                            <span className="text-[24px] font-[500]">
                              Total
                            </span>
                            <span className="text-[24px] font-[500]">
                              ${formatPrice(total)}
                            </span>
                          </section>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col gap-2 pl-4">
                          <div className="flex justify-between">
                            <span className="text-[16px] font-[400]">
                              Subtotal de librería
                            </span>
                            <span>${formatPrice(subtotalLibrary())}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-[16px] font-[400]">
                              Subtotal de impresiones
                            </span>
                            <span>${formatPrice(totalCart - ringedTotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[16px] font-[400]">
                              Subtotal de anillado
                            </span>
                            <span>${formatPrice(ringedTotal)}</span>
                          </div>

                          <section className="flex justify-between">
                            <span className="text-[16px] font-[400]">
                              Forma de entrega:&nbsp;
                              {orderToSend.place.type}
                            </span>
                            <span>
                              <span className="text-[13px] ">
                                {`(${delivery_distance?.text || 0}) `}
                              </span>
                              ${formatPrice(shipment)}
                            </span>
                          </section>
                        </div>
                        <div className="border-t border-gray-400 pt-4 ml-4">
                          <section className="flex justify-between">
                            <span className="text-[24px] font-[500]">
                              Total
                            </span>
                            <span className="text-[24px] font-[500]">
                              ${formatPrice(total)}
                            </span>
                          </section>
                        </div>
                      </>
                    )}
                  </section>
                ) : activeStep === 2 ? (
                  <section className="flex flex-col gap-4">
                    <span className="text-[20px] font-[400]">
                      Método de pago
                    </span>
                    <button
                      onClick={handleBuy}
                      className="flex justify-start gap-x-10 px-20 items-center border-2 border-blue-300 p-4 rounded-md transition-colors hover:bg-blue-300 relative"
                    >
                      <p className="text-xl md:text-2xl">Mercado Pago</p>
                      <svg
                        width="4em"
                        height="4em"
                        fill="none"
                        viewBox="0 0 150 104"
                      >
                        <path
                          fill="#0A0080"
                          d="M150 49.027c0-26.944-33.685-48.87-75-48.87-41.501 0-75 21.926-75 48.87v2.787c0 28.616 29.404 51.843 75 51.843 45.968 0 75-23.227 75-51.843v-2.787Z"
                        />
                        <path
                          fill="#2ABCFF"
                          d="M147.022 49.027c0 25.457-32.196 46.083-72.022 46.083-39.826 0-72.022-20.626-72.022-46.083C2.978 23.57 35.174 2.944 75 2.944c39.826.186 72.022 20.626 72.022 46.083Z"
                        />
                        <path
                          fill="#fff"
                          d="M50.993 34.533s-.745.743-.373 1.487c1.117 1.486 4.653 2.23 8.189 1.486 2.047-.557 4.839-2.601 7.444-4.645 2.792-2.23 5.583-4.46 8.56-5.389 2.979-.93 4.84-.558 6.142-.186 1.49.372 2.978 1.3 5.584 3.345 5.024 3.716 24.751 20.997 28.101 23.97 2.792-1.3 15.075-6.503 31.638-10.22-1.117-8.919-6.514-17.095-14.702-23.784-11.353 4.831-25.31 7.247-39.082.557 0 0-7.444-3.53-14.702-3.345-10.794.186-15.447 5.017-20.472 9.849l-6.327 6.875Z"
                        />
                        <path
                          fill="#fff"
                          d="M114.082 56.274c-.186-.186-23.263-20.44-28.474-24.342-2.978-2.23-4.653-2.788-6.514-3.16-.93-.185-2.233 0-3.163.372-2.42.744-5.584 2.788-8.375 5.017-2.978 2.416-5.77 4.46-8.189 5.017-3.163.93-7.258 0-9.119-1.114-.744-.558-1.303-1.115-1.489-1.673-.744-1.486.559-2.787.745-2.973l6.327-6.875 2.233-2.23c-2.047.186-3.908.743-5.769 1.3-2.233.558-4.466 1.302-6.7 1.302-.93 0-5.955-.744-6.885-1.115-5.77-1.487-10.794-3.16-18.425-6.69C11.166 25.8 5.211 34.161 3.536 43.452c1.303.372 3.35.93 4.28 1.115 20.472 4.46 26.8 9.291 28.102 10.22 1.303-1.3 2.978-2.23 5.025-2.23 2.233 0 4.28 1.115 5.583 2.974 1.117-.93 2.792-1.673 4.839-1.673.93 0 1.86.186 2.977.558a6.83 6.83 0 0 1 4.095 3.716c.744-.372 1.675-.557 2.791-.557 1.117 0 2.233.185 3.35.743 3.722 1.672 4.28 5.389 4.094 8.176h.745c4.466 0 8.189 3.716 8.189 8.176 0 1.3-.373 2.601-.931 3.902 1.303.743 4.28 2.23 7.072 1.858 2.233-.186 2.978-.929 3.35-1.486.186-.372.372-.558.186-.93l-5.77-6.503s-.93-.93-.558-1.3c.373-.372.93.185 1.303.557 2.978 2.415 6.514 6.132 6.514 6.132s.372.557 1.675.743c1.116.186 3.163 0 4.652-1.115.373-.372.745-.743.93-1.115 1.49-1.858-.185-3.716-.185-3.716l-6.7-7.619s-.93-.929-.558-1.3c.372-.372.93.185 1.302.557a253.206 253.206 0 0 1 8.003 7.619c.558.371 3.164 2.044 6.513-.186 2.048-1.301 2.42-2.973 2.42-4.274-.186-1.672-1.489-2.787-1.489-2.787l-9.305-9.291s-.93-.744-.558-1.301c.372-.372.93.186 1.302.557 2.978 2.416 10.98 9.663 10.98 9.663.186 0 2.792 2.044 6.328-.186 1.303-.743 2.047-1.858 2.047-3.345-.372-2.044-2.047-3.53-2.047-3.53Z"
                        />
                        <path
                          fill="#fff"
                          d="M69.417 67.98c-1.489 0-2.978.744-3.164.744-.186 0 0-.558.186-.93.186-.371 2.047-5.946-2.605-7.99-3.536-1.486-5.583.186-6.328.93-.186.185-.372.185-.372 0 0-.93-.558-3.717-3.536-4.646-4.28-1.3-7.072 1.672-7.816 2.787-.373-2.415-2.42-4.46-5.025-4.46a5 5 0 0 0-5.025 5.018 5 5 0 0 0 5.025 5.017c1.303 0 2.605-.558 3.536-1.487v.186c-.186 1.3-.559 5.76 4.094 7.619 1.861.743 3.536.186 4.839-.744.372-.371.372-.185.372.186-.186 1.115 0 3.717 3.536 5.017 2.605 1.115 4.28 0 5.21-.929.373-.371.56-.371.56.372.185 3.345 2.977 5.946 6.327 5.946 3.536 0 6.327-2.787 6.327-6.318.186-3.344-2.605-6.132-6.141-6.318Z"
                        />
                        <path
                          fill="#0A0080"
                          d="M115.012 53.858c-7.072-6.132-23.635-20.44-27.915-23.785-2.606-1.858-4.28-2.973-5.77-3.344-.744-.186-1.674-.372-2.791-.372s-2.42.186-3.536.558c-2.792.929-5.77 3.158-8.56 5.388l-.187.186c-2.605 2.044-5.21 4.088-7.258 4.646-.93.185-1.861.371-2.605.371-2.234 0-4.28-.743-5.025-1.672-.186-.186 0-.372.186-.744l6.141-7.06c4.839-4.832 9.492-9.477 20.1-9.663h.558c6.7 0 13.213 2.973 13.958 3.345 6.327 2.973 12.655 4.46 19.168 4.46 6.7 0 13.586-1.673 21.03-5.018-.744-.743-1.675-1.3-2.605-2.044-6.328 2.787-12.469 4.088-18.425 4.088-5.955 0-12.096-1.486-17.866-4.274-.372-.186-7.63-3.53-15.26-3.53h-.558c-8.933.186-13.958 3.344-17.308 6.132-3.35 0-6.142.929-8.747 1.672-2.233.558-4.28 1.115-6.142 1.115h-2.233c-2.233 0-13.213-2.787-21.96-6.132-.93.557-1.675 1.3-2.605 2.044 9.119 3.716 20.285 6.69 23.82 6.875.931 0 2.048.186 2.979.186 2.233 0 4.652-.557 6.885-1.3 1.303-.372 2.792-.744 4.28-1.116l-1.302 1.301-6.328 6.876c-.558.557-1.674 1.858-.93 3.53.372.743.93 1.3 1.675 1.858 1.489.93 4.28 1.673 6.7 1.673.93 0 1.86 0 2.605-.372 2.606-.557 5.397-2.787 8.375-5.203 2.42-1.858 5.77-4.274 8.188-5.017.745-.186 1.675-.372 2.234-.372h.558c1.675.186 3.35.744 6.328 2.973 5.21 3.903 28.287 24.157 28.473 24.343 0 0 1.489 1.3 1.303 3.344 0 1.115-.744 2.23-1.861 2.974-.93.557-2.047.929-2.978.929-1.488 0-2.605-.744-2.605-.744s-8.002-7.247-10.98-9.662c-.372-.372-.93-.744-1.303-.744-.186 0-.372.186-.558.372-.372.557 0 1.3.744 1.858l9.305 9.291s1.117 1.115 1.303 2.416c0 1.486-.744 2.787-2.233 3.902-1.117.743-2.233 1.115-3.35 1.115-1.489 0-2.42-.557-2.605-.743l-1.303-1.301c-2.42-2.416-4.839-4.831-6.7-6.318-.372-.371-.93-.743-1.303-.743-.186 0-.372 0-.558.186-.186.186-.372.743.186 1.3a2.3 2.3 0 0 0 .372.558l6.7 7.618s1.303 1.673.186 3.16l-.186.37-.558.558c-1.117.93-2.606 1.115-3.35 1.115h-.93c-.745-.186-1.117-.371-1.303-.557-.373-.372-3.722-3.902-6.514-6.132-.372-.372-.744-.743-1.303-.743-.186 0-.372 0-.558.185-.558.558.372 1.487.558 1.859l5.77 6.317s0 .186-.186.372c-.187.372-.931.93-2.978 1.3h-.745c-2.233 0-4.466-1.114-5.583-1.672.559-1.115.745-2.415.745-3.716 0-4.645-3.908-8.548-8.561-8.548h-.372c.186-2.23-.186-6.317-4.28-7.99-1.117-.557-2.42-.743-3.537-.743-.93 0-1.86.186-2.605.557-.93-1.672-2.233-2.973-4.28-3.53-1.117-.372-2.048-.558-3.164-.558-1.675 0-3.35.558-4.839 1.487-1.303-1.672-3.536-2.787-5.583-2.787-1.861 0-3.722.743-5.211 2.044-1.861-1.301-8.933-5.947-27.916-10.22-.93-.186-2.977-.744-4.28-1.115-.186 1.115-.372 2.044-.558 3.159 0 0 3.536.929 4.28.929 19.355 4.274 25.868 8.733 26.985 9.662a7.446 7.446 0 0 0-.558 2.787c0 4.089 3.35 7.247 7.258 7.247.372 0 .93 0 1.303-.185.558 2.973 2.605 5.203 5.397 6.317.93.372 1.675.558 2.605.558.558 0 1.117 0 1.675-.186.558 1.3 1.861 3.159 4.466 4.274.931.372 1.861.557 2.792.557.745 0 1.489-.185 2.233-.371 1.303 3.159 4.467 5.389 8.003 5.389 2.233 0 4.466-.93 6.141-2.602 1.303.743 4.28 2.23 7.258 2.23h1.117c2.978-.372 4.28-1.487 4.839-2.416.186-.186.186-.371.372-.557.744.186 1.489.371 2.233.371 1.675 0 3.164-.557 4.653-1.672 1.489-1.115 2.605-2.601 2.791-4.088.559.186 1.117.186 1.489.186 1.675 0 3.35-.558 4.839-1.487 2.977-2.044 3.536-4.46 3.536-6.132.558.186 1.116.186 1.675.186 1.489 0 2.977-.557 4.466-1.3a6.49 6.49 0 0 0 3.164-5.018c.186-1.486-.186-2.787-.931-4.088 5.025-2.23 16.378-6.318 29.963-9.29 0-1.116-.186-2.045-.372-3.16-16.191 2.974-28.288 8.176-31.452 9.477ZM69.417 80.244c-3.164 0-5.77-2.415-5.956-5.574 0-.186 0-.93-.558-.93-.186 0-.372.187-.744.372-.745.558-1.675 1.301-2.792 1.301-.558 0-1.302-.186-1.86-.371-3.35-1.301-3.35-3.717-3.165-4.646 0-.186 0-.557-.186-.743l-.186-.186h-.186c-.186 0-.372 0-.558.186-1.117.743-2.047 1.115-2.978 1.115-.558 0-1.116-.186-1.675-.372-4.466-1.672-4.094-5.946-3.908-7.061 0-.186 0-.372-.186-.557l-.372-.186-.373.371c-.93.744-2.047 1.301-3.163 1.301-2.606 0-4.653-2.044-4.653-4.645 0-2.602 2.047-4.646 4.653-4.646 2.233 0 4.28 1.672 4.466 3.902l.186 1.301.745-1.115c0-.186 1.86-2.973 5.397-2.973.558 0 1.302.186 2.047.372 2.791.743 3.164 3.344 3.164 4.273 0 .558.558.558.558.558.186 0 .372-.186.558-.186.559-.557 1.675-1.486 3.35-1.486.745 0 1.675.185 2.606.557 4.28 1.858 2.419 7.247 2.419 7.433-.372.929-.372 1.3 0 1.486h.372c.186 0 .372 0 .745-.186.558-.185 1.489-.557 2.233-.557 3.164 0 5.955 2.602 5.955 5.946 0 3.345-2.605 5.946-5.955 5.946Z"
                        />
                      </svg>
                      <ArrowRight
                        sx={{ height: "1.8em", width: "1.8em" }}
                        className="opacity-0 sm:opacity-100 absolute right-20"
                      />
                    </button>

                    <Dialog
                      open={mpModal}
                      onClose={closeMPModal}
                      aria-labelledby="responsive-dialog-title"
                    >
                      <div className="flex flex-col min-h-[300px] sm:min-h-[250px] w-full justify-center items-center relative pt-6">
                        <BackBtn close={closeMPModal} />
                        <DialogTitle
                          id="responsive-dialog-title"
                          className="flex items-center gap-5 text-center"
                        >
                          <span className="text-xl lg:text-2xl">
                            ¡Todo Listo!
                          </span>
                        </DialogTitle>
                        <DialogContent className="flex justify-center">
                          <DialogContentText className="text-center">
                            <span className="text-xl text-slate-700 lg:text-md">
                              Serás redirigido a la app de Mercado Pago para
                              finalizar tu compra
                            </span>
                          </DialogContentText>
                        </DialogContent>
                        {preferenceId && (
                          <div className="flex justify-center items-start w-11/12">
                            <DialogActions>
                              <Wallet
                                id="walletButton"
                                onSubmit={() => {}}
                                initialization={{
                                  preferenceId: preferenceId.id,
                                  redirectMode: "self",
                                }}
                                customization={{
                                  visual: {
                                    buttonBackground: "",
                                    borderRadius: "6px",
                                  },
                                }}
                              />
                            </DialogActions>
                          </div>
                        )}
                      </div>
                    </Dialog>
                  </section>
                ) : (
                  <></>
                )}
              </section>
              <Box className="bg-[#fff] rounded-b-md p-4 flex justify-between items-center pl-4">
                <section onClick={e => handleDeleteCart(e)}>
                  <Button variant="text" color="error">
                    Vaciar carrito
                  </Button>
                </section>
                <section>
                  <Button
                    color="inherit"
                    onClick={activeStep === 0 ? backToRoot : handleBack}
                    sx={{ mr: 1 }}
                  >
                    <span className="text-lg">Volver</span>
                  </Button>
                  {isStepOptional(activeStep) && (
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                      Skip
                    </Button>
                  )}
                  {activeStep === steps.length - 1 ? (
                    false
                  ) : activeStep === 0 ? (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={
                        !(
                          orderToSend?.place?.address &&
                          typeof shipment === "number" &&
                          !isNaN(shipment)
                        )
                      }
                    >
                      <span className="text-xl p-1">Continuar</span>
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleNext}>
                      <span className="text-xl p-1">Continuar</span>
                    </Button>
                  )}
                </section>
              </Box>
            </>
          )}
        </Box>
      </section>
      {/* </>
      )} */}
    </div>
  );
}
