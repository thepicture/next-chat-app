import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import AlertDialog from "../components/AlertDialog";
import styles from "../styles/Login.module.sass";
import { Credentials } from "./login";

export interface RegistrationCredentials extends Credentials {
  username: string;
}

const Login: NextPage = () => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const [credentials, setCredentials] = useState<RegistrationCredentials>({
    email: "",
    username: "",
    password: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };
  const handleLogin = () => {
    axios
      .post("/api/registration", credentials)
      .then(() => {
        setError(false);
        setMessage("You are registered!");
        setIsOpen(true);
      })
      .catch(() => {
        setError(true);
        setMessage("Cannot register, try again");
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
          <meta name="description" content="Enter your new account's info" />
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
                Enter your new account's info
              </Typography>
              <TextField
                onChange={handleChange}
                error={error}
                type="email"
                name="email"
                placeholder="Email"
              />
              <TextField
                onChange={handleChange}
                error={error}
                type="text"
                name="username"
                placeholder="Username"
              />
              <TextField
                onChange={handleChange}
                error={error}
                type="password"
                name="password"
                placeholder="Password"
              />
              <Button onClick={handleLogin}>Register</Button>
              <Link href="/login">
                <a style={{ textAlign: "center" }}>I have an account</a>
              </Link>
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
