import { Box, Typography } from "@mui/material";
import React from "react";
import stc from "string-to-color";

export interface MessageProps {
  username: string;
  side: "left" | "right";
  text: string;
}

const Message = ({ username, side, text }: MessageProps) => {
  return (
    <Box width="100%">
      <Box
        sx={{
          background: stc(username) + "50",
          borderRadius: "2em",
          color: "black",
          margin: "1em",
          width: "50%",
          position: "relative",
          float: side,
          right: 0,
        }}
      >
        <Typography component="p">{text}</Typography>
        <Typography
          sx={{
            position: "absolute",
            bottom: 0,
            fontSize: ".8em",
            marginBottom: "-1em",
            right: 0,
            opacity: ".9",
          }}
        >
          {username}
        </Typography>
      </Box>
    </Box>
  );
};

export default Message;
