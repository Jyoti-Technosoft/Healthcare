package com.HealthcareManagement.Repository;

import com.HealthcareManagement.Model.Appointment;
import com.HealthcareManagement.Model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentTime = :appointmentTime")
    List<Appointment> findByDoctorAndAppointmentTime(@Param("doctorId") Long doctorId, @Param("appointmentTime") String appointmentTime);

    int countAppointmentsByPatientId(Long patientId);

    @Query("SELECT COUNT(a) FROM Appointment a " +
            "WHERE a.doctor.id = :doctorId " +
            "AND a.appointmentDate = :appointmentDate " +
            "AND (a.appointmentTime >= :startTime AND a.appointmentTime <= :endTime)")
    int countAppointmentsByDoctorIdAndDateTimeRange(
            @Param("doctorId") Long doctorId,
            @Param("appointmentDate") String appointmentDate,
            @Param("startTime") String startTime,
            @Param("endTime") String endTime);


    @Query("SELECT COUNT(a) FROM Appointment a " +
            "WHERE a.doctor.id = :doctorId " +
            "AND a.appointmentDate = :appointmentDate ")
    int countAppointmentsSlotsByDoctorIdAndDate(
            @Param("doctorId") Long doctorId,
            @Param("appointmentDate") LocalDate appointmentDate);

//    @Query("SELECT a FROM Appointment a " +
//            "WHERE a.doctor.id = :doctorId " +
//            "AND ((a.appointmentDate >= :fromDate AND a.appointmentDate <= :toDate) " +
//            "AND ((a.appointmentTime >= :fromTime AND a.appointmentTime <= :toTime) OR " +
//            "(a.appointmentTime <= :fromTime AND a.appointmentTime >= :toTime)))")
//    List<Appointment> findAppointmentsDuringLeave(@Param("fromDate") String fromDate,
//                                                  @Param("toDate") String toDate,
//                                                  @Param("fromTime") String fromTime,
//                                                  @Param("toTime") String toTime,
//                                                  @Param("doctorId") Long doctorId);


    @Query("SELECT a FROM Appointment a " +
            "WHERE a.doctor.id = :doctorId " +
            "AND ((a.appointmentDate = :fromDate AND a.appointmentTime >= :fromTime) OR " +
            "(a.appointmentDate = :toDate AND a.appointmentTime <= :toTime) OR " +
            "(a.appointmentDate > :fromDate AND a.appointmentDate < :toDate))")
    List<Appointment> findAppointmentsDuringLeave(@Param("fromDate") String fromDate,
                                                  @Param("toDate") String toDate,
                                                  @Param("fromTime") String fromTime,
                                                  @Param("toTime") String toTime,
                                                  @Param("doctorId") Long doctorId);


    @Query("SELECT a.consultationCharge FROM Appointment a " +
            "WHERE a.patient.id = :patientId " +
            "AND a.consultationCharge IS NOT NULL " +
            "ORDER BY a.appointmentDate DESC")
    List<String> findLastPayableAppointmentChargeByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.patient.id = :patientId AND a.doctor.id = :doctorId AND a.appointmentDate = :appointmentDate")
    int countAppointmentsByPatientIdAndDoctorIdAndAppointmentDate(@Param("patientId") Long patientId, @Param("doctorId") Long doctorId, @Param("appointmentDate") String appointmentDate);



    @Query("SELECT a FROM Appointment a " +
            "WHERE a.patient.id = :patientId " +
            "AND a.consultationChargeType = '1' " +
            "AND a.consultationCharge IS NOT NULL " +
            "ORDER BY a.appointmentDate DESC")
    List<Appointment> findAllPayableAppointmentsWithIntegerChargeByPatientId(@Param("patientId") Long patientId);


    Optional<Appointment> findFirstByPatientIdOrderByAppointmentDateDesc(Long patientId);

    @Query("SELECT a.appointmentDate FROM Appointment a " +
            "WHERE a.patient.id = :patientId " +
            "ORDER BY a.appointmentDate DESC")
    List<String> findLastPayableAppointmentDateByPatientId(@Param("patientId") Long patientId);

    Optional<Appointment> findFirstByPatientIdOrderByAppointmentDateAsc(Long patientId);

    Optional<Appointment> findFirstByPatientIdAndDoctorIdOrderByAppointmentDateAsc(Long patientId, Long doctorId);

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId AND a.doctor.id = :doctorId AND a.consultationChargeType = '1'")
    List<Appointment> findAllPayableAppointmentsWithIntegerChargeByPatientIdAndDoctorId(Long patientId, Long doctorId);



    @Query("SELECT p.id, p.name, p.contact, p.gender, p.dateOfBirth, p.age, p.weight, p.height, p.address, " +
            "createdBy.id, createdBy.email, updatedBy.id, updatedBy.email, p.createdTime, p.updatedTime, " +
            "user.id, user.email " +
            "FROM Patient p " +
            "JOIN p.createdBy createdBy " +
            "JOIN p.updatedBy updatedBy " +
            "JOIN p.user user " +
            "WHERE " +

            "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.contact) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.dateOfBirth) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Object[]> searchPatients(@Param("query") String query);


    @Query("SELECT a.id, p.id ,p.name, p.contact, p.gender, p.dateOfBirth, p.age, p.weight, p.height, p.address , a.appointmentDate, a.appointmentTime ,a.consultationCharge " +
            "FROM Appointment a LEFT JOIN a.patient p " +
            "WHERE a.doctor.id = :doctorId")
    List getAppointmentsWithPatientName(@Param("doctorId") Long doctorId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId")
    List<Appointment> findByDoctorId(Long doctorId);

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId")
    List<Appointment> findByPatientId(Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a NOT IN (SELECT hr.appointment FROM HealthReport hr) ORDER BY a.appointmentDate ASC")
    List<Appointment> findAppointmentsWithoutHealthReport(Long doctorId);


    @Query("SELECT DISTINCT a.patient FROM Appointment a WHERE a.doctor.id = :doctorId")
    List<Patient> getPatientsForDoctor(Long doctorId);
}
