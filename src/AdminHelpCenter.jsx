import React from "react";
import "./AdminHelpCenter.css";

function AdminHelpCenter() {
  return (
    <div className="help-container">
      <h2>Administrator Help Center</h2>

      <div className="help-section">
        <h3>🏠 Home Dashboard</h3>
        <p>
          Home Dashboard shows your personal information,
          profile picture and system summary. Use this page
          to quickly monitor system activities.
        </p>
      </div>

      <div className="help-section">
        <h3>📋 View Attendance</h3>
        <p>
          This section allows you to view attendance records
          of all employees. You can monitor check-in time,
          check-out time, absentees and late arrivals.
        </p>
      </div>

      <div className="help-section">
        <h3>👥 Manage Employee</h3>
        <p>
          To register a new employee, click the Add Employee
          button and fill in all required information.
        </p>

        <ul>
          <li>Enter employee details.</li>
          <li>Save the information.</li>
          <li>Edit employee information if needed.</li>
          <li>Delete employee records when necessary.</li>
        </ul>
      </div>

      <div className="help-section">
        <h3>⚙ Settings</h3>
        <p>
          Use Settings to manage your administrator account.
        </p>

        <ul>
          <li>Update profile information.</li>
          <li>Change profile picture.</li>
          <li>Change password.</li>
          <li>Set working start time.</li>
          <li>Set working end time.</li>
        </ul>
      </div>

      <div className="help-section">
        <h3>🚪 Logout</h3>
        <p>
          Click Logout when you finish using the system.
          This helps keep your account secure.
        </p>
      </div>

      <div className="help-note">
        <h3>Need Assistance?</h3>
        <p>
          If you experience any issue while using the system,
          contact the system administrator or technical support.
        </p>
      </div>
    </div>
  );
}

export default AdminHelpCenter;