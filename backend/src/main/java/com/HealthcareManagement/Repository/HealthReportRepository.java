package com.HealthcareManagement.Repository;

import com.HealthcareManagement.Model.HealthReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthReportRepository extends JpaRepository<HealthReport,Long> {
}
