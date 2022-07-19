import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../styles/globals.sass";

const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          padding: "16px",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          padding: "16px",
          textAlign: "center",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          margin: "16px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          padding: "16px",
        },
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
