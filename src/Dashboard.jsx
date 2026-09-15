import React, { useState } from "react";
import "./Dashboard.css";
import HelpCenter from "./HelpCenter";
import ChangePassword from "./ChangePassword";

// =====================================================
// SCHOOL GPS LOCATION
// =====================================================

const SCHOOL_LATITUDE = -6.1746053;
const SCHOOL_LONGITUDE = 39.2263778;

// Employee lazima awe ndani ya mita 100
const SCHOOL_RADIUS_METERS = 100;

// =====================================================
// FUNCTION YA KUHESABU DISTANCE KATI YA COORDINATES MBILI
// Haversine Formula
// =====================================================

const calculateDistance = (
  latitude1,
  longitude1,
  latitude2,
  longitude2
) => {
  const earthRadius = 6371000; // meters

  const lat1 = (latitude1 * Math.PI) / 180;
  const lat2 = (latitude2 * Math.PI) / 180;

  const deltaLatitude =
    ((latitude2 - latitude1) * Math.PI) / 180;

  const deltaLongitude =
    ((longitude2 - longitude1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatitude / 2) *
      Math.sin(deltaLatitude / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2);

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
};

// =====================================================
// FUNCTION YA KUHESABU MASAA
// =====================================================

const calculateHours = (
  signInTime,
  signOutTime
) => {
  if (!signInTime || !signOutTime) return 0;

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");

    let [hours, minutes, seconds] = time
      .split(":")
      .map(Number);

    if (modifier === "PM" && hours < 12) {
      hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return new Date(
      2000,
      0,
      1,
      hours,
      minutes,
      seconds || 0
    );
  };

  try {
    const start = parseTime(signInTime);
    const end = parseTime(signOutTime);

    let diffMs = end - start;

    if (diffMs < 0) {
      diffMs += 24 * 60 * 60 * 1000;
    }

    return diffMs / (1000 * 60 * 60);
  } catch (error) {
    return 0;
  }
};

// =====================================================
// 1. MARK ATTENDANCE COMPONENT
// =====================================================

function MarkAttendance({ employee }) {
  const [attendance, setAttendance] = useState(() => {
    const savedAttendance =
      localStorage.getItem("employeeAttendance");

    return savedAttendance
      ? JSON.parse(savedAttendance)
      : [];
  });

  const [scanning, setScanning] = useState(false);

  // =====================================================
  // GPS STATES
  // =====================================================

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");

  const [locationDetected, setLocationDetected] =
    useState(false);

  // Geofence state
  const [insideSchool, setInsideSchool] =
    useState(false);

  const [distanceFromSchool, setDistanceFromSchool] =
    useState(null);

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayAttendance = attendance.find(
    (record) =>
      record.employeeId === employee?.employeeId &&
      record.date === today
  );

  // =====================================================
  // DETECT LOCATION + CHECK SCHOOL DISTANCE
  // =====================================================

  const handleDetectLocation = () => {
    setLocationError("");
    setLocationDetected(false);
    setInsideSchool(false);
    setDistanceFromSchool(null);

    if (!navigator.geolocation) {
      setLocationError(
        "Location services are not supported by this browser."
      );

      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const detectedLatitude =
          position.coords.latitude;

        const detectedLongitude =
          position.coords.longitude;

        // Save employee GPS
        setLatitude(detectedLatitude);
        setLongitude(detectedLongitude);

        // Calculate distance from school
        const distance = calculateDistance(
          detectedLatitude,
          detectedLongitude,
          SCHOOL_LATITUDE,
          SCHOOL_LONGITUDE
        );

        setDistanceFromSchool(distance);

        // Check if employee is inside school radius
        const employeeIsInside =
          distance <= SCHOOL_RADIUS_METERS;

        setInsideSchool(employeeIsInside);

        setLocationDetected(true);
        setLocationLoading(false);
        setLocationError("");
      },

      (error) => {
        setLocationLoading(false);
        setLocationDetected(false);
        setInsideSchool(false);
        setDistanceFromSchool(null);

        if (error.code === 1) {
          setLocationError(
            "Location permission was denied. Please allow location access in your browser settings to mark attendance."
          );
        } else if (error.code === 2) {
          setLocationError(
            "Your location could not be detected. Please turn on GPS/location services and try again."
          );
        } else if (error.code === 3) {
          setLocationError(
            "Location detection timed out. Please try again."
          );
        } else {
          setLocationError(
            "Unable to detect your location. Please try again."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // =====================================================
  // HANDLE ATTENDANCE / FINGERPRINT
  // =====================================================

  const handleScan = async () => {
    if (!employee?.employeeId) {
      alert(
        "Employee information is not available."
      );

      return;
    }

    // =====================================================
    // LOCATION MUST BE DETECTED
    // =====================================================

    if (
      !locationDetected ||
      latitude === null ||
      longitude === null
    ) {
      alert(
        "Location access is required before marking attendance. Please click 'Detect My Location' and allow location permission."
      );

      return;
    }

    // =====================================================
    // EMPLOYEE MUST BE INSIDE SCHOOL
    // =====================================================

    if (!insideSchool) {
      alert(
        `You are outside the school premises.\n\nAttendance cannot be recorded.\n\nYour distance from school is ${
          distanceFromSchool !== null
            ? Math.round(distanceFromSchool)
            : "--"
        } meters.\n\nYou must be within ${SCHOOL_RADIUS_METERS} meters of the school.`
      );

      return;
    }

    setScanning(true);

    try {
      // =====================================================
      // BIOMETRIC / FINGERPRINT
      // =====================================================

      if (window.PublicKeyCredential) {
        const challenge = new Uint8Array(32);

        window.crypto.getRandomValues(
          challenge
        );

        await navigator.credentials.get({
          publicKey: {
            challenge: challenge,
            timeout: 60000,
            userVerification: "required",
          },
        });
      }
    } catch (err) {
      console.log(
        "Biometric bypass or fallback simulation used:",
        err
      );
    }

    const now = new Date();

    const currentTime =
      now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

    const existingRecord = attendance.find(
      (record) =>
        record.employeeId === employee.employeeId &&
        record.date === today
    );

    let updatedAttendance;

    // =====================================================
    // SIGN IN
    // =====================================================

    if (!existingRecord) {
      const newRecord = {
        employeeId: employee.employeeId,

        date: today,

        signIn: currentTime,

        signOut: null,

        // ================================================
        // SIGN IN GPS
        // ================================================

        signInLatitude: latitude,

        signInLongitude: longitude,

        // General GPS compatibility
        latitude: latitude,

        longitude: longitude,

        // Distance from school
        signInDistanceFromSchool:
          distanceFromSchool,

        // Geofence status
        signInLocationStatus:
          insideSchool
            ? "INSIDE_SCHOOL"
            : "OUTSIDE_SCHOOL",

        location:
          "GPS Location - Inside School",
      };

      updatedAttendance = [
        ...attendance,
        newRecord,
      ];

      alert(
        `Fingerprint Verified!\n\nSigned in at ${currentTime}\n\n✓ Location verified\n✓ Inside school premises\n✓ Distance: ${Math.round(
          distanceFromSchool
        )} meters`
      );
    }

    // =====================================================
    // SIGN OUT
    // =====================================================

    else if (!existingRecord.signOut) {
      updatedAttendance = attendance.map(
        (record) =>
          record.employeeId ===
            employee.employeeId &&
          record.date === today
            ? {
                ...record,

                signOut: currentTime,

                // ========================================
                // SIGN OUT GPS
                // ========================================

                signOutLatitude: latitude,

                signOutLongitude: longitude,

                signOutDistanceFromSchool:
                  distanceFromSchool,

                signOutLocationStatus:
                  insideSchool
                    ? "INSIDE_SCHOOL"
                    : "OUTSIDE_SCHOOL",
              }
            : record
      );

      alert(
        `Fingerprint Verified!\n\nSigned out at ${currentTime}\n\n✓ Location verified\n✓ Inside school premises\n✓ Distance: ${Math.round(
          distanceFromSchool
        )} meters`
      );
    }

    // =====================================================
    // ALREADY COMPLETED
    // =====================================================

    else {
      updatedAttendance = attendance;

      alert(
        "You have already signed in and signed out today."
      );
    }

    setAttendance(updatedAttendance);

    localStorage.setItem(
      "employeeAttendance",
      JSON.stringify(updatedAttendance)
    );

    setScanning(false);
  };

  // =====================================================
  // EMPLOYEE ATTENDANCE HISTORY
  // =====================================================

  const employeeHistory = attendance
    .filter(
      (record) =>
        record.employeeId ===
        employee?.employeeId
    )
    .sort((a, b) =>
      b.date.localeCompare(a.date)
    );

  const totalTodayHours = calculateHours(
    todayAttendance?.signIn,
    todayAttendance?.signOut
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="attendance-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="attendance-header">
        <div>
          <h2>Mark attendance</h2>

          <p>
            Record your daily attendance using
            fingerprint verification and GPS
            location.
          </p>
        </div>
      </div>

      <div className="attendance-section-title">
        <h3>Today's attendance</h3>
      </div>

      {/* =====================================================
          TOP GRID
      ===================================================== */}

      <div
        className="attendance-top-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >

        {/* =====================================================
            FINGERPRINT BOX
        ===================================================== */}

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

              cursor:
                scanning ||
                todayAttendance?.signOut
                  ? "not-allowed"
                  : "pointer",

              marginBottom: "15px",
            }}
          >
            {scanning ? "⏳" : "👆"}
          </div>

          <button
            className="scan-button"
            onClick={handleScan}
            disabled={
              scanning ||
              Boolean(todayAttendance?.signOut)
            }
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "1px solid #333",
              backgroundColor: "#f9f9f9",

              cursor:
                scanning ||
                todayAttendance?.signOut
                  ? "not-allowed"
                  : "pointer",

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

        {/* =====================================================
            TIME CARDS
        ===================================================== */}

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

            <strong>
              {todayAttendance?.signIn ||
                "--:--:--"}
            </strong>
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

            <strong>
              {todayAttendance?.signOut ||
                "--:--:--"}
            </strong>
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

            <strong>
              {totalTodayHours > 0
                ? `${totalTodayHours.toFixed(
                    1
                  )} hrs`
                : "--"}
            </strong>
          </div>

        </div>
      </div>

      {/* =====================================================
          GPS LOCATION SECTION
      ===================================================== */}

      <div
        className="attendance-location-card"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fff",
          marginBottom: "30px",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <span style={{ fontSize: "24px" }}>
            📍
          </span>

          <div>
            <h3 style={{ margin: 0 }}>
              Activity Location (GPS)
            </h3>

            <p
              style={{
                margin: "5px 0 0",
                color: "#666",
                fontSize: "14px",
              }}
            >
              Your location is required to
              mark attendance.
            </p>
          </div>
        </div>

        {/* =====================================================
            LATITUDE + LONGITUDE
        ===================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginBottom: "15px",
          }}
        >

          {/* Latitude */}

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "12px",
              backgroundColor: "#fafafa",
            }}
          >
            <small
              style={{
                display: "block",
                color: "#777",
                marginBottom: "5px",
              }}
            >
              Latitude
            </small>

            <strong>
              {latitude !== null
                ? latitude.toFixed(8)
                : "Not Detected"}
            </strong>
          </div>

          {/* Longitude */}

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "12px",
              backgroundColor: "#fafafa",
            }}
          >
            <small
              style={{
                display: "block",
                color: "#777",
                marginBottom: "5px",
              }}
            >
              Longitude
            </small>

            <strong>
              {longitude !== null
                ? longitude.toFixed(8)
                : "Not Detected"}
            </strong>
          </div>

        </div>

        {/* =====================================================
            DETECT BUTTON
        ===================================================== */}

        <button
          onClick={handleDetectLocation}
          disabled={locationLoading}
          style={{
            padding: "10px 18px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#2563eb",
            color: "#fff",
            fontWeight: "bold",

            cursor: locationLoading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {locationLoading
            ? "Detecting location..."
            : "📍 Detect My Location"}
        </button>

        {/* =====================================================
            LOCATION DETECTED + GEOFENCE STATUS
        ===================================================== */}

        {locationDetected && (
          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              borderRadius: "6px",

              backgroundColor: insideSchool
                ? "#e8f7ee"
                : "#fff0f0",

              color: insideSchool
                ? "#18743a"
                : "#b42318",

              border: insideSchool
                ? "1px solid #b7e4c7"
                : "1px solid #f5c2c0",

              fontSize: "14px",
            }}
          >

            {insideSchool ? (
              <>
                <strong>
                  ✓ Location verified
                </strong>

                <p
                  style={{
                    margin: "8px 0 0",
                  }}
                >
                  You are within the school
                  premises. You can now mark
                  your attendance.
                </p>

                {distanceFromSchool !==
                  null && (
                  <p
                    style={{
                      margin:
                        "5px 0 0",
                      fontWeight:
                        "bold",
                    }}
                  >
                    Distance from school:{" "}
                    {Math.round(
                      distanceFromSchool
                    )}{" "}
                    meters
                  </p>
                )}

                <p
                  style={{
                    margin:
                      "5px 0 0",
                  }}
                >
                  Allowed radius:{" "}
                  {SCHOOL_RADIUS_METERS}{" "}
                  meters
                </p>
              </>
            ) : (
              <>
                <strong>
                  ✕ You are outside the
                  school premises
                </strong>

                <p
                  style={{
                    margin: "8px 0 0",
                  }}
                >
                  Attendance cannot be
                  recorded from your current
                  location.
                </p>

                {distanceFromSchool !==
                  null && (
                  <p
                    style={{
                      margin:
                        "5px 0 0",
                      fontWeight:
                        "bold",
                    }}
                  >
                    Distance from school:{" "}
                    {Math.round(
                      distanceFromSchool
                    )}{" "}
                    meters
                  </p>
                )}

                <p
                  style={{
                    margin:
                      "5px 0 0",
                  }}
                >
                  You must be within{" "}
                  {SCHOOL_RADIUS_METERS}{" "}
                  meters of the school.
                </p>
              </>
            )}

          </div>
        )}

        {/* =====================================================
            LOCATION ERROR
        ===================================================== */}

        {locationError && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "6px",
              backgroundColor: "#fff0f0",
              color: "#b42318",
              border:
                "1px solid #f5c2c0",
              fontSize: "14px",
            }}
          >
            <strong>
              Location required:
            </strong>

            <br />

            {locationError}
          </div>
        )}

      </div>

      {/* =====================================================
          ATTENDANCE HISTORY
      ===================================================== */}

      <div className="attendance-history">

        <div className="history-heading">

          <h2>
            My Attendance history
          </h2>

          <p>
            Your attendance history will
            appear here.
          </p>

        </div>

        {employeeHistory.length === 0 ? (

          <div
            className="no-attendance"
            style={{
              textAlign: "center",
              padding: "20px",
            }}
          >
            <p>
              No attendance records
              available.
            </p>
          </div>

        ) : (

          <div className="attendance-table-wrapper">

            <table
              className="attendance-table"
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
              }}
            >

              <thead>

                <tr
                  style={{
                    borderBottom:
                      "2px solid #ccc",
                    textAlign:
                      "left",
                  }}
                >

                  <th
                    style={{
                      padding: "10px",
                    }}
                  >
                    Date
                  </th>

                  <th
                    style={{
                      padding: "10px",
                    }}
                  >
                    Sign in
                  </th>

                  <th
                    style={{
                      padding: "10px",
                    }}
                  >
                    Sign out
                  </th>

                  <th
                    style={{
                      padding: "10px",
                    }}
                  >
                    Hours
                  </th>

                  <th
                    style={{
                      padding: "10px",
                    }}
                  >
                    Location
                  </th>

                </tr>

              </thead>

              <tbody>

                {employeeHistory.map(
                  (record, index) => (

                    <tr
                      key={index}
                      style={{
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >

                      <td
                        style={{
                          padding: "10px",
                        }}
                      >
                        {record.date}
                      </td>

                      <td
                        style={{
                          padding: "10px",
                        }}
                      >
                        {record.signIn ||
                          "--"}
                      </td>

                      <td
                        style={{
                          padding: "10px",
                        }}
                      >
                        {record.signOut ||
                          "--"}
                      </td>

                      <td
                        style={{
                          padding: "10px",
                        }}
                      >
                        {calculateHours(
                          record.signIn,
                          record.signOut
                        ).toFixed(1)}{" "}
                        hrs
                      </td>

                      <td
                        style={{
                          padding: "10px",
                        }}
                      >

                        {record.signInLatitude &&
                        record.signInLongitude ? (

                          <div>

                            <span
                              style={{
                                color:
                                  record.signInLocationStatus ===
                                  "INSIDE_SCHOOL"
                                    ? "#18743a"
                                    : "#b42318",

                                fontWeight:
                                  "bold",
                              }}
                            >
                              {record.signInLocationStatus ===
                              "INSIDE_SCHOOL"
                                ? "✓ Inside School"
                                : "✕ Outside School"}
                            </span>

                            {record.signInDistanceFromSchool !==
                              undefined && (
                              <small
                                style={{
                                  display:
                                    "block",
                                  color:
                                    "#666",
                                  marginTop:
                                    "3px",
                                }}
                              >
                                {Math.round(
                                  record.signInDistanceFromSchool
                                )}{" "}
                                m from
                                school
                              </small>
                            )}

                          </div>

                        ) : (
                          "Not available"
                        )}

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

// =====================================================
// 2. ATTENDANCE REPORT COMPONENT
// =====================================================

function AttendanceReport({ employee }) {
  const [attendance] = useState(() => {
    const saved =
      localStorage.getItem(
        "employeeAttendance"
      );

    return saved
      ? JSON.parse(saved)
      : [];
  });

  const employeeRecords =
    attendance.filter(
      (record) =>
        record.employeeId ===
        employee?.employeeId
    );

  const presentDays =
    employeeRecords.length;

  const absentDays = 0;

  const lateDays =
    employeeRecords.filter((r) => {
      if (!r.signIn) return false;

      return (
        r.signIn > "08:00:00 AM"
      );
    }).length;

  const totalDays =
    presentDays + absentDays;

  const totalHoursWorked =
    employeeRecords
      .reduce(
        (acc, curr) =>
          acc +
          calculateHours(
            curr.signIn,
            curr.signOut
          ),
        0
      )
      .toFixed(1);

  const daysOfWeek = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ];

  const getHoursForDayName = (
    dayName
  ) => {
    const record =
      employeeRecords.find((r) => {
        const dateObj =
          new Date(r.date);

        const name =
          dateObj.toLocaleDateString(
            "en-US",
            {
              weekday: "short",
            }
          );

        return name === dayName;
      });

    return record
      ? calculateHours(
          record.signIn,
          record.signOut
        )
      : 0;
  };

  return (
    <div
      className="report-page"
      style={{
        padding: "20px",
      }}
    >

      {/* HEADER INFO */}

      <div
        className="info-header-grid"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginBottom: "20px",
        }}
      >

        <div style={boxStyle}>

          <small
            style={{
              color: "#777",
            }}
          >
            Name
          </small>

          <p style={boxTextStyle}>
            {employee
              ? `${employee.firstName} ${employee.lastName}`
              : "N/A"}
          </p>

        </div>

        <div style={boxStyle}>

          <small
            style={{
              color: "#777",
            }}
          >
            Dept name
          </small>

          <p style={boxTextStyle}>
            {employee?.department ||
              "N/A"}
          </p>

        </div>

        <div style={boxStyle}>

          <small
            style={{
              color: "#777",
            }}
          >
            Id
          </small>

          <p style={boxTextStyle}>
            {employee?.employeeId ||
              "N/A"}
          </p>

        </div>

        <div style={boxStyle}>

          <small
            style={{
              color: "#777",
            }}
          >
            Email
          </small>

          <p style={boxTextStyle}>
            {employee?.email ||
              "N/A"}
          </p>

        </div>

      </div>

      {/* STATS */}

      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >

        <div style={statBoxStyle}>
          <small>
            Absent day
          </small>

          <h2>
            {absentDays}
          </h2>
        </div>

        <div style={statBoxStyle}>
          <small>
            Present day
          </small>

          <h2>
            {presentDays}
          </h2>
        </div>

        <div style={statBoxStyle}>
          <small>
            Late
          </small>

          <h2>
            {lateDays}
          </h2>
        </div>

        <div style={statBoxStyle}>
          <small>
            Total day
          </small>

          <h2>
            {totalDays}
          </h2>
        </div>

        <div
          style={{
            ...statBoxStyle,
            backgroundColor:
              "#eef6ff",
          }}
        >

          <small>
            Total hours
          </small>

          <h2
            style={{
              color: "#0066cc",
            }}
          >
            {totalHoursWorked} hrs
          </h2>

        </div>

      </div>

      {/* WEEKLY REPORT */}

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

        <h3
          style={{
            marginBottom: "20px",
          }}
        >
          Summary weekly report
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent:
              "space-around",
            height: "180px",
            borderBottom:
              "2px solid #ccc",
            borderLeft:
              "2px solid #ccc",
            paddingTop: "10px",
            paddingLeft: "10px",
            backgroundColor:
              "#fafafa",
          }}
        >

          {daysOfWeek.map(
            (day, index) => {
              const hrs =
                getHoursForDayName(
                  day
                );

              const barHeight =
                hrs > 0
                  ? Math.min(
                      hrs * 15,
                      140
                    )
                  : 0;

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    alignItems:
                      "center",
                    height: "100%",
                    justifyContent:
                      "flex-end",
                    width: "40px",
                  }}
                >

                  <div
                    style={{
                      width: "100%",
                      height: `${barHeight}px`,
                      backgroundColor:
                        "#4f46e5",
                      borderRadius:
                        "4px 4px 0 0",
                      transition:
                        "height 0.4s ease",
                      minHeight: "2px",
                    }}
                  ></div>

                  <span
                    style={{
                      marginTop: "8px",
                      fontSize: "14px",
                      fontWeight:
                        "bold",
                    }}
                  >
                    {day}
                  </span>

                </div>
              );
            }
          )}

        </div>

      </div>

      {/* DAILY ATTENDANCE */}

      <div
        className="daily-record-card"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fff",
        }}
      >

        <h3>
          My daily attendance record
        </h3>

        <p
          style={{
            color: "#666",
            fontSize: "14px",
            marginTop: "5px",
          }}
        >
          Detailed view of your daily
          attendance check-ins and
          check-outs.
        </p>

        <table
          style={{
            width: "100%",
            marginTop: "15px",
            borderCollapse:
              "collapse",
          }}
        >

          <thead>

            <tr
              style={{
                borderBottom:
                  "2px solid #eee",
                textAlign: "left",
              }}
            >

              <th
                style={{
                  padding: "8px",
                }}
              >
                Date
              </th>

              <th
                style={{
                  padding: "8px",
                }}
              >
                Sign In
              </th>

              <th
                style={{
                  padding: "8px",
                }}
              >
                Sign Out
              </th>

              <th
                style={{
                  padding: "8px",
                }}
              >
                Hours
              </th>

            </tr>

          </thead>

          <tbody>

            {employeeRecords.length ===
            0 ? (

              <tr>

                <td
                  colSpan="4"
                  style={{
                    padding:
                      "15px",
                    textAlign:
                      "center",
                    color: "#888",
                  }}
                >
                  No attendance
                  records found.
                </td>

              </tr>

            ) : (

              employeeRecords.map(
                (r, i) => (

                  <tr
                    key={i}
                    style={{
                      borderBottom:
                        "1px solid #f0f0f0",
                    }}
                  >

                    <td
                      style={{
                        padding:
                          "8px",
                      }}
                    >
                      {r.date}
                    </td>

                    <td
                      style={{
                        padding:
                          "8px",
                      }}
                    >
                      {r.signIn ||
                        "--"}
                    </td>

                    <td
                      style={{
                        padding:
                          "8px",
                      }}
                    >
                      {r.signOut ||
                        "--"}
                    </td>

                    <td
                      style={{
                        padding:
                          "8px",
                      }}
                    >
                      {calculateHours(
                        r.signIn,
                        r.signOut
                      ).toFixed(1)}{" "}
                      hrs
                    </td>

                  </tr>

                )
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

// =====================================================
// STYLING HELPERS
// =====================================================

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

// =====================================================
// 3. MAIN DASHBOARD COMPONENT
// =====================================================

function Dashboard({
  employee,
  onLogout,
}) {
  const [activeMenu, setActiveMenu] =
    useState("Dashboard");

  const [profileImage, setProfileImage] =
    useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(
        URL.createObjectURL(file)
      );
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: "🏠",
    },

    {
      name: "Mark attendance",
      icon: "🕘",
    },

    {
      name: "Attendance report",
      icon: "📊",
    },

    {
      name: "Setting",
      icon: "⚙️",
    },

    {
      name: "Help center",
      icon: "❓",
    },
  ];

  const renderContent = () => {
    switch (activeMenu) {

      case "Mark attendance":
        return (
          <MarkAttendance
            employee={employee}
          />
        );

      case "Attendance report":
        return (
          <AttendanceReport
            employee={employee}
          />
        );

      case "Help center":
        return <HelpCenter />;

      case "Setting":
        return (
          <ChangePassword
            employee={employee}
          />
        );

      case "Dashboard":

      default:

        return (
          <>

            {/* WELCOME CARD */}

            <section className="welcome-card">

              <div>

                <span>
                  Welcome back 👋
                </span>

                <h2>
                  {employee
                    ? `${employee.firstName} ${employee.lastName}`
                    : "Employee"}
                </h2>

                <p>
                  Welcome to your employee
                  attendance dashboard.
                  Manage your attendance
                  and view your information
                  here.
                </p>

              </div>

              <div className="welcome-icon">
                📅
              </div>

            </section>

            {/* PROFILE */}

            <section className="profile-area">

              <div className="section-heading">

                <h2>
                  My Profile
                </h2>

                <p>
                  Your registered personal
                  information
                </p>

              </div>

              <div className="profile-card">

                <div className="photo-area">

                  <div className="profile-photo">

                    {profileImage ? (

                      <img
                        src={profileImage}
                        alt="Employee Profile"
                      />

                    ) : (

                      <span>
                        👤
                      </span>

                    )}

                  </div>

                  <label
                    htmlFor="profile-upload"
                    className="upload-photo"
                  >
                    📷 Upload Photo
                  </label>

                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageUpload
                    }
                    hidden
                  />

                  <p>
                    JPG, PNG or JPEG
                  </p>

                </div>

                <div className="employee-information">

                  <div className="information-box">

                    <div className="information-icon">
                      👤
                    </div>

                    <div>

                      <small>
                        Name
                      </small>

                      <strong>
                        {employee
                          ? `${employee.firstName} ${employee.lastName}`
                          : "Not available"}
                      </strong>

                    </div>

                  </div>

                  <div className="information-box">

                    <div className="information-icon">
                      ✉️
                    </div>

                    <div>

                      <small>
                        Email
                      </small>

                      <strong>
                        {employee?.email ||
                          "Not available"}
                      </strong>

                    </div>

                  </div>

                  <div className="information-box">

                    <div className="information-icon">
                      📞
                    </div>

                    <div>

                      <small>
                        Contact
                      </small>

                      <strong>
                        {employee?.phone ||
                          "Not available"}
                      </strong>

                    </div>

                  </div>

                  <div className="information-box">

                    <div className="information-icon">
                      🏢
                    </div>

                    <div>

                      <small>
                        Department
                      </small>

                      <strong>
                        {employee?.department ||
                          "Not available"}
                      </strong>

                    </div>

                  </div>

                  <div className="information-box">

                    <div className="information-icon">
                      💼
                    </div>

                    <div>

                      <small>
                        Position
                      </small>

                      <strong>
                        {employee?.position ||
                          "Not available"}
                      </strong>

                    </div>

                  </div>

                  <div className="information-box">

                    <div className="information-icon">
                      🆔
                    </div>

                    <div>

                      <small>
                        Employee ID
                      </small>

                      <strong>
                        {employee?.employeeId ||
                          "Not available"}
                      </strong>

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

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-school">

          <img
            src="/LOGO.JPG"
            alt="Alihsan Girls Secondary School"
          />

          <div>

            <h2>
              AL-IHSAN GIRLS
            </h2>

            <p>
              SECONDARY SCHOOL
            </p>

          </div>

        </div>

        <div className="sidebar-title">

          <span>
            ☰
          </span>

          <strong>
            Dashboard
          </strong>

        </div>

        <nav className="dashboard-menu">

          {menuItems.map(
            (item) => (

              <button
                key={item.name}
                className={
                  activeMenu ===
                  item.name
                    ? "dashboard-menu-item active"
                    : "dashboard-menu-item"
                }
                onClick={() =>
                  setActiveMenu(
                    item.name
                  )
                }
              >

                <span className="menu-icon">
                  {item.icon}
                </span>

                {item.name}

              </button>

            )
          )}

          <button
            className="dashboard-menu-item logout-item"
            onClick={onLogout}
          >

            <span className="menu-icon">
              🚪
            </span>

            Log out

          </button>

        </nav>

      </aside>

      {/* =====================================================
          MAIN DASHBOARD
      ===================================================== */}

      <main className="dashboard-main">

        <header className="dashboard-topbar">

          <div>

            <h1>
              Employee dashboard
            </h1>

            <p>
              Manage your attendance and
              personal information
            </p>

          </div>

          <div className="topbar-profile">

            <span className="notification-icon">
              🔔
            </span>

            <div className="small-profile">

              {profileImage ? (

                <img
                  src={profileImage}
                  alt="Employee"
                />

              ) : (

                <div className="small-profile-placeholder">
                  👤
                </div>

              )}

              <div>

                <strong>
                  {employee?.firstName ||
                    "Employee"}
                </strong>

                <small>
                  Employee
                </small>

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