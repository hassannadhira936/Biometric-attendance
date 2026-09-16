package com.example.Biometric_attendance.operations;

import com.example.Biometric_attendance.model.System;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;

@Repository
public class SystemOperations {

    private final JdbcTemplate jdbcTemplate;

    public SystemOperations(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // =========================
    // GET ALL SYSTEM SETTINGS
    // =========================
    public List<System> getAllSettings() {

        String sql = "SELECT * FROM Systemsetting";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            System system = new System();

            system.setId(rs.getInt("id"));
            system.setSchoolname(rs.getString("schoolname"));
            system.setSchoolphone(rs.getString("schoolphone"));
            system.setAdminphone(rs.getString("adminphone"));

            system.setSchoollatitude(
                    rs.getObject("schoollatitude", Double.class)
            );

            system.setSchoollongitude(
                    rs.getObject("schoollongitude", Double.class)
            );

            system.setAdminid(
                    rs.getObject("adminid", Integer.class)
            );

            Time startTime = rs.getTime("workstarttime");

            if (startTime != null) {
                system.setWorkstarttime(
                        startTime.toLocalTime()
                );
            }

            Time endTime = rs.getTime("workendtime");

            if (endTime != null) {
                system.setWorkendtime(
                        endTime.toLocalTime()
                );
            }

            Timestamp updatedTimestamp =
                    rs.getTimestamp("updatedat");

            if (updatedTimestamp != null) {
                system.setUpdatedat(
                        updatedTimestamp.toLocalDateTime()
                );
            }

            return system;
        });
    }


    // =========================
    // GET SYSTEM SETTING BY ID
    // =========================
    public System getSettingById(Integer id) {

        String sql =
                "SELECT * FROM Systemsetting WHERE id = ?";

        return jdbcTemplate.queryForObject(
                sql,
                (rs, rowNum) -> {

                    System system = new System();

                    system.setId(rs.getInt("id"));
                    system.setSchoolname(
                            rs.getString("schoolname")
                    );
                    system.setSchoolphone(
                            rs.getString("schoolphone")
                    );
                    system.setAdminphone(
                            rs.getString("adminphone")
                    );

                    system.setSchoollatitude(
                            rs.getObject(
                                    "schoollatitude",
                                    Double.class
                            )
                    );

                    system.setSchoollongitude(
                            rs.getObject(
                                    "schoollongitude",
                                    Double.class
                            )
                    );

                    system.setAdminid(
                            rs.getObject(
                                    "adminid",
                                    Integer.class
                            )
                    );

                    Time startTime =
                            rs.getTime("workstarttime");

                    if (startTime != null) {
                        system.setWorkstarttime(
                                startTime.toLocalTime()
                        );
                    }

                    Time endTime =
                            rs.getTime("workendtime");

                    if (endTime != null) {
                        system.setWorkendtime(
                                endTime.toLocalTime()
                        );
                    }

                    Timestamp updatedTimestamp =
                            rs.getTimestamp("updatedat");

                    if (updatedTimestamp != null) {
                        system.setUpdatedat(
                                updatedTimestamp.toLocalDateTime()
                        );
                    }

                    return system;
                },
                id
        );
    }


    // =========================
    // CREATE SYSTEM SETTING
    // =========================
    public void createSetting(System system) {

        String sql = """
                INSERT INTO Systemsetting
                (
                    schoolname,
                    schoolphone,
                    adminphone,
                    schoollatitude,
                    schoollongitude,
                    adminid,
                    workstarttime,
                    workendtime
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                system.getSchoolname(),
                system.getSchoolphone(),
                system.getAdminphone(),
                system.getSchoollatitude(),
                system.getSchoollongitude(),
                system.getAdminid(),
                system.getWorkstarttime() != null
                        ? Time.valueOf(system.getWorkstarttime())
                        : null,
                system.getWorkendtime() != null
                        ? Time.valueOf(system.getWorkendtime())
                        : null
        );
    }


    // =========================
    // UPDATE SYSTEM SETTING
    // =========================
    public void updateSetting(System system) {

        String sql = """
                UPDATE Systemsetting
                SET
                    schoolname = ?,
                    schoolphone = ?,
                    adminphone = ?,
                    schoollatitude = ?,
                    schoollongitude = ?,
                    adminid = ?,
                    workstarttime = ?,
                    workendtime = ?
                WHERE id = ?
                """;

        jdbcTemplate.update(
                sql,
                system.getSchoolname(),
                system.getSchoolphone(),
                system.getAdminphone(),
                system.getSchoollatitude(),
                system.getSchoollongitude(),
                system.getAdminid(),
                system.getWorkstarttime() != null
                        ? Time.valueOf(system.getWorkstarttime())
                        : null,
                system.getWorkendtime() != null
                        ? Time.valueOf(system.getWorkendtime())
                        : null,
                system.getId()
        );
    }


    // =========================
    // DELETE SYSTEM SETTING
    // =========================
    public void deleteSetting(Integer id) {

        String sql =
                "DELETE FROM Systemsetting WHERE id = ?";

        jdbcTemplate.update(sql, id);
    }
}