package com.HealthcareManagement.Service;

import com.HealthcareManagement.Model.Patient;
import com.HealthcareManagement.Model.UserDTO;
import org.springframework.http.ResponseEntity;

public interface PatientService{
    public Patient getPatientByUserId(Long id);
    public ResponseEntity<String> updateprofile(Long userId, UserDTO userDTO);
}
