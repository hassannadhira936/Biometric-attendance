import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import AdminHelpCenter from "./AdminHelpCenter";

function AdminDashboard({ admin }) {

  // =====================================================
  // GENERAL STATES
  // =====================================================

  const [activeMenu, setActiveMenu] = useState("Home");
  const [adminPhoto, setAdminPhoto] = useState(null);

  // =====================================================
  // EMPLOYEE STATES
  // =====================================================

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

  // =====================================================
  // ATTENDANCE STATES
  // =====================================================

  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [placeName, setPlaceName] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  // =====================================================
  // MENU ITEMS
  // =====================================================

  const menuItems = [
    { name: "Home", icon: "🏠" },
    { name: "View Employees Attendance", icon: "👥" },
    { name: "Manage Employee", icon: "👤" },
    { name: "Settings", icon: "⚙️" },
    { name: "Help Center", icon: "❓" },
  ];

  // =====================================================
  // ADMIN INFORMATION
  // =====================================================

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

  // =====================================================
  // LOAD DATA FROM LOCAL STORAGE
  // =====================================================

  useEffect(() => {

    // Load employees
    const savedEmployees =
      localStorage.getItem("employees");

    if (savedEmployees) {
      try {
        setEmployees(JSON.parse(savedEmployees));
      } catch (error) {
        console.error(
          "Error loading employees:",
          error
        );
      }
    }

    // Load attendance
    const savedAttendance =
      localStorage.getItem("employeeAttendance");

    if (savedAttendance) {
      try {
        const parsedAttendance =
          JSON.parse(savedAttendance);

        if (Array.isArray(parsedAttendance)) {
          setAttendanceRecords(parsedAttendance);
        }
      } catch (error) {
        console.error(
          "Error loading attendance:",
          error
        );
      }
    }

  }, []);

  // =====================================================
  // RELOAD ATTENDANCE WHEN ADMIN OPENS ATTENDANCE PAGE
  // =====================================================

  useEffect(() => {

    if (activeMenu === "View Employees Attendance") {

      const savedAttendance =
        localStorage.getItem("employeeAttendance");

      if (savedAttendance) {

        try {

          const parsedAttendance =
            JSON.parse(savedAttendance);

          if (Array.isArray(parsedAttendance)) {
            setAttendanceRecords(parsedAttendance);
          }

        } catch (error) {

          console.error(
            "Error loading attendance:",
            error
          );

        }

      } else {

        setAttendanceRecords([]);

      }

    }

  }, [activeMenu]);

  // =====================================================
  // ADMIN PHOTO UPLOAD
  // =====================================================

  const handlePhotoUpload = (event) => {

    const file = event.target.files[0];

    if (file) {

      const imageUrl =
        URL.createObjectURL(file);

      setAdminPhoto(imageUrl);
    }
  };

  // =====================================================
  // EMPLOYEE FORM CHANGE
  // =====================================================

  const handleEmployeeChange = (event) => {

    const { name, value } = event.target;

    setEmployeeForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // REGISTER EMPLOYEE
  // =====================================================

  const handleEmployeeSubmit = (event) => {

    event.preventDefault();

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

      alert(
        "Please fill in all required fields."
      );

      return;
    }

    const newEmployee = {
      id: Date.now(),
      ...employeeForm,
    };

    const updatedEmployees = [
      ...employees,
      newEmployee,
    ];

    setEmployees(updatedEmployees);

    // Save employees
    localStorage.setItem(
      "employees",
      JSON.stringify(updatedEmployees)
    );

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

    alert(
      "Employee registered successfully!"
    );
  };

  // =====================================================
  // SEARCH EMPLOYEES
  // =====================================================

  const filteredEmployees =
    employees.filter((employee) => {

      const search =
        searchTerm.toLowerCase();

      return (
        employee.employeeId
          ?.toLowerCase()
          .includes(search) ||

        employee.firstName
          ?.toLowerCase()
          .includes(search) ||

        employee.lastName
          ?.toLowerCase()
          .includes(search) ||

        employee.department
          ?.toLowerCase()
          .includes(search) ||

        employee.position
          ?.toLowerCase()
          .includes(search)
      );

    });

  // =====================================================
  // INPUT STYLE
  // =====================================================

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginTop: "6px",
    boxSizing: "border-box",
    fontSize: "14px",
  };

  // =====================================================
  // GET EMPLOYEE INFORMATION
  // =====================================================

  const getEmployeeInformation = (
    attendance
  ) => {

    const employeeId =
      attendance.employeeId ||
      attendance.id ||
      attendance.employeeID;

    const employee =
      employees.find(
        (item) =>
          String(item.employeeId) ===
            String(employeeId) ||
          String(item.id) ===
            String(employeeId)
      );

    return employee;
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {

    if (!time) {
      return "-";
    }

    return time;
  };

  // =====================================================
  // GET ATTENDANCE LOCATION
  // =====================================================

  const getAttendanceLocation = (
    attendance
  ) => {

    const latitude =
      attendance.signInLatitude ??
      attendance.latitude;

    const longitude =
      attendance.signInLongitude ??
      attendance.longitude;

    if (
      latitude === undefined ||
      latitude === null ||
      longitude === undefined ||
      longitude === null
    ) {

      return null;
    }

    return {
      latitude,
      longitude,
      signInLatitude:
        attendance.signInLatitude ??
        attendance.latitude,
      signInLongitude:
        attendance.signInLongitude ??
        attendance.longitude,
      signOutLatitude:
        attendance.signOutLatitude,
      signOutLongitude:
        attendance.signOutLongitude,
      distance:
        attendance.signInDistanceFromSchool,
      status:
        attendance.signInLocationStatus ||
        "UNKNOWN",
      signOutDistance:
        attendance.signOutDistanceFromSchool,
      signOutStatus:
        attendance.signOutLocationStatus,
    };
  };

  // =====================================================
  // REVERSE GEOCODING
  // GET PLACE NAME FROM LATITUDE + LONGITUDE
  // =====================================================

  const getPlaceName = async (
    latitude,
    longitude
  ) => {

    setLocationLoading(true);
    setPlaceName("");

    try {

      const response =
        await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );

      if (!response.ok) {
        throw new Error(
          "Unable to get location name."
        );
      }

      const data =
        await response.json();

      if (data.display_name) {

        setPlaceName(
          data.display_name
        );

      } else {

        setPlaceName(
          "Place name not available"
        );

      }

    } catch (error) {

      console.error(
        "Reverse geocoding error:",
        error
      );

      setPlaceName(
        "Unable to determine place name"
      );

    } finally {

      setLocationLoading(false);

    }
  };

  // =====================================================
  // OPEN LOCATION
  // =====================================================

  const handleViewLocation = (
    attendance
  ) => {

    const location =
      getAttendanceLocation(
        attendance
      );

    if (!location) {

      alert(
        "Location information is not available for this attendance record."
      );

      return;
    }

    const employee =
      getEmployeeInformation(
        attendance
      );

    const locationData = {
      ...location,
      attendance,
      employee,
    };

    setSelectedLocation(
      locationData
    );

    getPlaceName(
      location.latitude,
      location.longitude
    );
  };

  // =====================================================
  // CLOSE LOCATION MODAL
  // =====================================================

  const closeLocationModal = () => {

    setSelectedLocation(null);
    setPlaceName("");
  };

  // =====================================================
  // CREATE OPENSTREETMAP URL
  // =====================================================

  const getMapUrl = (
    latitude,
    longitude
  ) => {

    const zoom = 18;

    const delta = 0.002;

    const left =
      Number(longitude) - delta;

    const right =
      Number(longitude) + delta;

    const top =
      Number(latitude) + delta;

    const bottom =
      Number(latitude) - delta;

    return (
      `https://www.openstreetmap.org/export/embed.html?` +
      `bbox=${left},${bottom},${right},${top}` +
      `&layer=mapnik` +
      `&marker=${latitude},${longitude}`
    );
  };

  // =====================================================
  // ATTENDANCE SUMMARY
  // =====================================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayAttendance =
    attendanceRecords.filter(
      (attendance) =>
        attendance.date === today
    );

  const presentToday =
    todayAttendance.length;

  const lateToday =
    todayAttendance.filter(
      (attendance) =>
        attendance.status === "Late" ||
        attendance.attendanceStatus === "Late"
    ).length;

  const absentToday =
    Math.max(
      employees.length -
        presentToday,
      0
    );

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.clear();

    window.location.href = "/";
  };

  // =====================================================
  // RETURN
  // =====================================================

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
                    onChange={
                      handlePhotoUpload
                    }
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
            style={{
              padding: "20px",
            }}
          >

            {/* PAGE HEADER */}

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

            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "15px",
                marginBottom: "25px",
              }}
            >

              {/* TOTAL EMPLOYEES */}

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

              {/* PRESENT */}

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
                  {presentToday}
                </span>

              </div>

              {/* LATE */}

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
                  {lateToday}
                </span>

              </div>

              {/* ABSENT */}

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
                  {absentToday}
                </span>

              </div>

            </div>

            {/* =================================================
                WEEKLY REPORT
            ================================================= */}

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
                  justifyContent:
                    "space-around",
                  borderBottom:
                    "2px solid #333",
                  borderLeft:
                    "2px solid #333",
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
                Weekly chart will be connected
                to the attendance database later.
              </p>

            </div>

            {/* =================================================
                DAILY ATTENDANCE TABLE
            ================================================= */}

            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                overflowX: "auto",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                  gap: "10px",
                }}
              >

                <div>

                  <h3>
                    Daily Attendance Records
                  </h3>

                  <p
                    style={{
                      color: "#777",
                      margin: "5px 0 0",
                    }}
                  >
                    Attendance records including
                    employee location.
                  </p>

                </div>

                <button
                  onClick={() => {

                    const saved =
                      localStorage.getItem(
                        "employeeAttendance"
                      );

                    if (saved) {

                      try {

                        setAttendanceRecords(
                          JSON.parse(saved)
                        );

                      } catch {

                        setAttendanceRecords([]);
                      }

                    } else {

                      setAttendanceRecords([]);

                    }

                  }}
                  style={{
                    padding:
                      "10px 15px",
                    border:
                      "1px solid #2d7d46",
                    background:
                      "#fff",
                    color:
                      "#2d7d46",
                    borderRadius:
                      "7px",
                    cursor:
                      "pointer",
                    fontWeight:
                      "bold",
                  }}
                >
                  🔄 Refresh
                </button>

              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse",
                  marginTop: "15px",
                  minWidth: "1000px",
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
                      }}
                    >
                      Date
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      First Name
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Last Name
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      ID
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Position
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Sign In
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Sign Out
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Status
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Location
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {attendanceRecords.length > 0 ? (

                    attendanceRecords.map(
                      (attendance, index) => {

                        const employee =
                          getEmployeeInformation(
                            attendance
                          );

                        const location =
                          getAttendanceLocation(
                            attendance
                          );

                        return (

                          <tr
                            key={
                              attendance.id ||
                              attendance.attendanceId ||
                              index
                            }
                            style={{
                              borderBottom:
                                "1px solid #eee",
                            }}
                          >

                            {/* DATE */}

                            <td
                              style={{
                                padding: "12px",
                              }}
                            >
                              {attendance.date ||
                                "-"}
                            </td>

                            {/* FIRST NAME */}

                            <td
                              style={{
                                padding: "12px",
                              }}
                            >
                              {employee?.firstName ||
                                attendance.firstName ||
                                "-"}
                            </td>

                            {/* LAST NAME */}

                            <td
                              style={{
                                padding: "12px",
                              }}
                            >
                              {employee?.lastName ||
                                attendance.lastName ||
                                "-"}
                            </td>

                            {/* ID */}

                            <td
                              style={{
                                padding: "12px",
                              }}
                            >
                              {employee?.employeeId ||
                                attendance.employeeId ||
                                "-"}
                            </td>

                            {/* POSITION */}

                            <td
                              style={{
                                padding: "12px",
                              }}
                            >
                              {employee?.position ||
                                attendance.position ||
                                "-"}
                            </td>

                            {/* SIGN IN */}

                            <td
                              style={{
                                padding: "12px",
                              }}
                            >
                              {formatTime(
                                attendance.signIn
                              )}
                            </td>

                            {/* SIGN OUT */}

                            <td
                              style={{
                                padding: "12px",
                              }}
                            >
                              {formatTime(
                                attendance.signOut
                              )}
                            </td>

                            {/* STATUS */}

                            <td
                              style={{
                                padding: "12px",
                              }}
                            >

                              <span
                                style={{
                                  display:
                                    "inline-block",
                                  padding:
                                    "6px 10px",
                                  borderRadius:
                                    "20px",
                                  background:
                                    location?.status ===
                                    "INSIDE_SCHOOL"
                                      ? "#e8f5e9"
                                      : "#ffebee",
                                  color:
                                    location?.status ===
                                    "INSIDE_SCHOOL"
                                      ? "#2e7d32"
                                      : "#c62828",
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    "bold",
                                }}
                              >

                                {location?.status ===
                                "INSIDE_SCHOOL"
                                  ? "Inside School"
                                  : location?.status ===
                                    "OUTSIDE_SCHOOL"
                                  ? "Outside School"
                                  : "Unknown"}

                              </span>

                            </td>

                            {/* LOCATION */}

                            <td
                              style={{
                                padding: "12px",
                              }}
                            >

                              {location ? (

                                <button
                                  onClick={() =>
                                    handleViewLocation(
                                      attendance
                                    )
                                  }
                                  style={{
                                    background:
                                      "#2d7d46",
                                    color:
                                      "#fff",
                                    border:
                                      "none",
                                    padding:
                                      "8px 12px",
                                    borderRadius:
                                      "6px",
                                    cursor:
                                      "pointer",
                                    fontWeight:
                                      "bold",
                                  }}
                                >
                                  📍 View Location
                                </button>

                              ) : (

                                <span
                                  style={{
                                    color:
                                      "#999",
                                  }}
                                >
                                  No location
                                </span>

                              )}

                            </td>

                          </tr>

                        );

                      }
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="9"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "35px",
                          color:
                            "#888",
                        }}
                      >

                        <div
                          style={{
                            fontSize:
                              "35px",
                            marginBottom:
                              "10px",
                          }}
                        >
                          📂
                        </div>

                        No attendance records
                        found.

                        <br />

                        <small>
                          Attendance records will
                          appear here after an
                          employee completes
                          attendance.
                        </small>

                      </td>

                    </tr>

                  )}

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

            {/* REGISTER EMPLOYEE FORM */}

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
                  textAlign:
                    "center",
                  marginBottom:
                    "8px",
                  color:
                    "#1b4332",
                }}
              >
                Register Employee
              </h2>

              <p
                style={{
                  textAlign:
                    "center",
                  color:
                    "#777",
                  marginBottom:
                    "30px",
                }}
              >
                Enter employee information below
              </p>

              <form
                onSubmit={
                  handleEmployeeSubmit
                }
              >

                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(2, 1fr)",
                    gap:
                      "20px",
                  }}
                >

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
                      style={
                        inputStyle
                      }
                    />

                  </div>

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
                      style={
                        inputStyle
                      }
                    />

                  </div>

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
                      style={
                        inputStyle
                      }
                    />

                  </div>

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
                      style={
                        inputStyle
                      }
                    />

                  </div>

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
                      style={
                        inputStyle
                      }
                    />

                  </div>

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
                      style={
                        inputStyle
                      }
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
                      style={
                        inputStyle
                      }
                    />

                  </div>

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
                      style={
                        inputStyle
                      }
                    />

                  </div>

                </div>

                <button
                  type="submit"
                  style={{
                    width:
                      "100%",
                    marginTop:
                      "30px",
                    background:
                      "#2d7d46",
                    color:
                      "#fff",
                    border:
                      "none",
                    padding:
                      "15px",
                    borderRadius:
                      "8px",
                    fontWeight:
                      "bold",
                    cursor:
                      "pointer",
                    fontSize:
                      "15px",
                  }}
                >
                  Register Employee
                </button>

              </form>

            </div>

            {/* EMPLOYEE DIRECTORY */}

            <div
              style={{
                background:
                  "#fff",
                padding:
                  "25px",
                borderRadius:
                  "12px",
                border:
                  "1px solid #ddd",
              }}
            >

              <h3
                style={{
                  color:
                    "#1b4332",
                  marginBottom:
                    "15px",
                }}
              >
                Employee Directory
              </h3>

              <input
                type="text"
                placeholder="Search by Name, ID, Department or Position..."
                value={
                  searchTerm
                }
                onChange={(
                  event
                ) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                style={{
                  width:
                    "100%",
                  padding:
                    "12px",
                  marginBottom:
                    "20px",
                  borderRadius:
                    "8px",
                  border:
                    "1px solid #ccc",
                  boxSizing:
                    "border-box",
                }}
              />

              <div
                style={{
                  overflowX:
                    "auto",
                }}
              >

                <table
                  style={{
                    width:
                      "100%",
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

                      <th>ID</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Hire Date</th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredEmployees.length >
                    0 ? (

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

                            <td>
                              {
                                employee.employeeId
                              }
                            </td>

                            <td>
                              {
                                employee.firstName
                              }
                            </td>

                            <td>
                              {
                                employee.lastName
                              }
                            </td>

                            <td>
                              {
                                employee.email
                              }
                            </td>

                            <td>
                              {
                                employee.phone
                              }
                            </td>

                            <td>
                              {
                                employee.department
                              }
                            </td>

                            <td>
                              {
                                employee.position
                              }
                            </td>

                            <td>
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
                marginBottom:
                  "25px",
              }}
            >

              <h2
                style={{
                  color:
                    "#1b4332",
                }}
              >
                System & Profile Settings
              </h2>

              <p
                style={{
                  color:
                    "#666",
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
                background:
                  "#fff",
                padding:
                  "25px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #ddd",
                marginBottom:
                  "20px",
              }}
            >

              <h3>
                👤 Administrator Profile
              </h3>

              <p
                style={{
                  color:
                    "#777",
                }}
              >
                Update administrator profile
                information.
              </p>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap:
                    "15px",
                }}
              >

                <div>

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    defaultValue={
                      adminName
                    }
                    style={
                      inputStyle
                    }
                  />

                </div>

                <div>

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    defaultValue={
                      adminEmail
                    }
                    style={
                      inputStyle
                    }
                  />

                </div>

                <div>

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="text"
                    defaultValue={
                      adminPhone
                    }
                    style={
                      inputStyle
                    }
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
                background:
                  "#fff",
                padding:
                  "25px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #ddd",
                marginBottom:
                  "20px",
              }}
            >

              <h3>
                ⏰ Attendance & Work Time Rules
              </h3>

              <p
                style={{
                  color:
                    "#777",
                }}
              >
                Set official arrival and departure
                times.
              </p>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap:
                    "15px",
                }}
              >

                <div>

                  <label>
                    Official Arrival Time
                  </label>

                  <input
                    type="time"
                    style={
                      inputStyle
                    }
                  />

                </div>

                <div>

                  <label>
                    Official Departure Time
                  </label>

                  <input
                    type="time"
                    style={
                      inputStyle
                    }
                  />

                </div>

              </div>

            </div>

            {/* SECURITY */}

            <div
              style={{
                background:
                  "#fff",
                padding:
                  "25px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #ddd",
                marginBottom:
                  "20px",
              }}
            >

              <h3>
                🔒 Security & Change Password
              </h3>

              <p
                style={{
                  color:
                    "#777",
                }}
              >
                Change administrator password.
              </p>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr 1fr",
                  gap:
                    "15px",
                }}
              >

                <input
                  type="password"
                  placeholder="Current Password"
                  style={
                    inputStyle
                  }
                />

                <input
                  type="password"
                  placeholder="New Password"
                  style={
                    inputStyle
                  }
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  style={
                    inputStyle
                  }
                />

              </div>

            </div>

            <div
              style={{
                textAlign:
                  "right",
              }}
            >

              <button
                style={{
                  background:
                    "#1b4332",
                  color:
                    "#fff",
                  padding:
                    "12px 25px",
                  border:
                    "none",
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

      {/* =====================================================
          LOCATION MODAL
      ===================================================== */}

      {selectedLocation && (

        <div
          style={{
            position:
              "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "rgba(0, 0, 0, 0.65)",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            zIndex: 9999,
            padding:
              "20px",
          }}
        >

          <div
            style={{
              background:
                "#fff",
              width:
                "min(900px, 100%)",
              maxHeight:
                "90vh",
              overflowY:
                "auto",
              borderRadius:
                "15px",
              padding:
                "25px",
              position:
                "relative",
            }}
          >

            {/* CLOSE BUTTON */}

            <button
              onClick={
                closeLocationModal
              }
              style={{
                position:
                  "absolute",
                right:
                  "15px",
                top:
                  "15px",
                width:
                  "35px",
                height:
                  "35px",
                border:
                  "none",
                borderRadius:
                  "50%",
                background:
                  "#f1f1f1",
                cursor:
                  "pointer",
                fontSize:
                  "18px",
              }}
            >
              ✕
            </button>

            {/* TITLE */}

            <h2
              style={{
                color:
                  "#1b4332",
                marginBottom:
                  "5px",
              }}
            >
              📍 Employee Attendance Location
            </h2>

            <p
              style={{
                color:
                  "#777",
                marginBottom:
                  "20px",
              }}
            >
              Location recorded when the employee
              marked attendance.
            </p>

            {/* EMPLOYEE INFORMATION */}

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap:
                  "12px",
                marginBottom:
                  "20px",
              }}
            >

              <div
                style={{
                  background:
                    "#f7f7f7",
                  padding:
                    "12px",
                  borderRadius:
                    "8px",
                }}
              >

                <small>
                  Employee
                </small>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop:
                      "5px",
                  }}
                >
                  {selectedLocation.employee?.firstName ||
                    selectedLocation.attendance?.firstName ||
                    "-"}{" "}
                  {selectedLocation.employee?.lastName ||
                    selectedLocation.attendance?.lastName ||
                    ""}
                </strong>

              </div>

              <div
                style={{
                  background:
                    "#f7f7f7",
                  padding:
                    "12px",
                  borderRadius:
                    "8px",
                }}
              >

                <small>
                  Employee ID
                </small>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop:
                      "5px",
                  }}
                >
                  {selectedLocation.employee?.employeeId ||
                    selectedLocation.attendance?.employeeId ||
                    "-"}
                </strong>

              </div>

              <div
                style={{
                  background:
                    "#f7f7f7",
                  padding:
                    "12px",
                  borderRadius:
                    "8px",
                }}
              >

                <small>
                  Date
                </small>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop:
                      "5px",
                  }}
                >
                  {selectedLocation.attendance?.date ||
                    "-"}
                </strong>

              </div>

            </div>

            {/* LOCATION INFORMATION */}

            <div
              style={{
                background:
                  "#eef7f0",
                padding:
                  "20px",
                borderRadius:
                  "10px",
                marginBottom:
                  "20px",
              }}
            >

              <h3>
                📡 GPS Information
              </h3>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap:
                    "15px",
                }}
              >

                <div>

                  <span
                    style={{
                      color:
                        "#666",
                      fontSize:
                        "13px",
                    }}
                  >
                    Latitude
                  </span>

                  <strong
                    style={{
                      display:
                        "block",
                      marginTop:
                        "5px",
                    }}
                  >
                    {
                      selectedLocation.latitude
                    }
                  </strong>

                </div>

                <div>

                  <span
                    style={{
                      color:
                        "#666",
                      fontSize:
                        "13px",
                    }}
                  >
                    Longitude
                  </span>

                  <strong
                    style={{
                      display:
                        "block",
                      marginTop:
                        "5px",
                    }}
                  >
                    {
                      selectedLocation.longitude
                    }
                  </strong>

                </div>

                <div>

                  <span
                    style={{
                      color:
                        "#666",
                      fontSize:
                        "13px",
                    }}
                  >
                    Distance From School
                  </span>

                  <strong
                    style={{
                      display:
                        "block",
                      marginTop:
                        "5px",
                    }}
                  >
                    {selectedLocation.distance !==
                    undefined &&
                    selectedLocation.distance !==
                    null
                      ? `${Number(
                          selectedLocation.distance
                        ).toFixed(2)} meters`
                      : "Not available"}
                  </strong>

                </div>

                <div>

                  <span
                    style={{
                      color:
                        "#666",
                      fontSize:
                        "13px",
                    }}
                  >
                    Location Status
                  </span>

                  <strong
                    style={{
                      display:
                        "block",
                      marginTop:
                        "5px",
                      color:
                        selectedLocation.status ===
                        "INSIDE_SCHOOL"
                          ? "#2e7d32"
                          : "#c62828",
                    }}
                  >
                    {selectedLocation.status ===
                    "INSIDE_SCHOOL"
                      ? "✓ INSIDE SCHOOL"
                      : selectedLocation.status ===
                        "OUTSIDE_SCHOOL"
                      ? "✕ OUTSIDE SCHOOL"
                      : "UNKNOWN"}
                  </strong>

                </div>

              </div>

            </div>

            {/* PLACE NAME */}

            <div
              style={{
                background:
                  "#f8f9fa",
                padding:
                  "18px",
                borderRadius:
                  "10px",
                marginBottom:
                  "20px",
              }}
            >

              <h3>
                📍 Place Name
              </h3>

              {locationLoading ? (

                <p
                  style={{
                    color:
                      "#777",
                  }}
                >
                  🔄 Finding place name...
                </p>

              ) : (

                <p
                  style={{
                    margin:
                      "5px 0 0",
                    lineHeight:
                      "1.6",
                  }}
                >
                  {placeName ||
                    "Place name not available"}
                </p>

              )}

            </div>

            {/* MAP */}

            <div>

              <h3>
                🗺️ Attendance Map
              </h3>

              <div
                style={{
                  width:
                    "100%",
                  height:
                    "400px",
                  borderRadius:
                    "10px",
                  overflow:
                    "hidden",
                  border:
                    "1px solid #ddd",
                  marginTop:
                    "10px",
                }}
              >

                <iframe
                  title="Employee Attendance Location"
                  src={getMapUrl(
                    selectedLocation.latitude,
                    selectedLocation.longitude
                  )}
                  width="100%"
                  height="100%"
                  style={{
                    border:
                      "none",
                  }}
                  loading="lazy"
                ></iframe>

              </div>

            </div>

            {/* OPEN MAP BUTTON */}

            <div
              style={{
                marginTop:
                  "15px",
                display:
                  "flex",
                gap:
                  "10px",
                flexWrap:
                  "wrap",
              }}
            >

              <a
                href={`https://www.openstreetmap.org/?mlat=${selectedLocation.latitude}&mlon=${selectedLocation.longitude}#map=18/${selectedLocation.latitude}/${selectedLocation.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:
                    "inline-block",
                  background:
                    "#2d7d46",
                  color:
                    "#fff",
                  textDecoration:
                    "none",
                  padding:
                    "10px 15px",
                  borderRadius:
                    "7px",
                  fontWeight:
                    "bold",
                }}
              >
                🗺️ Open Full Map
              </a>

              <button
                onClick={
                  closeLocationModal
                }
                style={{
                  background:
                    "#eee",
                  color:
                    "#333",
                  border:
                    "none",
                  padding:
                    "10px 15px",
                  borderRadius:
                    "7px",
                  cursor:
                    "pointer",
                }}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default AdminDashboard;