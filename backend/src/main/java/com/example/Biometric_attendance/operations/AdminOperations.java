package com.example.Biometric_attendance.operations;

import com.example.Biometric_attendance.model.Admin;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class AdminOperations {

    private final JdbcTemplate jdbcTemplate;

    public AdminOperations(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // =========================
    // GET ALL ADMINS
    // =========================
    public List<Admin> getAllAdmins() {

        String sql = "SELECT * FROM Admin";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            Admin admin = new Admin();

            admin.setId(rs.getInt("id"));
            admin.setFullname(rs.getString("fullname"));
            admin.setPosition(rs.getString("position"));
            admin.setContact(rs.getString("contact"));
            admin.setEmail(rs.getString("email"));
            admin.setUsername(rs.getString("username"));
            admin.setPassword(rs.getString("password"));

            Timestamp updateTimestamp = rs.getTimestamp("updateat");

            if (updateTimestamp != null) {
                admin.setUpdateat(updateTimestamp.toLocalDateTime());
            }

            return admin;
        });
    }


    // =========================
    // GET ADMIN BY ID
    // =========================
    public Admin getAdminById(Integer id) {

        String sql = "SELECT * FROM Admin WHERE id = ?";

        return jdbcTemplate.queryForObject(
                sql,
                (rs, rowNum) -> {

                    Admin admin = new Admin();

                    admin.setId(rs.getInt("id"));
                    admin.setFullname(rs.getString("fullname"));
                    admin.setPosition(rs.getString("position"));
                    admin.setContact(rs.getString("contact"));
                    admin.setEmail(rs.getString("email"));
                    admin.setUsername(rs.getString("username"));
                    admin.setPassword(rs.getString("password"));

                    Timestamp updateTimestamp = rs.getTimestamp("updateat");

                    if (updateTimestamp != null) {
                        admin.setUpdateat(
                                updateTimestamp.toLocalDateTime()
                        );
                    }

                    return admin;
                },
                id
        );
    }


    // =========================
    // CREATE ADMIN
    // =========================
    public void createAdmin(Admin admin) {

        String sql = """
                INSERT INTO Admin
                (
                    fullname,
                    position,
                    contact,
                    email,
                    username,
                    password
                )
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                admin.getFullname(),
                admin.getPosition(),
                admin.getContact(),
                admin.getEmail(),
                admin.getUsername(),
                admin.getPassword()
        );
    }


    // =========================
    // UPDATE ADMIN
    // =========================
    public void updateAdmin(Admin admin) {

        String sql = """
                UPDATE Admin
                SET
                    fullname = ?,
                    position = ?,
                    contact = ?,
                    email = ?,
                    username = ?,
                    password = ?
                WHERE id = ?
                """;

        jdbcTemplate.update(
                sql,
                admin.getFullname(),
                admin.getPosition(),
                admin.getContact(),
                admin.getEmail(),
                admin.getUsername(),
                admin.getPassword(),
                admin.getId()
        );
    }


    // =========================
    // DELETE ADMIN
    // =========================
    public void deleteAdmin(Integer id) {

        String sql = "DELETE FROM Admin WHERE id = ?";

        jdbcTemplate.update(sql, id);
    }
}