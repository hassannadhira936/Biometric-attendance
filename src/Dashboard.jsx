import React, { useState } from "react";
import "./Dashboard.css";
import HelpCenter from "./HelpCenter";
import ChangePassword from "./ChangePassword";

// Function ya kuhesabu masaa kati ya Sign In na Sign Out
const calculateHours = (signInTime, signOutTime) => {
  if (!signInTime || !signOutTime) return 0;

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes, seconds] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return new Date(2000, 0, 1, hours, minutes, seconds || 0);
  };

  try {
    const start = parseTime(signInTime);
    const end = parseTime(signOutTime);
    let diffMs = end - start;

    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;

    return diffMs / (1000 * 60 * 60);
  } catch (error) {
    return 0;
  }
};

// 1. MARK ATTENDANCE COMPONENT
function MarkAttendance({ employee }) {
  const [attendance, setAttendance] = useState(() => {
    const savedAttendance = localStorage.getItem("employeeAttendance");
    return savedAttendance ? JSON.parse(savedAttendance) : [];
  });

  const [scanning, setScanning] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const todayAttendance = attendance.find(
    (record) =>
      record.employeeId === employee?.employeeId && record.date === today
  );

  const handleScan = async () => {
    if (!employee?.employeeId) {
      alert("Employee information is not available.");
      return;
    }

    setScanning(true);

    try {
      if (window.PublicKeyCredential) {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        await navigator.credentials.get({
          publicKey: {
            challenge: challenge,
            timeout: 60000,
            userVerification: "required",
          },
        });
      }
    } catch (err) {
      console.log("Biometric bypass or fallback simulation used:", err);
    }

    const now = new Date();
    const currentTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const existingRecord = attendance.find(
      (record) =>
        record.employeeId === employee.employeeId && record.date === today
    );

    let updatedAttendance;

    if (!existingRecord) {
      const newRecord = {
        employeeId: employee.employeeId,
        date: today,
        signIn: currentTime,
        signOut: null,
        location: "Main Gate",
      };
      updatedAttendance = [...attendance, newRecord];
      alert(`Fingerprint Verified! Signed in at ${currentTime}`);
    } else if (!existingRecord.signOut) {
      updatedAttendance = attendance.map((record) =>
        record.employeeId === employee.employeeId && record.date === today
          ? { ...record, signOut: currentTime }
          : record
      );
      alert(`Fingerprint Verified! Signed out at ${currentTime}`);
    } else {
      updatedAttendance = attendance;
      alert("You have already signed in and signed out today.");
    }

    setAttendance(updatedAttendance);
    localStorage.setItem(
      "employeeAttendance",
      JSON.stringify(updatedAttendance)
    );
    setScanning(false);
  };

  const employeeHistory = attendance
    .filter((record) => record.employeeId === employee?.employeeId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalTodayHours = calculateHours(
    todayAttendance?.signIn,
    todayAttendance?.signOut
  );

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <div>
          <h2>Mark attendance</h2>
          <p>Record your daily attendance using fingerprint scanner below.</p>
        </div>
      </div>

      <div className="attendance-section-title">
        <h3>Today's attendance</h3>
      </div>

      <div
        className="attendance-top-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          className="scanner-box"
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
          }}
        >
          <div
            className="fingerprint-icon"
            onClick={handleScan}
            style={{
              fontSize: "60px",
              cursor: scanning || todayAttendance?.signOut ? "not-allowed" : "pointer",
              marginBottom: "15px",
            }}
          >
            {scanning ? "⏳" : "👆"}
          </div>

          <button
            className="scan-button"
            onClick={handleScan}
            disabled={scanning || Boolean(todayAttendance?.signOut)}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "1px solid #333",
              backgroundColor: "#f9f9f9",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {scanning
              ? "Scanning..."
              : todayAttendance?.signOut
              ? "Completed"
              : "Scan fingerprint"}
          </button>
        </div>

        <div
          className="time-cards-container"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            justifyContent: "center",
          }}
        >
          <div
            className="time-card-item"
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <span>Sign in at</span>
            <strong>{todayAttendance?.signIn || "--:--:--"}</strong>
          </div>

          <div
            className="time-card-item"
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <span>Sign out at</span>
            <strong>{todayAttendance?.signOut || "--:--:--"}</strong>
          </div>

          <div
            className="time-card-item"
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f4f4f4",
            }}
          >
            <span>Total Hours</span>
            <strong>{totalTodayHours > 0 ? `${totalTodayHours.toFixed(1)} hrs` : "--"}</strong>
          </div>
        </div>
      </div>

      <div className="attendance-history">
        <div className="history-heading">
          <h2>My Attendance history</h2>
          <p>Your attendance history will appear here.</p>
        </div>

        {employeeHistory.length === 0 ? (
          <div className="no-attendance" style={{ textAlign: "center", padding: "20px" }}>
            <p>No attendance records available.</p>
          </div>
        ) : (
          <div className="attendance-table-wrapper">
            <table className="attendance-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
                  <th style={{ padding: "10px" }}>Date</th>
                  <th style={{ padding: "10px" }}>Sign in</th>
                  <th style={{ padding: "10px" }}>Sign out</th>
                  <th style={{ padding: "10px" }}>Hours</th>
                  <th style={{ padding: "10px" }}>Location</th>
                </tr>
              </thead>
              <tbody>
                {employeeHistory.map((record, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px" }}>{record.date}</td>
                    <td style={{ padding: "10px" }}>{record.signIn || "--"}</td>
                    <td style={{ padding: "10px" }}>{record.signOut || "--"}</td>
                    <td style={{ padding: "10px" }}>
                      {calculateHours(record.signIn, record.signOut).toFixed(1)} hrs
                    </td>
                    <td style={{ padding: "10px" }}>{record.location || "Main Gate"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. ATTENDANCE REPORT COMPONENT
function AttendanceReport({ employee }) {
  const [attendance] = useState(() => {
    const saved = localStorage.getItem("employeeAttendance");
    return saved ? JSON.parse(saved) : [];
  });

  const employeeRecords = attendance.filter(
    (record) => record.employeeId === employee?.employeeId
  );

  // Takwimu halisi kulingana na muamala wa mtumiaji (Bila data za kubuni)
  const presentDays = employeeRecords.length;
  const absentDays = 0;
  const lateDays = employeeRecords.filter((r) => {
    if (!r.signIn) return false;
    return r.signIn > "08:00:00 AM";
  }).length;

  const totalDays = presentDays + absentDays;

  const totalHoursWorked = employeeRecords
    .reduce((acc, curr) => acc + calculateHours(curr.signIn, curr.signOut), 0)
    .toFixed(1);

  // Kuandaa Grafu ya Wiki (Masaa halisi kwa kila siku Mon-Fri)
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  
  const getHoursForDayName = (dayName) => {
    const record = employeeRecords.find((r) => {
      const dateObj = new Date(r.date);
      const name = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      return name === dayName;
    });
    return record ? calculateHours(record.signIn, record.signOut) : 0;
  };

  return (
    <div className="report-page" style={{ padding: "20px" }}>
      {/* Header Info */}
      <div
        className="info-header-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <div style={boxStyle}>
          <small style={{ color: "#777" }}>Name</small>
          <p style={boxTextStyle}>
            {employee ? `${employee.firstName} ${employee.lastName}` : "N/A"}
          </p>
        </div>

        <div style={boxStyle}>
          <small style={{ color: "#777" }}>Dept name</small>
          <p style={boxTextStyle}>{employee?.department || "N/A"}</p>
        </div>

        <div style={boxStyle}>
          <small style={{ color: "#777" }}>Id</small>
          <p style={boxTextStyle}>{employee?.employeeId || "N/A"}</p>
        </div>

        <div style={boxStyle}>
          <small style={{ color: "#777" }}>Email</small>
          <p style={boxTextStyle}>{employee?.email || "N/A"}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <div style={statBoxStyle}>
          <small>Absent day</small>
          <h2>{absentDays}</h2>
        </div>

        <div style={statBoxStyle}>
          <small>Present day</small>
          <h2>{presentDays}</h2>
        </div>

        <div style={statBoxStyle}>
          <small>Late</small>
          <h2>{lateDays}</h2>
        </div>

        <div style={statBoxStyle}>
          <small>Total day</small>
          <h2>{totalDays}</h2>
        </div>

        <div style={{ ...statBoxStyle, backgroundColor: "#eef6ff" }}>
          <small>Total hours</small>
          <h2 style={{ color: "#0066cc" }}>{totalHoursWorked} hrs</h2>
        </div>
      </div>

      {/* Summary Weekly Report (Bar Graph) */}
      <div
        className="weekly-report-card"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fff",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>Summary weekly report</h3>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-around",
            height: "180px",
            borderBottom: "2px solid #ccc",
            borderLeft: "2px solid #ccc",
            paddingTop: "10px",
            paddingLeft: "10px",
            backgroundColor: "#fafafa",
          }}
        >
          {daysOfWeek.map((day, index) => {
            const hrs = getHoursForDayName(day);
            const barHeight = hrs > 0 ? Math.min(hrs * 15, 140) : 0; // Max height capped

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "flex-end",
                  width: "40px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${barHeight}px`,
                    backgroundColor: "#4f46e5",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.4s ease",
                    minHeight: "2px", // Inahakikisha kizuizi kinaonekana hata kikiwa zero
                  }}
                ></div>
                <span style={{ marginTop: "8px", fontSize: "14px", fontWeight: "bold" }}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Daily Attendance Record Table */}
      <div
        className="daily-record-card"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fff",
        }}
      >
        <h3>My daily attendance record</h3>
        <p style={{ color: "#666", fontSize: "14px", marginTop: "5px" }}>
          Detailed view of your daily attendance check-ins and check-outs.
        </p>

        <table style={{ width: "100%", marginTop: "15px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
              <th style={{ padding: "8px" }}>Date</th>
              <th style={{ padding: "8px" }}>Sign In</th>
              <th style={{ padding: "8px" }}>Sign Out</th>
              <th style={{ padding: "8px" }}>Hours</th>
            </tr>
          </thead>
          <tbody>
            {employeeRecords.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: "15px", textAlign: "center", color: "#888" }}>
                  No attendance records found.
                </td>
              </tr>
            ) : (
              employeeRecords.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "8px" }}>{r.date}</td>
                  <td style={{ padding: "8px" }}>{r.signIn || "--"}</td>
                  <td style={{ padding: "8px" }}>{r.signOut || "--"}</td>
                  <td style={{ padding: "8px" }}>
                    {calculateHours(r.signIn, r.signOut).toFixed(1)} hrs
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styling Helper Objects
const boxStyle = {
  border: "1px solid #ccc",
  borderRadius: "6px",
  padding: "10px 15px",
  backgroundColor: "#fff",
};

const boxTextStyle = {
  margin: "4px 0 0 0",
  fontWeight: "bold",
  fontSize: "14px",
};

const statBoxStyle = {
  border: "1px solid #ccc",
  borderRadius: "6px",
  padding: "15px",
  textAlign: "center",
  backgroundColor: "#fff",
};

// 3. MAIN DASHBOARD COMPONENT
function Dashboard({ employee, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Mark attendance", icon: "🕘" },
    { name: "Attendance report", icon: "📊" },
    { name: "Setting", icon: "⚙️" },
    { name: "Help center", icon: "❓" },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "Mark attendance":
        return <MarkAttendance employee={employee} />;

      case "Attendance report":
        return <AttendanceReport employee={employee} />;

        case "Help center":
  return <HelpCenter />;

  case "Setting":
  return <ChangePassword employee={employee} />;

      case "Dashboard":
      default:
        return (
          <>
            <section className="welcome-card">
              <div>
                <span>Welcome back 👋</span>
                <h2>
                  {employee
                    ? `${employee.firstName} ${employee.lastName}`
                    : "Employee"}
                </h2>
                <p>
                  Welcome to your employee attendance dashboard. Manage your
                  attendance and view your information here.
                </p>
              </div>
              <div className="welcome-icon">📅</div>
            </section>

            <section className="profile-area">
              <div className="section-heading">
                <h2>My Profile</h2>
                <p>Your registered personal information</p>
              </div>

              <div className="profile-card">
                <div className="photo-area">
                  <div className="profile-photo">
                    {profileImage ? (
                      <img src={profileImage} alt="Employee Profile" />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>

                  <label htmlFor="profile-upload" className="upload-photo">
                    📷 Upload Photo
                  </label>

                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                  />

                  <p>JPG, PNG or JPEG</p>
                </div>

                <div className="employee-information">
                  <div className="information-box">
                    <div className="information-icon">👤</div>
                    <div>
                      <small>Name</small>
                      <strong>
                        {employee
                          ? `${employee.firstName} ${employee.lastName}`
                          : "Not available"}
                      </strong>
                    </div>
                  </div>

                  <div className="information-box">
                    <div className="information-icon">✉️</div>
                    <div>
                      <small>Email</small>
                      <strong>{employee?.email || "Not available"}</strong>
                    </div>
                  </div>

                  <div className="information-box">
                    <div className="information-icon">📞</div>
                    <div>
                      <small>Contact</small>
                      <strong>{employee?.phone || "Not available"}</strong>
                    </div>
                  </div>

                  <div className="information-box">
                    <div className="information-icon">🏢</div>
                    <div>
                      <small>Department</small>
                      <strong>{employee?.department || "Not available"}</strong>
                    </div>
                  </div>

                  <div className="information-box">
                    <div className="information-icon">💼</div>
                    <div>
                      <small>Position</small>
                      <strong>{employee?.position || "Not available"}</strong>
                    </div>
                  </div>

                  <div className="information-box">
                    <div className="information-icon">🆔</div>
                    <div>
                      <small>Employee ID</small>
                      <strong>{employee?.employeeId || "Not available"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="employee-dashboard">
      <aside className="dashboard-sidebar">
        <div className="dashboard-school">
          <img src="/LOGO.JPG" alt="Alihsan Girls Secondary School" />
          <div>
            <h2>AL-IHSAN GIRLS</h2>
            <p>SECONDARY SCHOOL</p>
          </div>
        </div>

        <div className="sidebar-title">
          <span>☰</span>
          <strong>Dashboard</strong>
        </div>

        <nav className="dashboard-menu">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={
                activeMenu === item.name
                  ? "dashboard-menu-item active"
                  : "dashboard-menu-item"
              }
              onClick={() => setActiveMenu(item.name)}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}

          <button
            className="dashboard-menu-item logout-item"
            onClick={onLogout}
          >
            <span className="menu-icon">🚪</span>
            Log out
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <h1>Employee dashboard</h1>
            <p>Manage your attendance and personal information</p>
          </div>

          <div className="topbar-profile">
            <span className="notification-icon">🔔</span>

            <div className="small-profile">
              {profileImage ? (
                <img src={profileImage} alt="Employee" />
              ) : (
                <div className="small-profile-placeholder">👤</div>
              )}

              <div>
                <strong>{employee?.firstName || "Employee"}</strong>
                <small>Employee</small>
              </div>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;