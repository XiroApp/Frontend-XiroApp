import { Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

export default function ToastAlert() {
  const toastAlert = useSelector(state => state.toastAlert),
    [state, setState] = useState({
      open: false,
      vertical: "top",
      horizontal: "center",
      message: "",
      variant: "",
    }),
    { vertical, horizontal, open, message } = state,
    handleClose = () => setState({ ...state, open: false });

  useEffect(() => setState({ ...toastAlert }), [toastAlert]);

  function renderIcon(variant) {
    switch (variant) {
      case "success":
        return <CheckCircleIcon color="success" />;
      case "error":
        return <ErrorIcon color="error" />;
      case "info":
        return <ErrorIcon color="primary" />;
      case "warning":
        return <ErrorIcon color="warning" />;
      default:
        return <></>;
    }
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
      message={message}
      key={vertical + horizontal}
      className="shadow-sm shadow-black bg-gray-200 hover:bg-gray-100 duration-75 border-2 border-gray-700 rounded-md h-20"
    >
      <section className="flex gap-4 justify-between items-center px-6">
        {renderIcon(state.variant)}
        <span className="text-[15px] text-black">{state.message}</span>
        <CloseIcon onClick={handleClose} className="cursor-pointer mt-1 mx-2" />
      </section>
    </Snackbar>
  );
}
