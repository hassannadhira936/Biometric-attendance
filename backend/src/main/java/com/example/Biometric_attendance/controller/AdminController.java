package com.example.Biometric_attendance.controller;

import com.example.Biometric_attendance.model.Admin;
import com.example.Biometric_attendance.operations.AdminOperations;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminOperations adminOperations;

    public AdminController(AdminOperations adminOperations) {
        this.adminOperations = adminOperations;
    }

    // =========================
    // GET ALL ADMINS
    // =========================
    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminOperations.getAllAdmins();
    }


    // =========================
    // GET ADMIN BY ID
    // =========================
    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable Integer id) {
        return adminOperations.getAdminById(id);
    }


    // =========================
    // CREATE ADMIN
    // =========================
    @PostMapping
    public String createAdmin(@RequestBody Admin admin) {

        adminOperations.createAdmin(admin);

        return "Admin added successfully!";
    }


    // =========================
    // UPDATE ADMIN
    // =========================
    @PutMapping("/{id}")
    public String updateAdmin(
            @PathVariable Integer id,
            @RequestBody Admin admin) {

        admin.setId(id);

        adminOperations.updateAdmin(admin);

        return "Admin updated successfully!";
    }


    // =========================
    // DELETE ADMIN
    // =========================
    @DeleteMapping("/{id}")
    public String deleteAdmin(@PathVariable Integer id) {

        adminOperations.deleteAdmin(id);

        return "Admin deleted successfully!";
    }
}