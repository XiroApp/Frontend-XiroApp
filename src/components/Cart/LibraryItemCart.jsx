import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ErrorIcon from "@mui/icons-material/Error";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setLibraryCart, setToast } from "../../redux/actions";
import { formatPrice } from "../../Common/helpers";
import propTypes from "prop-types";

export default function LibraryItemCart({ item }) {
  const dispatch = useDispatch(),
    [deleteItemModal, setDeleteItemModal] = useState(false),
    libraryCart = useSelector(state => state.libraryCart);

  function handleDelete() {
    const updatedCart = libraryCart.filter(cartItem => cartItem.id !== item.id);
    dispatch(setLibraryCart(updatedCart));
    dispatch(setToast("Artículo eliminado del carrito", "success"));
    setDeleteItemModal(false);
  }

  function updateQuantity(newQuantity) {
    if (newQuantity < 1 || newQuantity > 10) return;
    const updatedCart = libraryCart.map(cartItem => {
      if (cartItem.id === item.id) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });

    dispatch(setLibraryCart(updatedCart));
  }

  return (
    <li className="flex justify-between items-center border-b-2 border-green-800/30 pb-2 w-full">
      <div className="flex items-center gap-x-2 pl-3">
        <div className="flex items-center gap-x-1">
          <IconButton
            size="small"
            onClick={() => updateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="text-green-700"
            aria-label="Disminuir cantidad"
          >
            <RemoveIcon fontSize="small" />
          </IconButton>

          <span className="text-sm font-medium min-w-[20px] text-center select-none">
            {item.quantity}
          </span>

          <IconButton
            size="small"
            onClick={() => updateQuantity(item.quantity + 1)}
            disabled={item.quantity >= 10}
            className="text-green-700"
            aria-label="Aumentar cantidad"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </div>

        <div title={item.name} className="flex flex-col">
          <span className="text-sm font-medium line-clamp-1">{item.name}</span>
          <span className="text-xs text-gray-600">
            ${formatPrice(item.price)} c/u
          </span>
        </div>
      </div>

      <div className="flex items-center gap-x-3 pr-3">
        <span className="text-sm font-semibold">
          ${formatPrice(item.price * item.quantity)}
        </span>
        <Tooltip arrow placement="top" title="Eliminar">
          <IconButton
            size="small"
            onClick={() => setDeleteItemModal(true)}
            className="text-red-500"
            aria-label="Eliminar artículo"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      <Dialog
        open={deleteItemModal}
        onClose={() => setDeleteItemModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="flex flex-col justify-center items-center">
          <DialogTitle
            id="alert-dialog-title"
            className="flex flex-col items-center gap-5 text-center"
          >
            <ErrorIcon color="warning" sx={{ height: "4em", width: "4em" }} />
            <span className="text-xl lg:text-2xl">
              ¿Está seguro que desea quitar este artículo?
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
                onClick={() => setDeleteItemModal(false)}
              >
                <span className="text-lg font-[400]">Cancelar</span>
              </Button>
              <Button color="error" onClick={handleDelete} autoFocus>
                <span className="text-lg font-[400]">Quitar</span>
              </Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>
    </li>
  );
}

LibraryItemCart.propTypes = {
  item: propTypes.object,
};
