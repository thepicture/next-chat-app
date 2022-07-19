import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useState } from "react";
import AlertDialog from "../components/AlertDialog";
import styles from "../styles/Login.module.sass";

export interface Credentials {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { type, value } = e.target;
    setCredentials({ ...credentials, [type]: value });
  };
  const handleLogin = () => {
    axios
      .post("/api/login", credentials)
      .then(() => {
        setError(false);
        setMessage("You are logged in");
        setIsOpen(true);
      })
      .catch(() => {
        setError(true);
        setMessage("Incorrect email or password");
        setIsOpen(true);
      });
  };
  const handleDialogClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Login</title>
          <meta name="description" content="Enter your account" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Card sx={{ p: 4 }}>
            <Stack>
              <Typography component="h1" variant="h4">
                Login
              </Typography>
              <TextField
                onChange={handleChange}
                error={error}
                type="email"
                placeholder="Email"
              />
              <TextField
                onChange={handleChange}
                error={error}
                type="password"
                placeholder="Password"
              />
              <Button onClick={handleLogin}>Sign in</Button>
            </Stack>
          </Card>
        </Box>
      </div>
      <AlertDialog
        message={message}
        isOpen={isOpen}
        onClose={handleDialogClose}
      />
    </>
  );
};

export default Login;
