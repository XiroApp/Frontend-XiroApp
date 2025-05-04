import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Link,
  Modal,
} from "@mui/material";
import { FaMotorcycle as MopedIcon } from "react-icons/fa6";
import { FaStore as StoreIcon } from "react-icons/fa6";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import { useDispatch, useSelector } from "react-redux";
import NewAddressForm from "../../components/Forms/NewAddressForm";
import { setOrderPlace, setToast, updateUser } from "../../redux/actions";
import { UsersAdapter } from "../../Infra/Adapters/users.adapter";

export default function AlertModal() {
  const dispatch = useDispatch();
  const labels = useSelector(state => state.labels);
  const [open, setOpen] = useState(labels?.alert_info_new_order_modal.enabled);
  const [resume, setResume] = useState({ place: null });
  const [pickupUsers, setPickupUsers] = useState([]);
  const addresses = useSelector(state => state.addresses);
  const place = useSelector(state => state.place);
  const [loading, setLoading] = useState(false);

  function handleChoice() {
    setLoading(true);
    try {
      ("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={e => handleChoice(e)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        className=" flex items-center justify-center"
      >
        <Box className="bg-[#fff] rounded-lg w-[95%] max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col justify-between shadow-lg">
          <section className="p-4">
            <p
              id="parent-modal-title"
              className="text-center text-[20px] font-bold "
            >
              ¿Dónde querés recibir tu pedido?
            </p>
            <p>
              Envíos domicilio y puntos: Martes y Viernes entre las 9-14hs o las
              15-20hs. Los pedidos que ingresan hasta las 12pm del día previo,
              ingresan en el día previsto. Los que ingresan posterior a horario
              se envian el próximo dia de entrega.
            </p>
          </section>

          <section className="flex justify-end items-center px-5 pb-5">
            <Button
              onClick={e => handleChoice(e)}
              variant="text"
              color="primary"
              disabled={!resume?.place?.type || !resume?.place?.address}
            >
              <span className="text-[16px]">Aceptar</span>
            </Button>
          </section>
        </Box>
      </Modal>
    </>
  );
}
