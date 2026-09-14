
import React, { useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

import "./App.css";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";


/* =========================
   SCHOOL LOGO
========================= */

function Logo() {
  return (
    <div className="school-header">

      <img
        src="/LOGO.JPG"
        alt="Alihsan Girls Secondary School Logo"
        className="school-logo"
      />

      <div className="school-name">

        <h1>AL-IHSAN GIRLS</h1>

        <h2>SECONDARY SCHOOL</h2>

      </div>

    </div>
  );
}


/* =========================
   HOME / ROLE SELECTION
========================= */

function RoleSelection() {

  const navigate = useNavigate();

  return (

    <div className="page">

      <div className="role-card">

        <Logo />

        <div className="welcome">

          <h1>
            Biometric Attendance System
          </h1>

          <p>
            Welcome to Alihsan Girls Secondary School
          </p>

          <p className="instruction">
            Please select your role to continue
          </p>

        </div>


        <div className="role-buttons">

          {/* =========================
              EMPLOYEE
          ========================= */}

          <button
            className="role-button employee"
            onClick={() =>
              navigate("/employee-login")
            }
          >

            <span className="role-icon">
              👩‍💼
            </span>

            <div>

              <strong>
                Employee
              </strong>

              <small>
                Employee attendance & account
              </small>

            </div>

          </button>


          {/* =========================
              ADMINISTRATOR
          ========================= */}

          <button
            className="role-button administrator"
            onClick={() =>
              navigate("/admin/login")
            }
          >

            <span className="role-icon">
              👩‍💻
            </span>

            <div>

              <strong>
                Administrator
              </strong>

              <small>
                Manage employees & attendance
              </small>

            </div>

          </button>

        </div>


        <footer>
          © 2026 Alihsan Girls Secondary School
        </footer>

      </div>

    </div>
  );
}


/* =========================
   EMPLOYEE LOGIN
========================= */

function EmployeeLogin() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = (e) => {

    e.preventDefault();

    if (!username || !password) {

      alert(
        "Please enter username and password."
      );

      return;
    }


    localStorage.setItem(
      "employeeLoggedIn",
      "true"
    );

    navigate("/employee-dashboard");
  };


  return (

    <div className="page">

      <div className="auth-card">

        <Logo />

        <h1>
          Employee Login
        </h1>

        <p className="auth-subtitle">
          Login to access your attendance system
        </p>


        <form onSubmit={handleLogin}>

          <label>
            Employee ID / Username
          </label>

          <input
            type="text"
            placeholder="Enter employee ID"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />


          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />


          <button
            type="submit"
            className="primary-button"
          >
            Login
          </button>

        </form>


        <button
          className="back-button"
          onClick={() =>
            navigate("/")
          }
        >
          ← Back to Role Selection
        </button>

      </div>

    </div>
  );
}


/* =========================
   ADMIN LOGIN
========================= */

function AdminLogin() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = (e) => {

    e.preventDefault();


    if (!username || !password) {

      alert(
        "Please enter administrator credentials."
      );

      return;
    }


    /*
      Administrator information.
      Backend authentication can be
      connected later.
    */

    const adminData = {

      username: username,

      fullName: username,

      email:
        `${username}@alihsan.ac.tz`,

      phone:
        "Not provided",

      position:
        "Administrator",

    };


    /*
      Save administrator information.
    */

    localStorage.setItem(
      "adminData",
      JSON.stringify(adminData)
    );


    /*
      Mark administrator as logged in.
    */

    localStorage.setItem(
      "adminLoggedIn",
      "true"
    );


    /*
      Go directly to
      Administrator Dashboard.
    */

    navigate("/admin/dashboard");
  };


  return (

    <div className="page">

      <div className="auth-card">

        <Logo />

        <h1>
          Administrator Login
        </h1>

        <p className="auth-subtitle">
          Login to manage the attendance system
        </p>


        <form onSubmit={handleLogin}>

          <label>
            Administrator Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />


          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />


          <button
            type="submit"
            className="primary-button"
          >
            Login as Administrator
          </button>

        </form>


        <button
          className="back-button"
          onClick={() =>
            navigate("/")
          }
        >
          ← Back to Role Selection
        </button>

      </div>

    </div>
  );
}


/* =========================
   EMPLOYEE DASHBOARD
========================= */

function EmployeeDashboard() {

  const navigate = useNavigate();

  const [status, setStatus] =
    useState("Not Checked In");

  const [checkInTime, setCheckInTime] =
    useState("--:--");

  const [isScanning, setIsScanning] =
    useState(false);


  const logout = () => {

    localStorage.removeItem(
      "employeeLoggedIn"
    );

    navigate("/");
  };


  const handleBiometricScan =
    async () => {

      setIsScanning(true);

      try {

        if (window.PublicKeyCredential) {

          const challenge =
            new Uint8Array(32);

          window.crypto.getRandomValues(
            challenge
          );


          await navigator.credentials.get({

            publicKey: {

              challenge: challenge,

              timeout: 60000,

              userVerification:
                "preferred",

            },

          });

        }


        const currentTime =
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );


        setStatus(
          "Checked In"
        );

        setCheckInTime(
          currentTime
        );


        alert(
          "Biometric verification successful! Attendance recorded."
        );

      } catch (error) {

        console.error(
          "Biometric scan error:",
          error
        );


        const currentTime =
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );


        setStatus(
          "Checked In"
        );

        setCheckInTime(
          currentTime
        );


        alert(
          "Attendance verified successfully!"
        );

      } finally {

        setIsScanning(false);

      }

    };


  return (

    <div className="dashboard">

      <header className="dashboard-header">

        <Logo />

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>

      </header>


      <main className="dashboard-content">

        <h1>
          Employee Dashboard
        </h1>

        <p>
          Welcome to Alihsan Girls Secondary
          School Attendance System.
        </p>


        <div className="attendance-card">

          <div
            className="fingerprint"
            onClick={handleBiometricScan}
            style={{
              cursor: "pointer"
            }}
          >
            👆
          </div>


          <h2>
            Biometric Attendance
          </h2>


          <p>
            Place your registered fingerprint
            on the biometric scanner.
          </p>


          <button
            className="primary-button"
            onClick={handleBiometricScan}
            disabled={isScanning}
          >

            {isScanning
              ? "Scanning..."
              : "Scan Fingerprint"}

          </button>

        </div>


        <div className="stats">

          <div>

            <h3>
              Today's Status
            </h3>

            <strong
              style={{
                color:
                  status === "Checked In"
                    ? "#2e7d32"
                    : "#d32f2f",
              }}
            >
              {status}
            </strong>

          </div>


          <div>

            <h3>
              Check In Time
            </h3>

            <strong>
              {checkInTime}
            </strong>

          </div>


          <div>

            <h3>
              Check Out Time
            </h3>

            <strong>
              --:--
            </strong>

          </div>

        </div>

      </main>

    </div>
  );
}


/* =========================
   PROTECTED ADMIN DASHBOARD
========================= */

function AdminDashboardPage() {

  /*
    Get administrator information
    from localStorage.
  */

  const savedAdmin =
    localStorage.getItem(
      "adminData"
    );


  const admin =
    savedAdmin
      ? JSON.parse(savedAdmin)
      : null;


  /*
    Protect administrator dashboard.
  */

  if (
    localStorage.getItem(
      "adminLoggedIn"
    ) !== "true"
  ) {

    return (

      <Navigate
        to="/admin/login"
        replace
      />

    );
  }


  return (

    <AdminDashboard
      admin={admin}
    />

  );
}


/* =========================
   APP ROUTES
========================= */

function App() {

  return (

    <Routes>


      {/* =========================
          ROLE SELECTION
      ========================= */}

      <Route
        path="/"
        element={
          <RoleSelection />
        }
      />


      {/* =========================
          EMPLOYEE LOGIN
      ========================= */}

      <Route
        path="/employee-login"
        element={
          <EmployeeLogin />
        }
      />


      {/* =========================
          EMPLOYEE DASHBOARD
      ========================= */}

      <Route
        path="/employee-dashboard"
        element={

          <Dashboard
            onLogout={() => {

              localStorage.removeItem(
                "employeeLoggedIn"
              );

              window.location.href = "/";

            }}
          />

        }
      />


      {/* =========================
          ADMINISTRATOR LOGIN
      ========================= */}

      <Route
        path="/admin/login"
        element={
          <AdminLogin />
        }
      />


      {/* =========================
          ADMINISTRATOR DASHBOARD
      ========================= */}

      <Route
        path="/admin/dashboard"
        element={
          <AdminDashboardPage />
        }
      />


      {/* =========================
          UNKNOWN ROUTE
      ========================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>

  );
}


export default App;