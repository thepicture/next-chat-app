import { Typography } from "@mui/material";
import React from "react";

export interface OnlineUserListProps {
  onlineUsers: string[];
}

const OnlineUserList = ({ onlineUsers }: OnlineUserListProps) => {
  return (
    <div>
      {onlineUsers.map((onlineUser) => (
        <Typography key={onlineUser} sx={{ textAlign: "inherit", p: 0 }}>
          {onlineUser}
        </Typography>
      ))}
    </div>
  );
};

export default OnlineUserList;
