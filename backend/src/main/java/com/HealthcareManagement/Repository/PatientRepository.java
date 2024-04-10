package com.HealthcareManagement.Repository;

import com.HealthcareManagement.Model.Patient;
import com.HealthcareManagement.Model.Receptionist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient,Long> {
    @Query("SELECT p FROM Patient p WHERE p.id = :patientId")
    Patient findPatientById(@Param("patientId") Long patientId);


    @Query("SELECT p FROM Patient p JOIN FETCH p.user WHERE p.user.id = :userId")
    Optional<Patient> findByUserId(@Param("userId") Long userId);

}
