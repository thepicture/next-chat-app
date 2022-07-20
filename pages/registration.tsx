import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import AlertDialog from "../components/AlertDialog";
import styles from "../styles/Login.module.sass";
import { Credentials } from "./login";
import { ErrorMessage, Formik, FormikHelpers, FormikValues } from "formik";

export interface RegistrationCredentials extends Credentials {
  username: string;
}

const emailRegExpPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const Login: NextPage = () => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const handleRegistration = (values: FormikValues) => {
    axios
      .post("/api/registration", values)
      .then(() => {
        setError(false);
        setMessage("You are registered!");
        setIsOpen(true);
      })
      .catch(() => {
        setError(true);
        setMessage("User with the given email or username exists");
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
            <Formik
              initialValues={{ email: "", username: "", password: "" }}
              validate={(values) => {
                const errors: RegistrationCredentials =
                  {} as RegistrationCredentials;
                if (!values.email) {
                  errors.email = "Email required";
                } else if (!emailRegExpPattern.test(values.email)) {
                  errors.email = "Enter valid email address";
                }
                if (!values.username) errors.username = "Username required";
                if (!values.password) errors.password = "Password required";
                else if (values.password.length < 5)
                  errors.password =
                    "Password length must be at least 5 characters long";

                return errors;
              }}
              onSubmit={(values) => handleRegistration(values)}
            >
              {({ values, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Stack>
                    <Typography component="h1" variant="h4">
                      Enter your new account's info
                    </Typography>
                    <TextField
                      onChange={handleChange}
                      value={values.email}
                      error={error}
                      type="email"
                      name="email"
                      placeholder="Email"
                    />
                    <Typography component="p">
                      <ErrorMessage name="email" />
                    </Typography>
                    <TextField
                      onChange={handleChange}
                      value={values.username}
                      error={error}
                      type="text"
                      name="username"
                      placeholder="Username"
                    />{" "}
                    <Typography component="p">
                      <ErrorMessage name="username" />
                    </Typography>
                    <TextField
                      onChange={handleChange}
                      value={values.password}
                      error={error}
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                    <Typography component="p">
                      <ErrorMessage name="password" />
                    </Typography>
                    <Button type="submit">Register</Button>
                    <Link href="/login">
                      <a style={{ textAlign: "center" }}>I have an account</a>
                    </Link>
                  </Stack>
                </form>
              )}
            </Formik>
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
