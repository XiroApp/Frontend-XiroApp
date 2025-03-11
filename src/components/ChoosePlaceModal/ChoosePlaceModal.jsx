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
        <Box className="bg-[#fff] rounded-lg w-10/12 md:w-1/2 lg:w-1/3">
          <section className=" p-4 ">
            <h2
              id="parent-modal-title"
              className="text-center text-[20px] font-bold "
            >
              ¿Donde queres recibir tu pedido?
            </h2>
          </section>
          <section className="flex px-5 py-5 gap-10">
            <button
              className={
                resume?.place?.type === "Envío a domicilio"
                  ? "flex flex-col gap-5 items-center w-1/2 justify-center p-4  border-2 border-[#000] bg-[#81A165] rounded-lg text-white"
                  : "flex flex-col gap-5 items-center w-1/2 justify-center p-4  border border-[#000] bg-[#fff]/50 rounded-lg hover:bg-[#81A165]"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["place"]: { ...resume.place, type: "Envío a domicilio" },
                })
              }
            >
              <MopedIcon
                color="primary"
                style={{ color: "#458552", height: "3em", width: "3em" }}
              />
              <span className="text-[14px] font-bold">Envío a domicilio</span>
              <div className="flex flex-col">
                {!!labels
                  ? labels
                      ?.find((label) => label.id === "delivery_description")
                      .content?.split("//")
                      .map((text, index) => (
                        <p key={index} className="text-sm">
                          {text}
                        </p>
                      ))
                  : false}
              </div>
            </button>
            <button
              className={
                resume?.place?.type === "Retiro"
                  ? "flex flex-col gap-5 items-center w-1/2 justify-center p-4  border-2 border-[#000] bg-[#81A165] rounded-lg text-white"
                  : "flex flex-col gap-5 items-center w-1/2 justify-center p-4  border border-[#000] bg-[#fff]/50 rounded-lg hover:bg-[#81A165]"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["place"]: { ...resume.place, type: "Retiro" },
                })
              }
            >
              {/* <span className="text-[14px] text-yellow-500">Próximamente</span> */}
              <StoreIcon
                color="primary"
                style={{ color: "#458552", height: "3em", width: "3em" }}
              />

              <span className="text-[14px] font-bold">
                Retiro en punto cercano
              </span>
              <div className="flex flex-col">
                {!!labels
                  ? labels
                      ?.find(
                        (label) => label.id === "pick_up_point_description"
                      )
                      .content?.split("//")
                      .map((text, index) => (
                        <p key={index} className="text-sm">
                          {text}
                        </p>
                      ))
                  : false}
              </div>
            </button>
          </section>
          <section className="flex flex-col items-center">
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
                            sx={{ height: "1.3em", width: "1.3em" }}
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
                {/* {console.log(pickupUsers)} */}
                {pickupUsers?.length > 0
                  ? pickupUsers?.map((pickup) => (
                      <button
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
                            sx={{ height: "1.3em", width: "1.3em" }}
                          />
                          <div className="flex flex-col items-start">
                            <span className="text-sm">
                              {pickup?.displayName}
                            </span>
                            <span className="text-sm opacity-80">
                              {pickup.address?.name?.length < 15
                                ? pickup.address.name
                                : `${pickup.address.name.slice(0, 15)}...`}{" "}
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

                {/* <div className="flex flex-col justify-start p-2 w-2/3">
                  <span className="text-sm">CIUDAD</span>
                  <NativeSelect
                    defaultValue={30}
                    inputProps={{
                      name: "age",
                      id: "uncontrolled-native",
                    }}
                  >
                    <option value={""}>Seleccioná tu ciudad</option>
                    <option value={20}>Mendoza</option>
                    <option value={10}>Guaymallén</option>
                    <option value={30}>Godoy Cruz</option>
                    <option value={30}>Lujan</option>
                    <option value={30}>Las Heras</option>
                  </NativeSelect>
                </div> */}
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
