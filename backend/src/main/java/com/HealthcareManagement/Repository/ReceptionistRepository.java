package com.HealthcareManagement.Repository;

import com.HealthcareManagement.Model.Appointment;
import com.HealthcareManagement.Model.Receptionist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReceptionistRepository extends JpaRepository<Receptionist,Long> {
    @Query("SELECT r FROM Receptionist r JOIN FETCH r.user WHERE r.user.id = :userId")
    Optional<Receptionist> findByUserId(@Param("userId") Long userId);

    @Query("SELECT a from Appointment a WHERE a.createdBy.id = :userId")
    List<Appointment> findAllAppointmentsByUserId(Long userId);
}
