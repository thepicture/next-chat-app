import { Button, Card, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import Message from "../components/Message";

export interface MessageResponse {
  id: number;
  username: string;
  dateTime: Date;
  text: string;
  isMe: boolean;
}

const INTERVAL_IN_MILLISECONDS = 1 * 1000;

const Home: NextPage = () => {
  const session = useSession();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  useEffect(() => {
    let timer: NodeJS.Timer;
    const retrieveMessages = async () => {
      try {
        const response = await axios.get("/api/chat");
        setMessages(JSON.parse(response.data as any).messages);
      } catch (error) {
        console.error("Cannot retrieve messages: " + error);
      }
    };
    timer = setInterval(retrieveMessages, INTERVAL_IN_MILLISECONDS);
    return () => clearInterval(timer);
  }, []);
  const handleChange = (newText: string) => {
    setText(newText);
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setText("");
    try {
      await axios.post("/api/chat", { text });
    } catch (error) {
      console.log(error);
      alert("Cannot send the message, try again");
    }
  };
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
            <Box display="flex" flexDirection="column">
              <Typography component="h1" variant="h4">
                Chat
              </Typography>
              <Button onClick={() => signOut()}>Logout</Button>
            </Box>
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
              <>
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    isMe={message.isMe}
                    username={message.username}
                    side={message.isMe ? "right" : "left"}
                    text={message.text}
                  />
                ))}
              </>
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <TextField
                  value={text}
                  onChange={(e) => handleChange(e.target.value)}
                  type="text"
                  autoComplete="none"
                  placeholder="Enter your message"
                />
                <Button type="submit" disabled={!text}>
                  Send
                </Button>
              </form>
            </Box>
          </Card>
        </Box>
      </Grid>
    </>
  ) : (
    <>
      <Button onClick={() => signIn()}>Sign in</Button>
      <Link href="/registration">
        <a style={{ textAlign: "center" }}>Don&apos;t have an account?</a>
      </Link>
    </>
  );
};

export default Home;
