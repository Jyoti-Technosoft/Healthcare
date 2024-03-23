package com.HealthcareManagement.Repository;

import com.HealthcareManagement.Model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin,Long> {
}
