import { Box, Button, Card, Stack } from "@mui/material";
import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import styles from "./../styles/Home.module.sass";

export interface MessageResponse {
  id: number;
  username: string;
  dateTime: Date;
  text: string;
  isMe: boolean;
}
const Home: NextPage = () => {
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Chat Site</title>
          <meta name="description" content="Welcome to The Chat Site!" />
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
              <Button
                onClick={() =>
                  signIn(undefined, {
                    callbackUrl: "/chat",
                  })
                }
              >
                Sign in
              </Button>
              <Link href="/registration">
                <a style={{ textAlign: "center" }}>
                  Don&apos;t have an account?
                </a>
              </Link>
            </Stack>
          </Card>
        </Box>
      </div>
    </>
  );
};

export default Home;
