package com.example.Biometric_attendance.model;

import java.time.LocalDateTime;

public class Admin {

    private Integer id;
    private String fullname;
    private String position;
    private String contact;
    private String email;
    private String username;
    private String password;
    private LocalDateTime updateat;

    // Empty constructor
    public Admin() {
    }

    // Full constructor
    public Admin(
            Integer id,
            String fullname,
            String position,
            String contact,
            String email,
            String username,
            String password,
            LocalDateTime updateat) {

        this.id = id;
        this.fullname = fullname;
        this.position = position;
        this.contact = contact;
        this.email = email;
        this.username = username;
        this.password = password;
        this.updateat = updateat;
    }

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getUpdateat() {
        return updateat;
    }

    public void setUpdateat(LocalDateTime updateat) {
        this.updateat = updateat;
    }
}