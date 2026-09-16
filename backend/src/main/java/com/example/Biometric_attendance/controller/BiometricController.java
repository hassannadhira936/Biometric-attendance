package com.example.Biometric_attendance.controller;

import com.example.Biometric_attendance.model.Biometric;
import com.example.Biometric_attendance.operations.BiometricOperations;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/biometric")
@CrossOrigin(origins = "http://localhost:5173")
public class BiometricController {

    private final BiometricOperations biometricOperations;

    public BiometricController(
            BiometricOperations biometricOperations) {

        this.biometricOperations = biometricOperations;
    }


    // =========================
    // GET ALL BIOMETRICS
    // =========================
    @GetMapping
    public List<Biometric> getAllBiometrics() {

        return biometricOperations.getAllBiometrics();
    }


    // =========================
    // GET BIOMETRIC BY ID
    // =========================
    @GetMapping("/{biometricid}")
    public Biometric getBiometricById(
            @PathVariable Integer biometricid) {

        return biometricOperations.getBiometricById(
                biometricid
        );
    }


    // =========================
    // CREATE BIOMETRIC
    // =========================
    @PostMapping
    public String createBiometric(
            @RequestBody Biometric biometric) {

        biometricOperations.createBiometric(
                biometric
        );

        return "Biometric registered successfully!";
    }


    // =========================
    // UPDATE BIOMETRIC
    // =========================
    @PutMapping("/{biometricid}")
    public String updateBiometric(
            @PathVariable Integer biometricid,
            @RequestBody Biometric biometric) {

        biometric.setBiometricid(
                biometricid
        );

        biometricOperations.updateBiometric(
                biometric
        );

        return "Biometric updated successfully!";
    }


    // =========================
    // DELETE BIOMETRIC
    // =========================
    @DeleteMapping("/{biometricid}")
    public String deleteBiometric(
            @PathVariable Integer biometricid) {

        biometricOperations.deleteBiometric(
                biometricid
        );

        return "Biometric deleted successfully!";
    }
}