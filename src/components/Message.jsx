import userEvent from "@testing-library/user-event";
import { deleteDoc, doc } from "firebase/firestore";
import moment from "moment/moment";
import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const deleteMessageMenu = (e, id) => {
    if (e.detail === 2) {
      deleteDoc(doc(db , 'userChats' , ))
    }
  };

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="message-info">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span className="sent-time">
          {message.timestamp
            ? moment(message.timestamp.toDate().getTime()).format("LT")
            : "..."}
        </span>
      </div>
      <div
        className="message-content"
        onClick={(event) => deleteMessageMenu(event, message.id)}
      >
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}
        {message.location && (
          <p>
            {" "}
            <a href={message.location}>Location</a>{" "}
          </p>
        )}
      </div>
    </div>
  );
};

export default Message;
