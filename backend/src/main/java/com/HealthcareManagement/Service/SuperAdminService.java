package com.HealthcareManagement.Service;


import com.HealthcareManagement.Model.PatientDTO;
import com.HealthcareManagement.Model.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface SuperAdminService {
    public ResponseEntity<String> registration(UserDTO userDTO);

    public ResponseEntity<?> registrationDoctor(UserDTO userDTO,MultipartFile file) throws IOException;



    public ResponseEntity<String> registerPatient(PatientDTO patientDTO);
}
