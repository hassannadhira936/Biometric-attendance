package com.example.Biometric_attendance.model;

import java.time.LocalDateTime;

public class Biometric {

    private Integer biometricid;
    private Integer employeeid;
    private String fingerprintid;
    private String fingername;
    private String status;
    private LocalDateTime registeredat;

    // Empty constructor
    public Biometric() {
    }

    // Full constructor
    public Biometric(
            Integer biometricid,
            Integer employeeid,
            String fingerprintid,
            String fingername,
            String status,
            LocalDateTime registeredat) {

        this.biometricid = biometricid;
        this.employeeid = employeeid;
        this.fingerprintid = fingerprintid;
        this.fingername = fingername;
        this.status = status;
        this.registeredat = registeredat;
    }

    // Getters and Setters

    public Integer getBiometricid() {
        return biometricid;
    }

    public void setBiometricid(Integer biometricid) {
        this.biometricid = biometricid;
    }

    public Integer getEmployeeid() {
        return employeeid;
    }

    public void setEmployeeid(Integer employeeid) {
        this.employeeid = employeeid;
    }

    public String getFingerprintid() {
        return fingerprintid;
    }

    public void setFingerprintid(String fingerprintid) {
        this.fingerprintid = fingerprintid;
    }

    public String getFingername() {
        return fingername;
    }

    public void setFingername(String fingername) {
        this.fingername = fingername;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRegisteredat() {
        return registeredat;
    }

    public void setRegisteredat(LocalDateTime registeredat) {
        this.registeredat = registeredat;
    }
}