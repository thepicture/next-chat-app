import { Typography } from "@mui/material";
import React from "react";

export interface OnlineUserListProps {
  onlineUsers: string[];
}

const OnlineUserList = ({ onlineUsers }: OnlineUserListProps) => {
  return (
    <div>
      {onlineUsers.map((onlineUser) => (
        <Typography
          key={onlineUser}
          component="h3"
          variant="h6"
          sx={{ textAlign: "inherit", pt: 0 }}
        >
          {onlineUser}
        </Typography>
      ))}
    </div>
  );
};

export default OnlineUserList;
