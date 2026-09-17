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
import { getEmployees } from "./services/api";

/* =========================
   SCHOOL LOGO
========================= */

function Logo() {
  return (
    <div className="school-header">

      <img
        src="/LOGO.jpg"
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

          {/* EMPLOYEE */}

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


          {/* ADMINISTRATOR */}

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

  const [loading, setLoading] = useState(false);


  /* =========================
     HANDLE EMPLOYEE LOGIN
  ========================= */

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!username || !password) {

      alert(
        "Please enter username and password."
      );

      return;
    }

    try {

      setLoading(true);

      /*
       * Get employees from backend
       *
       * GET:
       * http://localhost:8080/api/employees
       */

      const employees = await getEmployees();


      /*
       * Find employee whose username
       * and password match the login.
       */

      const employee = employees.find(
        (item) =>
          String(item.username).toLowerCase() ===
            username.toLowerCase() &&
          String(item.password) === password
      );


      /*
       * No employee found
       */

      if (!employee) {

        alert(
          "Invalid username or password."
        );

        return;
      }


      /*
       * Convert backend field names
       * to frontend field names.
       *
       * Backend:
       * employeeid
       * firstname
       * lastname
       * hiredate
       *
       * Frontend Dashboard:
       * employeeId
       * firstName
       * lastName
       * hireDate
       */

      const employeeData = {

        employeeId: employee.employeeid,

        firstName: employee.firstname,

        lastName: employee.lastname,

        email: employee.email,

        phone: employee.phone,

        department: employee.department,

        position: employee.position,

        hireDate: employee.hiredate,

        username: employee.username,

        status: employee.status,

      };


      /*
       * Save employee login status
       */

      localStorage.setItem(
        "employeeLoggedIn",
        "true"
      );


      /*
       * Save employee information
       */

      localStorage.setItem(
        "employeeData",
        JSON.stringify(employeeData)
      );


      /*
       * Open Employee Dashboard
       */

      navigate("/employee-dashboard");

    } catch (error) {

      console.error(
        "Employee login error:",
        error
      );

      alert(
        "Unable to connect to the backend. Make sure Spring Boot is running on port 8080."
      );

    } finally {

      setLoading(false);

    }

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
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

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
     * Temporary administrator information.
     * Backend authentication can be connected later.
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


    localStorage.setItem(
      "adminData",
      JSON.stringify(adminData)
    );


    localStorage.setItem(
      "adminLoggedIn",
      "true"
    );


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
np
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
   PROTECTED EMPLOYEE DASHBOARD
========================= */

function EmployeeDashboardPage() {

  /*
   * Get employee information
   * saved during login.
   */

  const savedEmployee =
    localStorage.getItem(
      "employeeData"
    );


  const employee =
    savedEmployee
      ? JSON.parse(savedEmployee)
      : null;


  /*
   * Protect Employee Dashboard.
   */

  if (
    localStorage.getItem(
      "employeeLoggedIn"
    ) !== "true" ||
    !employee
  ) {

    return (

      <Navigate
        to="/employee-login"
        replace
      />

    );
  }


  /*
   * Show the real employee dashboard
   * and pass employee information.
   */

  return (

    <Dashboard
      employee={employee}
      onLogout={() => {

        localStorage.removeItem(
          "employeeLoggedIn"
        );

        localStorage.removeItem(
          "employeeData"
        );

        window.location.href = "/";

      }}
    />

  );
}


/* =========================
   PROTECTED ADMIN DASHBOARD
========================= */

function AdminDashboardPage() {

  /*
   * Get administrator information
   * from localStorage.
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
   * Protect administrator dashboard.
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
          <EmployeeDashboardPage />
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
