import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Input,
  Modal,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { editPricing, getPricing } from "../../../redux/actions/adminActions";

export default function Pricing() {
  const dispatch = useDispatch();
  const pricing = useSelector((state) => state.pricing);

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    BIG_ringed: pricing?.BIG_ringed,
    SMALL_ringed: pricing?.SMALL_ringed,
    A3_simple_do: pricing?.A3_simple_do,
    A3_simple_do_color: pricing?.A3_simple_do_color,
    A3_double_does: pricing?.A3_double_does,
    A3_double_does_color: pricing?.A3_double_does_color,
    OF_simple_do: pricing?.OF_simple_do,
    OF_simple_do_color: pricing?.OF_simple_do_color,
    OF_double_does: pricing?.OF_double_does,
    OF_double_does_color: pricing?.OF_double_does_color,
    simple_do: pricing?.simple_do,
    simple_do_color: pricing?.simple_do_color,
    double_does: pricing?.double_does,
    double_does_color: pricing?.double_does_color,
    pick_up: pricing?.pick_up,
  });

  const [distanceInput, setDistanceInput] = useState({
    distance_0_to_5: pricing?.distance_0_to_5,
    distance_5_to_10: pricing?.distance_5_to_10,
    distance_10_to_15: pricing?.distance_10_to_15,
  });

  useEffect(() => {
    setLoading(true);
    dispatch(getPricing()).then(setLoading(false));
  }, []);

  async function handleSaveChanges(e, collection) {
    e.preventDefault();
    setLoading(true);
    try {
      if (collection === "paper") {
        dispatch(editPricing(input, collection));
      } else if (collection === "delivery") {
        dispatch(editPricing(distanceInput, collection));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function handleInput(e, collection) {
    if (collection === "paper") {
      setInput({ ...input, [e.target.name]: Number(e.target.value) });
    } else if (collection === "delivery") {
      setDistanceInput({
        ...distanceInput,
        [e.target.name]: Number(e.target.value),
      });
    }
  }

  return (
    <div className="flex flex-col items-center rounded-2xl lg:h-full p-6 gap-4">
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* PRECIOS PAPEL */}
      <div className="flex flex-col gap-4 shadow-2xl p-4 border border-gray-200 rounded-lg">
        <div className="flex gap-4 flex-wrap">
          {/*A3 CAMBIAR PRECIOS */}
          <div className="flex  flex-col items-center gap-2">
            <span className="text-xl border-b border-black w-full text-left opacity-80 border-b">
              Precios A3
            </span>
            <div className="flex flex-col">
              <form id="pricingForm" action="" className="flex flex-row gap-4">
                <section className="border border-black bg-slate-200 shadow-2xl p-2 rounded-lg flex flex-col gap-1">
                  <h2>B y N 📃</h2>

                  <div className="flex flex-col ">
                    <span className="text-[12px] opacity-80">Simple faz</span>
                    <div className="flex items-center gap-x-1">
                      <span className="font-semibold">$</span>
                      <Input
                        type="number"
                        name="simple_do"
                        defaultValue={input.A3_simple_do}
                        onChange={(e) => handleInput(e, "paper")}
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
                        defaultValue={input.A3_double_does}
                        onChange={(e) => handleInput(e, "paper")}
                        className="lg:w-fit"
                      />
                    </div>
                  </div>
                </section>
                <section className="border border-black bg-slate-200 shadow-2xl p-2 rounded-lg flex flex-col gap-1">
                  <h2>COLOR 🎨</h2>

                  <div className="flex flex-col ">
                    <span className="text-[12px] opacity-80">Simple faz</span>
                    <div className="flex items-center gap-x-1">
                      <span className="font-semibold">$</span>
                      <Input
                        type="number"
                        name="simple_do_color"
                        defaultValue={input.A3_simple_do_color}
                        onChange={(e) => handleInput(e, "paper")}
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
                        defaultValue={input.A3_double_does_color}
                        onChange={(e) => handleInput(e, "paper")}
                        className="lg:w-fit"
                      />
                    </div>
                  </div>
                </section>
              </form>
            </div>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          {/*A4 CAMBIAR PRECIOS */}
          <div className="flex  flex-col items-center gap-2">
            <span className="text-xl border-b border-black w-full text-left opacity-80 border-b">
              Precios A4
            </span>
            <div className="flex flex-col">
              <form id="pricingForm" action="" className="flex flex-row gap-4">
                <section className="border border-black bg-slate-200 shadow-2xl p-2 rounded-lg flex flex-col gap-1">
                  <h2>B y N 📃</h2>

                  <div className="flex flex-col ">
                    <span className="text-[12px] opacity-80">Simple faz</span>
                    <div className="flex items-center gap-x-1">
                      <span className="font-semibold">$</span>
                      <Input
                        type="number"
                        name="simple_do"
                        defaultValue={input.simple_do}
                        onChange={(e) => handleInput(e, "paper")}
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
                        onChange={(e) => handleInput(e, "paper")}
                        className="lg:w-fit"
                      />
                    </div>
                  </div>
                </section>
                <section className="border border-black bg-slate-200 shadow-2xl p-2 rounded-lg flex flex-col gap-1">
                  <h2>COLOR 🎨</h2>

                  <div className="flex flex-col ">
                    <span className="text-[12px] opacity-80">Simple faz</span>
                    <div className="flex items-center gap-x-1">
                      <span className="font-semibold">$</span>
                      <Input
                        type="number"
                        name="simple_do_color"
                        defaultValue={input.simple_do_color}
                        onChange={(e) => handleInput(e, "paper")}
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
                        onChange={(e) => handleInput(e, "paper")}
                        className="lg:w-fit"
                      />
                    </div>
                  </div>
                </section>
              </form>
            </div>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          {/*OFICIO CAMBIAR PRECIOS */}
          <div className="flex  flex-col items-center gap-2">
            <span className="text-xl border-b border-black w-full text-left opacity-80 border-b">
              Precios OFICIO
            </span>
            <div className="flex flex-col">
              <form id="pricingForm" action="" className="flex flex-row gap-4">
                <section className="border border-black bg-slate-200 shadow-2xl p-2 rounded-lg flex flex-col gap-1">
                  <h2>B y N 📃</h2>
                  <div className="flex flex-col ">
                    <span className="text-[12px] opacity-80">Simple faz</span>
                    <div className="flex items-center gap-x-1">
                      <span className="font-semibold">$</span>
                      <Input
                        type="number"
                        name="OF_simple_do"
                        defaultValue={input.OF_simple_do}
                        onChange={(e) => handleInput(e, "paper")}
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
                        onChange={(e) => handleInput(e, "paper")}
                        className="lg:w-fit"
                      />
                    </div>
                  </div>
                </section>
                <section className="border border-black bg-slate-200 shadow-2xl p-2 rounded-lg flex flex-col gap-1">
                  <h2>COLOR 🎨</h2>
                  <div className="flex flex-col ">
                    <span className="text-[12px] opacity-80">Simple faz</span>
                    <div className="flex items-center gap-x-1">
                      <span className="font-semibold">$</span>
                      <Input
                        type="number"
                        name="OF_simple_do_color"
                        defaultValue={input.OF_simple_do_color}
                        onChange={(e) => handleInput(e, "paper")}
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
                        onChange={(e) => handleInput(e, "paper")}
                        className="lg:w-fit"
                      />
                    </div>
                  </div>
                </section>
              </form>
            </div>
          </div>
          {/*ANILLADO CAMBIAR PRECIOS */}
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex  flex-col items-center gap-2">
            <span className="text-xl border-b border-black w-full text-left opacity-80 border-b">
              Precio Anillado
            </span>
            <form id="pricingForm" action="" className="flex flex-row gap-4">
              <section className="border border-black bg-slate-200 shadow-2xl p-2 rounded-lg flex flex-col gap-1">
                <h2>ANILLADO 📘</h2>

                <div className="flex flex-col ">
                  <span className="text-[12px] opacity-80">Anillado chico</span>
                  <div className="flex items-center gap-x-1">
                    <span className="font-semibold">$</span>
                    <Input
                      type="number"
                      name="SMALL_ringed"
                      defaultValue={input.SMALL_ringed}
                      onChange={(e) => handleInput(e, "paper")}
                      className="lg:w-fit"
                    />
                  </div>
                </div>
                <div className="flex flex-col ">
                  <span className="text-[12px] opacity-80">
                    Anillado grande
                  </span>
                  <div className="flex items-center gap-x-1">
                    <span className="font-semibold">$</span>
                    <Input
                      type="number"
                      name="BIG_ringed"
                      defaultValue={input.BIG_ringed}
                      onChange={(e) => handleInput(e, "paper")}
                      className="lg:w-fit"
                    />
                  </div>
                </div>
              </section>
            </form>
          </div>
        </div>
        <div className="flex w-full">
          <Button
            onClick={(e) => handleSaveChanges(e, "paper")}
            className="w-full"
            variant="contained"
            color="primary"
          >
            Guardar precios de papel
          </Button>
        </div>
      </div>
      {/*PRECIOS DISTANCIA*/}
      <div className="flex flex-col gap-4 shadow-2xl p-4 border border-gray-200 rounded-lg">
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col">
            <div className="flex  flex-col items-center gap-2">
              <span className="text-xl border-b border-black w-full text-left opacity-80 border-b">
                Precio de entrega por KM
              </span>
              <form id="pricingForm" action="" className="flex flex-row gap-4">
                <section className="border border-black bg-slate-200 shadow-2xl p-2 rounded-lg flex flex-col gap-1">
                  <h2>Delivery 🛵</h2>

                  <div className="flex flex-col ">
                    <span className="text-[12px] opacity-80">De 0 a 5 km</span>
                    <div className="flex items-center gap-x-1">
                      <span className="font-semibold">$</span>
                      <Input
                        type="number"
                        name="distance_0_to_5"
                        defaultValue={distanceInput?.distance_0_to_5}
                        onChange={(e) => handleInput(e, "delivery")}
                        className="lg:w-fit"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col ">
                    <span className="text-[12px] opacity-80">De 5 a 10 km</span>
                    <div className="flex items-center gap-x-1">
                      <span className="font-semibold">$</span>
                      <Input
                        type="number"
                        name="distance_5_to_10"
                        defaultValue={distanceInput?.distance_5_to_10}
                        onChange={(e) => handleInput(e, "delivery")}
                        className="lg:w-fit"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col ">
                    <span className="text-[12px] opacity-80">
                      A partir de 10 km
                    </span>
                    <div className="flex items-center gap-x-1">
                      <span className="font-semibold">$</span>
                      <Input
                        type="number"
                        name="distance_10_to_15"
                        defaultValue={distanceInput?.distance_10_to_15}
                        onChange={(e) => handleInput(e, "delivery")}
                        className="lg:w-fit"
                      />
                    </div>
                  </div>
                </section>
              </form>
            </div>
          </div>
          <div className="flex w-full">
            {" "}
            <Button
              onClick={(e) => handleSaveChanges(e, "delivery")}
              className="w-full"
              variant="contained"
              color="primary"
            >
              Guardar precios de entrega
            </Button>
          </div>
        </div>
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
