import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import AlertDialog, { MessageWithCallback } from "../components/AlertDialog";
import styles from "../styles/Login.module.sass";

export interface Credentials {
  email: string;
  password: string;
}

export interface LoginCredentials extends Credentials {}

const Login: NextPage = () => {
  const [messageWithCallback, setMessageWithCallback] =
    useState<MessageWithCallback>({ message: "" });
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const [credentials, setCredentials] = useState<LoginCredentials>({
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
        setMessageWithCallback({ message: "You are logged in" });
        setIsOpen(true);
      })
      .catch(() => {
        setError(true);
        setMessageWithCallback({ message: "Incorrect email or password" });
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
              <Link href="/registration">
                <a style={{ textAlign: "center" }}>Don't have an account?</a>
              </Link>
            </Stack>
          </Card>
        </Box>
      </div>
      <AlertDialog
        messageWithCallback={messageWithCallback}
        isOpen={isOpen}
        onClose={handleDialogClose}
      />
    </>
  );
};

export default Login;
