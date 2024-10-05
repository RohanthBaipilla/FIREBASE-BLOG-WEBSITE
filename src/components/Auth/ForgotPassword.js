// src/components/Auth/ForgotPassword.js
import React, { useState } from "react";
import { auth } from "../../firebaseConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    try {
      await auth.sendPasswordResetEmail(email);
      setMessage("Password reset email sent.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button onClick={handleForgotPassword}>Reset Password</button>
      <p>{message}</p>
    </div>
  );
};

export default ForgotPassword;
