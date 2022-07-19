import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useState } from "react";
import styles from "../styles/Login.module.sass";

export interface Credentials {
  email: string;
  password: string;
}

const Login: NextPage = () => {
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
        alert("You are logged in");
      })
      .catch(() => {
        setError(true);
        alert("Incorrect email or password");
      });
  };
  return (
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
  );
};

export default Login;
