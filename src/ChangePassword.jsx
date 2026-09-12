import React, { useState } from "react";
import "./ChangePassword.css";

function ChangePassword({ employee }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    // Check empty fields
    if (!email || !newPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    // Check email
    if (employee?.email && email !== employee.email) {
      setMessage("The email does not match your employee account.");
      setMessageType("error");
      return;
    }

    // Check password length
    if (newPassword.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      setMessageType("error");
      return;
    }

    // Check password matching
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      setMessageType("error");
      return;
    }

    // Frontend demonstration only
    setMessage(
      "Password change request submitted successfully. Backend connection is required to save the new password."
    );
    setMessageType("success");

    // Clear password fields
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="change-password-page">
      <div className="change-password-header">
        <h2>Change Password</h2>
        <p>
          Update your account password to keep your employee account secure.
        </p>
      </div>

      <div className="change-password-card">
        <div className="password-icon">🔐</div>

        <h3>Update your password</h3>

        <p className="password-description">
          Enter your registered email address and create a new password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {message && (
            <div className={`password-message ${messageType}`}>
              {message}
            </div>
          )}

          <button type="submit" className="change-password-button">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;