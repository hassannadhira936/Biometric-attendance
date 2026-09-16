package com.example.Biometric_attendance.operations;

import com.example.Biometric_attendance.model.employee;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public class EmployeeOperations {

    private final JdbcTemplate jdbcTemplate;

    public EmployeeOperations(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ==========================================
    // GET ALL EMPLOYEES
    // ==========================================
    public List<employee> getAllEmployees() {

        String sql = "SELECT * FROM employee";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            employee emp = new employee();

            emp.setEmployeeid(rs.getInt("employeeid"));
            emp.setFirstname(rs.getString("firstname"));
            emp.setLastname(rs.getString("lastname"));
            emp.setEmail(rs.getString("email"));
            emp.setPhone(rs.getString("phone"));
            emp.setDepartment(rs.getString("department"));
            emp.setPosition(rs.getString("position"));
            emp.setHiredate(
                    rs.getDate("hiredate") != null
                            ? rs.getDate("hiredate").toLocalDate()
                            : null
            );
            emp.setUsername(rs.getString("username"));
            emp.setPassword(rs.getString("password"));
            emp.setStatus(rs.getString("status"));

            emp.setCreatedat(
                    rs.getDate("createdat") != null
                            ? rs.getDate("createdat").toLocalDate()
                            : null
            );

            emp.setUpdateat(
                    rs.getDate("updateat") != null
                            ? rs.getDate("updateat").toLocalDate()
                            : null
            );

            return emp;
        });
    }


    // ==========================================
    // GET EMPLOYEE BY ID
    // ==========================================
    public employee getEmployeeById(Integer employeeid) {

        String sql = "SELECT * FROM employee WHERE employeeid = ?";

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {

            employee emp = new employee();

            emp.setEmployeeid(rs.getInt("employeeid"));
            emp.setFirstname(rs.getString("firstname"));
            emp.setLastname(rs.getString("lastname"));
            emp.setEmail(rs.getString("email"));
            emp.setPhone(rs.getString("phone"));
            emp.setDepartment(rs.getString("department"));
            emp.setPosition(rs.getString("position"));

            emp.setHiredate(
                    rs.getDate("hiredate") != null
                            ? rs.getDate("hiredate").toLocalDate()
                            : null
            );

            emp.setUsername(rs.getString("username"));
            emp.setPassword(rs.getString("password"));
            emp.setStatus(rs.getString("status"));

            emp.setCreatedat(
                    rs.getDate("createdat") != null
                            ? rs.getDate("createdat").toLocalDate()
                            : null
            );

            emp.setUpdateat(
                    rs.getDate("updateat") != null
                            ? rs.getDate("updateat").toLocalDate()
                            : null
            );

            return emp;
        });
    }


    // ==========================================
    // CREATE EMPLOYEE
    // ==========================================
    public void createEmployee(employee emp) {

        String sql = """
                INSERT INTO employee
                (
                    firstname,
                    lastname,
                    email,
                    phone,
                    department,
                    position,
                    hiredate,
                    username,
                    password,
                    status,
                    createdat,
                    updateat
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                emp.getFirstname(),
                emp.getLastname(),
                emp.getEmail(),
                emp.getPhone(),
                emp.getDepartment(),
                emp.getPosition(),

                emp.getHiredate() != null
                        ? Date.valueOf(emp.getHiredate())
                        : null,

                emp.getUsername(),
                emp.getPassword(),
                emp.getStatus(),

                emp.getCreatedat() != null
                        ? Date.valueOf(emp.getCreatedat())
                        : null,

                emp.getUpdateat() != null
                        ? Date.valueOf(emp.getUpdateat())
                        : null
        );
    }


    // ==========================================
    // UPDATE EMPLOYEE
    // ==========================================
    public void updateEmployee(employee emp) {

        String sql = """
                UPDATE employee
                SET
                    firstname = ?,
                    lastname = ?,
                    email = ?,
                    phone = ?,
                    department = ?,
                    position = ?,
                    hiredate = ?,
                    username = ?,
                    password = ?,
                    status = ?,
                    updateat = ?
                WHERE employeeid = ?
                """;

        jdbcTemplate.update(
                sql,
                emp.getFirstname(),
                emp.getLastname(),
                emp.getEmail(),
                emp.getPhone(),
                emp.getDepartment(),
                emp.getPosition(),

                emp.getHiredate() != null
                        ? Date.valueOf(emp.getHiredate())
                        : null,

                emp.getUsername(),
                emp.getPassword(),
                emp.getStatus(),

                emp.getUpdateat() != null
                        ? Date.valueOf(emp.getUpdateat())
                        : null,

                emp.getEmployeeid()
        );
    }


    // ==========================================
    // DELETE EMPLOYEE
    // ==========================================
    public void deleteEmployee(Integer employeeid) {

        String sql = "DELETE FROM employee WHERE employeeid = ?";

        jdbcTemplate.update(sql, employeeid);
    }
}

