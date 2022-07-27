import { Box, Card, Stack, Typography, TextField, Button } from "@mui/material";
import { GetServerSidePropsContext, NextPage } from "next";
import { getCsrfToken, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "./../../styles/Home.module.sass";

export interface SignInProps {
  csrfToken: string;
}

const SignIn: NextPage<SignInProps> = ({ csrfToken }) => {
  const router = useRouter();
  const { error } = router.query;
  const { status } = useSession();
  useEffect(() => {
    status === "authenticated" && router.push("/chat");
  }, [status, router]);
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Sign in</title>
          <meta name="description" content="Sign in on this site" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Card sx={{ p: 4 }}>
            {error === "CredentialsSignin" && (
              <Box sx={{ background: "pink", borderRadius: 1 }}>
                <Typography>Incorrect login or password</Typography>
              </Box>
            )}
            <form method="post" action="/api/auth/callback/credentials">
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <Stack>
                <Typography component="h1" variant="h4">
                  Sign in
                </Typography>
                <TextField type="email" name="email" placeholder="Email" />
                <TextField
                  type="password"
                  name="password"
                  placeholder="Password"
                />
                <Button type="submit">Sign in</Button>
                <Link href="/registration">
                  <a>Don&apos;t have an account?</a>
                </Link>
              </Stack>
            </form>
          </Card>
        </Box>
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default SignIn;
