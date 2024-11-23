import React, { useEffect, useState } from "react";
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
import MopedIcon from "@mui/icons-material/Moped";
import StoreIcon from "@mui/icons-material/Store";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Link, useNavigate } from "react-router-dom";
import OrderCard from "../../../components/Cart/OrderCard";
import {
  deleteAllCart,
  setOrderPlace,
  verifyCoupon,
} from "../../../redux/actions";
import EditOrderModal from "../../../components/Cart/EditOrderModal";
import ChoosePlaceModal from "../../../components/ChoosePlaceModal/ChoosePlaceModal";
import { Settings } from "../../../config";
import axios from "axios";

/* MERCADOPAGO */
const baseUrl = Settings.SERVER_URL;
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import Chatbot from "../../../components/Chatbot/Chatbot";
import { NativeSelect } from "@mui/material";
import { ApiConstants } from "../../../Common/constants";

/* ------------------------ */
const steps = ["Detalles", "Resumen", "Pago"];
const PUBLIC_KEY = ApiConstants.MERCADOPAGO_PUBLIC_KEY;

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.dataBaseUser);
  const place = useSelector((state) => state.place);
  const cart = useSelector((state) => state.cart);
  const coupon = useSelector((state) => state.coupon);
  const pricing = useSelector((state) => state.pricing);
  const distance = useSelector((state) => state.distance);
  const [shipment, setShipment] = useState(null);
  const [delivery_distance, setDelivery_distance] = useState("0 mtrs");

  /* DELETE BUTTON */
  const [mercadoPagoModal, setmercadoPagoModal] = useState(false);
  const handleClosemercadoPagoModal = () => {
    setmercadoPagoModal(false);
  };

  /* PRICING */
  const initialValue = 0;
  const totalReduce = cart?.reduce(
    (acumm, order) => acumm + Number(order.total),
    initialValue
  );

  // console.log(totalReduce);

  const [total, setTotal] = useState(0);
  const subtotal = totalReduce;

  // const total = subtotal + shipment - coupon.ammount;

  const [showEditModal, setShowEditModal] = useState({
    show: false,
    orderToEdit: null,
  });
  const [choosePlace, setChoosePlace] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [cuponInput, setCuponInput] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [orderToSend, setOrderTosend] = useState({
    orders: cart,
    place: place,
    availability: "Mañana",
    description: "",
    coupon: coupon || "Sin cupones agregados.",
  });

  useEffect(() => {
    setOrderTosend({ ...orderToSend, place: place });

    setShipment((pricing.delivery_km * distance?.value) / 1000);
    setDelivery_distance(distance);
  }, [place]);
console.log(shipment);

  useEffect(() => {
    coupon?.type[0] === "%"
      ? setTotal(
          subtotal + shipment - (subtotal * (coupon?.ammount / 100) || 0)
        )
      : setTotal(subtotal + shipment - (coupon?.ammount || 0));
  }, [shipment, coupon]);

  const isStepOptional = (step) => {
    return step === 4;
  }; //AQUI LOS INDICES DE PASOS OPCIONALES

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  function handleDeleteCart(e) {
    e.preventDefault();
    dispatch(deleteAllCart(user));
    dispatch(setOrderPlace(null));
    navigate("/");
  }

  function handleEditPlace(e) {
    setChoosePlace(true);
  }

  function handleInput(e) {
    setOrderTosend({ ...orderToSend, [e.target.name]: e.target.value });
  }

  async function handleBuy() {
    const id = await createPreference();
    if (id) {
      setmercadoPagoModal(true);
      setPreferenceId(id);
    }
  }
  async function handleCupon(e) {
    dispatch(verifyCoupon(cuponInput));
  }

  const backToRoot = () => {
    navigate("/");
  };

  /* MERCADOPAGO */
  const [preferenceId, setPreferenceId] = useState(null);
  useEffect(() => {
    initMercadoPago(PUBLIC_KEY, {
      locale: "es-AR",
    });
  }, []);

  const createPreference = async () => {
    try {
      const response = await axios.post(`${baseUrl}/payment/newpayment`, {
        client_uid: user.uid,
        title: "Pedido Xiro",
        quantity: 1,
        place: place,
        details: orderToSend,
        unit_price: total,
        shipment_price: shipment,
        subtotal_price: subtotal,
        coupon_used: coupon,
        distance: delivery_distance,
      });
      const id = response.data;
      return id;
    } catch (error) {
      console.log(error);
    }
  };

  const customization = {
    /*  checkout: {
      theme: {
        elementsColor: "#031020",
        headerColor: "#031020",
      },
    }, */
    /*   texts: {
    action: 'buy',
    valueProp: 'practicaly',
  }, */
    visual: {
      buttonBackground: "",
      borderRadius: "6px",
    },
  };
  /* --------- */

  return (
    <div className={"h-screen w-screen flex flex-col items-center"}>
      {showEditModal.show ? (
        <EditOrderModal
          orderToEdit={showEditModal.orderToEdit}
          showEditModal={showEditModal.show}
          setShowEditModal={setShowEditModal}
        />
      ) : (
        <>
          <Navbar title="Carrito" loggedUser={user} cart={cart} />
          <section className="w-11/12 flex justify-center items-center pb-28 mt-3">
            {choosePlace ? (
              <ChoosePlaceModal
                choosePlace={choosePlace}
                setChoosePlace={setChoosePlace}
                // resume={resume}
                // setResume={setResume}
              />
            ) : (
              false
            )}
            <Chatbot />
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
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    Todos los pasos completados
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleReset}>Resetear</Button>
                  </Box>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <section className="flex flex-col bg-[#fff] p-5 mt-4 rounded-t-md">
                    {activeStep === 0 ? (
                      <div className="flex  flex-col gap-4">
                        {/* 1 */}
                        <div className="flex flex-col gap-3">
                          <section className="flex items-center">
                            <img
                              src={xiro_outline_green}
                              alt=""
                              className="w-8 h-8 object-contain"
                            />
                            <span className="w-8 h-8 p-2 flex items-center justify-center rounded-full">
                              1
                            </span>
                            <span>Personalización de archivos</span>
                          </section>
                          <section className="flex h-full gap-4 overflow-auto">
                            {cart?.map((order, index) => (
                              <OrderCard
                                key={index}
                                order={order}
                                user={user}
                                showEditModal={showEditModal}
                                setShowEditModal={setShowEditModal}
                              />
                            ))}
                          </section>
                          <Link to="/imprimir">
                            <span className="text-[#789360] text-[14px] hover:text-green-700 underline">
                              +Agregar más productos
                            </span>
                          </Link>
                        </div>
                        {/* 2 */}
                        <div className="flex flex-col gap-3">
                          <section className="flex gap-2 justify-between items-center">
                            <section className="flex items-center">
                              <img
                                src={xiro_outline_green}
                                alt=""
                                className="w-8 h-8 object-contain"
                              />
                              <span className=" w-8 h-8 p-2 flex items-center justify-center rounded-full">
                                2
                              </span>
                              <span>Forma de entrega</span>
                            </section>
                          </section>
                          <section className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1 border border-gray-500 rounded-md p-3">
                              <div className="flex  justify-between items-center ">
                                <div className="flex flex-col justify-center">
                                  <span className="text-[16px] text-black ">
                                    {place?.address?.name ||
                                      "No tienes direcciones agregadas"}{" "}
                                    {place?.address?.number}
                                  </span>
                                  <span className=" text-[14px] font-[400] ">
                                    {place?.address?.city}
                                  </span>
                                </div>
                                <button onClick={(e) => handleEditPlace(e)}>
                                  <EditIcon
                                    className={
                                      place?.address
                                        ? "text-green-700"
                                        : "text-red-500"
                                    }
                                  />
                                </button>
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
                        {/* 3 */}
                        <div>
                          <section className="flex items-center">
                            <img
                              src={xiro_outline_green}
                              alt=""
                              className="w-8 h-8 object-contain"
                            />
                            <span className=" w-8 h-8 p-2 flex items-center justify-center rounded-full">
                              3
                            </span>
                            <span>Disponibilidad horaria</span>
                          </section>
                          <section className="flex items-center gap-5 p-2">
                            <NativeSelect
                              onChange={(e) => handleInput(e)}
                              defaultValue={"Mañana"}
                              inputProps={{
                                name: "availability",
                                id: "uncontrolled-native",
                              }}
                              className="w-full"
                            >
                              <option value="Mañana" className="text-sm">
                                Mañana
                              </option>
                              <option value="Tarde" className="text-sm">
                                Tarde
                              </option>
                            </NativeSelect>
                          </section>
                        </div>
                        {/* 4 */}
                        <div className="flex flex-col gap-3">
                          <section className="flex items-center">
                            <img
                              src={xiro_outline_green}
                              alt=""
                              className="w-8 h-8 object-contain"
                            />
                            <span className=" w-8 h-8 p-2 flex items-center justify-center rounded-full">
                              4
                            </span>
                            <span>Comentarios</span>
                          </section>
                          <section className="flex flex-col justify-start">
                            <span className="text-[14px] font-[400]">
                              Notas adicionales para el pedido
                            </span>
                            <TextField
                              onChange={(e) => handleInput(e)}
                              id="standard-basic"
                              label="Añadir un comentario"
                              name="description"
                              variant="standard"
                              value={orderToSend.description}
                            />
                          </section>
                        </div>
                      </div>
                    ) : activeStep === 1 ? (
                      <section className="flex flex-col gap-6 ">
                        <span className="text-[20px] font-[400]">
                          Resumen del pedido
                        </span>
                        {/* resumen detallado */}
                        <div className="flex flex-col gap-6  ">
                          <section className="flex flex-col">
                            <span className="opacitytext-[16px] font-[400]">
                              Detalles de impresión
                            </span>
                            <div className="flex flex-col">
                              {orderToSend.orders.map((order, index) => (
                                <span
                                  key={index}
                                  className=" text-[14px] font-[400]"
                                >
                                  Impresión{" "}
                                  {order.color === "BN"
                                    ? "en blanco y negro"
                                    : "a color"}{" "}
                                  {order.size} x{" "}
                                  {order.numberOfCopies > 1
                                    ? `${order.numberOfCopies} copias.`
                                    : `${order.numberOfCopies} copia.`}
                                </span>
                              ))}
                            </div>
                          </section>

                          <section className="flex flex-col">
                            <span className="opacity text-[16px] font-[400]">
                              Forma de entrega
                            </span>

                            <span className=" text-[14px] font-[400]">
                              {orderToSend?.place?.type}
                            </span>
                          </section>
                          <section className="flex flex-col">
                            <span className="opacity text-[16px] font-[400]">
                              Dirección
                            </span>

                            <span className=" text-[14px] font-[400]">
                              {`${orderToSend?.place?.address?.name} N°${orderToSend?.place?.address?.number}, ${orderToSend?.place?.address?.locality}, ${orderToSend?.place?.address?.city}`}
                            </span>
                          </section>
                          <section className="flex flex-col">
                            <span className="opacitytext-[16px] font-[400]">
                              Preferencia horaria (El horario concreto se
                              coordinará por WhatsApp)
                            </span>
                            <section>
                              <span className=" text-[14px] font-[400]">
                                De {orderToSend.availability}
                              </span>
                            </section>
                          </section>
                          <section className="flex flex-col">
                            <div className="flex justify-between">
                              <span className="opacitytext-[16px] font-[400] mb-1">
                                Instrucciones de entrega
                              </span>
                              <button
                                onClick={(e) => setEditComment(!editComment)}
                              >
                                <EditIcon className="hover:text-green-700" />
                              </button>
                            </div>
                            {editComment ? (
                              <TextField
                                onChange={(e) => handleInput(e)}
                                id="standard-basic"
                                label="Editar comentario"
                                name="description"
                                variant="standard"
                                value={orderToSend.description}
                              />
                            ) : (
                              <span className=" text-[14px] font-[400]">
                                {orderToSend.description
                                  ? orderToSend.description
                                  : "No hay comentarios agregados"}
                              </span>
                            )}
                          </section>
                        </div>
                        <div className="flex flex-col">
                          <span className="opacitytext-[16px] font-[400] mb-1">
                            Cupones
                          </span>
                          <section className="flex justify-between gap-4">
                            <TextField
                              onChange={(e) => setCuponInput(e.target.value)}
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
                              onClick={(e) => handleCupon(e)}
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
                            <div className="flex flex-col gap-2">
                              <section className="flex justify-between">
                                <span className=" text-[16px] font-[400]">
                                  Subtotal del pedido
                                </span>
                                <span>${subtotal.toFixed(2)}</span>
                              </section>

                              <section className="flex justify-between">
                                <span className=" text-[16px] font-[400]">
                                  Cupón de descuento ( {coupon?.code} )
                                </span>
                                <span className="text-green-500">
                                  {coupon.type[0] === "%"
                                    ? `     - $${
                                        subtotal * (coupon?.ammount / 100)
                                      }`
                                    : `  - $${coupon?.ammount}`}
                                </span>
                              </section>

                              <section className="flex justify-between">
                                <span className=" text-[16px] font-[400]">
                                  Entrega: {orderToSend.place.type}
                                </span>
                                <span>
                                  <span className="text-[13px] ">
                                    {`(${delivery_distance.text}) `}
                                  </span>
                                  ${shipment.toFixed(2)}{" "}
                                </span>
                              </section>
                            </div>
                            <div className="border-t border-gray-400 pt-4">
                              <section className="flex justify-between">
                                <span className=" text-[24px] font-[500]">
                                  Total
                                </span>
                                <span className=" text-[24px] font-[500]">
                                  ${total.toFixed(2)}
                                </span>
                              </section>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col gap-2">
                              <section className="flex justify-between">
                                <span className=" text-[16px] font-[400]">
                                  Subtotal del pedido
                                </span>
                                <span>${subtotal.toFixed(2)}</span>
                              </section>

                              <section className="flex justify-between">
                                <span className=" text-[16px] font-[400]">
                                    Entrega: {orderToSend.place.type}
                                </span>
                                <span>
                                  <span className="text-[13px] ">
                                    {`(${delivery_distance.text}) `}
                                  </span>
                                  ${shipment.toFixed(2)}{" "}
                                </span>
                              </section>
                            </div>
                            <div className="border-t border-gray-400 pt-4">
                              <section className="flex justify-between">
                                <span className=" text-[24px] font-[500]">
                                  Total
                                </span>
                                <span className=" text-[24px] font-[500]">
                                  ${total.toFixed(2)}
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
                          className="flex justify-between border border-gray-400 p-8 rounded-md hover:bg-[#789360] hover:border-black"
                        >
                          <span>Mercado Pago</span>
                          <span className="text-[20px] font-[600]">{">"}</span>
                        </button>

                        <div className="flex justify-center w-full">
                          <Dialog
                            // fullScreen={fullScreen}
                            open={mercadoPagoModal}
                            onClose={handleClosemercadoPagoModal}
                            aria-labelledby="responsive-dialog-title"
                          >
                            <div className="flex flex-col justify-center items-center ">
                              <Button
                                color="primary"
                                autoFocus
                                onClick={handleClosemercadoPagoModal}
                                className="flex flex-col self-end  p-6"
                              >
                                <span className="  text-lg text-black">X</span>
                              </Button>
                              <DialogTitle
                                id="responsive-dialog-title"
                                className="flex items-center gap-5 text-center "
                              >
                                <span className="text-xl lg:text-2xl">
                                  Todo listo!
                                </span>
                              </DialogTitle>
                              <DialogContent className="flex justify-center">
                                <DialogContentText className="text-center">
                                  <span className="text-xl lg:text-md">
                                    Serás redirigido a la app de mercadopago
                                    para finalizar tu compra.
                                  </span>
                                </DialogContentText>
                              </DialogContent>
                              {preferenceId ? (
                                <div className="flex justify-center items-center w-11/12 ">
                                  <DialogActions>
                                    <Wallet
                                      id="walletButton"
                                      onSubmit={() => {}}
                                      onReady={() => {
                                        // navigate("/mercadopago/25")
                                      }}
                                      initialization={{
                                        preferenceId: preferenceId.id,
                                        redirectMode: "self",
                                      }}
                                      customization={customization}
                                    />
                                  </DialogActions>
                                </div>
                              ) : (
                                "Cargando"
                              )}
                            </div>
                          </Dialog>
                        </div>
                      </section>
                    ) : (
                      false
                    )}
                  </section>
                  <Box className="bg-[#fff] rounded-b-md p-4 flex justify-between items-center">
                    <section onClick={(e) => handleDeleteCart(e)}>
                      <button className="text-[#789360] text-[14px] hover:text-black underline">
                        Vaciar carrito
                      </button>
                    </section>
                    <section>
                      {activeStep === 0 ? false : false}
                      <Button
                        color="inherit"
                        // disabled={activeStep === 0}
                        onClick={activeStep === 0 ? backToRoot : handleBack}
                        sx={{ mr: 1 }}
                      >
                        <span>Volver</span>
                      </Button>

                      {isStepOptional(activeStep) && (
                        <Button
                          color="inherit"
                          onClick={handleSkip}
                          sx={{ mr: 1 }}
                        >
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
                          Continuar
                        </Button>
                      ) : (
                        <Button variant="contained" onClick={handleNext}>
                          Continuar
                        </Button>
                      )}
                    </section>
                  </Box>
                </React.Fragment>
              )}
            </Box>
          </section>
        </>
      )}
    </div>
  );
}
