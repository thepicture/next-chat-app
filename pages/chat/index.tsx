import { Grid, Box, Card, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import React, { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { MessageResponse } from "..";
import Message from "../../components/Message";

const INTERVAL_IN_MILLISECONDS = 1 * 1000;

const ChatContainerGrid = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;
const MessagesContainerGrid = styled.div`
  display: grid;
  height: 100%
  grid-template-rows: 1fr 1fr;
`;

const ChatPage = () => {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  useEffect(() => {
    const retrieveMessages = async () => {
      try {
        if (!session || Date.parse(session!.expires) < +new Date()) signIn();
        const response = await axios.get("/api/chat");
        setMessages(JSON.parse(response.data as any).messages);
      } catch (error) {
        console.error("Cannot retrieve messages: " + error);
      }
    };
    let timer = setInterval(retrieveMessages, INTERVAL_IN_MILLISECONDS);
    return () => clearInterval(timer);
  }, [session]);
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
  return (
    <>
      <Head>
        <title>Chat</title>
        <meta name="description" content="Chat with logged in users" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ChatContainerGrid>
        <Box mt={1} mr={1} ml={1}>
          <Card>
            <Typography component="h1" variant="h4">
              Chat
            </Typography>
            <Box textAlign="center">
              <Button
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                  })
                }
              >
                Logout
              </Button>
            </Box>
          </Card>
        </Box>
        <Card sx={{ m: 1 }}>
          <MessagesContainerGrid>
            <Box
              sx={{ overflowY: "scroll" }}
              height="500px"
              display="flex"
              flexDirection="column"
            >
              {messages.map((message) => (
                <Message
                  key={message.id}
                  isMe={message.isMe}
                  username={message.username}
                  side={message.isMe ? "right" : "left"}
                  text={message.text}
                />
              ))}
            </Box>
            <form onSubmit={handleSubmit}>
              <TextField
                value={text}
                onChange={(e) => handleChange(e.target.value)}
                type="text"
                autoComplete="none"
                placeholder="Enter your message"
                fullWidth={true}
                sx={{ m: 0, p: 0, pt: 1, pb: 1 }}
              />
              <Button
                variant="contained"
                type="submit"
                disabled={!text}
                fullWidth={true}
                sx={{ m: 0 }}
              >
                Send
              </Button>
            </form>
          </MessagesContainerGrid>
        </Card>
      </ChatContainerGrid>
    </>
  );
};

export default ChatPage;
