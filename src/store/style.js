// @flow
import React from 'react';
import { createTheme } from '@mui/material';
import { ThemeProvider as TP } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1c426b',
    },
    secondary: {
      main: '#f44336',
    },
  },
  components: {
    MuiStepper: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          maxWidth: '400px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          color: '#fff',
          backgroundColor: '#1c426b',
        },
        avatarColorPrimary: {
          color: '#fff',
          backgroundColor: '#1c426b',
        },
        avatar: {
          width: '1.0rem',
          paddingLeft: '0.3rem',
        },
      },
    },
    MuiTextField: {
      // remove number input arrows
      styleOverrides: {
        root: {
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
          },
          '& input[type=number]': {
            '-moz-appearance': 'textfield',
          },
        },
      },
    },
  },
});

type Props = {
  children: React$Node,
};

function ThemeProvider(props: Props): React$Node {
  return (
    <TP theme={theme}>
      {props.children}
    </TP>
  );
}

export default ThemeProvider;
