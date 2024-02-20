package com.HealthcareManagement.Repository;

import com.HealthcareManagement.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findById(int userId);
    Optional<User> findByEmail(String email);

    Optional<User> findByRole(String role);

}
