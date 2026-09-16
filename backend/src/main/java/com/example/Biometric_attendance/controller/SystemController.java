package com.example.Biometric_attendance.controller;

import com.example.Biometric_attendance.model.System;
import com.example.Biometric_attendance.operations.SystemOperations;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/system")
@CrossOrigin(origins = "http://localhost:5173")
public class SystemController {

    private final SystemOperations systemOperations;

    public SystemController(SystemOperations systemOperations) {
        this.systemOperations = systemOperations;
    }

    // =========================
    // GET ALL SYSTEM SETTINGS
    // =========================
    @GetMapping
    public List<System> getAllSettings() {
        return systemOperations.getAllSettings();
    }

    // =========================
    // GET SYSTEM SETTING BY ID
    // =========================
    @GetMapping("/{id}")
    public System getSettingById(@PathVariable Integer id) {
        return systemOperations.getSettingById(id);
    }

    // =========================
    // CREATE SYSTEM SETTING
    // =========================
    @PostMapping
    public String createSetting(@RequestBody System system) {

        systemOperations.createSetting(system);

        return "System setting added successfully!";
    }

    // =========================
    // UPDATE SYSTEM SETTING
    // =========================
    @PutMapping("/{id}")
    public String updateSetting(
            @PathVariable Integer id,
            @RequestBody System system) {

        system.setId(id);

        systemOperations.updateSetting(system);

        return "System setting updated successfully!";
    }

    // =========================
    // DELETE SYSTEM SETTING
    // =========================
    @DeleteMapping("/{id}")
    public String deleteSetting(@PathVariable Integer id) {

        systemOperations.deleteSetting(id);

        return "System setting deleted successfully!";
    }
}