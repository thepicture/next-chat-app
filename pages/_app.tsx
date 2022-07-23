import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../styles/globals.sass";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

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

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
