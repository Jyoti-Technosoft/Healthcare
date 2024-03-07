package com.HealthcareManagement.Service;

import com.HealthcareManagement.Model.Doctor;
import com.HealthcareManagement.Model.Receptionist;
import com.HealthcareManagement.Model.UserDTO;
import org.springframework.http.ResponseEntity;

public interface DoctorService {
    public Doctor getDoctorByUserId(Long id);
    public ResponseEntity<String> updateprofile(Long userId, UserDTO userDTO);

    public ResponseEntity<String> healthReport(UserDTO userDTO);

}
