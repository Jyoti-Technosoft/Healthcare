package com.HealthcareManagement.Repository;

import com.HealthcareManagement.Model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentTime = :appointmentTime")
    List<Appointment> findByDoctorAndAppointmentTime(@Param("doctorId") Long doctorId, @Param("appointmentTime") String appointmentTime);

    int countAppointmentsByPatientId(Long patientId);

    @Query("SELECT COUNT(a) FROM Appointment a " +
            "WHERE a.doctor.id = :doctorId " +
            "AND a.appointmentDate = :appointmentDate " +
            "AND a.appointmentTime BETWEEN :startTime AND :endTime")
    int countAppointmentsByDoctorIdAndDateTimeRange(
            @Param("doctorId") Long doctorId,
            @Param("appointmentDate") String appointmentDate,
            @Param("startTime") String startTime,
            @Param("endTime") String endTime);
}
