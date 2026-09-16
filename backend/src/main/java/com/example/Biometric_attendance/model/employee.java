package com.example.Biometric_attendance.model;

import java.time.LocalDate;

public class employee {

    private Integer employeeid;
    private String firstname;
    private String lastname;
    private String email;
    private String phone;
    private String department;
    private String position;
    private LocalDate hiredate;
    private String username;
    private String password;
    private String status;
    private LocalDate createdat;
    private LocalDate updateat;

    // Empty constructor
    public employee() {
    }

    // Constructor
    public employee(
            Integer employeeid,
            String firstname,
            String lastname,
            String email,
            String phone,
            String department,
            String position,
            LocalDate hiredate,
            String username,
            String password,
            String status,
            LocalDate createdat,
            LocalDate updateat) {

        this.employeeid = employeeid;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.position = position;
        this.hiredate = hiredate;
        this.username = username;
        this.password = password;
        this.status = status;
        this.createdat = createdat;
        this.updateat = updateat;
    }

    // employeeid
    public Integer getEmployeeid() {
        return employeeid;
    }

    public void setEmployeeid(Integer employeeid) {
        this.employeeid = employeeid;
    }

    // firstname
    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    // lastname
    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    // email
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // phone
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    // department
    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    // position
    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    // hiredate
    public LocalDate getHiredate() {
        return hiredate;
    }

    public void setHiredate(LocalDate hiredate) {
        this.hiredate = hiredate;
    }

    // username
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // password
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // status
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // createdat
    public LocalDate getCreatedat() {
        return createdat;
    }

    public void setCreatedat(LocalDate createdat) {
        this.createdat = createdat;
    }

    // updateat
    public LocalDate getUpdateat() {
        return updateat;
    }

    public void setUpdateat(LocalDate updateat) {
        this.updateat = updateat;
    }
}