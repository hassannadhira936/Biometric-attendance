package com.example.Biometric_attendance.model;

import java.time.LocalDateTime;
import java.time.LocalTime;

public class System {

    private Integer id;
    private String schoolname;
    private String schoolphone;
    private String adminphone;
    private Double schoollatitude;
    private Double schoollongitude;
    private Integer adminid;
    private LocalTime workstarttime;
    private LocalTime workendtime;
    private LocalDateTime updatedat;

    // Empty constructor
    public System() {
    }

    // Full constructor
    public System(
            Integer id,
            String schoolname,
            String schoolphone,
            String adminphone,
            Double schoollatitude,
            Double schoollongitude,
            Integer adminid,
            LocalTime workstarttime,
            LocalTime workendtime,
            LocalDateTime updatedat) {

        this.id = id;
        this.schoolname = schoolname;
        this.schoolphone = schoolphone;
        this.adminphone = adminphone;
        this.schoollatitude = schoollatitude;
        this.schoollongitude = schoollongitude;
        this.adminid = adminid;
        this.workstarttime = workstarttime;
        this.workendtime = workendtime;
        this.updatedat = updatedat;
    }

    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSchoolname() {
        return schoolname;
    }

    public void setSchoolname(String schoolname) {
        this.schoolname = schoolname;
    }

    public String getSchoolphone() {
        return schoolphone;
    }

    public void setSchoolphone(String schoolphone) {
        this.schoolphone = schoolphone;
    }

    public String getAdminphone() {
        return adminphone;
    }

    public void setAdminphone(String adminphone) {
        this.adminphone = adminphone;
    }

    public Double getSchoollatitude() {
        return schoollatitude;
    }

    public void setSchoollatitude(Double schoollatitude) {
        this.schoollatitude = schoollatitude;
    }

    public Double getSchoollongitude() {
        return schoollongitude;
    }

    public void setSchoollongitude(Double schoollongitude) {
        this.schoollongitude = schoollongitude;
    }

    public Integer getAdminid() {
        return adminid;
    }

    public void setAdminid(Integer adminid) {
        this.adminid = adminid;
    }

    public LocalTime getWorkstarttime() {
        return workstarttime;
    }

    public void setWorkstarttime(LocalTime workstarttime) {
        this.workstarttime = workstarttime;
    }

    public LocalTime getWorkendtime() {
        return workendtime;
    }

    public void setWorkendtime(LocalTime workendtime) {
        this.workendtime = workendtime;
    }

    public LocalDateTime getUpdatedat() {
        return updatedat;
    }

    public void setUpdatedat(LocalDateTime updatedat) {
        this.updatedat = updatedat;
    }
}