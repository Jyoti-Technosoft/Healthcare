package com.HealthcareManagement.Repository;

import com.HealthcareManagement.Model.DoctorLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DoctorLeaveRepository extends JpaRepository<DoctorLeave,Long> {
    @Query("SELECT dl FROM DoctorLeave dl WHERE dl.doctor.id = :doctorId")
    List<DoctorLeave> findByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT COUNT(dl) > 0 FROM DoctorLeave dl WHERE dl.doctor.id = :doctorId AND :date >= dl.fromDate AND :date<= dl.toDate")
    boolean existsByDoctorIdAndDate(Long doctorId, String date);

    @Query("SELECT dl FROM DoctorLeave dl WHERE dl.doctor.id = :doctorId " +
            "AND (dl.fromTime IS NULL OR dl.fromTime = ' ' OR dl.toTime IS NULL OR dl.toTime = ' ')")
    List<DoctorLeave> findFullDayLeavesByDoctorId(@Param("doctorId") Long doctorId);



}
