import React from "react";
import { createTheme } from "@mui/material";
import { ThemeProvider as TP } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1c426b",
    },
    secondary: {
      main: "#f44336",
    },
  },
  components: {
    MuiStepper: {
      styleOverrides: {
        root: {
          width: "100%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          maxWidth: "400px",
          width: "100%",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          color: "#fff",
          backgroundColor: "#1c426b",
        },
        avatarColorPrimary: {
          color: "#fff",
          backgroundColor: "#1c426b",
        },
        avatar: {
          width: "1.0rem",
          paddingLeft: "0.3rem",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          width: "100%",
        },
      },
    },
    MuiTextField: {
      // remove number input arrows
      styleOverrides: {
        root: {
          width: "100%",
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            {
              webkitAppearance: "none",
              margin: 0,
            },
          "& input[type=number]": {
            mozAppearance: "textfield",
          },
          "& .hidden-button": {
            display: "none",
          },
          "&:hover .hidden-button": {
            display: "flex",
          },
        },
      },
    },
  },
});

type Props = {
  children: React$Node;
};

function ThemeProvider(props: Props) {
  return <TP theme={theme}>{props.children}</TP>;
}

export default ThemeProvider;
