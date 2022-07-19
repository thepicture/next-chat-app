import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Login.module.sass";

const Login: NextPage = () => {
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
              Enter your account
            </Typography>
            <TextField type="email" placeholder="Email" />
            <TextField type="password" placeholder="Password" />
            <Button>Enter</Button>
          </Stack>
        </Card>
      </Box>
    </div>
  );
};

export default Login;
