import React, { useState } from "react";
import "./AdminDashboard.css";
import AdminHelpCenter from "./AdminHelpCenter";

function AdminDashboard({ admin }) {

  // =========================
  // GENERAL STATES
  // =========================

  const [activeMenu, setActiveMenu] = useState("Home");
  const [adminPhoto, setAdminPhoto] = useState(null);

  // =========================
  // EMPLOYEE STATES
  // =========================

  const [employeeForm, setEmployeeForm] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    hireDate: "",
  });

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // =========================
  // MENU ITEMS
  // =========================

  const menuItems = [
    { name: "Home", icon: "🏠" },
    { name: "View Employees Attendance", icon: "👥" },
    { name: "Manage Employee", icon: "👤" },
    { name: "Settings", icon: "⚙️" },
    { name: "Help Center", icon: "❓" },
  ];

  // =========================
  // ADMIN INFORMATION
  // =========================

  const adminName =
    admin?.fullName ||
    admin?.username ||
    "Administrator";

  const adminEmail =
    admin?.email ||
    "Not provided";

  const adminPhone =
    admin?.phone ||
    "Not provided";

  const adminPosition =
    admin?.position ||
    "Administrator";

  // =========================
  // ADMIN PHOTO UPLOAD
  // =========================

  const handlePhotoUpload = (event) => {

    const file = event.target.files[0];

    if (file) {

      const imageUrl = URL.createObjectURL(file);

      setAdminPhoto(imageUrl);
    }
  };

  // =========================
  // EMPLOYEE FORM CHANGE
  // =========================

  const handleEmployeeChange = (event) => {

    const { name, value } = event.target;

    setEmployeeForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // REGISTER EMPLOYEE
  // =========================

  const handleEmployeeSubmit = (event) => {

    event.preventDefault();

    // Check required fields
    if (
      !employeeForm.employeeId ||
      !employeeForm.firstName ||
      !employeeForm.lastName ||
      !employeeForm.email ||
      !employeeForm.phone ||
      !employeeForm.department ||
      !employeeForm.position ||
      !employeeForm.hireDate
    ) {

      alert("Please fill in all required fields.");

      return;
    }

    // Create new employee
    const newEmployee = {
      id: Date.now(),
      ...employeeForm,
    };

    // Add employee to list
    setEmployees((previous) => [
      ...previous,
      newEmployee,
    ]);

    // Clear form
    setEmployeeForm({
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      hireDate: "",
    });

    alert("Employee registered successfully!");
  };

  // =========================
  // SEARCH EMPLOYEES
  // =========================

  const filteredEmployees = employees.filter((employee) => {

    const search = searchTerm.toLowerCase();

    return (
      employee.employeeId
        .toLowerCase()
        .includes(search) ||

      employee.firstName
        .toLowerCase()
        .includes(search) ||

      employee.lastName
        .toLowerCase()
        .includes(search) ||

      employee.department
        .toLowerCase()
        .includes(search) ||

      employee.position
        .toLowerCase()
        .includes(search)
    );
  });

  // =========================
  // INPUT STYLE
  // =========================

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginTop: "6px",
    boxSizing: "border-box",
    fontSize: "14px",
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.clear();

    window.location.href = "/";
  };

  // =========================
  // RETURN
  // =========================

  return (

    <div className="admin-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="admin-sidebar">

        {/* SCHOOL LOGO */}

        <div className="school-logo">

          <img
            src="/LOGO.JPG"
            alt="School Logo"
            className="sidebar-logo"
          />

          <div>

            <h2>AL-IHSAN</h2>

            <p>
              GIRLS SECONDARY SCHOOL
            </p>

          </div>

        </div>


        <div className="sidebar-line"></div>


        {/* MENU */}

        <nav className="admin-menu">

          {menuItems.map((item) => (

            <button
              key={item.name}
              className={`menu-item ${
                activeMenu === item.name
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveMenu(item.name)
              }
            >

              <span className="menu-icon">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </button>

          ))}

        </nav>


        {/* LOGOUT */}

        <button
          className="logout-button"
          onClick={handleLogout}
        >

          <span>🚪</span>

          <span>
            Logout
          </span>

        </button>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="admin-main">


        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <div className="top-bar">

          <div>

            <h1>
              Administrator Dashboard
            </h1>

            <p>
              Manage and monitor the employee
              attendance system.
            </p>

          </div>


          {/* SMALL ADMIN PROFILE */}

          <div className="admin-small-profile">

            {adminPhoto ? (

              <img
                src={adminPhoto}
                alt="Administrator"
                className="small-profile-image uploaded-small-image"
              />

            ) : (

              <div className="small-profile-image">

                {adminName
                  .substring(0, 2)
                  .toUpperCase()}

              </div>

            )}

            <div>

              <strong>
                {adminName}
              </strong>

              <span>
                {adminPosition}
              </span>

            </div>

          </div>

        </div>


        {/* =====================================================
            HOME
        ===================================================== */}

        {activeMenu === "Home" && (

          <section className="home-section">

            {/* WELCOME */}

            <div className="welcome-card">

              <div>

                <h2>
                  Welcome back, {adminName}! 👋
                </h2>

                <p>
                  Welcome to the Al-Ihsan Girls
                  Secondary School Employee
                  Attendance Management System.
                </p>

              </div>

            </div>


            {/* PROFILE */}

            <div className="profile-card">

              <div className="profile-header">

                <div>

                  <h2>
                    Administrator Profile
                  </h2>

                  <p>
                    Your personal information
                  </p>

                </div>

              </div>


              <div className="profile-content">


                {/* PHOTO */}

                <div className="admin-photo-container">

                  <div className="admin-photo-wrapper">

                    {adminPhoto ? (

                      <img
                        src={adminPhoto}
                        alt="Administrator"
                        className="admin-photo uploaded-admin-photo"
                      />

                    ) : (

                      <div className="admin-photo">

                        {adminName
                          .substring(0, 2)
                          .toUpperCase()}

                      </div>

                    )}

                  </div>


                  <h3>
                    {adminName}
                  </h3>

                  <p>
                    {adminPosition}
                  </p>


                  <label
                    htmlFor="admin-photo-upload"
                    className="upload-photo-button"
                  >
                    📷 Upload Photo
                  </label>


                  <input
                    id="admin-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    hidden
                  />

                </div>


                {/* INFORMATION */}

                <div className="admin-information">

                  <div className="information-item">

                    <span className="information-label">
                      Full Name
                    </span>

                    <strong>
                      {adminName}
                    </strong>

                  </div>


                  <div className="information-item">

                    <span className="information-label">
                      Position
                    </span>

                    <strong>
                      {adminPosition}
                    </strong>

                  </div>


                  <div className="information-item">

                    <span className="information-label">
                      Contact
                    </span>

                    <strong>
                      {adminPhone}
                    </strong>

                  </div>


                  <div className="information-item">

                    <span className="information-label">
                      Email
                    </span>

                    <strong>
                      {adminEmail}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </section>

        )}


        {/* =====================================================
            VIEW EMPLOYEES ATTENDANCE
        ===================================================== */}

        {activeMenu === "View Employees Attendance" && (

          <div
            className="view-attendance-container"
            style={{ padding: "20px" }}
          >

            <div
              style={{
                marginBottom: "20px",
              }}
            >

              <h2>
                View Employees Attendance
              </h2>

              <p
                style={{
                  color: "#666",
                }}
              >
                Administrator can view and monitor
                employee attendance records here.
              </p>

            </div>


            {/* SUMMARY CARDS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "15px",
                marginBottom: "25px",
              }}
            >

              <div
                style={{
                  background: "#e3f2fd",
                  padding: "20px",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >

                <h4>
                  Total Employees
                </h4>

                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                >
                  {employees.length}
                </span>

              </div>


              <div
                style={{
                  background: "#e8f5e9",
                  padding: "20px",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >

                <h4>
                  Present Today
                </h4>

                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                >
                  0
                </span>

              </div>


              <div
                style={{
                  background: "#fffde7",
                  padding: "20px",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >

                <h4>
                  Late Today
                </h4>

                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                >
                  0
                </span>

              </div>


              <div
                style={{
                  background: "#ffebee",
                  padding: "20px",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >

                <h4>
                  Absent Today
                </h4>

                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                >
                  0
                </span>

              </div>

            </div>


            {/* WEEKLY REPORT */}

            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                marginBottom: "25px",
              }}
            >

              <h3>
                Overall Employees Weekly Report
              </h3>

              <div
                style={{
                  height: "180px",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-around",
                  borderBottom: "2px solid #333",
                  borderLeft: "2px solid #333",
                  marginTop: "20px",
                }}
              >

                {[
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                ].map((day) => (

                  <div
                    key={day}
                    style={{
                      textAlign: "center",
                    }}
                  >

                    <div
                      style={{
                        width: "35px",
                        height: "0px",
                      }}
                    ></div>

                    <strong>
                      {day}
                    </strong>

                  </div>

                ))}

              </div>

              <p
                style={{
                  textAlign: "center",
                  color: "#999",
                }}
              >
                No weekly attendance data available
                yet.
              </p>

            </div>


            {/* ATTENDANCE TABLE */}

            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                overflowX: "auto",
              }}
            >

              <h3>
                Daily Attendance Records
              </h3>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "15px",
                }}
              >

                <thead>

                  <tr
                    style={{
                      background: "#f5f5f5",
                    }}
                  >

                    <th>Date</th>
                    <th>Picture</th>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Position</th>
                    <th>Sign In</th>
                    <th>Sign Out</th>
                    <th>Status</th>

                  </tr>

                </thead>


                <tbody>

                  <tr>

                    <td
                      colSpan="8"
                      style={{
                        textAlign: "center",
                        padding: "35px",
                        color: "#888",
                      }}
                    >

                      📂

                      <br />

                      No attendance records found.

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        )}


        {/* =====================================================
            MANAGE EMPLOYEE
        ===================================================== */}

        {activeMenu === "Manage Employee" && (

          <div
            className="manage-employee-container"
            style={{
              padding: "20px",
              maxWidth: "1200px",
            }}
          >

            {/* PAGE HEADER */}

            <div
              style={{
                marginBottom: "25px",
              }}
            >

              <h2
                style={{
                  color: "#1b4332",
                  marginBottom: "5px",
                }}
              >
                Employee Management
              </h2>

              <p
                style={{
                  color: "#666",
                }}
              >
                Register new employees and manage
                staff records.
              </p>

            </div>


            {/* =================================================
                REGISTER EMPLOYEE FORM
            ================================================= */}

            <div
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "30px",
                border: "1px solid #ddd",
              }}
            >

              <h2
                style={{
                  textAlign: "center",
                  marginBottom: "8px",
                  color: "#1b4332",
                }}
              >
                Register Employee
              </h2>

              <p
                style={{
                  textAlign: "center",
                  color: "#777",
                  marginBottom: "30px",
                }}
              >
                Enter employee information below
              </p>


              <form
                onSubmit={handleEmployeeSubmit}
              >

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, 1fr)",
                    gap: "20px",
                  }}
                >

                  {/* EMPLOYEE ID */}

                  <div>

                    <label>
                      Employee ID *
                    </label>

                    <input
                      type="text"
                      name="employeeId"
                      value={
                        employeeForm.employeeId
                      }
                      onChange={
                        handleEmployeeChange
                      }
                      placeholder="e.g. AGS001"
                      style={inputStyle}
                    />

                  </div>


                  {/* FIRST NAME */}

                  <div>

                    <label>
                      First Name *
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={
                        employeeForm.firstName
                      }
                      onChange={
                        handleEmployeeChange
                      }
                      placeholder="Enter first name"
                      style={inputStyle}
                    />

                  </div>


                  {/* LAST NAME */}

                  <div>

                    <label>
                      Last Name *
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={
                        employeeForm.lastName
                      }
                      onChange={
                        handleEmployeeChange
                      }
                      placeholder="Enter last name"
                      style={inputStyle}
                    />

                  </div>


                  {/* EMAIL */}

                  <div>

                    <label>
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={
                        employeeForm.email
                      }
                      onChange={
                        handleEmployeeChange
                      }
                      placeholder="employee@email.com"
                      style={inputStyle}
                    />

                  </div>


                  {/* PHONE */}

                  <div>

                    <label>
                      Phone Number *
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={
                        employeeForm.phone
                      }
                      onChange={
                        handleEmployeeChange
                      }
                      placeholder="+255..."
                      style={inputStyle}
                    />

                  </div>


                  {/* DEPARTMENT */}

                  <div>

                    <label>
                      Department *
                    </label>

                    <select
                      name="department"
                      value={
                        employeeForm.department
                      }
                      onChange={
                        handleEmployeeChange
                      }
                      style={inputStyle}
                    >

                      <option value="">
                        Select department
                      </option>

                      <option value="Teaching">
                        Teaching
                      </option>

                      <option value="Administration">
                        Administration
                      </option>

                      <option value="Finance">
                        Finance
                      </option>

                      <option value="ICT">
                        ICT
                      </option>

                      <option value="Human Resources">
                        Human Resources
                      </option>

                    </select>

                  </div>


                  {/* POSITION */}

                  <div>

                    <label>
                      Position *
                    </label>

                    <input
                      type="text"
                      name="position"
                      value={
                        employeeForm.position
                      }
                      onChange={
                        handleEmployeeChange
                      }
                      placeholder="e.g. Teacher"
                      style={inputStyle}
                    />

                  </div>


                  {/* HIRE DATE */}

                  <div>

                    <label>
                      Hire Date *
                    </label>

                    <input
                      type="date"
                      name="hireDate"
                      value={
                        employeeForm.hireDate
                      }
                      onChange={
                        handleEmployeeChange
                      }
                      style={inputStyle}
                    />

                  </div>

                </div>


                {/* SUBMIT BUTTON */}

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    marginTop: "30px",
                    background: "#2d7d46",
                    color: "#fff",
                    border: "none",
                    padding: "15px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "15px",
                  }}
                >

                  Register Employee

                </button>

              </form>

            </div>


            {/* =================================================
                EMPLOYEE DIRECTORY
            ================================================= */}

            <div
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "12px",
                border: "1px solid #ddd",
              }}
            >

              <h3
                style={{
                  color: "#1b4332",
                  marginBottom: "15px",
                }}
              >
                Employee Directory
              </h3>


              {/* SEARCH */}

              <input
                type="text"
                placeholder="Search by Name, ID, Department or Position..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />


              {/* TABLE */}

              <div
                style={{
                  overflowX: "auto",
                }}
              >

                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                  }}
                >

                  <thead>

                    <tr
                      style={{
                        background:
                          "#f5f5f5",
                      }}
                    >

                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                        }}
                      >
                        ID
                      </th>

                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                        }}
                      >
                        First Name
                      </th>

                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                        }}
                      >
                        Last Name
                      </th>

                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                        }}
                      >
                        Email
                      </th>

                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                        }}
                      >
                        Phone
                      </th>

                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                        }}
                      >
                        Department
                      </th>

                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                        }}
                      >
                        Position
                      </th>

                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                        }}
                      >
                        Hire Date
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredEmployees.length > 0 ? (

                      filteredEmployees.map(
                        (employee) => (

                          <tr
                            key={
                              employee.id
                            }
                            style={{
                              borderBottom:
                                "1px solid #eee",
                            }}
                          >

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {
                                employee.employeeId
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {
                                employee.firstName
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {
                                employee.lastName
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {
                                employee.email
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {
                                employee.phone
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {
                                employee.department
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {
                                employee.position
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {
                                employee.hireDate
                              }
                            </td>

                          </tr>

                        )
                      )

                    ) : (

                      <tr>

                        <td
                          colSpan="8"
                          style={{
                            textAlign:
                              "center",
                            padding:
                              "30px",
                            color:
                              "#888",
                          }}
                        >

                          👤

                          <br />

                          No employee records found.

                          <br />

                          <small>
                            Register an employee
                            using the form above.
                          </small>

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        )}


        {/* =====================================================
            SETTINGS
        ===================================================== */}

        {activeMenu === "Settings" && (

          <div
            className="settings-container"
            style={{
              padding: "20px",
              maxWidth: "900px",
            }}
          >

            <div
              style={{
                marginBottom: "25px",
              }}
            >

              <h2
                style={{
                  color: "#1b4332",
                }}
              >
                System & Profile Settings
              </h2>

              <p
                style={{
                  color: "#666",
                }}
              >
                Configure system rules, update
                administrator profile, and manage
                security settings.
              </p>

            </div>


            {/* ADMIN PROFILE */}

            <div
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                marginBottom: "20px",
              }}
            >

              <h3>
                👤 Administrator Profile
              </h3>

              <p
                style={{
                  color: "#777",
                }}
              >
                Update administrator profile
                information.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "15px",
                }}
              >

                <div>

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    defaultValue={adminName}
                    style={inputStyle}
                  />

                </div>


                <div>

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    defaultValue={adminEmail}
                    style={inputStyle}
                  />

                </div>


                <div>

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="text"
                    defaultValue={adminPhone}
                    style={inputStyle}
                  />

                </div>


                <div>

                  <label>
                    Role
                  </label>

                  <input
                    type="text"
                    value="Administrator"
                    disabled
                    style={{
                      ...inputStyle,
                      background:
                        "#f5f5f5",
                    }}
                  />

                </div>

              </div>

            </div>


            {/* ATTENDANCE RULES */}

            <div
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                marginBottom: "20px",
              }}
            >

              <h3>
                ⏰ Attendance & Work Time Rules
              </h3>

              <p
                style={{
                  color: "#777",
                }}
              >
                Set official arrival and departure
                times.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "15px",
                }}
              >

                <div>

                  <label>
                    Official Arrival Time
                  </label>

                  <input
                    type="time"
                    style={inputStyle}
                  />

                </div>


                <div>

                  <label>
                    Official Departure Time
                  </label>

                  <input
                    type="time"
                    style={inputStyle}
                  />

                </div>

              </div>

            </div>


            {/* SECURITY */}

            <div
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                marginBottom: "20px",
              }}
            >

              <h3>
                🔒 Security & Change Password
              </h3>

              <p
                style={{
                  color: "#777",
                }}
              >
                Change administrator password.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr 1fr",
                  gap: "15px",
                }}
              >

                <input
                  type="password"
                  placeholder="Current Password"
                  style={inputStyle}
                />

                <input
                  type="password"
                  placeholder="New Password"
                  style={inputStyle}
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  style={inputStyle}
                />

              </div>

            </div>


            <div
              style={{
                textAlign: "right",
              }}
            >

              <button
                style={{
                  background: "#1b4332",
                  color: "#fff",
                  padding:
                    "12px 25px",
                  border: "none",
                  borderRadius:
                    "7px",
                  fontWeight:
                    "bold",
                  cursor:
                    "pointer",
                }}
                onClick={() =>
                  alert(
                    "Settings saved successfully!"
                  )
                }
              >
                Save Changes
              </button>

            </div>

          </div>

        )}


        {/* =====================================================
            HELP CENTER
        ===================================================== */}

        {activeMenu === "Help Center" && (

          <AdminHelpCenter />

        )}

      </main>

    </div>
  );
}

export default AdminDashboard;