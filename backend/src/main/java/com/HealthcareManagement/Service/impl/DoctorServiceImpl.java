package com.HealthcareManagement.Service.impl;

import com.HealthcareManagement.Model.Doctor;
import com.HealthcareManagement.Model.Receptionist;
import com.HealthcareManagement.Model.UserDTO;
import com.HealthcareManagement.Repository.DoctorRepository;
import com.HealthcareManagement.Service.DoctorService;
import com.HealthcareManagement.Service.ImageUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    DoctorRepository doctorRepository;
    @Override
    public Doctor getDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Doctor not found with ID: " + userId));
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

//    @Transactional
//    public List<Doctor> getAllDoctorsWithImages() {
//        List<Doctor> doctors = doctorRepository.findAll();
//        // Make sure each doctor's image data is loaded
//        doctors.forEach(doctor -> doctor.getDoctorImageData());
//        return doctors;
//    }

    public List<Doctor> getAllDoctorsWithImages() {
        return doctorRepository.findAll();
    }




}
