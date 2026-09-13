
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
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
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
{/* =============== VIEW EMPLOYEES ATTENDANCE SECTION =============== */}
{activeMenu === "View Employees Attendance" && (
  <div className="view-attendance-container" style={{ padding: '20px' }}>
    
    {/* 1. Header */}
    <div style={{ marginBottom: '20px' }}>
      <h2 style={{ margin: '0 0 5px 0' }}>View Employees Attendance</h2>
      <p style={{ margin: 0, color: '#666' }}>
        Administrator will be able to view and monitor employee attendance records here.
      </p>
    </div>

    {/* 2. Summary Cards (Zote zinaanza na 0) */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginBottom: '25px' }}>
      <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', border: '1px solid #bbdefb', textAlign: 'center' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#0d47a1' }}>Total emp</h4>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>0</span>
      </div>

      <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px', border: '1px solid #c8e6c9', textAlign: 'center' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#1b5e20' }}>Present today</h4>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>0</span>
      </div>

      <div style={{ backgroundColor: '#fffde7', padding: '15px', borderRadius: '8px', border: '1px solid #fff9c4', textAlign: 'center' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#f57f17' }}>Late today</h4>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>0</span>
      </div>

      <div style={{ backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px', border: '1px solid #ffcdd2', textAlign: 'center' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#b71c1c' }}>Absent today</h4>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>0</span>
      </div>
    </div>

    {/* 3. Bar Graph Section (Haina Data) */}
    <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e0e0e0', marginBottom: '25px' }}>
      <h4 style={{ margin: '0 0 15px 0', textAlign: 'center', color: '#333' }}>
        Overall employees weekly report / records
      </h4>
      
      {/* Visual za Grafu Tupu */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '180px', borderBottom: '2px solid #333', borderLeft: '2px solid #333', paddingBottom: '5px' }}>
        {['Mon', 'Tue', 'Wed', 'Thur', 'Fri'].map((day, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '35px' }}>
            <div style={{ height: '0px', width: '100%', backgroundColor: '#2e7d32' }}></div>
            <span style={{ marginTop: '8px', fontSize: '13px', fontWeight: 'bold' }}>{day}</span>
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', marginTop: '10px' }}>
        No weekly attendance data available yet.
      </p>
    </div>

    {/* 4. Table Section (Ujumbe wa Kitu tupu) */}
    <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
        Employees daily attendance records history will appear here.
      </h4>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px' }}>Date</th>
              <th style={{ padding: '10px' }}>Picture</th>
              <th style={{ padding: '10px' }}>Name</th>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Position</th>
              <th style={{ padding: '10px' }}>Sign in</th>
              <th style={{ padding: '10px' }}>Sign out</th>
              <th style={{ padding: '10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="8" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                <div style={{ fontSize: '30px', marginBottom: '10px' }}>📂</div>
                No attendance records found. Data will appear once recorded.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
)}


        {/* ================= MANAGE EMPLOYEE ================= */}
        
{/* =============== MANAGE EMPLOYEE SECTION =============== */}
{(activeMenu === "Manage Employee" || activeMenu === "Manage employee") && (
  <div className="manage-employee-container" style={{ padding: '20px', maxWidth: '1000px' }}>
    
    {/* Header */}
    <div style={{ marginBottom: '25px' }}>
      <h2 style={{ margin: '0 0 5px 0', color: '#1b4332' }}>Employee Management</h2>
      <p style={{ margin: 0, color: '#666' }}>
        Register new employees, update details, or manage existing staff records.
      </p>
    </div>

    {/* 1. Add New Employee Form */}
    <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '10px', border: '1px solid #e0e0e0', marginBottom: '25px' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#1b4332', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ➕ Add New Employee
      </h3>
      
    <form onSubmit={(e) => {
  e.preventDefault();
  alert("Data saved successfully!");
}}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Full Name</label>
          <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Employee ID / Reg No</label>
          <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Department / Position</label>
          <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Email Address</label>
          <input type="email" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Phone Number</label>
          <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Biometric / Card ID</label>
          <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <div style={{ gridColumn: 'span 2', textAlign: 'right', marginTop: '10px' }}>
          <button style={{
            backgroundColor: '#1b4332',
            color: '#ffffff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Save Employee
          </button>
        </div>
      </form>
    </div>

    {/* 2. Search & Staff Directory Section */}
    <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#1b4332', fontSize: '16px' }}>
          🔍 Search & Manage Employees
        </h3>
      </div>

      {/* Search Input Box */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by name, ID, or department..." 
          style={{ 
            width: '100%', 
            padding: '12px 15px', 
            borderRadius: '8px', 
            border: '1px solid #ccc', 
            fontSize: '14px',
            boxSizing: 'border-box' 
          }} 
        />
      </div>

      {/* Employees Table with Action Buttons */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
            <th style={{ padding: '12px', color: '#333' }}>ID</th>
            <th style={{ padding: '12px', color: '#333' }}>Full Name</th>
            <th style={{ padding: '12px', color: '#333' }}>Department</th>
            <th style={{ padding: '12px', color: '#333' }}>Status</th>
            <th style={{ padding: '12px', color: '#333', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Mfano wa muundo pindi data zitakapokuwepo */}
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
              No employee records found. Use the search bar or add a new employee above.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
)}

        {/* ================= SETTINGS ================= */}
     {/* =============== SETTINGS SECTION =============== */}
{(activeMenu === "Settings" || activeMenu === "Setting") && (
  <div className="settings-container" style={{ padding: '20px', maxWidth: '900px' }}>
    
    {/* Header */}
    <div style={{ marginBottom: '25px' }}>
      <h2 style={{ margin: '0 0 5px 0', color: '#1b4332' }}>System & Profile Settings</h2>
      <p style={{ margin: 0, color: '#666' }}>
        Configure system rules, update administrator profile, and manage security settings.
      </p>
    </div>

    {/* 1. Administrator Profile */}
    <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '10px', border: '1px solid #e0e0e0', marginBottom: '20px' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#1b4332', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        👤 Administrator Profile
      </h3>
      <p style={{ color: '#777', fontSize: '13px', marginBottom: '20px' }}>
        Update profile information for the administrator account.
      </p>
      
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Full Name</label>
          <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Email Address</label>
          <input type="email" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Phone Number</label>
          <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Role</label>
          <input type="text" value="Administrator" disabled style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#f5f5f5', color: '#777', boxSizing: 'border-box' }} />
        </div>
      </form>
    </div>

    {/* 2. Attendance & Work Time Rules */}
    <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '10px', border: '1px solid #e0e0e0', marginBottom: '20px' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#1b4332', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ⏰ Attendance & Work Time Rules
      </h3>
      <p style={{ color: '#777', fontSize: '13px', marginBottom: '20px' }}>
        Set official arrival and departure times for employees.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Official Arrival Time (Sign In)</label>
          <input type="time" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Official Departure Time (Sign Out)</label>
          <input type="time" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
      </div>
    </div>

    {/* 3. Security & Password Settings */}
    <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '10px', border: '1px solid #e0e0e0', marginBottom: '25px' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#1b4332', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🔒 Security & Change Password
      </h3>
      <p style={{ color: '#777', fontSize: '13px', marginBottom: '20px' }}>
        Change password to keep the administrator account secure.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Current Password</label>
          <input type="password" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>New Password</label>
          <input type="password" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Confirm New Password</label>
          <input type="password" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
      </div>
    </div>

    {/* Save Changes Button */}
    <div style={{ textAlign: 'right' }}>
      <button style={{
        backgroundColor: '#1b4332',
        color: '#ffffff',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}>
        Save Changes
      </button>
    </div>

  </div>
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
