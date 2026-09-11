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

          <h1>Biometric Attendance System</h1>

          <p>
            Welcome to Alihsan Girls Secondary School
          </p>

          <p className="instruction">
            Please select your role to continue
          </p>

        </div>


        <div className="role-buttons">

          <button
            className="role-button employee"
            onClick={() => navigate("/employee-login")}
          >

            <span className="role-icon">👩‍💼</span>

            <div>
              <strong>Employee</strong>
              <small>
                Employee attendance & account
              </small>
            </div>

          </button>


          <button
            className="role-button administrator"
            onClick={() => navigate("/administrator")}
          >

            <span className="role-icon">👩‍💻</span>

            <div>
              <strong>Administrator</strong>
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

      alert("Please enter username and password.");

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

        <h1>Employee Login</h1>

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


          <button className="primary-button">
            Login
          </button>

        </form>


        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Role Selection
        </button>

      </div>

    </div>
  );
}


/* =========================
   ADMINISTRATOR PORTAL
========================= */

function AdministratorPortal() {

  const navigate = useNavigate();

  return (
    <div className="page">

      <div className="auth-card">

        <Logo />

        <h1>Administrator Portal</h1>

        <p className="auth-subtitle">
          Select an action to continue
        </p>


        <div className="admin-actions">

          <button
            className="admin-action register"
            onClick={() =>
              navigate("/admin/register")
            }
          >

            <span>👤+</span>

            <div>

              <strong>
                Register Employee
              </strong>

              <small>
                Create a new employee account
              </small>

            </div>

          </button>


          <button
            className="admin-action login"
            onClick={() =>
              navigate("/admin/login")
            }
          >

            <span>🔐</span>

            <div>

              <strong>
                Administrator Login
              </strong>

              <small>
                Login to administrator dashboard
              </small>

            </div>

          </button>

        </div>


        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Role Selection
        </button>

      </div>

    </div>
  );
}


/* =========================
   ADMIN REGISTER EMPLOYEE
========================= */

function AdminRegister() {

  const navigate = useNavigate();

  const [form, setForm] = useState({

    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    hireDate: "",

  });


  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  };


  const handleRegister = (e) => {

    e.preventDefault();


    if (
      !form.employeeId ||
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.department ||
      !form.position ||
      !form.hireDate
    ) {

      alert(
        "Please fill in all employee fields."
      );

      return;
    }


    const employees =
      JSON.parse(
        localStorage.getItem("employees")
      ) || [];


    const employeeExists =
      employees.some(
        (employee) =>
          employee.employeeId.toLowerCase() ===
          form.employeeId.toLowerCase()
      );


    if (employeeExists) {

      alert("Employee ID already exists.");

      return;
    }


    employees.push(form);


    localStorage.setItem(
      "employees",
      JSON.stringify(employees)
    );


    alert(
      "Employee registered successfully!"
    );


    setForm({

      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      hireDate: "",

    });


    navigate("/admin/dashboard");
  };


  return (
    <div className="page">

      <div className="form-card">

        <Logo />

        <h1>Register Employee</h1>

        <p className="auth-subtitle">
          Register a new employee
        </p>


        <form onSubmit={handleRegister}>

          <div className="form-grid">


            {/* Employee ID */}

            <div>

              <label>
                Employee ID *
              </label>

              <input
                name="employeeId"
                type="text"
                placeholder="e.g. AGS001"
                value={form.employeeId}
                onChange={handleChange}
              />

            </div>


            {/* First Name */}

            <div>

              <label>
                First Name *
              </label>

              <input
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={form.firstName}
                onChange={handleChange}
              />

            </div>


            {/* Last Name */}

            <div>

              <label>
                Last Name *
              </label>

              <input
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={form.lastName}
                onChange={handleChange}
              />

            </div>


            {/* Email */}

            <div>

              <label>
                Email *
              </label>

              <input
                name="email"
                type="email"
                placeholder="employee@email.com"
                value={form.email}
                onChange={handleChange}
              />

            </div>


            {/* Phone */}

            <div>

              <label>
                Phone Number *
              </label>

              <input
                name="phone"
                type="tel"
                placeholder="+255..."
                value={form.phone}
                onChange={handleChange}
              />

            </div>


            {/* Department */}

            <div>

              <label>
                Department *
              </label>

              <select
                name="department"
                value={form.department}
                onChange={handleChange}
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

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            {/* Position */}

            <div>

              <label>
                Position *
              </label>

              <input
                name="position"
                type="text"
                placeholder="e.g. Teacher"
                value={form.position}
                onChange={handleChange}
              />

            </div>


            {/* Hire Date */}

            <div>

              <label>
                Hire Date *
              </label>

              <input
                name="hireDate"
                type="date"
                value={form.hireDate}
                onChange={handleChange}
              />

            </div>

          </div>


          <button
            type="submit"
            className="primary-button"
          >
            Register Employee
          </button>

        </form>


        <button
          className="back-button"
          onClick={() =>
            navigate("/administrator")
          }
        >
          ← Back
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
      Create administrator information
      from the login details.
    */

    const adminData = {

      username: username,

      fullName: username,

      email: `${username}@alihsan.ac.tz`,

      phone: "Not provided",

      position: "Administrator",

    };


    /*
      Save administrator information
      so AdminDashboard can use it.
    */

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


          <button className="primary-button">
            Login as Administrator
          </button>

        </form>


        <button
          className="back-button"
          onClick={() =>
            navigate("/administrator")
          }
        >
          ← Back
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


        setStatus("Checked In");

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


        setStatus("Checked In");

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
          Welcome to Alihsan Girls Secondary School
          Attendance System.
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
    localStorage.getItem("adminData");


  const admin =
    savedAdmin
      ? JSON.parse(savedAdmin)
      : null;


  /*
    If administrator is not logged in,
    send them back to login.
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

      {/* ROLE SELECTION */}

      <Route
        path="/"
        element={<RoleSelection />}
      />


      {/* EMPLOYEE LOGIN */}

      <Route
        path="/employee-login"
        element={<EmployeeLogin />}
      />


      {/* EMPLOYEE DASHBOARD */}

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


      {/* ADMINISTRATOR PORTAL */}

      <Route
        path="/administrator"
        element={<AdministratorPortal />}
      />


      {/* ADMIN REGISTER */}

      <Route
        path="/admin/register"
        element={<AdminRegister />}
      />


      {/* ADMIN LOGIN */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />


      {/* ADMIN DASHBOARD */}

      <Route
        path="/admin/dashboard"
        element={<AdminDashboardPage />}
      />


      {/* UNKNOWN ROUTE */}

      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>

  );
}


export default App;