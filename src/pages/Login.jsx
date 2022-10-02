import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { Button, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Login() {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCloseConfirm = () => setOpenConfirm(false);

  const emailRef = useRef("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      setErr(true);
    }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, emailRef.current.value);
      setOpenConfirm(true);
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <span className="logo">Wezo chat</span>
        <span className="titl">Login</span>

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input type="file" id="file" style={{ display: "none " }} />
          <button>Sign In</button>
          {err && <p style={{ color: "red" }}>Something went wrong</p>}
        </form>
        <button onClick={handleOpen} className="forgot-pass">
          Forgot password?
        </button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Enter your email and you will receive a link to reset your
              password:
            </Typography>

            <Typography
              id="modal-modal-description"
              sx={{ mt: 2 }}
              style={{ textAlign: "end" }}
            >
              <input type="text" placeholder="Type Your Email" ref={emailRef} />
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={resetPassword}>Send email</Button>
              {err && <p className="err-msg">Something went wrong</p>}
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
              Reset email sent successfully to your email! Please check your inbox or spam folder
            </Typography>

            <Typography
              id="modal-modal-description"
              sx={{ mt: 2 }}
              style={{ textAlign: "end" }}
            >
              <Button onClick={handleCloseConfirm}>Close</Button>
            </Typography>
          </Box>
        </Modal>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
