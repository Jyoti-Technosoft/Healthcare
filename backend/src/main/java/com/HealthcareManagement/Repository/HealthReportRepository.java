package com.HealthcareManagement.Repository;

import com.HealthcareManagement.Model.HealthReport;

import com.HealthcareManagement.Model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface HealthReportRepository extends JpaRepository<HealthReport,Long> {

    List<HealthReport> findByAppointmentId(Long appointmentId);
}
