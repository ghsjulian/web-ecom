import React, { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/admin-login.css";
import useAuth from "../store/useAuth";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
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
    if (email.trim() === "") {
      showMessage("Email Address Is Required", false);
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage("Invalid Email Format", false);
      return false;
    }
    return true;
  };
  const handleReset = async (e) => {
    e.preventDefault();
    if (!isValid()) return;
    console.log("Okay...");
  };
  document.title = "Admin Password Reset | Access the admin dashboard";

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Reset Password</h1>
        <p ref={msgRef} className=""></p>
      </div>

      <form className="login-form">
        <div className="input-group">
          <input
            type="email"
            placeholder="Enter Email Address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <i className="fas fa-envelope icon"></i>
        </div>
        <button onClick={handleReset} className="login-btn">
          Reset Now
        </button>
      </form>

      <div className="login-footer">
        <p>
          <NavLink to="/admin-login">Go to login page</NavLink>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
