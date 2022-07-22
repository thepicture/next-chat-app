import { Button } from "@mui/material";
import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import ChatPage from "./chat";

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
      <Button
        onClick={() =>
          signIn("credentials", {
            callbackUrl: "/chat",
          })
        }
      >
        Sign in
      </Button>
      <Link href="/registration">
        <a style={{ textAlign: "center" }}>Don&apos;t have an account?</a>
      </Link>
    </>
  );
};

export default Home;
