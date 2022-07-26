import React from "react";

export interface OnlineUserListProps {
  onlineUsers: string[];
}

const OnlineUserList = ({ onlineUsers }: OnlineUserListProps) => {
  return (
    <div>
      {onlineUsers.map((onlineUser) => (
        <p key={onlineUser}>{onlineUser}</p>
      ))}
    </div>
  );
};

export default OnlineUserList;
