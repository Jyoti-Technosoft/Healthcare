package com.HealthcareManagement.Service;

import com.HealthcareManagement.Model.Receptionist;
import com.HealthcareManagement.Model.UserDTO;
import org.springframework.http.ResponseEntity;

public interface ReceptionistService {
    public ResponseEntity<String> updateprofile(Long userId, UserDTO userDTO);

    public Receptionist getReceptionistByUserId(Long id);

    public ResponseEntity<String> bookAppointment(UserDTO userDTO);

}
