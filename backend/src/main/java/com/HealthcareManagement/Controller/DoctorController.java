package com.HealthcareManagement.Controller;

import com.HealthcareManagement.Model.*;
import com.HealthcareManagement.Repository.AppointmentRepository;
import com.HealthcareManagement.Repository.DoctorLeaveRepository;
import com.HealthcareManagement.Repository.DoctorRepository;
import com.HealthcareManagement.Service.DoctorService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.POST}, allowCredentials = "true")
@RequestMapping("/doctor")
@Api(value = "Doctor Controller", tags = "Doctor Controller", description = "APIs for doctor-related operations")

public class DoctorController {

    @Autowired
    DoctorService doctorService;
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    DoctorLeaveRepository doctorLeaveRepository;

    @GetMapping("/auth/getDoctor/{userId}")
    @PreAuthorize("hasAuthority('Doctor')")
    public ResponseEntity<?> getDoctor(@PathVariable Long userId) {
        try {
            Doctor doctor = doctorService.getDoctorByUserId(userId);
            if (doctor != null) {
                return new ResponseEntity<>(doctor, HttpStatus.OK);
            } else{
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/auth/updateDoctorProfile/{userId}")
    @PreAuthorize("hasAuthority('Doctor')")
    public ResponseEntity<String> UpdateProfile(@PathVariable Long userId, @RequestBody UserDTO userDTO, @RequestHeader("Authorization") String authHeader){
        try{
            return doctorService.updateprofile(userId,userDTO);
        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }


    @GetMapping("/auth/allAppointments/{doctorId}")
    @PreAuthorize("hasAuthority('Doctor')")
    public ResponseEntity<List> getAppointmentsWithPatientName(@PathVariable Long doctorId, @RequestHeader("Authorization") String authHeader) {
        // Check if the doctor with the specified ID exists
        Optional<Doctor> doctor = doctorRepository.findById(doctorId);

        if (doctor.isEmpty()) {
            String errorMessage = "Doctor with ID " + doctorId + " not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonList(new Object[]{errorMessage}));
        }

        List appointments = appointmentRepository.getAppointmentsWithPatientName(doctorId);

        // Check if appointments are not found
        if (appointments.isEmpty()) {
            // Return a ResponseEntity with a 204 No Content status and a custom message
            String errorMessage = "No appointments found for the doctor with ID " + doctorId + ".";
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.singletonList(new Object[]{errorMessage}));
        }
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/auth/new/allAppointments/{doctorId}")
    @PreAuthorize("hasAuthority('Doctor')")
    public ResponseEntity<List> getAllAppointments(@PathVariable Long doctorId) {
        // Check if the doctor with the specified ID exists
        Optional<Doctor> doctor = doctorRepository.findById(doctorId);

        if (doctor.isEmpty()) {
            String errorMessage = "Doctor with ID " + doctorId + " not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonList(new Object[]{errorMessage}));
        }

        List appointments = appointmentRepository.findByDoctorId(doctorId);

        // Check if appointments are not found
        if (appointments.isEmpty()) {
            // Return a ResponseEntity with a 204 No Content status and a custom message
            String errorMessage = "No appointments found for the doctor with ID " + doctorId + ".";
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.singletonList(new Object[]{errorMessage}));
        }
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/auth/AppointmentWithoutHealthReport/{doctorId}")
    @PreAuthorize("hasAuthority('Doctor')")
    public ResponseEntity<List<Appointment>> getAppointmentsWithoutHealthReport(@PathVariable Long doctorId) {

        List<Appointment> appointments = appointmentRepository.findAppointmentsWithoutHealthReport(doctorId);
        if(appointments.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/auth/patients/{doctorId}")
    @PreAuthorize("hasAuthority('Doctor')")
    public List<Patient> getPatientsForDoctor(@PathVariable Long doctorId) {
        return appointmentRepository.getPatientsForDoctor(doctorId);
    }


    @PostMapping("/auth/healthReport/{appointmentId}")
    @PreAuthorize("hasAuthority('Doctor')")
    public ResponseEntity<String> healthReport(@RequestBody UserDTO userDTO){
        try {

            return doctorService.healthReport(userDTO);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            throw e; // Rethrow the exception
        }
    }

    @GetMapping("/auth/allHealthReport")
    @PreAuthorize("hasAnyAuthority('Patient','Doctor')")
    public ResponseEntity<List<HealthReport>> fetchHealthReport(){
        try {
            List<HealthReport> healthReport = doctorService.getAllHealthreport();
            if (healthReport != null) {
                // Return health report with prescriptions
                return ResponseEntity.ok(healthReport);
            } else {
                // Health report not found
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            throw e; // Rethrow the exception
        }
    }

    @GetMapping("/auth/healthReport/{appointmentId}")
    @PreAuthorize("hasAnyAuthority('Patient','Doctor')")
    public ResponseEntity<List<HealthReport>> fetchHealthReport(@PathVariable Long appointmentId){
        try {
            List<HealthReport> healthReport = doctorService.getHealthreport(appointmentId);
            if (healthReport != null) {
                // Return health report with prescriptions
                return ResponseEntity.ok(healthReport);
            } else {
                // Health report not found
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            throw e; // Rethrow the exception
        }
    }

    @PostMapping("/auth/doctorLeaveRequest/{doctorId}")
    @PreAuthorize("hasAuthority('Doctor')")
    public ResponseEntity<String> doctorLeaveRequest(@PathVariable Long doctorId,@RequestBody UserDTO userDTO){
        try{
            return doctorService.doctorLeaveRequest(doctorId,userDTO);
        }catch(Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/auth/getDoctorLeaveRequest/{doctorId}")
    @PreAuthorize("hasAnyAuthority('Doctor','Receptionist')")
    public ResponseEntity<List<DoctorLeave>> getDoctorLeaveRequest(@PathVariable Long doctorId) {
        try {
            Optional<Doctor> existingDoctor = doctorRepository.findById(doctorId);
            if (existingDoctor.isPresent()) {
                List<DoctorLeave> leaveRequests = doctorLeaveRepository.findByDoctorId(doctorId);
                if (!leaveRequests.isEmpty()) {
                    return ResponseEntity.ok(leaveRequests);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }



}
