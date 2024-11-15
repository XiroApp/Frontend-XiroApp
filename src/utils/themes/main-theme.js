import { createTheme } from "@mui/material";

export const mainTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#458552",
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#fff",
      // light: "#F5EBFF",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#47008F",
    },
    white: {
      main: "#fff",
      // light: "#F5EBFF",
      // dark: will be calculated from palette.secondary.main,
      // contrastText: "#47008F",
    },
    black: {
      main: "#000000",
      // light: "#000000",
      // dark: "#000000",
      // contrastText: "#fff",
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
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    // fontSize: 12,
    // fontWeightMedium:""
    fontFamily: "Poppins",
  },
});
