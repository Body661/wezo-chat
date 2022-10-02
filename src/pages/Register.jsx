import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

function Register() {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    if (!file) {
      setErr(true);
    }

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const storageRef = ref(storage, email);

      let uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        (error) => {
          setErr(true);
        },
        () => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            await updateProfile(response.user, {
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", response.user.uid), {
              uid: response.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", response.user.uid), {});

            navigate("/");

            emailjs
              .sendForm(
                process.env.REACT_APP_EMAILJS,
                process.env.REACT_APP_EMAILJS_TEMP,
                e.target,
                "uppYeAUB5jgSHJ0o-"
              )
              .then(
                (result) => {
                  console.log(result.text);
                },
                (error) => {
                  console.log(error.text);
                }
              );
          });
        }
      );
    } catch (e) {
      setErr(true);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <span className="logo">Wezo chat</span>
        <span className="titl">Register</span>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Display name" name="name" required />
          <input type="email" placeholder="email" name="email" required />
          <input type="password" placeholder="password" required />
          <input type="file" id="file" style={{ display: "none " }} required />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
          {err && <p className="err-msg">Something went wrong</p>}
        </form>
        <p>
          Do you have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
