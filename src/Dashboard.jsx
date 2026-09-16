import React, { useEffect, useState } from "react";

import {
  getAttendance,
  createAttendance,
  updateAttendance,
} from "./services/api";

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const TANZANIA_TIME_ZONE = "Africa/Dar_es_Salaam";

function getToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TANZANIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatDate(value) {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TANZANIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatTime(value) {
  if (!value) return "--:--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: TANZANIA_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

function calculateHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return 0;
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return 0;
  }

  let difference = end.getTime() - start.getTime();

  if (difference < 0) {
    difference += 24 * 60 * 60 * 1000;
  }

  return difference / (1000 * 60 * 60);
}

/* =========================================================
   CONVERT BACKEND ATTENDANCE
========================================================= */

function mapAttendance(item) {
  return {
    attendanceId: item.attendanceid,
    employeeId: item.employeeid,
    checkIn: item.checkin,
    checkOut: item.checkout,
    checkoutLatitude: item.checkout_latitude,
    checkoutLongitude: item.checkout_longitude,
    status: item.status || "PRESENT",
    date: formatDate(item.checkin),
    hours: calculateHours(item.checkin, item.checkout),
  };
}

/* =========================================================
   MARK ATTENDANCE
========================================================= */

function MarkAttendance({ employee }) {
  const [attendance, setAttendance] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState(
    "Location not detected"
  );

  /* -------------------------------------------------------
     LOAD ATTENDANCE FROM BACKEND
  ------------------------------------------------------- */

  async function loadEmployeeAttendance() {
    try {
      const data = await getAttendance();

      const employeeId = Number(employee?.employeeId);

      const records = data
        .filter(
          (item) => Number(item.employeeid) === employeeId
        )
        .map(mapAttendance);

      setAttendance(records);
    } catch (error) {
      console.error("Failed to load attendance:", error);
      alert("Failed to load attendance from backend.");
    }
  }

  useEffect(() => {
    if (employee?.employeeId) {
      loadEmployeeAttendance();
    }
  }, [employee]);

  /* -------------------------------------------------------
     DETECT LOCATION
  ------------------------------------------------------- */

  function handleDetectLocation() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    setLocationMessage("Detecting location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({
          latitude,
          longitude,
        });

        setLocationMessage(
          `Location detected: ${latitude.toFixed(
            5
          )}, ${longitude.toFixed(5)}`
        );
      },
      (error) => {
        console.error("Location error:", error);

        setLocationMessage(
          "Unable to detect location. Please allow location permission."
        );
      }
    );
  }

  /* -------------------------------------------------------
     CHECK SCHOOL LOCATION
  ------------------------------------------------------- */

  function isInsideSchool() {
    /*
      Current school coordinates from your database/project:

      Latitude  = -6.7924
      Longitude = 39.2083

      For testing we use approximately 500 meters.
    */

    if (!location) {
      return false;
    }

    const schoolLatitude = -6.7924;
    const schoolLongitude = 39.2083;

    const latitudeDifference =
      location.latitude - schoolLatitude;

    const longitudeDifference =
      location.longitude - schoolLongitude;

    const distance = Math.sqrt(
      latitudeDifference * latitudeDifference +
        longitudeDifference * longitudeDifference
    );

    /*
      Approximate degree-to-meter conversion.
      0.005 degrees is approximately 500m.
    */

    return distance <= 0.005;
  }

  /* -------------------------------------------------------
     BIOMETRIC SCAN
  ------------------------------------------------------- */

  async function performBiometricScan() {
    /*
      This is browser WebAuthn testing.

      It is NOT yet connected to the biometric table
      in the Spring Boot backend.
    */

    if (
      window.PublicKeyCredential &&
      navigator.credentials
    ) {
      try {
        const available =
          await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

        if (available) {
          /*
            Browser biometric/security key attempt.

            For now we use fallback because the actual
            fingerprint matching is not yet connected
            to /api/biometric.
          */

          console.log(
            "Platform biometric authenticator available."
          );
        }
      } catch (error) {
        console.log(
          "Biometric test failed, using fallback.",
          error
        );
      }
    }

    return true;
  }

  /* -------------------------------------------------------
     CHECK IN / CHECK OUT
  ------------------------------------------------------- */

  async function handleScan() {
    if (!employee?.employeeId) {
      alert("Employee information is missing.");
      return;
    }

    if (!location) {
      alert("Please detect your location first.");
      return;
    }

    if (!isInsideSchool()) {
      alert(
        "You are outside the school attendance area."
      );
      return;
    }

    setScanning(true);

    try {
      /* -----------------------------------------------
         BIOMETRIC
      ------------------------------------------------ */

      const biometricSuccess =
        await performBiometricScan();

      if (!biometricSuccess) {
        alert("Biometric verification failed.");
        return;
      }

      /* -----------------------------------------------
         GET TODAY'S RECORD
      ------------------------------------------------ */

      const today = getToday();

      const existingRecord = attendance.find(
        (record) =>
          record.date === today
      );

      /* -----------------------------------------------
         CHECK IN
      ------------------------------------------------ */

      if (!existingRecord) {
        const checkInTime = new Date().toISOString();

        const attendanceData = {
          employeeid: Number(employee.employeeId),
          checkin: checkInTime,
          checkout: null,
          checkout_latitude: null,
          checkout_longitude: null,
          status: "PRESENT",
        };

        await createAttendance(attendanceData);

        alert("Check In successful!");

        await loadEmployeeAttendance();

        return;
      }

      /* -----------------------------------------------
         CHECK OUT
      ------------------------------------------------ */

      if (!existingRecord.checkOut) {
        const checkOutTime =
          new Date().toISOString();

        const attendanceData = {
          employeeid: Number(employee.employeeId),
          checkin: existingRecord.checkIn,
          checkout: checkOutTime,
          checkout_latitude: location.latitude,
          checkout_longitude: location.longitude,
          status: "PRESENT",
        };

        await updateAttendance(
          existingRecord.attendanceId,
          attendanceData
        );

        alert("Check Out successful!");

        await loadEmployeeAttendance();

        return;
      }

      /* -----------------------------------------------
         ALREADY COMPLETED
      ------------------------------------------------ */

      alert(
        "You have already completed today's attendance."
      );
    } catch (error) {
      console.error(
        "Attendance operation failed:",
        error
      );

      alert(
        "Attendance operation failed. Please try again."
      );
    } finally {
      setScanning(false);
    }
  }

  /* -------------------------------------------------------
     TODAY'S ATTENDANCE
  ------------------------------------------------------- */

  const today = getToday();

  const todayRecord = attendance.find(
    (record) => record.date === today
  );

  const totalHours = attendance.reduce(
    (total, record) =>
      total + Number(record.hours || 0),
    0
  );

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <div style={{ padding: "30px" }}>
      <h2>Mark Attendance</h2>

      <p>
        Welcome,{" "}
        <strong>
          {employee?.firstName} {employee?.lastName}
        </strong>
      </p>

      {/* BIOMETRIC */}

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "25px",
          marginTop: "20px",
          maxWidth: "600px",
        }}
      >
        <h3>🔐 Biometric Attendance</h3>

        <p>
          Use your fingerprint/biometric verification
          to record attendance.
        </p>

        <button
          onClick={handleScan}
          disabled={scanning}
          style={{
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            cursor: scanning
              ? "not-allowed"
              : "pointer",
          }}
        >
          {scanning
            ? "Scanning..."
            : todayRecord?.checkOut
            ? "Attendance Completed"
            : todayRecord?.checkIn
            ? "Check Out"
            : "Check In"}
        </button>
      </div>

      {/* LOCATION */}

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "25px",
          marginTop: "20px",
          maxWidth: "600px",
        }}
      >
        <h3>📍 Attendance Location</h3>

        <p>{locationMessage}</p>

        <button
          onClick={handleDetectLocation}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Detect Location
        </button>

        {location && (
          <div style={{ marginTop: "15px" }}>
            <p>
              Latitude:{" "}
              {location.latitude.toFixed(6)}
            </p>

            <p>
              Longitude:{" "}
              {location.longitude.toFixed(6)}
            </p>

            <p>
              School Area:{" "}
              <strong>
                {isInsideSchool()
                  ? "YES"
                  : "NO"}
              </strong>
            </p>
          </div>
        )}
      </div>

      {/* TODAY */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <div style={boxStyle}>
          <h3>Sign In</h3>

          <p style={boxTextStyle}>
            {todayRecord?.checkIn
              ? formatTime(
                  todayRecord.checkIn
                )
              : "--:--"}
          </p>
        </div>

        <div style={boxStyle}>
          <h3>Sign Out</h3>

          <p style={boxTextStyle}>
            {todayRecord?.checkOut
              ? formatTime(
                  todayRecord.checkOut
                )
              : "--:--"}
          </p>
        </div>

        <div style={boxStyle}>
          <h3>Total Hours</h3>

          <p style={boxTextStyle}>
            {todayRecord
              ? todayRecord.hours.toFixed(1)
              : "0.0"}{" "}
            hrs
          </p>
        </div>
      </div>

      {/* HISTORY */}

      <div style={{ marginTop: "40px" }}>
        <h2>Employee Attendance History</h2>

        {attendance.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                marginTop: "15px",
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeader}>
                    Date
                  </th>

                  <th style={tableHeader}>
                    Sign In
                  </th>

                  <th style={tableHeader}>
                    Sign Out
                  </th>

                  <th style={tableHeader}>
                    Hours
                  </th>

                  <th style={tableHeader}>
                    Status
                  </th>

                  <th style={tableHeader}>
                    Checkout Location
                  </th>
                </tr>
              </thead>

              <tbody>
                {attendance.map(
                  (record) => (
                    <tr
                      key={
                        record.attendanceId
                      }
                    >
                      <td style={tableCell}>
                        {record.date}
                      </td>

                      <td style={tableCell}>
                        {formatTime(
                          record.checkIn
                        )}
                      </td>

                      <td style={tableCell}>
                        {record.checkOut
                          ? formatTime(
                              record.checkOut
                            )
                          : "--:--"}
                      </td>

                      <td style={tableCell}>
                        {record.hours.toFixed(
                          1
                        )}{" "}
                        hrs
                      </td>

                      <td style={tableCell}>
                        {record.status}
                      </td>

                      <td style={tableCell}>
                        {record.checkoutLatitude !==
                          null &&
                        record.checkoutLongitude !==
                          null
                          ? `${record.checkoutLatitude}, ${record.checkoutLongitude}`
                          : "Not available"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TOTAL */}

      <div
        style={{
          marginTop: "20px",
          fontWeight: "bold",
        }}
      >
        Total Hours All Records:{" "}
        {totalHours.toFixed(1)} hrs
      </div>
    </div>
  );
}

/* =========================================================
   ATTENDANCE REPORT
========================================================= */

function AttendanceReport({ employee }) {
  const [attendance, setAttendance] = useState(
    []
  );

  const [loading, setLoading] =
    useState(true);

  async function loadAttendance() {
    try {
      setLoading(true);

      const data =
        await getAttendance();

      const employeeId = Number(
        employee?.employeeId
      );

      const records = data
        .filter(
          (item) =>
            Number(item.employeeid) ===
            employeeId
        )
        .map(mapAttendance);

      setAttendance(records);
    } catch (error) {
      console.error(
        "Failed to load attendance report:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (employee?.employeeId) {
      loadAttendance();
    } else {
      setLoading(false);
    }
  }, [employee]);

  /* -------------------------------------------------------
     STATISTICS
  ------------------------------------------------------- */

  const presentDays = attendance.filter(
    (record) =>
      record.status === "PRESENT"
  ).length;

  const lateDays = attendance.filter(
    (record) =>
      record.status === "LATE"
  ).length;

  const totalDays = attendance.length;

  const totalHours = attendance.reduce(
    (total, record) =>
      total + Number(record.hours || 0),
    0
  );

  const absentDays = 0;

  /* -------------------------------------------------------
     WEEKLY REPORT
  ------------------------------------------------------- */

  const weekDays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ];

  function getDayAttendance(dayName) {
    const now = new Date();

    const dayNumber =
      now.getDay();

    const monday =
      new Date(now);

    const difference =
      dayNumber === 0
        ? -6
        : 1 - dayNumber;

    monday.setDate(
      now.getDate() + difference
    );

    const dayIndex =
      weekDays.indexOf(dayName);

    const targetDate =
      new Date(monday);

    targetDate.setDate(
      monday.getDate() + dayIndex
    );

    const dateString =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone:
            TANZANIA_TIME_ZONE,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      ).format(targetDate);

    return attendance.find(
      (record) =>
        record.date === dateString
    );
  }

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Attendance Report</h2>
        <p>
          Loading attendance data...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Attendance Report</h2>

      <p>
        Detailed attendance report for{" "}
        <strong>
          {employee?.firstName}{" "}
          {employee?.lastName}
        </strong>
      </p>

      {/* STATISTICS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginTop: "25px",
        }}
      >
        <div style={statBoxStyle}>
          <h3>Absent Day</h3>
          <h2>{absentDays}</h2>
        </div>

        <div style={statBoxStyle}>
          <h3>Present Day</h3>
          <h2>{presentDays}</h2>
        </div>

        <div style={statBoxStyle}>
          <h3>Late</h3>
          <h2>{lateDays}</h2>
        </div>

        <div style={statBoxStyle}>
          <h3>Total Day</h3>
          <h2>{totalDays}</h2>
        </div>

        <div style={statBoxStyle}>
          <h3>Total Hours</h3>
          <h2>
            {totalHours.toFixed(1)} hrs
          </h2>
        </div>
      </div>

      {/* WEEKLY */}

      <div style={{ marginTop: "40px" }}>
        <h2>Summary Weekly Report</h2>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          {weekDays.map(
            (day) => {
              const record =
                getDayAttendance(day);

              return (
                <div
                  key={day}
                  style={{
                    width: "90px",
                    minHeight: "120px",
                    border:
                      "1px solid #ddd",
                    borderRadius:
                      "10px",
                    padding:
                      "15px",
                    textAlign:
                      "center",
                  }}
                >
                  <strong>
                    {day}
                  </strong>

                  <div
                    style={{
                      marginTop:
                        "20px",
                      fontSize:
                        "24px",
                    }}
                  >
                    {record
                      ? "✓"
                      : "—"}
                  </div>

                  <small>
                    {record
                      ? `${record.hours.toFixed(
                          1
                        )} hrs`
                      : "No record"}
                  </small>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* DAILY RECORD */}

      <div style={{ marginTop: "40px" }}>
        <h2>
          My Daily Attendance Record
        </h2>

        <p>
          Detailed view of your daily
          attendance check-ins and
          check-outs.
        </p>

        {attendance.length === 0 ? (
          <p>
            No attendance records
            found.
          </p>
        ) : (
          <div
            style={{
              overflowX:
                "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                marginTop:
                  "20px",
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeader}>
                    Date
                  </th>

                  <th style={tableHeader}>
                    Sign In
                  </th>

                  <th style={tableHeader}>
                    Sign Out
                  </th>

                  <th style={tableHeader}>
                    Hours
                  </th>

                  <th style={tableHeader}>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {attendance.map(
                  (record) => (
                    <tr
                      key={
                        record.attendanceId
                      }
                    >
                      <td style={tableCell}>
                        {record.date}
                      </td>

                      <td style={tableCell}>
                        {formatTime(
                          record.checkIn
                        )}
                      </td>

                      <td style={tableCell}>
                        {record.checkOut
                          ? formatTime(
                              record.checkOut
                            )
                          : "--:--"}
                      </td>

                      <td style={tableCell}>
                        {record.hours.toFixed(
                          1
                        )}{" "}
                        hrs
                      </td>

                      <td style={tableCell}>
                        {record.status}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function Dashboard({
  employee,
  onLogout,
}) {
  const [activePage, setActivePage] =
    useState("dashboard");

  const [profileImage, setProfileImage] =
    useState(null);

  function handleProfileUpload(event) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const imageUrl =
      URL.createObjectURL(file);

    setProfileImage(imageUrl);
  }

  function handleLogout() {
    localStorage.removeItem(
      "employeeData"
    );

    if (onLogout) {
      onLogout();
    }
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f6fa",
      }}
    >
      {/* SIDEBAR */}

      <aside
        style={{
          width: "240px",
          background: "#ffffff",
          borderRight:
            "1px solid #ddd",
          padding: "20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <img
            src="/LOGO.jpg"
            alt="Alihsan Girls Secondary School"
            style={{
              width: "70px",
              height: "70px",
              objectFit:
                "contain",
            }}
          />

          <h3>
            AL-IHSAN GIRLS
          </h3>

          <small>
            SECONDARY SCHOOL
          </small>
        </div>

        <nav>
          <button
            onClick={() =>
              setActivePage(
                "dashboard"
              )
            }
            style={menuButtonStyle}
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() =>
              setActivePage(
                "attendance"
              )
            }
            style={menuButtonStyle}
          >
            🕘 Mark attendance
          </button>

          <button
            onClick={() =>
              setActivePage(
                "report"
              )
            }
            style={menuButtonStyle}
          >
            📊 Attendance report
          </button>

          <button
            onClick={() =>
              setActivePage(
                "setting"
              )
            }
            style={menuButtonStyle}
          >
            ⚙️ Setting
          </button>

          <button
            onClick={() =>
              setActivePage(
                "help"
              )
            }
            style={menuButtonStyle}
          >
            ❓ Help center
          </button>

          <button
            onClick={
              handleLogout
            }
            style={{
              ...menuButtonStyle,
              marginTop:
                "20px",
            }}
          >
            🚪 Log out
          </button>
        </nav>
      </aside>

      {/* MAIN */}

      <main
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        {/* TOP BAR */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom:
              "25px",
          }}
        >
          <div>
            <h1>
              Employee dashboard
            </h1>

            <p>
              Manage your attendance
              and personal information
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems:
                "center",
            }}
          >
            <span>
              🔔
            </span>

            <span>
              👤
            </span>

            <strong>
              {employee?.firstName ||
                "Employee"}
            </strong>
          </div>
        </div>

        {/* DASHBOARD */}

        {activePage ===
          "dashboard" && (
          <>
            {/* WELCOME */}

            <div
              style={{
                background:
                  "#ffffff",
                borderRadius:
                  "12px",
                padding:
                  "25px",
                marginBottom:
                  "25px",
              }}
            >
              <h2>
                Welcome,{" "}
                {employee?.firstName}!
              </h2>

              <p>
                Manage your attendance
                and personal information
                from your dashboard.
              </p>
            </div>

            {/* EMPLOYEE PROFILE */}

            <div
              style={{
                background:
                  "#ffffff",
                borderRadius:
                  "12px",
                padding:
                  "25px",
              }}
            >
              <h2>
                Employee Information
              </h2>

              <div
                style={{
                  display:
                    "flex",
                  gap: "25px",
                  alignItems:
                    "center",
                  marginTop:
                    "20px",
                }}
              >
                <div>
                  {profileImage ? (
                    <img
                      src={
                        profileImage
                      }
                      alt="Profile"
                      style={{
                        width:
                          "100px",
                        height:
                          "100px",
                        borderRadius:
                          "50%",
                        objectFit:
                          "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width:
                          "100px",
                        height:
                          "100px",
                        borderRadius:
                          "50%",
                        background:
                          "#eee",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        fontSize:
                          "40px",
                      }}
                    >
                      👤
                    </div>
                  )}

                  <br />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleProfileUpload
                    }
                  />
                </div>

                <div>
                  <p>
                    <strong>
                      Name:
                    </strong>{" "}
                    {employee?.firstName}{" "}
                    {employee?.lastName}
                  </p>

                  <p>
                    <strong>
                      Department:
                    </strong>{" "}
                    {employee?.department ||
                      "--"}
                  </p>

                  <p>
                    <strong>
                      Position:
                    </strong>{" "}
                    {employee?.position ||
                      "--"}
                  </p>

                  <p>
                    <strong>
                      Employee ID:
                    </strong>{" "}
                    {employee?.employeeId ||
                      "--"}
                  </p>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {employee?.email ||
                      "--"}
                  </p>

                  <p>
                    <strong>
                      Phone:
                    </strong>{" "}
                    {employee?.phone ||
                      "--"}
                  </p>

                  <p>
                    <strong>
                      Hire Date:
                    </strong>{" "}
                    {employee?.hireDate ||
                      "--"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* MARK ATTENDANCE */}

        {activePage ===
          "attendance" && (
          <MarkAttendance
            employee={employee}
          />
        )}

        {/* ATTENDANCE REPORT */}

        {activePage ===
          "report" && (
          <AttendanceReport
            employee={employee}
          />
        )}

        {/* SETTING */}

        {activePage ===
          "setting" && (
          <div
            style={{
              background:
                "#ffffff",
              padding:
                "30px",
              borderRadius:
                "12px",
            }}
          >
            <h2>Setting</h2>

            <p>
              Employee account
              settings will appear
              here.
            </p>
          </div>
        )}

        {/* HELP */}

        {activePage ===
          "help" && (
          <div
            style={{
              background:
                "#ffffff",
              padding:
                "30px",
              borderRadius:
                "12px",
            }}
          >
            <h2>
              Help Center
            </h2>

            <p>
              If you have a problem
              with attendance, contact
              your administrator.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const menuButtonStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginBottom: "8px",
  border: "none",
  borderRadius: "8px",
  background: "transparent",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "15px",
};

const boxStyle = {
  flex: "1",
  minWidth: "180px",
  background: "#ffffff",
  borderRadius: "12px",
  padding: "20px",
  textAlign: "center",
};

const boxTextStyle = {
  fontSize: "22px",
  fontWeight: "bold",
};

const statBoxStyle = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "20px",
  textAlign: "center",
};

const tableHeader = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left",
  background: "#f5f5f5",
};

const tableCell = {
  border: "1px solid #ddd",
  padding: "12px",
};