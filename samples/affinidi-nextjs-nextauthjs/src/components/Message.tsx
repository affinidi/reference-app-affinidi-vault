import React from "react";
import { MessagePayload } from "src/types/types";

const Message: React.FC<{ payload: MessagePayload }> = ({ payload }) => {
  const { message: text, type } = payload;

  let messageClass = "";
  switch (type) {
    case "success":
      messageClass = "bg-green-100 text-green-700";
      break;
    case "error":
      messageClass = "bg-red-100 text-red-700";
      break;
    default:
      break;
  }

  return (
    <div className={`p-4 rounded-md ${messageClass}`}>
      <p id="messageText">{text}</p>
    </div>
  );
};

export default Message;
