package com.HealthcareManagement.Service.impl;

import com.HealthcareManagement.Model.*;
import com.HealthcareManagement.Repository.*;
import com.HealthcareManagement.Service.ReceptionistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReceptionistServiceImpl implements ReceptionistService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    ReceptionistRepository receptionistRepository;
    @Autowired
    AppointmentRepository appointmentRepository;
    @Autowired
    private PasswordEncoder encoder;

    @Override
    public ResponseEntity<String> updateprofile(Long userId, UserDTO userDTO) {
        try {
            // Check if the provided user ID is valid
            if (userId == null || userId <= 0) {
                throw new IllegalArgumentException("Invalid user id");
            }

            // Retrieve the receptionist entity from the database
            Optional<Receptionist> existingReceptionistOption = receptionistRepository.findById(userId);
            if (existingReceptionistOption.isPresent()) {
                Receptionist existingReceptionist = existingReceptionistOption.get();

                // Retrieve the associated User entity
                User user = existingReceptionist.getUser();

                // Check if the current password matches
                if (encoder.matches(userDTO.getCurrentPassword(), user.getPassword())) {
                    // Update the receptionist entity with data from the UserDTO
                    existingReceptionist.setName(userDTO.getName());
                    existingReceptionist.setContact(userDTO.getContact());
                    existingReceptionist.setGender(userDTO.getGender());
                    existingReceptionist.setDateOfBirth(userDTO.getDateOfBirth());
                    existingReceptionist.setAddress(userDTO.getAddress());
                    existingReceptionist.setAge(userDTO.getAge());

                    // Update the associated User entity with email and password
                    user.setEmail(userDTO.getEmail());
                    user.setPassword(encoder.encode(userDTO.getPassword()));

                    // Save changes to receptionist and user entities
                    receptionistRepository.save(existingReceptionist);
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
    public Receptionist getReceptionistByUserId(Long userId) {
        return receptionistRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Receptionist not found with ID: " + userId));
    }

    @Override
    public ResponseEntity<String> bookAppointment(UserDTO userDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long loggedInUserId = ((UserInfoDetails) authentication.getPrincipal()).getId();

        Long doctorId = userDTO.getDoctorId();
        Long patientId = userDTO.getPatientId();
        String appointmentDate = userDTO.getAppointmentDate();
        String appointmentTimeRange = userDTO.getAppointmentTime();
        String[] timeRangeParts = appointmentTimeRange.split(" to ");
        if (timeRangeParts.length != 2) {
            return ResponseEntity.badRequest().body("Invalid appointment time format. Please enter in the format 'start time to end time', e.g., '10 AM to 11 AM'.");
        }

        // Validate doctor ID
        Optional<Doctor> doctorOptional = doctorRepository.findById(doctorId);
        if (doctorOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Doctor with ID " + doctorId + " does not exist.");
        }

        // Validate patient ID
        Optional<Patient> patientOptional = patientRepository.findById(patientId);
        if (patientOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Patient with ID " + patientId + " does not exist.");
        }

        // Book appointment for patient
        Patient patient = patientOptional.get();
        Doctor doctor = doctorOptional.get();
        Appointment appointment = convertToPatient(userDTO, patient, doctor, loggedInUserId);
        appointmentRepository.save(appointment);

        // Count the number of appointments within the specified hour
        int totalAppointmentsWithinHour = appointmentRepository.countAppointmentsByDoctorIdAndDateTimeRange(
                doctorId, appointmentDate, timeRangeParts[0], timeRangeParts[1]);

        // Log the number of remaining slots
        int remainingSlots = 20 - totalAppointmentsWithinHour;
        System.out.println("Remaining appointment slots within the specified hour: " + remainingSlots);

        // Check if the total appointments within the hour exceed the limit
        if (totalAppointmentsWithinHour == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("All appointment slots are full for the selected doctor within the specified hour.");
        }

        return ResponseEntity.ok("Appointment booked successfully!");
    }



    private List<String> calculateTimeSlots(String startTime, String endTime, int intervalMinutes) {
        // Extract hour, minute, and AM/PM components
        int startHour = Integer.parseInt(startTime.substring(0, 2));
        int startMinute = Integer.parseInt(startTime.substring(3, 5));
        boolean startIsPM = startTime.substring(5).equalsIgnoreCase("PM");

        int endHour = Integer.parseInt(endTime.substring(0, 2));
        int endMinute = Integer.parseInt(endTime.substring(3, 5));
        boolean endIsPM = endTime.substring(5).equalsIgnoreCase("PM");

        // Adjust hours for PM times
        if (startIsPM && startHour != 12) {
            startHour += 12;
        }
        if (endIsPM && endHour != 12) {
            endHour += 12;
        }

        // Construct LocalTime objects
        LocalTime start = LocalTime.of(startHour, startMinute);
        LocalTime end = LocalTime.of(endHour, endMinute);

        // Calculate time slots between start and end times
        List<String> timeSlots = new ArrayList<>();
        while (start.isBefore(end) || start.equals(end)) {
            timeSlots.add(start.format(DateTimeFormatter.ofPattern("h:mma")));
            start = start.plusMinutes(intervalMinutes);
        }

        return timeSlots;
    }









    public Appointment convertToPatient(UserDTO userDTO, Patient patient, Doctor doctor, Long loggedInUserId) {
        Appointment appointment = new Appointment();
        appointment.setAppointmentDate(userDTO.getAppointmentDate());
        appointment.setAppointmentTime(userDTO.getAppointmentTime());
        appointment.setCreatedBy(userRepository.getOne(loggedInUserId));
        appointment.setUpdatedBy(userRepository.getOne(loggedInUserId));
        appointment.setCreatedTime(LocalDateTime.now());
        appointment.setUpdatedTime(LocalDateTime.now());
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        return appointment;
    }
}