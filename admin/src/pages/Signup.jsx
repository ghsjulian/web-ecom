import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin-login.css";
import useAuth from "../store/useAuth";

const Signup = () => {
  const navigate = useNavigate();
  const { isSigningIn, createUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const msgRef = useRef(null);

  const showMessage = (msg, type) => {
    if (type) {
      msgRef.current.classList.add("success");
      msgRef.current.textContent = msg;
    } else {
      msgRef.current.classList.add("error");
      msgRef.current.textContent = msg;
    }
    setTimeout(() => {
      msgRef.current.removeAttribute("class");
      msgRef.current.textContent = "";
    }, 2500);
  };
  const isValid = () => {
    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      showMessage("Required All Fields", false);
      return false;
    } else if (password.length <= 5) {
      showMessage("Password Will Be 6 Charecters", false);
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage("Invalid Email Format", false);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) return;
    console.log("Okay...");
    await createUser({ name, email, password }, showMessage, navigate);
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Create User</h1>
        <p ref={msgRef}></p>
      </div>

      <form className="login-form">
        <div className="input-group">
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Full Name"
          />
          <i className="fas fa-envelope icon"></i>
        </div>
        <div className="input-group">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email Address"
          />
          <i className="fas fa-envelope icon"></i>
        </div>
        <div className="input-group">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
          />
          <i className="fas fa-lock icon"></i>
        </div>

        <div className="remember-me">
          <input type="checkbox" id="remember" />
          <label for="remember">Remember me</label>
        </div>

        <button
          disabled={isSigningIn}
          onClick={handleSubmit}
          className="login-btn"
        >
          Sign In
        </button>
      </form>

      <div className="login-footer">
        <p>
          <a href="/admin-login">Go to admin panel</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
