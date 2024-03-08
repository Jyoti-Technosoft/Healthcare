package com.HealthcareManagement.Repository;

import com.HealthcareManagement.Model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicationRepository extends JpaRepository<Medication,Long> {
    List<Medication> findByHealthReportId(Long healthReportId);

}
