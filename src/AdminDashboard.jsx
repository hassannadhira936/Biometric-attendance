import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import AdminHelpCenter from "./AdminHelpCenter";

import {
  getEmployees,
  createEmployee,
  getAttendance,
} from "./services/api";

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

  // =====================================================
  // LOCATION STATES
  // =====================================================

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
  // FORMAT EMPLOYEE DATA
  // ============
     const formatEmployees = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((employee) => ({
    id: employee.employeeId,
    employeeId: employee.employeeId,

    employeeNumber:
      employee.employeeNumber || "",

    firstName:
      employee.firstName || "",

    lastName:
      employee.lastName || "",

    email:
      employee.email || "",

    phone:
      employee.phone || "",

    department:
      employee.department || "",

    position:
      employee.position || "",

    hireDate:
      employee.hireDate || "",

    username:
      employee.username || "",

    password:
      employee.password || "",

    status:
      employee.status || "ACTIVE",
  }));
};
  // =====================================================
  // FORMAT ATTENDANCE DATA
  // =====================================================

  const formatAttendance = (data) => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((attendance) => ({
      attendanceId: attendance.attendanceid,
      employeeId: attendance.employeeid,

      checkIn: attendance.checkin || null,
      checkOut: attendance.checkout || null,

      signIn: attendance.checkin || null,
      signOut: attendance.checkout || null,

      date: attendance.checkin
        ? String(attendance.checkin).substring(0, 10)
        : "",

      status:
        attendance.status ||
        "PRESENT",

      attendanceStatus:
        attendance.status ||
        "PRESENT",

      checkoutLatitude:
        attendance.checkout_latitude ??
        null,

      checkoutLongitude:
        attendance.checkout_longitude ??
        null,

      signOutLatitude:
        attendance.checkout_latitude ??
        null,

      signOutLongitude:
        attendance.checkout_longitude ??
        null,

      latitude:
        attendance.checkout_latitude ??
        null,

      longitude:
        attendance.checkout_longitude ??
        null,
    }));
  };

  // =====================================================
  // LOAD EMPLOYEES
  // =====================================================

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();

      const formattedEmployees =
        formatEmployees(data);

      setEmployees(formattedEmployees);

      console.log(
        "Employees loaded:",
        formattedEmployees
      );
    } catch (error) {
      console.error(
        "Error loading employees:",
        error
      );

      alert(
        "Failed to load employees from backend."
      );
    }
  };

  // =====================================================
  // LOAD ATTENDANCE
  // =====================================================

  const loadAttendance = async () => {
    try {
      const data = await getAttendance();

      const formattedAttendance =
        formatAttendance(data);

      setAttendanceRecords(
        formattedAttendance
      );

      console.log(
        "Attendance loaded:",
        formattedAttendance
      );
    } catch (error) {
      console.error(
        "Error loading attendance:",
        error
      );

      setAttendanceRecords([]);

      alert(
        "Failed to load attendance from backend."
      );
    }
  };

  // =====================================================
  // LOAD ALL DATA WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadEmployees();
    loadAttendance();
  }, []);

  // =====================================================
  // RELOAD ATTENDANCE WHEN ADMIN OPENS ATTENDANCE
  // =====================================================

  useEffect(() => {
    if (
      activeMenu ===
      "View Employees Attendance"
    ) {
      loadEmployees();
      loadAttendance();
    }
  }, [activeMenu]);

  // =====================================================
  // ADMIN PHOTO UPLOAD
  // =====================================================

  const handlePhotoUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    setAdminPhoto(imageUrl);
  };

  // =====================================================
  // EMPLOYEE FORM CHANGE
  // =====================================================

  const handleEmployeeChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setEmployeeForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // REGISTER EMPLOYEE
  // =====================================================

  const handleEmployeeSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
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

    try {
      const firstName =
        employeeForm.firstName
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "");

      const lastName =
        employeeForm.lastName
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "");

      const username =
        `${firstName}${lastName}123`;

      const newEmployee = {
        firstname:
          employeeForm.firstName.trim(),

        lastname:
          employeeForm.lastName.trim(),

        email:
          employeeForm.email.trim(),

        phone:
          employeeForm.phone.trim(),

        department:
          employeeForm.department,

        position:
          employeeForm.position,

        hiredate:
          employeeForm.hireDate,

        username,
        password: "123456",
        status: "ACTIVE",
      };

      console.log(
        "Creating employee:",
        newEmployee
      );

      await createEmployee(
        newEmployee
      );

      alert(
        `Employee registered successfully!\n\nUsername: ${username}\nPassword: 123456`
      );

      await loadEmployees();

      setEmployeeForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        hireDate: "",
      });
    } catch (error) {
      console.error(
        "Error creating employee:",
        error
      );

      alert(
        "Failed to register employee. Check backend and database."
      );
    }
  };

  // =====================================================
  // SEARCH EMPLOYEES
  // =====================================================

  const filteredEmployees =
    employees.filter((employee) => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      return (
        String(
          employee.employeeId ?? ""
        )
          .toLowerCase()
          .includes(search) ||

        String(
          employee.firstName ?? ""
        )
          .toLowerCase()
          .includes(search) ||

        String(
          employee.lastName ?? ""
        )
          .toLowerCase()
          .includes(search) ||

        String(
          employee.department ?? ""
        )
          .toLowerCase()
          .includes(search) ||

        String(
          employee.position ?? ""
        )
          .toLowerCase()
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
      attendance.employeeId ??
      attendance.employeeid ??
      attendance.id ??
      attendance.employeeID;

    return employees.find(
      (item) =>
        String(item.employeeId) ===
          String(employeeId) ||
        String(item.id) ===
          String(employeeId)
    );
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    try {
      return new Date(
        time
      ).toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
          timeZone:
            "Africa/Dar_es_Salaam",
        }
      );
    } catch {
      return time;
    }
  };

  // =====================================================
  // GET TODAY DATE TANZANIA
  // =====================================================

  const getTodayDate = () => {
    return new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "Africa/Dar_es_Salaam",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(new Date());
  };

  const today =
    getTodayDate();

  // =====================================================
  // GET ATTENDANCE LOCATION
  // =====================================================

  const getAttendanceLocation = (
    attendance
  ) => {
    const latitude =
      attendance.checkoutLatitude ??
      attendance.signOutLatitude ??
      attendance.latitude ??
      attendance.checkout_latitude ??
      attendance.signInLatitude ??
      null;

    const longitude =
      attendance.checkoutLongitude ??
      attendance.signOutLongitude ??
      attendance.longitude ??
      attendance.checkout_longitude ??
      attendance.signInLongitude ??
      null;

    if (
      latitude === null ||
      latitude === undefined ||
      longitude === null ||
      longitude === undefined
    ) {
      return null;
    }

    return {
      latitude,
      longitude,

      signInLatitude:
        attendance.signInLatitude ??
        null,

      signInLongitude:
        attendance.signInLongitude ??
        null,

      signOutLatitude:
        attendance.signOutLatitude ??
        attendance.checkoutLatitude ??
        attendance.checkout_latitude ??
        null,

      signOutLongitude:
        attendance.signOutLongitude ??
        attendance.checkoutLongitude ??
        attendance.checkout_longitude ??
        null,

      distance:
        attendance.signInDistanceFromSchool ??
        null,

      status:
        attendance.signInLocationStatus ??
        "UNKNOWN",

      signOutDistance:
        attendance.signOutDistanceFromSchool ??
        null,

      signOutStatus:
        attendance.signOutLocationStatus ??
        "UNKNOWN",
    };
  };

  // =====================================================
  // REVERSE GEOCODING
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

  const todayAttendance =
    attendanceRecords.filter(
      (attendance) =>
        attendance.date === today
    );

  const presentToday =
    todayAttendance.length;

  const lateToday =
    todayAttendance.filter(
      (attendance) => {
        const status =
          String(
            attendance.status ||
              attendance.attendanceStatus ||
              ""
          ).toUpperCase();

        return status === "LATE";
      }
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
    localStorage.removeItem(
      "adminLoggedIn"
    );

    localStorage.removeItem(
      "adminData"
    );

    localStorage.removeItem(
      "employeeLoggedIn"
    );

    localStorage.removeItem(
      "employeeData"
    );

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

        <div className="school-logo">

          <img
            src="/LOGO.jpg"
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

        <nav className="admin-menu">

          {menuItems.map(
            (item) => (
              <button
                key={item.name}
                className={`menu-item ${
                  activeMenu ===
                  item.name
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveMenu(
                    item.name
                  )
                }
              >
                <span className="menu-icon">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>
              </button>
            )
          )}

        </nav>

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

        {/* TOP BAR */}

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

            <div className="welcome-card">

              <div>
                <h2>
                  Welcome back,{" "}
                  {adminName}! 👋
                </h2>

                <p>
                  Welcome to the Al-Ihsan
                  Girls Secondary School
                  Employee Attendance
                  Management System.
                </p>
              </div>

            </div>

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
                          .substring(
                            0,
                            2
                          )
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

        {activeMenu ===
          "View Employees Attendance" && (

          <div
            className="view-attendance-container"
            style={{
              padding: "20px",
            }}
          >

            <div
              style={{
                marginBottom:
                  "20px",
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
                Administrator can view and
                monitor employee attendance
                records from the backend.
              </p>
            </div>

            {/* SUMMARY CARDS */}

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "15px",
                marginBottom:
                  "25px",
              }}
            >

              <div
                style={{
                  background:
                    "#e3f2fd",
                  padding:
                    "20px",
                  borderRadius:
                    "10px",
                  textAlign:
                    "center",
                }}
              >
                <h4>
                  Total Employees
                </h4>

                <span
                  style={{
                    fontSize:
                      "28px",
                    fontWeight:
                      "bold",
                  }}
                >
                  {employees.length}
                </span>
              </div>

              <div
                style={{
                  background:
                    "#e8f5e9",
                  padding:
                    "20px",
                  borderRadius:
                    "10px",
                  textAlign:
                    "center",
                }}
              >
                <h4>
                  Present Today
                </h4>

                <span
                  style={{
                    fontSize:
                      "28px",
                    fontWeight:
                      "bold",
                  }}
                >
                  {presentToday}
                </span>
              </div>

              <div
                style={{
                  background:
                    "#fffde7",
                  padding:
                    "20px",
                  borderRadius:
                    "10px",
                  textAlign:
                    "center",
                }}
              >
                <h4>
                  Late Today
                </h4>

                <span
                  style={{
                    fontSize:
                      "28px",
                    fontWeight:
                      "bold",
                  }}
                >
                  {lateToday}
                </span>
              </div>

              <div
                style={{
                  background:
                    "#ffebee",
                  padding:
                    "20px",
                  borderRadius:
                    "10px",
                  textAlign:
                    "center",
                }}
              >
                <h4>
                  Absent Today
                </h4>

                <span
                  style={{
                    fontSize:
                      "28px",
                    fontWeight:
                      "bold",
                  }}
                >
                  {absentToday}
                </span>
              </div>

            </div>

            {/* WEEKLY REPORT */}

            <div
              style={{
                background:
                  "#fff",
                padding:
                  "20px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #ddd",
                marginBottom:
                  "25px",
              }}
            >

              <h3>
                Overall Employees Weekly Report
              </h3>

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-around",
                  alignItems:
                    "center",
                  padding:
                    "30px 10px",
                  marginTop:
                    "20px",
                  background:
                    "#f8f9fa",
                  borderRadius:
                    "10px",
                }}
              >

                {[
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                ].map(
                  (day) => (
                    <div
                      key={day}
                      style={{
                        textAlign:
                          "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize:
                            "25px",
                          marginBottom:
                            "8px",
                        }}
                      >
                        📊
                      </div>

                      <strong>
                        {day}
                      </strong>
                    </div>
                  )
                )}

              </div>

              <p
                style={{
                  textAlign:
                    "center",
                  color:
                    "#999",
                  marginTop:
                    "15px",
                }}
              >
                Attendance data is now
                loaded from the backend.
              </p>

            </div>

            {/* ATTENDANCE TABLE */}

            <div
              style={{
                background:
                  "#fff",
                padding:
                  "20px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #ddd",
                overflowX:
                  "auto",
              }}
            >

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom:
                    "15px",
                  gap:
                    "10px",
                }}
              >

                <div>
                  <h3>
                    Daily Attendance Records
                  </h3>

                  <p
                    style={{
                      color:
                        "#777",
                      margin:
                        "5px 0 0",
                    }}
                  >
                    Attendance records
                    loaded from MySQL
                    through Spring Boot.
                  </p>
                </div>

                <button
                  onClick={() => {
                    loadAttendance();
                    loadEmployees();
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
                  width:
                    "100%",
                  borderCollapse:
                    "collapse",
                  marginTop:
                    "15px",
                  minWidth:
                    "1100px",
                }}
              >

                <thead>
                  <tr
                    style={{
                      background:
                        "#f5f5f5",
                    }}
                  >
                    <th style={{ padding: "12px" }}>
                      Date
                    </th>

                    <th style={{ padding: "12px" }}>
                      First Name
                    </th>

                    <th style={{ padding: "12px" }}>
                      Last Name
                    </th>

                    <th style={{ padding: "12px" }}>
                      ID
                    </th>

                    <th style={{ padding: "12px" }}>
                      Position
                    </th>

                    <th style={{ padding: "12px" }}>
                      Sign In
                    </th>

                    <th style={{ padding: "12px" }}>
                      Sign Out
                    </th>

                    <th style={{ padding: "12px" }}>
                      Status
                    </th>

                    <th style={{ padding: "12px" }}>
                      Location
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {attendanceRecords.length >
                  0 ? (
                    attendanceRecords.map(
                      (
                        attendance,
                        index
                      ) => {

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
                              attendance.attendanceId ||
                              index
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
                              {attendance.date ||
                                "-"}
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {employee?.firstName ||
                                "-"}
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {employee?.lastName ||
                                "-"}
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {employee?.employeeId ||
                                attendance.employeeId ||
                                "-"}
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {employee?.position ||
                                "-"}
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {formatTime(
                                attendance.checkIn
                              )}
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {formatTime(
                                attendance.checkOut
                              )}
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
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
                                    String(
                                      attendance.status
                                    ).toUpperCase() ===
                                    "LATE"
                                      ? "#fff3cd"
                                      : "#e8f5e9",
                                  color:
                                    String(
                                      attendance.status
                                    ).toUpperCase() ===
                                    "LATE"
                                      ? "#856404"
                                      : "#2e7d32",
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    "bold",
                                }}
                              >
                                {attendance.status ||
                                  "PRESENT"}
                              </span>
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
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
                          Attendance records
                          will appear here
                          after an employee
                          completes attendance.
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

        {activeMenu ===
          "Manage Employee" && (

          <div
            className="manage-employee-container"
            style={{
              padding:
                "20px",
              maxWidth:
                "1200px",
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
                  marginBottom:
                    "5px",
                }}
              >
                Employee Management
              </h2>

              <p
                style={{
                  color:
                    "#666",
                }}
              >
                Register new employees and
                manage staff records.
              </p>
            </div>

            {/* REGISTER FORM */}

            <div
              style={{
                background:
                  "#fff",
                padding:
                  "25px",
                borderRadius:
                  "12px",
                marginBottom:
                  "30px",
                border:
                  "1px solid #ddd",
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
                Enter employee information
                below
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
                      placeholder="0712345678"
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

                  <div
                    style={{
                      gridColumn:
                        "1 / -1",
                    }}
                  >
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

                <div
                  style={{
                    marginTop:
                      "15px",
                    padding:
                      "12px",
                    background:
                      "#fff8e1",
                    borderRadius:
                      "8px",
                    color:
                      "#795548",
                  }}
                >
                  <strong>
                    Login credentials:
                  </strong>{" "}
                  Username will be generated
                  automatically and the temporary
                  password will be{" "}
                  <strong>
                    123456
                  </strong>.
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
                onChange={(event) =>
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
                    minWidth:
                      "900px",
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
                          No employee records
                          found.
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
              padding:
                "20px",
              maxWidth:
                "900px",
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
                Configure system rules,
                administrator profile,
                and security settings.
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
                Administrator information.
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
                    readOnly
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
                Set official arrival and
                departure times.
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

        {activeMenu ===
          "Help Center" && (
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
            zIndex:
              9999,
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
              Location recorded with
              the attendance record.
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
                    "-"}{" "}
                  {selectedLocation.employee?.lastName ||
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

            {/* GPS INFORMATION */}

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
                      null &&
                    selectedLocation.distance !==
                      undefined
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
                          : "#777",
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

            {/* BUTTONS */}

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
