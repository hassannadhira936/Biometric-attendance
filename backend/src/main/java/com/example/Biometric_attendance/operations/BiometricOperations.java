package com.example.Biometric_attendance.operations;

import com.example.Biometric_attendance.model.Biometric;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class BiometricOperations {

    private final JdbcTemplate jdbcTemplate;

    public BiometricOperations(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    // =========================
    // GET ALL BIOMETRICS
    // =========================
    public List<Biometric> getAllBiometrics() {

        String sql = "SELECT * FROM biometric";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            Biometric biometric = new Biometric();

            biometric.setBiometricid(
                    rs.getInt("biometricid")
            );

            biometric.setEmployeeid(
                    rs.getInt("employeeid")
            );

            biometric.setFingerprintid(
                    rs.getString("fingerprintid")
            );

            biometric.setFingername(
                    rs.getString("fingername")
            );

            biometric.setStatus(
                    rs.getString("status")
            );

            Timestamp registeredTimestamp =
                    rs.getTimestamp("registeredat");

            if (registeredTimestamp != null) {
                biometric.setRegisteredat(
                        registeredTimestamp.toLocalDateTime()
                );
            }

            return biometric;
        });
    }


    // =========================
    // GET BIOMETRIC BY ID
    // =========================
    public Biometric getBiometricById(Integer biometricid) {

        String sql =
                "SELECT * FROM biometric WHERE biometricid = ?";

        return jdbcTemplate.queryForObject(
                sql,
                (rs, rowNum) -> {

                    Biometric biometric = new Biometric();

                    biometric.setBiometricid(
                            rs.getInt("biometricid")
                    );

                    biometric.setEmployeeid(
                            rs.getInt("employeeid")
                    );

                    biometric.setFingerprintid(
                            rs.getString("fingerprintid")
                    );

                    biometric.setFingername(
                            rs.getString("fingername")
                    );

                    biometric.setStatus(
                            rs.getString("status")
                    );

                    Timestamp registeredTimestamp =
                            rs.getTimestamp("registeredat");

                    if (registeredTimestamp != null) {
                        biometric.setRegisteredat(
                                registeredTimestamp.toLocalDateTime()
                        );
                    }

                    return biometric;
                },
                biometricid
        );
    }


    // =========================
    // CREATE BIOMETRIC
    // =========================
    public void createBiometric(Biometric biometric) {

        String sql = """
                INSERT INTO biometric
                (
                    employeeid,
                    fingerprintid,
                    fingername,
                    status
                )
                VALUES (?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                biometric.getEmployeeid(),
                biometric.getFingerprintid(),
                biometric.getFingername(),
                biometric.getStatus()
        );
    }


    // =========================
    // UPDATE BIOMETRIC
    // =========================
    public void updateBiometric(Biometric biometric) {

        String sql = """
                UPDATE biometric
                SET
                    employeeid = ?,
                    fingerprintid = ?,
                    fingername = ?,
                    status = ?
                WHERE biometricid = ?
                """;

        jdbcTemplate.update(
                sql,
                biometric.getEmployeeid(),
                biometric.getFingerprintid(),
                biometric.getFingername(),
                biometric.getStatus(),
                biometric.getBiometricid()
        );
    }


    // =========================
    // DELETE BIOMETRIC
    // =========================
    public void deleteBiometric(Integer biometricid) {

        String sql =
                "DELETE FROM biometric WHERE biometricid = ?";

        jdbcTemplate.update(
                sql,
                biometricid
        );
    }
}