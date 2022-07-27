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
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MessageResponse } from "..";
import Message from "../../components/Message";
import io from "socket.io-client";
import { Socket } from "socket.io";
import TypingList from "../../components/TypingList";
import OnlineUserList from "../../components/OnlineUserList";
import { IEmojiData } from "emoji-picker-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
let socket: any;

const ChatContainerGrid = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;
const MessagesContainerGrid = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr auto auto auto;
`;

const EmojiToggler = styled.div<{ isShowEmoji: boolean }>`
  position: absolute;
  bottom: 0;
  padding-bottom: 128px;
  display: ${(props) => (props.isShowEmoji ? "inherit" : "none")};
`;

const NoSSREmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

const TYPING_STOP_TIMEOUT_IN_MILLISECONDS = 2000;

const ChatPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLElement>();
  const { data: session, status } = useSession();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isAutoscrollEnabled, setIsAutoscrollEnabled] = useState(true);
  const [typers, setTypers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      signOut({ redirect: false });
      router.push("/auth/credentials-signin");
    }
    if (socket) return;

    const initializeSocket = async () => {
      await axios.get("/api/socket");
      socket = io({
        query: {
          email: session!.user!.email,
        },
      });
      socket.on(
        "get all messages",
        (messagesAndUsers: {
          messages: MessageResponse[];
          onlineUsers: string[];
        }) => {
          setMessages(messagesAndUsers.messages);
          setOnlineUsers(messagesAndUsers.onlineUsers);
        }
      );
      socket.on("new message", (message: MessageResponse) =>
        setMessages((prev) => [
          ...prev,
          {
            id: (prev[prev.length - 1]?.id || 1) + 1,
            email: message.email,
            dateTime: new Date(),
            text: message.text,
            isMe: false,
          },
        ])
      );
      let _typersCache: string[] = [];
      socket.on("typing", (typer: { email: string }) => {
        if (_typersCache.includes(typer.email)) return;
        _typersCache = [..._typersCache, typer.email];
        setTypers(_typersCache);
        setTimeout(() => {
          _typersCache = _typersCache.filter(
            (prevTyper) => prevTyper !== typer.email
          );
          setTypers(_typersCache);
        }, TYPING_STOP_TIMEOUT_IN_MILLISECONDS);
      });
      socket.on("user connect", (newUser: { email: string }) => {
        setOnlineUsers((prev) =>
          prev.includes(newUser.email) ? prev : [...prev, newUser.email]
        );
      });
      socket.on("user disconnect", (disconnectedUser: { email: string }) => {
        setOnlineUsers((prev) =>
          prev.filter((onlineUser) => onlineUser != disconnectedUser.email)
        );
      });
      socket.on("expired", () => {
        signOut({ redirect: false });
        router.push("/auth/credentials-signin");
      });
    };

    initializeSocket();
  }, [status, session]);
  useEffect(() => {
    if (isAutoscrollEnabled) ref.current!.scrollTop = ref.current!.scrollHeight;
  }, [messages.length, isAutoscrollEnabled]);
  const handleChange = (newText: string) => {
    setText(newText);
    socket.emit("typing");
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      socket.emit("post message", text);
      setMessages((prev) => [
        ...prev,
        {
          id: (prev[prev.length - 1]?.id || 1) + 1,
          email: session!.user!.email!,
          dateTime: new Date(),
          text,
          isMe: true,
        },
      ]);
      setText("");
    } catch (error) {
      console.log(error);
      alert("Cannot send the message, try again");
    }
  };
  const handleEmojiClick = (
    _event: React.MouseEvent<Element, MouseEvent>,
    data: IEmojiData
  ) => {
    setText((prev) => prev + data.emoji);
    setIsShowEmoji(false);
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
          <Card sx={{ p: 0 }}>
            <Box display="flex" justifyContent="space-between">
              <Typography alignSelf="center" component="h1" variant="h5">
                Chat
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onChange={(e) => setIsAutoscrollEnabled(e.target.checked)}
                  />
                }
                label="Autoscroll"
              />
              <Box textAlign="center">
                <Button
                  onClick={() => {
                    (socket as Socket).disconnect();
                    signOut({ redirect: false });
                    router.push("/auth/credentials-signin");
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>
        <Card sx={{ m: 1 }}>
          <MessagesContainerGrid>
            <Box>
              <Typography
                component="h2"
                variant="h6"
                sx={{ textAlign: "inherit", p: 0 }}
              >
                Online users
              </Typography>
              <OnlineUserList onlineUsers={onlineUsers} />
            </Box>
            <Box
              ref={ref}
              sx={{ overflowY: "scroll" }}
              display="flex"
              flexDirection="column"
            >
              {session &&
                messages.map((message) => (
                  <Message
                    key={message.id}
                    isMe={
                      (session!.user as { email: string })!.email ===
                      message.email
                    }
                    email={message.email}
                    side={
                      (session!.user as { email: string })!.email ===
                      message.email
                        ? "right"
                        : "left"
                    }
                    text={message.text}
                  />
                ))}
            </Box>
            <TypingList typers={typers} />
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
                onClick={() => setIsShowEmoji((prev) => !prev)}
                variant="contained"
                fullWidth={true}
                sx={{ m: 0, mb: 1 }}
              >
                😀
              </Button>
              <EmojiToggler isShowEmoji={isShowEmoji}>
                <NoSSREmojiPicker onEmojiClick={handleEmojiClick} />
              </EmojiToggler>
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
