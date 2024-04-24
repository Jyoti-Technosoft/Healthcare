package com.HealthcareManagement.Service.impl;

import com.HealthcareManagement.Model.*;
import com.HealthcareManagement.Repository.*;
import com.HealthcareManagement.Service.DoctorService;
import com.HealthcareManagement.Service.ImageUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Statement;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    DoctorRepository doctorRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    HealthReportRepository healthReportRepository;
    @Autowired
    MedicationRepository medicationRepository;
    @Autowired
    DoctorLeaveRepository doctorLeaveRepository;

    @Autowired
    private PasswordEncoder encoder;


    @Override
    public Doctor getDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Doctor not found with ID: " + userId));
    }

    @Override
    public ResponseEntity<String> updateprofile(Long userId, UserDTO userDTO) {
        try {
            // Check if the provided user ID is valid
            if (userId == null || userId <= 0) {
                throw new IllegalArgumentException("Invalid user id");
            }

            // Retrieve the receptionist entity from the database
            Optional<Doctor> existingDoctorOption = doctorRepository.findById(userId);
            if (existingDoctorOption.isPresent()) {
                Doctor existingDoctor = existingDoctorOption.get();

                // Retrieve the associated User entity
                User user = existingDoctor.getUser();

                // Check if the current password matches
                if (encoder.matches(userDTO.getCurrentPassword(), user.getPassword())) {
                    // Update the receptionist entity with data from the UserDTO
                    existingDoctor.setName(userDTO.getName());
                    existingDoctor.setContact(userDTO.getContact());
                    existingDoctor.setGender(userDTO.getGender());
                    existingDoctor.setDateOfBirth(userDTO.getDateOfBirth());
                    existingDoctor.setAddress(userDTO.getAddress());
                    existingDoctor.setAge(userDTO.getAge());

                    // Update the associated User entity with email and password
                    user.setEmail(userDTO.getEmail());
                    user.setPassword(encoder.encode(userDTO.getPassword()));

                    // Save changes to receptionist and user entities
                    doctorRepository.save(existingDoctor);
                    userRepository.save(user);

                    return ResponseEntity.ok("Receptionist profile and user details updated successfully");
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
                }
            } else {
                return ResponseEntity.notFound().build(); // Receptionist with the provided ID not found
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update receptionist profile");
        }
    }

    @Override
    public ResponseEntity<String> healthReport(UserDTO userDTO) {
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long loggedInUserId = ((UserInfoDetails) authentication.getPrincipal()).getId();

            Optional<Appointment> optionalAppointment = appointmentRepository.findById(userDTO.getAppointmentId());
            if(optionalAppointment.isPresent()){
                Appointment appointment = optionalAppointment.get();
                HealthReport report = convertToHealthReport(userDTO,appointment,loggedInUserId);
                healthReportRepository.save(report);
                return ResponseEntity.status(HttpStatus.OK).body("Health report submitted!!!");
            }else{
                return ResponseEntity.badRequest().body("Appointment not found");
            }

        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Health report submission failed");
        }
    }

    @Override
    public List<HealthReport> getAllHealthreport() {
        List<HealthReport> healthReports = healthReportRepository.findAll();
        if (!healthReports.isEmpty()) {
            // Iterate through each health report and fetch prescriptions for each one
            for (HealthReport healthReport : healthReports) {
                List<Medication> prescriptions = medicationRepository.findByHealthReportId(healthReport.getId());
                healthReport.setPrescriptions(prescriptions);
            }
        }
        return healthReports;
    }

    @Override
    public List<HealthReport> getHealthreport(Long appointmentId) {
        List<HealthReport> healthReports = healthReportRepository.findByAppointmentId(appointmentId);
        if (!healthReports.isEmpty()) {
            // Iterate through each health report and fetch prescriptions for each one
            for (HealthReport healthReport : healthReports) {
                List<Medication> prescriptions = medicationRepository.findByHealthReportId(healthReport.getId());
                healthReport.setPrescriptions(prescriptions);
            }
        }
        return healthReports;
    }

    @Override
    public ResponseEntity<String> doctorLeaveRequest(Long doctorId,UserDTO userDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long loggedInUserId = ((UserInfoDetails) authentication.getPrincipal()).getId();

            Optional<Doctor> existingDoctor = doctorRepository.findById(doctorId);
            if(existingDoctor.isPresent()) {
                Doctor existingDocId = existingDoctor.get();
                DoctorLeave doctorLeave = convertToDoctorLeaveRequest(userDTO, existingDocId, loggedInUserId);
                doctorLeaveRepository.save(doctorLeave);
                return ResponseEntity.status(HttpStatus.CREATED).body("Leave applied successfully");
            }else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor id not found");
            }
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Leave not apply");
        }
    }

    public DoctorLeave convertToDoctorLeaveRequest(UserDTO userDTO,Doctor doctor,Long loggedInUserId){
        DoctorLeave doctorLeave = new DoctorLeave();
        doctorLeave.setFromDate(userDTO.getFromDate());
        doctorLeave.setToDate(userDTO.getToDate());
        doctorLeave.setFromTime(userDTO.getFromTime());
        doctorLeave.setToTime(userDTO.getToTime());
        doctorLeave.setReason(userDTO.getReason());
        doctorLeave.setCreatedBy(userRepository.getOne(loggedInUserId));
        doctorLeave.setUpdatedBy(userRepository.getOne(loggedInUserId));
        doctorLeave.setCreatedTime(LocalDateTime.now());
        doctorLeave.setUpdatedTime(LocalDateTime.now());
        doctorLeave.setDoctor(doctor);
        return doctorLeave;
    }


    public HealthReport convertToHealthReport(UserDTO userDTO, Appointment appointment,Long loggedInUserId){
        HealthReport report = new HealthReport();
        report.setDisease(userDTO.getDisease());
        // Create a new list to hold medications
        List<Medication> medications = new ArrayList<>();
        // Check if prescriptions exist in userDTO and not null
        if (userDTO.getPrescriptions() != null) {
            // Iterate over prescriptions in userDTO
            for (Medication medicationDTO : userDTO.getPrescriptions()) {
                Medication medication = new Medication();
                // Set properties of medication from userDTO
                medication.setMedicineName(medicationDTO.getMedicineName());
                medication.setDosage(medicationDTO.getDosage());
                medication.setTiming(medicationDTO.getTiming());
                // Set the healthReport for medication
                medication.setHealthReport(report); // This line is crucial
                // Add medication to the list
                medications.add(medication);
            }
        }
        // Set the prescriptions list in the health report
        report.setCreatedBy(userRepository.getOne(loggedInUserId));
        report.setUpdatedBy(userRepository.getOne(loggedInUserId));
        report.setCreatedTime(LocalDateTime.now());
        report.setUpdatedTime(LocalDateTime.now());
        report.setExaminationDateTime(LocalDateTime.now());
        report.setPrescriptions(medications);
        report.setNotes(userDTO.getNotes());
        report.setAppointment(appointment);
        return report;
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
