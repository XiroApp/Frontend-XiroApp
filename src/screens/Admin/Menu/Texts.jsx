import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Modal,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { InAppTextsAdapter } from "../../../Adapters/inAppTexts.adapter";
import { setToast } from "../../../redux/actions";

export default function Texts() {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [labels, setLabels] = useState([]);
  const [input, setInput] = useState({});

  useEffect(() => {
    InAppTextsAdapter.getLabels().then(res => {
      setLabels(res);
    });
  }, []);

  function handleCloseModal() {
    setOpenModal(!openModal);
  }

  const handleInput = e =>
    setInput({ ...input, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const dataArray = Object.entries(input).map(([key, value]) => ({
        id: key,
        content: value,
      }));

      await InAppTextsAdapter.editLabels(dataArray).then(() => {
        dispatch(setToast("Textos editados correctamente.", "success"));
      });
    } catch (error) {
      dispatch(setToast(error.message, "error"));
    }
  }

  return (
    <div className="flex flex-col items-center rounded-2xl lg:h-full p-6 gap-4">
      <div className=" w-full flex flex-col gap-5">
        {labels?.length
          ? labels.map((item, index) => (
              <div className="" key={index}>
                <Typography variant="h6">
                  {item.id === "delivery_description"
                    ? "Info de delivery"
                    : item.id === "pick_up_point_description"
                    ? "Info de punto de entrega"
                    : item.id === "snackbar_new_order_info"
                    ? "Info nueva orden"
                    : item.id === "alert_info_new_order_modal"
                    ? "Info al elegir lugar de entrega"
                    : item.id === "week_alert "
                    ? "Alerta semanal"
                    : item.id}
                </Typography>
                <TextareaAutosize
                  defaultValue={item.content}
                  id={item.id}
                  name={item.id}
                  onChange={handleInput}
                  className="min-h-24 w-full border border-black rounded-lg p-2"
                />
              </div>
            ))
          : false}
      </div>
      <div className="flex lg:justify-end">
        <Button
          onClick={handleSubmit}
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
