import React, { useContext, useEffect } from "react";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { useState } from "react";
import back from "../img/back.svg";

const Chat = () => {
  const [show, setShow] = useState(false);
  const { data } = useContext(ChatContext);

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  useEffect(() => {
    if (!isEmpty(data.user)) {
      setShow(true);
    }
  }, [data]);

  return (
    <div className={`chat ${show && "top"}`}>
      {show && (
        <>
          <div className="chat-info">
            <button onClick={() => setShow(false)} className="return">
              <img src={back} alt="" />
            </button>
            <span>{data.user?.displayName}</span>
            <div className="chat-icons">
              <img src={More} alt="" />
            </div>
          </div>
          <Messages />
          <Input />
        </>
      )}
    </div>
  );
};

export default Chat;
