package com.HealthcareManagement.Service.impl;

import com.HealthcareManagement.Model.Patient;
import com.HealthcareManagement.Model.Receptionist;
import com.HealthcareManagement.Model.User;
import com.HealthcareManagement.Model.UserDTO;
import com.HealthcareManagement.Repository.PatientRepository;
import com.HealthcareManagement.Repository.UserRepository;
import com.HealthcareManagement.Service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PatientServiceImpl implements PatientService {
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    private PasswordEncoder encoder;
    @Override
    public Patient getPatientByUserId(Long id) {
        return patientRepository.findByUserId(id)
                .orElseThrow(() -> new UsernameNotFoundException("Patient not found with ID: " + id));
    }

    @Override
    public ResponseEntity<String> updateprofile(Long userId, UserDTO userDTO) {
        try {
            // Check if the provided user ID is valid
            if (userId == null || userId <= 0) {
                throw new IllegalArgumentException("Invalid user id");
            }

            // Retrieve the receptionist entity from the database
            Optional<Patient> existingPatientOption = patientRepository.findById(userId);
            if (existingPatientOption.isPresent()) {
                Patient existingPatient = existingPatientOption.get();

                // Retrieve the associated User entity
                User user = existingPatient.getUser();

                // Check if the current password matches
                if (encoder.matches(userDTO.getCurrentPassword(), user.getPassword())) {
                    // Update the receptionist entity with data from the UserDTO
                    existingPatient.setName(userDTO.getName());
                    existingPatient.setContact(userDTO.getContact());
                    existingPatient.setGender(userDTO.getGender());
                    existingPatient.setDateOfBirth(userDTO.getDateOfBirth());
                    existingPatient.setAddress(userDTO.getAddress());
                    existingPatient.setAge(userDTO.getAge());
                    existingPatient.setWeight(userDTO.getWeight());
                    existingPatient.setHeight(userDTO.getHeight());

                    // Update the associated User entity with email and password
                    user.setEmail(userDTO.getEmail());
                    user.setPassword(encoder.encode(userDTO.getPassword()));

                    // Save changes to receptionist and user entities
                    patientRepository.save(existingPatient);
                    userRepository.save(user);

                    return ResponseEntity.ok("Patient profile and user details updated successfully");
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
}
