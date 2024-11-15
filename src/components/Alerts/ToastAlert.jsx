import { IconButton, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
export default function ToastAlert() {
  const toastAlert = useSelector((state) => state.toastAlert);

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    variant: "",
  });

  const { vertical, horizontal, open, message } = state;

  useEffect(() => {
    setState({
      ...toastAlert,
    });
  }, [toastAlert]);

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <div>
      <Snackbar
        sx={{ backgroundColor: "#81A165", borderRadius: "4px" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        // action={action}
        anchorOrigin={{ vertical, horizontal }}
        message={message}
        key={vertical + horizontal}
        className="drop-shadow-2xl"
      >
        <section className="flex gap-4 justify-between items-center p-4 rounded-[55px] drop-shadow-2xl">
          {state.variant === "success" ? (
            <CheckCircleIcon color="success" />
          ) : state.variant === "error" ? (
            <ErrorIcon color="error" />
          ) : state.variant === "info" ? (
            <ErrorIcon color="primary" />
          ) : state.variant === "warning" ? (
            <ErrorIcon color="warning" />
          ) : (
            false
          )}
          <span className="text-[14px] text-white">{state.message}</span>
          <IconButton
            size="small"
            aria-label="close"
            color="primary"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </section>
      </Snackbar>
    </div>
  );
}
