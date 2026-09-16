package com.example.Biometric_attendance.operations;

import com.example.Biometric_attendance.model.attendance;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class AttendanceOperations {

    private final JdbcTemplate jdbcTemplate;

    public AttendanceOperations(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    // ==========================================
    // GET ALL ATTENDANCE RECORDS
    // ==========================================
    public List<attendance> getAllAttendanceRecords() {

        String sql = "SELECT * FROM attendance";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            attendance att = new attendance();

            att.setAttendanceid(
                    rs.getInt("attendanceid")
            );

            att.setEmployeeid(
                    rs.getInt("employeeid")
            );

            Timestamp checkinTimestamp = rs.getTimestamp("checkin");

            if (checkinTimestamp != null) {
                att.setCheckin(
                        checkinTimestamp.toLocalDateTime()
                );
            }

            Timestamp checkoutTimestamp = rs.getTimestamp("checkout");

            if (checkoutTimestamp != null) {
                att.setCheckout(
                        checkoutTimestamp.toLocalDateTime()
                );
            }

            att.setCheckout_latitude(
                    rs.getObject("checkout_latitude", Double.class)
            );

            att.setCheckout_longitude(
                    rs.getObject("checkout_longitude", Double.class)
            );

            att.setStatus(
                    rs.getString("status")
            );

            return att;
        });
    }


    // ==========================================
    // GET ATTENDANCE BY ID
    // ==========================================
    public attendance getAttendanceRecordById(Integer attendanceid) {

        String sql =
                "SELECT * FROM attendance WHERE attendanceid = ?";

        return jdbcTemplate.queryForObject(
                sql,
                (rs, rowNum) -> {

                    attendance att = new attendance();

                    att.setAttendanceid(
                            rs.getInt("attendanceid")
                    );

                    att.setEmployeeid(
                            rs.getInt("employeeid")
                    );

                    Timestamp checkinTimestamp =
                            rs.getTimestamp("checkin");

                    if (checkinTimestamp != null) {
                        att.setCheckin(
                                checkinTimestamp.toLocalDateTime()
                        );
                    }

                    Timestamp checkoutTimestamp =
                            rs.getTimestamp("checkout");

                    if (checkoutTimestamp != null) {
                        att.setCheckout(
                                checkoutTimestamp.toLocalDateTime()
                        );
                    }

                    att.setCheckout_latitude(
                            rs.getObject(
                                    "checkout_latitude",
                                    Double.class
                            )
                    );

                    att.setCheckout_longitude(
                            rs.getObject(
                                    "checkout_longitude",
                                    Double.class
                            )
                    );

                    att.setStatus(
                            rs.getString("status")
                    );

                    return att;
                }
        );
    }


    // ==========================================
    // CREATE ATTENDANCE
    // ==========================================
    public void createAttendance(attendance att) {

        String sql = """
                INSERT INTO attendance
                (
                    employeeid,
                    checkin,
                    checkout,
                    checkout_latitude,
                    checkout_longitude,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,

                att.getEmployeeid(),

                att.getCheckin() != null
                        ? Timestamp.valueOf(att.getCheckin())
                        : null,

                att.getCheckout() != null
                        ? Timestamp.valueOf(att.getCheckout())
                        : null,

                att.getCheckout_latitude(),

                att.getCheckout_longitude(),

                att.getStatus()
        );
    }


    // ==========================================
    // UPDATE ATTENDANCE
    // ==========================================
    public void updateAttendance(attendance att) {

        String sql = """
                UPDATE attendance
                SET
                    employeeid = ?,
                    checkin = ?,
                    checkout = ?,
                    checkout_latitude = ?,
                    checkout_longitude = ?,
                    status = ?
                WHERE attendanceid = ?
                """;

        jdbcTemplate.update(
                sql,

                att.getEmployeeid(),

                att.getCheckin() != null
                        ? Timestamp.valueOf(att.getCheckin())
                        : null,

                att.getCheckout() != null
                        ? Timestamp.valueOf(att.getCheckout())
                        : null,

                att.getCheckout_latitude(),

                att.getCheckout_longitude(),

                att.getStatus(),

                att.getAttendanceid()
        );
    }


    // ==========================================
    // DELETE ATTENDANCE
    // ==========================================
    public void deleteAttendance(Integer attendanceid) {

        String sql =
                "DELETE FROM attendance WHERE attendanceid = ?";

        jdbcTemplate.update(sql, attendanceid);
    }
}
