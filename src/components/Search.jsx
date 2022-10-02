import React, { useContext, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsrname] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    if (username !== currentUser.email) {
      const q = query(collection(db, "users"), where("email", "==", username));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } catch (err) {
        setErr(true);
      }
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    const cominedID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", cominedID));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", cominedID), { messages: [] });
      }

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [cominedID + ".userInfo"]: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        [cominedID + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userChats", user.uid), {
        [cominedID + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [cominedID + ".date"]: serverTimestamp(),
      });
    } catch (err) {
      setErr(true);
    }

    setUser(null);
    setUsrname("");
  };

  return (
    <div className="search">
      <div className="search-form">
        <input
          type="text"
          placeholder="Find a user by email"
          onChange={(e) => {
            setUsrname(e.target.value);
          }}
          onKeyDown={handleKey}
          value={username}
          style={{ width: "100%" }}
        />
      </div>
      {err && <p className="err-msg">Something went wrong</p>}
      {user && (
        <div className="user-chat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="user-chat-info">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
