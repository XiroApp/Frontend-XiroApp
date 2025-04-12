import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Link,
  Modal,
  NativeSelect,
} from "@mui/material";
import { FaMotorcycle as MopedIcon } from "react-icons/fa6";
import { FaStore as StoreIcon } from "react-icons/fa6";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import { useDispatch, useSelector } from "react-redux";
import NewAddressForm from "../../components/Forms/NewAddressForm";
import { setOrderPlace, setToast, updateUser } from "../../redux/actions";
import { UsersAdapter } from "../../Infra/Adapters/users.adapter";

export default function ChoosePlaceModal({ choosePlace, setChoosePlace }) {
  const dispatch = useDispatch();
  const labels = useSelector((state) => state.labels);
  const [open, setOpen] = useState(false);
  const [resume, setResume] = useState({ place: null });
  const [pickupUsers, setPickupUsers] = useState([]);
  const addresses = useSelector((state) => state.addresses);
  const place = useSelector((state) => state.place);
  const [loading, setLoading] = useState(false);

  // const user = useSelector((state) => state.dataBaseUser);

  function handleChoice(e) {
    setLoading(true);
    try {
      if (resume?.place?.type && resume?.place?.address) {
        dispatch(setOrderPlace(resume.place));
      } else if (!place) {
        dispatch(setToast("Debes elegir una dirección de envío.", "error"));
      } else {
        setChoosePlace(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setChoosePlace(false);
    }
  }

  const fetchPickupPoints = async () => {
    UsersAdapter.getPickupUsers().then((res) => setPickupUsers(res));
  };

  useEffect(() => {
    fetchPickupPoints();
  }, []);

  return (
    <>
      {/* LOADER */}
      {loading ? (
        <Backdrop sx={{ color: "#fff", zIndex: "999999" }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        false
      )}
      <Modal
        open={choosePlace}
        onClose={(e) => handleChoice(e)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        className=" flex items-center justify-center"
      >
        <Box className="bg-[#fff] rounded-lg w-[95%] max-w-[500px] h-[90vh] overflow-hidden flex flex-col justify-between shadow-lg">
          <section className=" p-4 ">
            <h2
              id="parent-modal-title"
              className="text-center text-[20px] font-bold "
            >
              ¿Donde queres recibir tu pedido?
            </h2>
            <p>
              Envíos domicilio y puntos: Martes y Viernes entre las 9-14hs o las
              15-20hs. Los pedidos que ingresan hasta las 12pm del día previo,
              ingresan en el día previsto. Los que ingresan posterior a horario
              se envian el próximo dia de entrega.
            </p>
          </section>
          <section className="flex flex-col w-full px-5 py-5 gap-6 md:gap-10 overflow-y-auto max-h-[calc(90vh-200px)]">
            <button
              className={
                resume?.place?.type === "Envío a domicilio"
                  ? "flex flex-row gap-3 md:gap-5 items-center justify-start p-3 md:p-4 border-2 border-[#000] bg-[#81A165] rounded-lg text-white"
                  : "flex flex-row gap-3 md:gap-5 items-center justify-start p-3 md:p-4 border border-[#000] bg-[#fff]/50 rounded-lg hover:bg-[#81A165]"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["place"]: { ...resume.place, type: "Envío a domicilio" },
                })
              }
            >
              <div className="w-8 md:w-1/12 flex-shrink-0">
                <MopedIcon
                  color={
                    resume?.place?.type == "Envío a domicilio"
                      ? "white"
                      : "#458552"
                  }
                  className="h-8 w-8 md:h-12 md:w-12"
                />
              </div>
              <div className="flex flex-col justify-start items-start">
                <span className="text-sm md:text-[14px] font-bold text-start">
                  Envío a domicilio
                </span>
                {resume?.place?.type == "Envío a domicilio" && (
                  <p className="text-xs md:text-sm text-start">
                    {labels?.delivery_description}
                  </p>
                )}
              </div>
            </button>

            <button
              className={
                resume?.place?.type === "Retiro"
                  ? "flex flex-row gap-3 md:gap-5 items-center justify-start p-3 md:p-4 border-2 border-[#000] bg-[#81A165] rounded-lg text-white"
                  : "flex flex-row gap-3 md:gap-5 items-center justify-start p-3 md:p-4 border border-[#000] bg-[#fff]/50 rounded-lg hover:bg-[#81A165]"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["place"]: { ...resume.place, type: "Retiro" },
                })
              }
            >
              <div className="w-8 md:w-1/12 flex-shrink-0">
                <StoreIcon
                  color={resume?.place?.type == "Retiro" ? "white" : "#458552"}
                  className="h-8 w-8 md:h-12 md:w-12"
                />
              </div>

              <div className="flex flex-col justify-start items-start">
                <span className="text-sm md:text-[14px] font-bold text-start">
                  Retiro en punto cercano
                </span>
                {resume?.place?.type == "Retiro" && (
                  <p className="text-xs md:text-sm text-start">
                    {labels?.pick_up_point_description}
                  </p>
                )}
              </div>
            </button>
          </section>

          <section className="flex flex-col items-center py-2 ">
            {resume?.place?.type === "Envío a domicilio" ? (
              <div className="flex flex-col items-center">
                <span className="font-[500]">Seleccioná tu domicilio</span>
                <div className="flex flex-col justify-start p-2 gap-2">
                  {addresses && addresses.length > 0 ? (
                    addresses.map((address, index) => (
                      <button
                        key={index}
                        className={
                          resume.place.address === address
                            ? " p-2 rounded-md  bg-[#81A165] border-2 border-[#000] hover:bg-[#81A165] text-white "
                            : " p-2 rounded-md border border-gray-400 hover:bg-[#81A165] bg-[#fff]/60 "
                        }
                        onClick={(e) =>
                          setResume({
                            ...resume,
                            ["place"]: { ...resume.place, address: address },
                          })
                        }
                      >
                        <div className="flex items-center  gap-3 w-full">
                          <PlaceIcon
                            color="primary"
                            sx={{ height: "1.2em", width: "1.2em" }}
                          />
                          <div className="flex flex-col items-start">
                            <span className="text-sm">
                              {address?.name?.length < 15
                                ? address.name
                                : `${address.name.slice(0, 15)}...`}{" "}
                              {address.number}
                            </span>
                            <span className="text-sm opacity-80">
                              {address.tag}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <span className="font-[400] text-sm">
                      {" "}
                      No tienes direcciones agregadas.
                    </span>
                  )}
                </div>
                <button onClick={(e) => setOpen(!open)}>
                  <Link className="font-[600]">Añadir dirección</Link>
                </button>
              </div>
            ) : resume?.place?.type === "Retiro" ? (
              <div className="flex flex-col items-center w-full gap-2">
                <span className="font-[500]">
                  Seleccioná donde retirar tu pedido
                </span>
                <div className="flex flex-col justify-start p-2 gap-2 h-56 overflow-y-auto">
                  {pickupUsers?.length > 0
                    ? pickupUsers?.map((pickup, index) => (
                        <button
                          key={index}
                          className={
                            resume.place.address === pickup.address
                              ? " p-2 rounded-md  bg-[#81A165] border-2 border-[#000] hover:bg-[#81A165] text-white "
                              : " p-2 rounded-md border border-gray-400 hover:bg-[#81A165] bg-[#fff]/60 "
                          }
                          onClick={(e) =>
                            setResume({
                              ...resume,
                              ["place"]: {
                                ...resume.place,
                                address: pickup.address,
                              },
                            })
                          }
                        >
                          <div className="flex items-center  gap-3 w-full">
                            <PlaceIcon
                              color="primary"
                              sx={{ height: "1.2em", width: "1.2em" }}
                            />
                            <div className="flex flex-col items-start">
                              <span className="text-sm">
                                {pickup?.displayName}
                              </span>
                              <span className="text-sm opacity-80">
                                {pickup.address?.name?.length < 80
                                  ? pickup.address.name
                                  : `${pickup.address.name.slice(
                                      0,
                                      80
                                    )}...`}{" "}
                                {pickup.address.number}
                              </span>
                              <span className="text-sm opacity-80">
                                {pickup.address.locality}
                              </span>
                              <span className="text-sm opacity-80">
                                {pickup.address.city}
                              </span>
                              {/* <span className="text-sm opacity-80">
                              {pickup.address.tag}
                            </span> */}
                            </div>
                          </div>
                        </button>
                      ))
                    : false}
                </div>
              </div>
            ) : (
              false
            )}
          </section>
          <section className="flex justify-end items-center px-5 pb-5">
            <Button
              onClick={(e) => handleChoice(e)}
              variant="text"
              color="primary"
              disabled={!resume?.place?.type || !resume?.place?.address}
            >
              <span className="text-[16px]">Aceptar</span>
            </Button>
          </section>
        </Box>
      </Modal>
      {/* New Address modal */}
      <NewAddressForm open={open} setOpen={setOpen} />
    </>
  );
}
