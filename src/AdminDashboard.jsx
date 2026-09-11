
import React, { useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ admin }) {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [adminPhoto, setAdminPhoto] = useState(null);

  const menuItems = [
    { name: "Home", icon: "🏠" },
    { name: "View Employees Attendance", icon: "👥" },
    { name: "Manage Employee", icon: "👤" },
    { name: "Settings", icon: "⚙️" },
    { name: "Help Center", icon: "❓" },
  ];

  // Handle administrator photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAdminPhoto(imageUrl);
    }
  };

  // Use real admin information when available
  const adminName = admin?.fullName || admin?.username || "Administrator";
  const adminEmail = admin?.email || "Not provided";
  const adminPhone = admin?.phone || "Not provided";
  const adminPosition = admin?.position || "Administrator";

  return (
    <div className="admin-dashboard">

      {/* ================= SIDEBAR ================= */}
      <aside className="admin-sidebar">

        <div className="school-logo">

          <img
            src="/LOGO.JPG"
            alt="School Logo"
            className="sidebar-logo"
          />

          <div>
            <h2>AL-IHSAN</h2>
            <p>GIRLS SECONDARY SCHOOL</p>
          </div>

        </div>

        <div className="sidebar-line"></div>

        <nav className="admin-menu">

          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`menu-item ${
                activeMenu === item.name ? "active" : ""
              }`}
              onClick={() => setActiveMenu(item.name)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}

        </nav>

        <button
          className="logout-button"
          onClick={() => alert("Logout clicked")}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>

      </aside>


      {/* ================= MAIN CONTENT ================= */}
      <main className="admin-main">

        {/* TOP BAR */}
        <div className="top-bar">

          <div>
            <h1>Administrator Dashboard</h1>

            <p>
              Manage and monitor the employee attendance system.
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
                {adminName.substring(0, 2).toUpperCase()}
              </div>
            )}

            <div>
              <strong>{adminName}</strong>
              <span>{adminPosition}</span>
            </div>

          </div>

        </div>


        {/* ================= HOME ================= */}
        {activeMenu === "Home" && (

          <section className="home-section">

            {/* WELCOME CARD */}
            <div className="welcome-card">

              <div>

                <h2>
                  Welcome back, {adminName}! 👋
                </h2>

                <p>
                  Welcome to the Al-Ihsan Girls Secondary School
                  Employee Attendance Management System.
                </p>

              </div>

            </div>


            {/* ADMIN PROFILE */}
            <div className="profile-card">

              <div className="profile-header">

                <div>
                  <h2>Administrator Profile</h2>

                  <p>
                    Your personal information
                  </p>
                </div>

              </div>


              <div className="profile-content">

                {/* ================= PHOTO SECTION ================= */}
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
                        {adminName.substring(0, 2).toUpperCase()}
                      </div>

                    )}

                  </div>


                  <h3>{adminName}</h3>

                  <p>{adminPosition}</p>


                  {/* UPLOAD PHOTO */}
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


                {/* ================= ADMIN INFORMATION ================= */}
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


        {/* ================= ATTENDANCE ================= */}
        {activeMenu === "View Employees Attendance" && (

          <section className="content-section">

            <h2>View Employees Attendance</h2>

            <p>
              Administrator will be able to view and monitor
              employee attendance records here.
            </p>


            <div className="coming-card">

              <span>👥</span>

              <h3>Employee Attendance</h3>

              <p>
                Attendance records will appear here.
              </p>

            </div>

          </section>

        )}


        {/* ================= MANAGE EMPLOYEE ================= */}
        {activeMenu === "Manage Employee" && (

          <section className="content-section">

            <h2>Manage Employee</h2>

            <p>
              Add, update, view and delete employees from
              the system.
            </p>


            <div className="coming-card">

              <span>👤</span>

              <h3>Employee Management</h3>

              <p>
                Employee management features will appear here.
              </p>

            </div>

          </section>

        )}


        {/* ================= SETTINGS ================= */}
        {activeMenu === "Settings" && (

          <section className="content-section">

            <h2>Settings</h2>

            <p>
              Manage administrator and system settings.
            </p>


            <div className="coming-card">

              <span>⚙️</span>

              <h3>System Settings</h3>

              <p>
                Settings options will appear here.
              </p>

            </div>

          </section>

        )}


        {/* ================= HELP CENTER ================= */}
        {activeMenu === "Help Center" && (

          <section className="content-section">

            <h2>Help Center</h2>

            <p>
              Find help and information about using the system.
            </p>


            <div className="coming-card">

              <span>❓</span>

              <h3>How can we help?</h3>

              <p>
                Help and system guidance will appear here.
              </p>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default AdminDashboard;
