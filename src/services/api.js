const API_BASE_URL = "http://localhost:8080/api";


//EMPLOYEES
 // EMPLOYEES

export async function getEmployees() {
  const response = await fetch(
    `${API_BASE_URL}/employees`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch employees"
    );
  }

  return response.json();
}


export async function createEmployee(employee) {
  const response = await fetch(
    `${API_BASE_URL}/employees`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(employee),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create employee"
    );
  }

  return response.text();
}


// UPDATE EMPLOYEE

export async function updateEmployee(id, employee) {
  const response = await fetch(
    `${API_BASE_URL}/employees/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(employee),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update employee"
    );
  }

  return response.text();
}


// DELETE EMPLOYEE

export async function deleteEmployee(id) {
  const response = await fetch(
    `${API_BASE_URL}/employees/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete employee"
    );
  }

  return response.text();
}
// ATTENDANCE

export async function getAttendance() {
  const response = await fetch(
    `${API_BASE_URL}/attendance`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch attendance"
    );
  }

  return response.json();
}


// CREATE ATTENDANCE - CHECK IN

export async function createAttendance(attendance) {
  const response = await fetch(
    `${API_BASE_URL}/attendance`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(attendance),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create attendance"
    );
  }

  return response.text();
}


// UPDATE ATTENDANCE - CHECK OUT

export async function updateAttendance(
  id,
  attendance
) {
  const response = await fetch(
    `${API_BASE_URL}/attendance/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(attendance),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update attendance"
    );
  }

  return response.text();
}


//ADMIN

export async function getAdmins() {
const response = await fetch(`${API_BASE_URL}/admin`);

if (!response.ok) {
throw new Error("Failed to fetch administrators");
}

return response.json();
}



//BIOMETRIC


export async function getBiometrics() {
const response = await fetch(`${API_BASE_URL}/biometric`);

if (!response.ok) {
throw new Error("Failed to fetch biometric records");
}

return response.json();
}

 

// SYSTEM SETTINGS


export async function getSystemSettings() {
const response = await fetch(`${API_BASE_URL}/system`);

if (!response.ok) {
throw new Error("Failed to fetch system settings");
}

return response.json();
}
