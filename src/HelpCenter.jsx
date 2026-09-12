import React from "react";
import "./HelpCenter.css";

function HelpCenter() {
  return (
    <div className="help-container">
      <h2>Help Center</h2>
      <p className="help-intro">
        Welcome to the Employee Attendance Management System Help Center.
        Follow the guides below to use the system correctly.
      </p>

      <div className="help-card">
        <h3>📌 How to Mark Attendance</h3>
        <ul>
          <li>Open the Mark Attendance menu.</li>
          <li>Click Check In when you arrive at work.</li>
          <li>The system will record your arrival time automatically.</li>
          <li>Click Check Out before leaving work.</li>
          <li>Ensure you have an active internet connection.</li>
        </ul>
      </div>

      <div className="help-card">
        <h3>📊 How to View Attendance Records</h3>
        <ul>
          <li>Open the View Attendance menu.</li>
          <li>Check your attendance history.</li>
          <li>View check-in and check-out times.</li>
          <li>Monitor your attendance performance.</li>
        </ul>
      </div>

      <div className="help-card">
        <h3>👤 How to Update Profile</h3>
        <ul>
          <li>Open My Profile.</li>
          <li>Review your personal information.</li>
          <li>Update details if editing is allowed.</li>
          <li>Save changes before leaving the page.</li>
        </ul>
      </div>

      <div className="help-card">
        <h3>⚠ Common Issues</h3>
        <p><strong>Cannot mark attendance?</strong></p>
        <ul>
          <li>Check your internet connection.</li>
          <li>Refresh the page.</li>
          <li>Login again if necessary.</li>
        </ul>

        <p><strong>Attendance record not showing?</strong></p>
        <ul>
          <li>Refresh the page.</li>
          <li>Check View Attendance again.</li>
          <li>Contact the Administrator.</li>
        </ul>
      </div>

      <div className="help-card">
        <h3>📞 Contact Administrator</h3>
        <p>Email: admin@alihsan.ac.tz</p>
        <p>Phone: +255 XXX XXX XXX</p>
      </div>
    </div>
  );
}

export default HelpCenter;