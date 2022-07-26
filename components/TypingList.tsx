import React from "react";

export interface TypingListProps {
  typers: string[];
}

const TypingList = ({ typers }: TypingListProps) => {
  return (
    <div>
      {typers.map((typer) => (
        <p key={typer}>{typer} is typing...</p>
      ))}
    </div>
  );
};

export default TypingList;
