import {
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Message from "../components/Message";

const Home: NextPage = () => {
  const session = useSession();
  return session.status === "authenticated" ? (
    <>
      <Head>
        <title>Chat</title>
        <meta name="description" content="Chat with logged in users" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid
        gridTemplateRows="auto 1fr"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        margin={4}
      >
        <Box gridRow={1} marginBottom={4}>
          <Card sx={{ p: 4 }}>
            <Typography component="h1" variant="h4">
              Chat
            </Typography>
          </Card>
        </Box>
        <Box gridRow={2} sx={{ height: "calc(100% - 10em)" }}>
          <Card sx={{ p: 4, height: "100%" }}>
            <Box
              display="flex"
              flexDirection="column"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "100%",
              }}
            >
              <Message username="abc" side="left" text="From the left side" />
              <Message username="Me" side="right" text="from the right side" />
              <TextField
                type="text"
                autoComplete="none"
                placeholder="Enter your message"
              />
              <Button>Send</Button>
            </Box>
          </Card>
        </Box>
      </Grid>
    </>
  ) : (
    <>
      <Button onClick={() => signIn()}>Sign in</Button>
      <Link href="/registration">
        <a style={{ textAlign: "center" }}>Don't have an account?</a>
      </Link>
    </>
  );
};

export default Home;
