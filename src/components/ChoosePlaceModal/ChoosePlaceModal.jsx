import React, { useState } from "react";
import { Box, Button, Link, Modal, NativeSelect } from "@mui/material";
import MopedIcon from "@mui/icons-material/Moped";
import StoreIcon from "@mui/icons-material/Store";
import { useDispatch, useSelector } from "react-redux";
import NewAddressForm from "../../components/Forms/NewAddressForm";
import PlaceIcon from "@mui/icons-material/Place";
import { setOrderPlace, setToast, updateUser } from "../../redux/actions";

export default function ChoosePlaceModal({ choosePlace, setChoosePlace }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [resume, setResume] = useState({ place: null });
  const addresses = useSelector((state) => state.addresses);
  const place = useSelector((state) => state.place);
  // const user = useSelector((state) => state.dataBaseUser);

  function handleChoice(e) {
    if (resume?.place?.type && resume?.place?.address) {
      dispatch(setOrderPlace(resume.place));
      setChoosePlace(false);
    } else if (!place) {
      dispatch(setToast("Debes elegir una dirección de envío.", "error"));
      setChoosePlace(false);
    } else {
      setChoosePlace(false);
    }
  }
  return (
    <>
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
              className="text-center text-[20px] font-[300] "
            >
              ¿Dónde queres recibir tu pedido?
            </h2>
          </section>
          <section className="flex px-5 py-5 gap-10">
            <button
              className={
                resume?.place?.type === "Envío a domicilio"
                  ? "flex flex-col gap-5 items-center w-1/2 justify-center p-4  border border-[#000] bg-[#81A165] rounded-lg"
                  : "flex flex-col gap-5 items-center w-1/2 justify-center p-4  bg-[#81A165]/50 rounded-lg hover:bg-[#81A165]"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["place"]: { ...resume.place, type: "Envío a domicilio" },
                })
              }
            >
              <MopedIcon color="primary" sx={{ height: "2em", width: "2em" }} />
              <span className="text-[14px]">Envío a domicilio</span>
            </button>
            <button
              disabled
              className={
                resume?.place?.type === "Retiro"
                  ? "cursor-no-drop flex flex-col gap-5 items-center w-1/2 justify-center p-4  border border-[#000] bg-[#81A165]/20 rounded-lg"
                  : "cursor-no-drop flex flex-col gap-5 items-center w-1/2 justify-center p-4  bg-[#81A165]/20 rounded-lg"
              }
              onClick={(e) =>
                setResume({
                  ...resume,
                  ["place"]: { ...resume.place, type: "Retiro" },
                })
              }
            >
              <span className="text-[14px] text-yellow-500">Próximamente</span>
              <StoreIcon color="primary" sx={{ height: "2em", width: "2em" }} />

              <span className="text-[14px]">Retiro en punto cercano</span>
            </button>
          </section>
          <section className="flex flex-col items-center">
            {resume?.place?.type === "Envío a domicilio" ? (
              <div className="flex flex-col items-center">
                <span className="font-[300]">Seleccioná tu domicilio</span>
                <div className="flex flex-col justify-start p-2 gap-2">
                  {addresses && addresses.length > 0 ? (
                    addresses.map((address, index) => (
                      <button
                        key={index}
                        className={
                          resume.place.address === address
                            ? " p-2 rounded-md  bg-[#81A165] border border-[#000] hover:bg-[#81A165] "
                            : " p-2 rounded-md border border-gray-400 hover:bg-[#81A165] bg-[#81A165]/60 "
                        }
                        onClick={(e) =>
                          setResume({
                            ...resume,
                            ["place"]: { ...resume.place, address: address },
                          })
                        }
                      >
                        <div className="flex items-center  gap-3 w-full text-white">
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
                            <span className="text-sm opacity-60">
                              {address.tag}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <span className="font-[200] text-sm">
                      {" "}
                      No tienes ningún domicilio registrado
                    </span>
                  )}
                </div>
                <button onClick={(e) => setOpen(!open)}>
                  <Link className="font-[500]">Añadir dirección</Link>
                </button>
              </div>
            ) : resume?.place?.type === "Retiro" ? (
              <div className="flex flex-col items-center w-full">
                <span className="font-[300] text-xl">¡Próximamente!</span>
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
