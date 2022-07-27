import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import AlertDialog, { MessageWithCallback } from "../components/AlertDialog";
import styles from "../styles/Home.module.sass";
import { ErrorMessage, Formik, FormikValues } from "formik";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export interface RegistrationCredentials {
  email: string;
  username: string;
  password: string;
}

const emailRegExpPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const Login: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    session && router.push("/chat");
  }, [session, router]);
  const [messageWithCallback, setMessageWithCallback] =
    useState<MessageWithCallback>({ message: "" });
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const handleRegistration = (values: FormikValues) => {
    axios
      .post("/api/registration", values)
      .then(() => {
        setError(false);
        setMessageWithCallback({
          message: "You are registered!",
          callback: () => router.back(),
        });
        setIsOpen(true);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 409) {
            setMessageWithCallback({
              message: "User with the given email or username exists",
            });
          } else if (error.response.status === 500) {
            setMessageWithCallback({
              message: "Server error, try to register again",
            });
          }
        }
        setError(true);
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
          <title>Registration</title>
          <meta name="description" content="Registration on the site" />
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
                if (!values.username.trim())
                  errors.username = "Username required";
                if (!values.password.trim())
                  errors.password = "Password required without white spaces";
                else if (values.password.length < 5)
                  errors.password =
                    "Password length must be at least 5 characters long";

                return errors;
              }}
              onSubmit={(values) => handleRegistration(values)}
            >
              {({ values, errors, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Stack>
                    <Typography component="h1" variant="h4">
                      Enter your new account info
                    </Typography>
                    <TextField
                      onChange={handleChange}
                      value={values.email}
                      error={error}
                      type="email"
                      name="email"
                      placeholder="Email"
                    />
                    {errors.email && (
                      <Typography component="p">
                        <ErrorMessage name="email" />
                      </Typography>
                    )}
                    <TextField
                      onChange={handleChange}
                      value={values.username}
                      error={error}
                      type="text"
                      name="username"
                      placeholder="Username"
                    />{" "}
                    {errors.username && (
                      <Typography component="p">
                        <ErrorMessage name="username" />
                      </Typography>
                    )}
                    <TextField
                      onChange={handleChange}
                      value={values.password}
                      error={error}
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                    {errors.password && (
                      <Typography component="p">
                        <ErrorMessage name="password" />
                      </Typography>
                    )}
                    <Button type="submit">Register</Button>
                    <Link href="/api/auth/signin?callbackUrl=/chat">
                      <a>I have an account</a>
                    </Link>
                  </Stack>
                </form>
              )}
            </Formik>
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
