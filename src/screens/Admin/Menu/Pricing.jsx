import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Button, Input, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { editPricing, getPricing } from "../../../redux/actions/adminActions";

export default function Pricing() {
  const dispatch = useDispatch();
  const pricing = useSelector((state) => state.pricing);
  const [openModal, setOpenModal] = useState(false);
  const [input, setInput] = useState({
    BIG_ringed: pricing?.BIG_ringed,
    SMALL_ringed: pricing?.SMALL_ringed,
    OF_simple_do: pricing?.OF_simple_do,
    OF_simple_do_color: pricing?.OF_simple_do_color,
    OF_double_does: pricing?.OF_double_does,
    OF_double_does_color: pricing?.OF_double_does_color,
    simple_do: pricing?.simple_do,
    simple_do_color: pricing?.simple_do_color,
    double_does: pricing?.double_does,
    double_does_color: pricing?.double_does_color,
    delivery_km: pricing?.delivery_km,
    pick_up: pricing?.pick_up,
  });

  useEffect(() => {
    dispatch(getPricing());
  }, []);

  function handleCloseModal() {
    setOpenModal(!openModal);
  }

  async function handleSaveChanges(e) {
    e.preventDefault();
    dispatch(editPricing(input));
  }

  function handleInput(e) {
    setInput({ ...input, [e.target.name]: Number(e.target.value) });
  }

  return (
    <div className="flex flex-col bg-[#1e1e1e] rounded-2xl lg:h-full p-6 gap-4">
      {/*A4 CAMBIAR PRECIOS */}
      <span className="text-xl opacity-80 border-b">Precios A4</span>
      <div className="flex flex-col">
        <form id="pricingForm" action="" className="flex flex-row gap-4">
          <section className="bg-[#313131] p-2 rounded-lg flex flex-col gap-1">
            <h2>B y N 📃</h2>

            <div className="flex flex-col ">
              <span className="text-[12px] opacity-80">Simple faz</span>
              <div className="flex items-center gap-x-1">
                <span className="font-semibold">$</span>
                <Input
                  type="number"
                  name="simple_do"
                  defaultValue={input.simple_do}
                  onChange={(e) => handleInput(e)}
                  className="lg:w-fit"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] opacity-80">Doble faz</span>
              <div className="flex items-center gap-x-1">
                <span className="font-semibold">$</span>
                <Input
                  type="number"
                  name="double_does"
                  defaultValue={input.double_does}
                  onChange={(e) => handleInput(e)}
                  className="lg:w-fit"
                />
              </div>
            </div>
          </section>
          <section className="bg-[#313131] p-2 rounded-lg flex flex-col gap-1">
            <h2>COLOR 🎨</h2>

            <div className="flex flex-col ">
              <span className="text-[12px] opacity-80">Simple faz</span>
              <div className="flex items-center gap-x-1">
                <span className="font-semibold">$</span>
                <Input
                  type="number"
                  name="simple_do_color"
                  defaultValue={input.simple_do_color}
                  onChange={(e) => handleInput(e)}
                  className="lg:w-fit"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] opacity-80">Doble faz</span>
              <div className="flex items-center gap-x-1">
                <span className="font-semibold">$</span>
                <Input
                  type="number"
                  name="double_does_color"
                  defaultValue={input.double_does_color}
                  onChange={(e) => handleInput(e)}
                  className="lg:w-fit"
                />
              </div>
            </div>
          </section>
        </form>
      </div>
      {/*OFICIO CAMBIAR PRECIOS */}
      <span className="text-xl opacity-80 border-b">Precios OFICIO</span>
      <div className="flex flex-col">
        <form id="pricingForm" action="" className="flex flex-row gap-4">
          <section className="bg-[#313131] p-2 rounded-lg flex flex-col gap-1">
            <h2>B y N 📃</h2>
            <div className="flex flex-col ">
              <span className="text-[12px] opacity-80">Simple faz</span>
              <div className="flex items-center gap-x-1">
                <span className="font-semibold">$</span>
                <Input
                  type="number"
                  name="OF_simple_do"
                  defaultValue={input.OF_simple_do}
                  onChange={(e) => handleInput(e)}
                  className="lg:w-fit"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] opacity-80">Doble faz</span>
              <div className="flex items-center gap-x-1">
                <span className="font-semibold">$</span>
                <Input
                  type="number"
                  name="OF_double_does"
                  defaultValue={input.OF_double_does}
                  onChange={(e) => handleInput(e)}
                  className="lg:w-fit"
                />
              </div>
            </div>
          </section>
          <section className="bg-[#313131] p-2 rounded-lg flex flex-col gap-1">
            <h2>COLOR 🎨</h2>
            <div className="flex flex-col ">
              <span className="text-[12px] opacity-80">Simple faz</span>
              <div className="flex items-center gap-x-1">
                <span className="font-semibold">$</span>
                <Input
                  type="number"
                  name="OF_simple_do_color"
                  defaultValue={input.OF_simple_do_color}
                  onChange={(e) => handleInput(e)}
                  className="lg:w-fit"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] opacity-80">Doble faz</span>
              <div className="flex items-center gap-x-1">
                <span className="font-semibold">$</span>
                <Input
                  type="number"
                  name="OF_double_does_color"
                  defaultValue={input.OF_double_does_color}
                  onChange={(e) => handleInput(e)}
                  className="lg:w-fit"
                />
              </div>
            </div>
          </section>
        </form>
      </div>

      <div className="flex gap-4">
        {/*ANILLADO CAMBIAR PRECIOS */}
        <section className="flex flex-col gap-4">
          <span className="text-xl opacity-80 border-b">Precio Anillado</span>
          <form id="pricingForm" action="" className="flex flex-row gap-4">
            <section className="bg-[#313131] p-2 rounded-lg flex flex-col gap-1">
              <h2>ANILLADO 📘</h2>

              <div className="flex flex-col ">
                <span className="text-[12px] opacity-80">Anillado chico</span>
                <div className="flex items-center gap-x-1">
                  <span className="font-semibold">$</span>
                  <Input
                    type="number"
                    name="SMALL_ringed"
                    defaultValue={input.SMALL_ringed}
                    onChange={(e) => handleInput(e)}
                    className="lg:w-fit"
                  />
                </div>
              </div>
              <div className="flex flex-col ">
                <span className="text-[12px] opacity-80">Anillado grande</span>
                <div className="flex items-center gap-x-1">
                  <span className="font-semibold">$</span>
                  <Input
                    type="number"
                    name="BIG_ringed"
                    defaultValue={input.BIG_ringed}
                    onChange={(e) => handleInput(e)}
                    className="lg:w-fit"
                  />
                </div>
              </div>
            </section>
          </form>
        </section>
        {/*DELIVERY CAMBIAR PRECIOS */}
        <section className="flex flex-col gap-4">
          <span className="text-xl opacity-80 border-b">Precio Entrega</span>
          <form id="pricingForm" action="" className="flex flex-row gap-4">
            <section className="bg-[#313131] p-2 rounded-lg flex flex-col gap-1">
              <h2>Delivery 🛵</h2>

              <div className="flex flex-col ">
                <span className="text-[12px] opacity-80">Por KM</span>
                <div className="flex items-center gap-x-1">
                  <span className="font-semibold">$</span>
                  <Input
                    type="number"
                    name="delivery_km"
                    defaultValue={input.delivery_km}
                    onChange={(e) => handleInput(e)}
                    className="lg:w-fit"
                  />
                </div>
              </div>
            </section>
          </form>
        </section>
      </div>

      <div className="flex lg:justify-end">
        <Button
          onClick={(e) => handleSaveChanges(e)}
          className="w-full lg:w-56"
          variant="contained"
          color="primary"
        >
          Guardar
        </Button>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <CheckCircleIcon
              color="success"
              sx={{ height: "4rem", width: "4rem" }}
            />
            <span className="text-center">
              ¡Los cambios se han guardado con éxito!
            </span>
            <div className="flex">
              <Button onClick={handleCloseModal}>Aceptar</Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
const modalStyle = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2em",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "#1e1e1e",
  // border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};
