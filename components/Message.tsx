import { Box, Typography } from "@mui/material";
import React from "react";
import stc from "string-to-color";

export interface MessageProps {
  email: string;
  side: "left" | "right";
  text: string;
  isMe: boolean;
}

const Message = ({ email, side, text, isMe }: MessageProps) => {
  return (
    <Box width="100%">
      <Box
        sx={{
          background: stc(email) + "50",
          borderRadius: "2em",
          color: "black",
          width: "50%",
          marginBottom: "1em",
          position: "relative",
          float: side,
          right: 0,
        }}
      >
        <Typography
          component="p"
          sx={{
            wordWrap: "break-word",
          }}
        >
          {text}
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            bottom: 0,
            fontSize: ".8em",
            marginBottom: "-1em",
            right: 0,
            opacity: ".5",
          }}
        >
          {isMe ? "Me" : email}
        </Typography>
      </Box>
    </Box>
  );
};

export default Message;
