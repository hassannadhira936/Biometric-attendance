package com.example.Biometric_attendance.model;

import java.time.LocalDateTime;

public class attendance {

    private Integer attendanceid;

    private Integer employeeid;

    private LocalDateTime checkin;

    private LocalDateTime checkout;

    private Double checkout_latitude;

    private Double checkout_longitude;

    private String status;


    // ==========================================
    // EMPTY CONSTRUCTOR
    // ==========================================
    public attendance() {
    }


    // ==========================================
    // CONSTRUCTOR
    // ==========================================
    public attendance(
            Integer attendanceid,
            Integer employeeid,
            LocalDateTime checkin,
            LocalDateTime checkout,
            Double checkout_latitude,
            Double checkout_longitude,
            String status) {

        this.attendanceid = attendanceid;
        this.employeeid = employeeid;
        this.checkin = checkin;
        this.checkout = checkout;
        this.checkout_latitude = checkout_latitude;
        this.checkout_longitude = checkout_longitude;
        this.status = status;
    }


    // ==========================================
    // ATTENDANCE ID
    // ==========================================
    public Integer getAttendanceid() {
        return attendanceid;
    }

    public void setAttendanceid(Integer attendanceid) {
        this.attendanceid = attendanceid;
    }


    // ==========================================
    // EMPLOYEE ID
    // ==========================================
    public Integer getEmployeeid() {
        return employeeid;
    }

    public void setEmployeeid(Integer employeeid) {
        this.employeeid = employeeid;
    }


    // ==========================================
    // CHECK IN
    // ==========================================
    public LocalDateTime getCheckin() {
        return checkin;
    }

    public void setCheckin(LocalDateTime checkin) {
        this.checkin = checkin;
    }


    // ==========================================
    // CHECK OUT
    // ==========================================
    public LocalDateTime getCheckout() {
        return checkout;
    }

    public void setCheckout(LocalDateTime checkout) {
        this.checkout = checkout;
    }


    // ==========================================
    // CHECKOUT LATITUDE
    // ==========================================
    public Double getCheckout_latitude() {
        return checkout_latitude;
    }

    public void setCheckout_latitude(Double checkout_latitude) {
        this.checkout_latitude = checkout_latitude;
    }


    // ==========================================
    // CHECKOUT LONGITUDE
    // ==========================================
    public Double getCheckout_longitude() {
        return checkout_longitude;
    }

    public void setCheckout_longitude(Double checkout_longitude) {
        this.checkout_longitude = checkout_longitude;
    }


    // ==========================================
    // STATUS
    // ==========================================
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

