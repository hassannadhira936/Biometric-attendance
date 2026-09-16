package com.example.Biometric_attendance.controller;

import com.example.Biometric_attendance.model.attendance;
import com.example.Biometric_attendance.operations.AttendanceOperations;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    private final AttendanceOperations attendanceOperations;

    public AttendanceController(AttendanceOperations attendanceOperations) {
        this.attendanceOperations = attendanceOperations;
    }


    // ==========================================
    // GET ALL ATTENDANCE
    // ==========================================
    @GetMapping
    public List<attendance> getAllAttendanceRecords() {

        return attendanceOperations.getAllAttendanceRecords();
    }


    // ==========================================
    // GET ATTENDANCE BY ID
    // ==========================================
    @GetMapping("/{attendanceid}")
    public attendance getAttendanceRecordById(
            @PathVariable Integer attendanceid) {

        return attendanceOperations.getAttendanceRecordById(attendanceid);
    }


    // ==========================================
    // CREATE ATTENDANCE
    // ==========================================
    @PostMapping
    public String createAttendance(
            @RequestBody attendance attendance) {

        attendanceOperations.createAttendance(attendance);

        return "Attendance created successfully!";
    }


    // ==========================================
    // UPDATE ATTENDANCE
    // ==========================================
    @PutMapping("/{attendanceid}")
    public String updateAttendance(
            @PathVariable Integer attendanceid,
            @RequestBody attendance attendance) {

        attendance.setAttendanceid(attendanceid);

        attendanceOperations.updateAttendance(attendance);

        return "Attendance updated successfully!";
    }


    // ==========================================
    // DELETE ATTENDANCE
    // ==========================================
    @DeleteMapping("/{attendanceid}")
    public String deleteAttendance(
            @PathVariable Integer attendanceid) {

        attendanceOperations.deleteAttendance(attendanceid);

        return "Attendance deleted successfully!";
    }
}