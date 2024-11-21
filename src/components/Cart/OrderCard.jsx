import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { deleteOrderFromCart } from "../../redux/actions";
import { ApiConstants } from "../../Common/constants";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "#fff",
  borderRadius: "8px",
  boxShadow: 14,
};
export default function OrderCard({
  order,
  user,
  showEditModal,
  setShowEditModal,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteOrderModal, setDeleteOrderModal] = useState(false);
  const [filesModal, setFilesModal] = useState(false);
  const cart = useSelector((state) => state.cart);

  /* FUNCIONES */
  function handleDeleteOrder(e) {
    dispatch(deleteOrderFromCart(user, order.orderUid));
    setDeleteOrderModal(false);
    if (cart.length <= 1) {
      navigate("/");
    }
  }
  function handleEditOrder(e) {
    // dispatch(getCartOrder(user, order));
    // setDeleteOrderModal(true);
    setShowEditModal({ show: true, orderToEdit: order });
  }

  return (
    <div className="flex flex-col gap-2 border border-gray-500 rounded-md p-3">
      <div className="flex gap-2 items-center justify-between">
        <span className="text-black text-[12px] font-[400]">
          Impresión {order.color === "BN" ? "en blanco y negro" : "a color"}{" "}
          {order.size} x {order?.numberOfCopies}
        </span>
        <div className="flex items-center gap-2">
          <Tooltip arrow placement="top" title="Editar" sx={{}}>
            {/* <Link to={`/editarPedido/${order.orderUid}`}> */}
            <button onClick={(e) => handleEditOrder(e)}>
              <EditIcon sx={{ width: "0.8em", height: "0.8em" }} />
            </button>
            {/* </Link> */}
          </Tooltip>
          <Tooltip arrow placement="top" title="Eliminar" sx={{}}>
            <button onClick={(e) => setDeleteOrderModal(true)}>
              <DeleteIcon sx={{ width: "0.8em", height: "0.8em" }} />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-wrap w-72 gap-2">
        <div className="bg-[#789360] w-fit px-4 py-1 rounded-full text-[10px] text-center">
          {order?.color}
        </div>
        <div className="bg-[#789360] w-fit px-4 py-1 rounded-full text-[10px] text-center">
          {order?.size}
        </div>
        <div className="bg-[#789360] w-fit px-4 py-1 rounded-full text-[10px] text-center">
          {order?.finishing}
        </div>
        <div className="bg-[#789360] w-fit px-4 py-1 rounded-full text-[10px] text-center">
          {order?.copiesPerPage === "Normal"
            ? order?.copiesPerPage
            : order?.copiesPerPage + " por cara"}
        </div>
        <div className="bg-[#789360] w-fit px-4 py-1 rounded-full text-[10px] text-center">
          {order?.orientacion}
        </div>
        {/* <div className="bg-[#789360] w-fit px-4 py-1 rounded-full text-[10px] text-center">
          
        </div> */}
      </div>
      <div>
        <button
          onClick={() => setFilesModal(true)}
          className="flex items-center border border-gray-500 hover:bg-gray-500 rounded-md p-2 text-[12px]"
        >
          <AttachFileIcon sx={{ width: "0.8em", height: "0.8em" }} />
          <span>Ver documentos adjuntos</span>
        </button>
      </div>
      {/* DELETE MODAL  */}
      <Dialog
        // fullScreen={fullScreen}
        open={deleteOrderModal}
        onClose={() => setDeleteOrderModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="flex flex-col justify-center items-center">
          <DialogTitle
            id="responsive-dialog-title"
            className="flex flex-col items-center gap-5 text-center"
          >
            <ErrorIcon color="warning" sx={{ height: "4em", width: "4em" }} />
            <span className="text-xl lg:text-2xl">
              ¿Está seguro que desea eliminar esta orden?
            </span>
          </DialogTitle>
          <DialogContent className="flex justify-center">
            <DialogContentText className="text-center">
              <span className="text-md lg:text-lg">
                Esta acción es permanente
              </span>
            </DialogContentText>
          </DialogContent>

          <div className="flex justify-end items-end w-full">
            <DialogActions>
              <Button
                color="primary"
                autoFocus
                onClick={() => setDeleteOrderModal(false)}
              >
                <span className="text-lg font-[400]">Cancelar</span>
              </Button>
              <Button
                color="error"
                onClick={(e) => handleDeleteOrder(e)}
                autoFocus
              >
                <span className="text-lg font-[400]">Borrar</span>
              </Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>

      {/* FILES MODAL */}

      <Modal
        open={filesModal}
        onClose={() => setFilesModal(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <section className="border-b border-gray-600 p-4 ">
            <h2 id="parent-modal-title" className="text-center ">
              Archivos adjuntos
            </h2>
          </section>
          <section className="flex flex-col px-5 py-10 gap-10">
            {order?.files?.map((file, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-[12px] font-[500]">{file.slice(11)}</span>
                <Tooltip placement="top" title="Ver en pantalla completa">
                  <a
                    target="_blank"
                    href={`https://firebasestorage.googleapis.com/v0/b/xiro-app-2ec87.firebasestorage.app/o/${file}?alt=media&token=e7b0f280-413a-4546-aa2b-da0cd3523289`}
                    >
                    <VisibilityIcon
                      className="hover:bg-gray-500 rounded-lg"
                      sx={{ height: "0.7em", width: "0.7em" }}
                    />
                  </a>
                </Tooltip>
              </div>
            ))}
          </section>
          <section className="flex justify-end items-center px-5 pb-5">
            <Button
              variant="contained"
              color="primary"
              className="text-sm font-light"
              onClick={(e) => setFilesModal(false)}
            >
              <span className="text-sm font-light">Volver al carrito</span>
            </Button>
          </section>
        </Box>
      </Modal>
    </div>
  );
}
