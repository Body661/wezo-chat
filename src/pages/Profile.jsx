import { async } from "@firebase/util";
import { Box, Button, Modal, Typography } from "@mui/material";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { auth, db, storage } from "../firebase";
import updateImg from "../img/addAvatar.png";
import back from "../img/back.svg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [err, setErr] = useState(false);
  const [Show, setShow] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const [openConfirmReset, setOpenConfirmReset] = useState(false);
  const handleCloseConfirmReset = () => setOpenConfirmReset(false);

  const passwordRef = useRef();
  const fileRef = useRef();

  const navigate = useNavigate();

  // const handleNameChange = () => {
  //   updateProfile(currentUser, {
  //     displayName: "Ahmed",
  //   })
  //     .then(() => {
  //       console.log("Profile updated successfully ");
  //     })
  //     .catch((error) => {
  //       console.log(error.message);
  //     });
  // };

  const checkFile = () => {
    if (!fileRef.current.files[0]) {
      return;
    }

    setShow(true);
  };

  const handleDelete = () => {
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      passwordRef.current.value
    );
    reauthenticateWithCredential(currentUser, credential)
      .then(() => {
        deleteUser(currentUser);
        deleteDoc(doc(db, "users", currentUser.uid));
        deleteDoc(doc(db, "userChats", currentUser.uid));
        deleteObject(ref(storage, currentUser.email));
      })
      .catch((err) => {
        setErr(true);
      });
  };

  const onFileChange = (e) => {
    if (fileRef.current.files[0]) {
      setShow(true);
    }
  };

  const handleSubmitUpdate = async () => {
    const storageRef = ref(storage, currentUser.email);

    let uploadTask = uploadBytesResumable(storageRef, fileRef.current.files[0]);
    await uploadTask.on(
      (error) => {
        setErr(true);
      },
      async () => {
        await getDownloadURL(storageRef).then(async (downloadURL) => {
          await updateProfile(currentUser, {
            photoURL: downloadURL,
          });
        });
      }
    );
    window.location.reload(true);
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      setOpenConfirmReset(true);
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="profile">
      <button onClick={() => navigate("/")} className="return">
        <img src={back} alt="" />
      </button>
      <h1>Your Profile </h1>
      <div className="imgDiv">
        <img src={currentUser.photoURL} alt="" className="profileImg" />
        <input
          type="file"
          id="uploadImg"
          style={{ display: "none" }}
          onChange={onFileChange}
          ref={fileRef}
        />
        <label htmlFor="uploadImg" style={{ display: "none" }}>
          <img src={updateImg} alt="" />
        </label>
      </div>
      {/* <input
        type="file"
        placeholder=""
        id="updateProfileImg"
        style={{ display: "none" }}
      />
      <label htmlFor="updateProfileImg">
        <img src={updateImg} alt="" />
        <span>Update Profile Image</span>
      </label> */}
      <div className="info">
        <div className="name">
          <span>Your Name:</span>
          <div>
            <p>{currentUser.displayName}</p>
            {/* <EditIcon onClick={handleNameChange} /> */}
          </div>
        </div>
        <div className="email">
          <span>Your Email:</span>
          <p>{currentUser.email}</p>
        </div>
      </div>

      {Show && <Button onClick={handleSubmitUpdate}>Update avatar</Button>}

      <div className="account-del-pass">
        <Button onClick={resetPassword} className="reset-password">
          Reset Password
        </Button>

        <Button onClick={handleOpen} className="delete-account">
          DELETE ACCOUNT
        </Button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to permanently delete your account?
          </Typography>

          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            style={{ textAlign: "end" }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => {
                handleOpenConfirm();
                handleClose();
              }}
              className="delete-account-button"
              style={{ color: "red" }}
            >
              DELETE
            </Button>
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Type your password to confirm!
          </Typography>

          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            style={{ textAlign: "end" }}
          >
            <input
              type="password"
              placeholder="Password"
              className="input-pass-confirm"
              ref={passwordRef}
            />
            <Button onClick={handleCloseConfirm}>Cancel</Button>
            <Button
              onClick={handleDelete}
              className="delete-account-button"
              style={{ color: "red" }}
            >
              DELETE
            </Button>
            {err && <p className="err-msg">Something went wrong</p>}
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openConfirmReset}
        onClose={handleCloseConfirmReset}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Reset email sent successfully to your email! Please check your inbox
            or spam folder
          </Typography>

          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            style={{ textAlign: "end" }}
          >
            <Button onClick={handleCloseConfirmReset}>Close</Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Profile;
