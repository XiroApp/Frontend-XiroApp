import { createTheme } from "@mui/material";

export const mainTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#458552",
    },
    secondary: {
      main: "#fff",
      contrastText: "#47008F",
    },
    white: {
      main: "#fff",
    },
    black: {
      main: "#000000",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: "",
        },
      },
    },
  },
  typography: {
    fontFamily: "Exo 2",
  },
});
