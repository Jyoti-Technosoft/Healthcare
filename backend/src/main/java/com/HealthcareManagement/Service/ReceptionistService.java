package com.HealthcareManagement.Service;

import com.HealthcareManagement.Model.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ReceptionistService {
    public ResponseEntity<String> updateprofile(Long userId, UserDTO userDTO);

    public Receptionist getReceptionistByUserId(Long id);

    public ResponseEntity<String> bookAppointment(UserDTO userDTO);

    public List<Object[]> searchPatients(String query);

    public ResponseEntity<String> calculateConsultationCharge(Long patientId,Long doctorId,String appointmentDate);

    public List<Patient> getAllPatients();

    public List<Appointment> getAllAppointments(Long userId);
    public List<Appointment> getAllAppointments();
    public List<Doctor> getAllDoctors();
}
