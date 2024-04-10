package com.HealthcareManagement.Controller;

import com.HealthcareManagement.Model.Doctor;
import com.HealthcareManagement.Model.Patient;
import com.HealthcareManagement.Model.UserDTO;
import com.HealthcareManagement.Repository.AppointmentRepository;
import com.HealthcareManagement.Repository.PatientRepository;
import com.HealthcareManagement.Service.impl.PatientServiceImpl;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.POST}, allowCredentials = "true")
@RequestMapping("/patient")
@Api(value = "Patient Controller", tags = "Patient Controller", description = "APIs for patient-related operations")

public class PatientController {

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    PatientServiceImpl patientService;

    @Autowired
    PatientRepository patientRepository;

    @GetMapping("/auth/new/allAppointments/{patientId}")
    @PreAuthorize("hasAnyAuthority('Patient','Doctor')")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List> getAllAppointments(@PathVariable Long patientId) {
        // Check if the doctor with the specified ID exists
        Optional<Patient> patient = patientRepository.findById(patientId);

        if (patient.isEmpty()) {
            String errorMessage = "Patient with ID " + patientId + " not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonList(new Object[]{errorMessage}));
        }

        List appointments = appointmentRepository.findByPatientId(patientId);

        // Check if appointments are not found
        if (appointments.isEmpty()) {
            // Return a ResponseEntity with a 204 No Content status and a custom message
            String errorMessage = "No appointments found for the patient with ID " + patientId + ".";
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.singletonList(new Object[]{errorMessage}));
        }
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @PutMapping("/auth/updatePatientProfile/{userId}")
    @PreAuthorize("hasAuthority('Patient')")
    public ResponseEntity<String> UpdateProfile(@PathVariable Long userId, @RequestBody UserDTO userDTO, @RequestHeader("Authorization") String authHeader){
        try{
            return patientService.updateprofile(userId,userDTO);
        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }
}
