import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MessageResponse } from "..";
import Message from "../../components/Message";
import io from "socket.io-client";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
let socket: any;

const ChatContainerGrid = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;
const MessagesContainerGrid = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: 1fr auto auto;
`;

const ChatPage = () => {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const ref = useRef<HTMLElement>();
  const [isAutoscrollEnabled, setIsAutoscrollEnabled] = useState(true);
  const initializeSocket = async () => {
    await axios.get("/api/socket");
    socket = io();
    socket.on("get-all-messages", (messages: MessageResponse[]) => {
      setMessages(messages);
    });
  };
  useEffect(() => {
    if (!session) return;
    initializeSocket();
  }, [session]);
  useEffect(() => {
    if (isAutoscrollEnabled) ref.current!.scrollTop = ref.current!.scrollHeight;
  }, [messages.length, isAutoscrollEnabled]);
  const handleChange = (newText: string) => {
    setText(newText);
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setText("");
    try {
      socket.emit("send-message", text);
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
              ref={ref}
              sx={{ overflowY: "scroll" }}
              display="flex"
              flexDirection="column"
            >
              {messages.map((message) => (
                <Message
                  key={message.id}
                  isMe={
                    (session!.user as { username: string })!.username ===
                    message.username
                  }
                  username={message.username}
                  side={
                    (session!.user as { username: string })!.username ===
                    message.username
                      ? "right"
                      : "left"
                  }
                  text={message.text}
                />
              ))}
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  onChange={(e) => setIsAutoscrollEnabled(e.target.checked)}
                />
              }
              label="Autoscroll"
            />
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
