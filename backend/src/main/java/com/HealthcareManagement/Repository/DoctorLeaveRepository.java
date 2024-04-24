package com.HealthcareManagement.Repository;

import com.HealthcareManagement.Model.DoctorLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorLeaveRepository extends JpaRepository<DoctorLeave,Long> {
    @Query("SELECT dl FROM DoctorLeave dl WHERE dl.doctor.id = :doctorId")
    List<DoctorLeave> findByDoctorId(@Param("doctorId") Long doctorId);
}
