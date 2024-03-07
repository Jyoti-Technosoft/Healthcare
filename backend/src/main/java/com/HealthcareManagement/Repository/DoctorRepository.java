package com.HealthcareManagement.Repository;

import com.HealthcareManagement.Model.Doctor;
import com.HealthcareManagement.Model.Patient;
import com.HealthcareManagement.Model.Receptionist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface DoctorRepository extends JpaRepository<Doctor,Long> {
    //Optional<Doctor> findByDoctorImageId(Long userId);

    List<Doctor> findAll();
    Optional<Doctor> findByDoctorImageName(String imageName);

    @Query("SELECT d FROM Doctor d JOIN FETCH d.user WHERE d.user.id = :userId")
    Optional<Doctor> findByUserId(@Param("userId") Long userId);

    @Query("SELECT d.morningTiming FROM Doctor d WHERE d.id = :doctorId")
    String findMorningTimingByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT d.eveningTiming FROM Doctor d WHERE d.id = :doctorId")
    String findEveningTimingByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT d FROM Doctor d WHERE d.id = :doctorId")
    Doctor findDoctorById(@Param("doctorId") Long doctorId);

    @Query("SELECT d.consultationCharge FROM Doctor d WHERE d.id = :doctorId")
    String findConsultationChargeByDoctorId(@Param("doctorId") Long doctorId);
}
