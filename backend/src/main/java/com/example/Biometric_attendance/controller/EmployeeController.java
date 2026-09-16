package com.example.Biometric_attendance.controller;

import com.example.Biometric_attendance.model.employee;
import com.example.Biometric_attendance.operations.EmployeeOperations;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeOperations employeeOperations;

    public EmployeeController(EmployeeOperations employeeOperations) {
        this.employeeOperations = employeeOperations;
    }


    // ==========================================
    // GET ALL EMPLOYEES
    // ==========================================
    @GetMapping
    public List<employee> getAllEmployees() {

        return employeeOperations.getAllEmployees();
    }


    // ==========================================
    // GET EMPLOYEE BY ID
    // ==========================================
    @GetMapping("/{employeeid}")
    public employee getEmployeeById(
            @PathVariable Integer employeeid) {

        return employeeOperations.getEmployeeById(employeeid);
    }


    // ==========================================
    // CREATE EMPLOYEE
    // ==========================================
    @PostMapping
    public String createEmployee(
            @RequestBody employee employee) {

        employeeOperations.createEmployee(employee);

        return "Employee added successfully!";
    }


    // ==========================================
    // UPDATE EMPLOYEE
    // ==========================================
    @PutMapping("/{employeeid}")
    public String updateEmployee(
            @PathVariable Integer employeeid,
            @RequestBody employee employee) {

        employee.setEmployeeid(employeeid);

        employeeOperations.updateEmployee(employee);

        return "Employee updated successfully!";
    }


    // ==========================================
    // DELETE EMPLOYEE
    // ==========================================
    @DeleteMapping("/{employeeid}")
    public String deleteEmployee(
            @PathVariable Integer employeeid) {

        employeeOperations.deleteEmployee(employeeid);

        return "Employee deleted successfully!";
    }
}

