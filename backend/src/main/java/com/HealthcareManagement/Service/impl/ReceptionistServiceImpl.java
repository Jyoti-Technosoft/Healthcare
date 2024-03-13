package com.HealthcareManagement.Service.impl;

import com.HealthcareManagement.Model.*;
import com.HealthcareManagement.Repository.*;
import com.HealthcareManagement.Service.ReceptionistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
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

        // Check if the patient has booked an appointment before
        boolean isFirstAppointment = appointmentRepository.countAppointmentsByPatientId(patientId) == 0;

        // Calculate the date six months from the first appointment
        LocalDateTime sixMonthsAfterFirstAppointment = null;
        if (isFirstAppointment) {
            // Get the first appointment date
            Optional<Appointment> firstAppointment = appointmentRepository.findFirstByPatientIdAndDoctorIdOrderByAppointmentDateAsc(patientId,doctorId);
            if (firstAppointment.isPresent()) {
                LocalDateTime firstAppointmentDateTime = LocalDateTime.parse(firstAppointment.get().getAppointmentDate());
                // Calculate six months after the first appointment
                sixMonthsAfterFirstAppointment = firstAppointmentDateTime.plusMonths(6);
            }
        }
        Doctor doctor = doctorOptional.get();
        String consultationCharge = "N/A";
        String consultationChargeType="1";
        if (isFirstAppointment) {
            if (doctor.getConsultationCharge() != null) {
                consultationCharge = doctor.getConsultationCharge();
                System.out.println("Consultancy charge: " + consultationCharge);
            } else {
                consultationCharge = "N/A";
            }
        } else if (sixMonthsAfterFirstAppointment != null && LocalDateTime.now().isBefore(sixMonthsAfterFirstAppointment)) {
            consultationCharge = "N/A"; // No charge within six months
        } else {
            Optional<Appointment> firstAppointment = appointmentRepository.findFirstByPatientIdAndDoctorIdOrderByAppointmentDateAsc(patientId,doctorId);
            if (firstAppointment.isPresent()) {
                String appointmentDateString = firstAppointment.get().getAppointmentDate();
                System.out.println("Appointment date string: " + appointmentDateString); // Add this line for debugging
                LocalDate firstAppointmentDate = LocalDate.parse(appointmentDateString);
                // Calculate six months after the first appointment
                sixMonthsAfterFirstAppointment = firstAppointmentDate.plusMonths(6).atStartOfDay();
            }

            // Check if the appointment is after the six months of the last payable appointment
            List<Appointment> lastPayableAppointmentDates = appointmentRepository.findAllPayableAppointmentsWithIntegerChargeByPatientIdAndDoctorId(patientId,doctorId);
            if (!lastPayableAppointmentDates.isEmpty()) {
                Appointment lastPayableAppointment = lastPayableAppointmentDates.get(0);
                LocalDate lastPayableAppointmentDate = LocalDate.parse(lastPayableAppointment.getAppointmentDate());
                LocalDate sixMonthsAfterLastPayableAppointment = lastPayableAppointmentDate.plusMonths(6);
                System.out.println("Last payable appointment date: " + lastPayableAppointmentDate);
                System.out.println("Six months after last payable appointment: " + sixMonthsAfterLastPayableAppointment);
                System.out.println("Current date time: " + LocalDate.now());
                // Parse the appointment date string into a LocalDate
                LocalDate appointmentDTODate = LocalDate.parse(userDTO.getAppointmentDate());
                if (appointmentDTODate.isAfter(sixMonthsAfterLastPayableAppointment) || appointmentDTODate.isEqual(sixMonthsAfterLastPayableAppointment)) {
                    // Full charge
                    consultationCharge = doctor.getConsultationCharge();
                    System.out.println("Consultancy charge: " + consultationCharge);
                } else {
                    // 50% charge
                    double fullCharge = Double.parseDouble(doctor.getConsultationCharge());
                    double halfCharge = fullCharge / 2;
                    consultationCharge = String.valueOf(halfCharge);
                    consultationChargeType = "0";
                    System.out.println("Consultancy charge (50%): " + consultationCharge);
                }
            } else {
                consultationCharge = doctor.getConsultationCharge(); // Assuming this is the default charge when no previous payable appointments are found
            }
        }

        // Book appointment for patient
        Appointment appointment = convertToAppointment(userDTO, patientOptional.get(), doctor, consultationCharge, consultationChargeType, loggedInUserId);
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

    @Override
    public List<Object[]> searchPatients(String query) {
        return appointmentRepository.searchPatients(query);
    }

    @Override
    public ResponseEntity<String> calculateConsultationCharge(Long patientId, Long doctorId, String appointDate) {
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

        Doctor doctor = doctorOptional.get();
        // Fetch the doctor associated with the appointment
        // Doctor doctor = doctorRepository.findById(doctorId).orElse(null);

        // Check if the patient has booked an appointment before
        boolean isFirstAppointment = appointmentRepository.countAppointmentsByPatientId(patientId) == 0;

        // Calculate the date six months from the first appointment with the same doctor
        LocalDateTime sixMonthsAfterFirstAppointment = null;
        if (isFirstAppointment) {
            // Get the first appointment date with the same doctor
            Optional<Appointment> firstAppointment = appointmentRepository.findFirstByPatientIdAndDoctorIdOrderByAppointmentDateAsc(patientId, doctorId);
            if (firstAppointment.isPresent()) {
                LocalDateTime firstAppointmentDateTime = LocalDateTime.parse(firstAppointment.get().getAppointmentDate());
                // Calculate six months after the first appointment
                sixMonthsAfterFirstAppointment = firstAppointmentDateTime.plusMonths(6);
            }
        }

        String consultationCharge = "N/A";
        String consultationChargeType = "1";
        if (isFirstAppointment || sixMonthsAfterFirstAppointment == null || LocalDateTime.now().isAfter(sixMonthsAfterFirstAppointment)) {
            // Check if the appointment is after the six months of the last payable appointment with the same doctor
            List<Appointment> payableAppointments = appointmentRepository.findAllPayableAppointmentsWithIntegerChargeByPatientIdAndDoctorId(patientId, doctorId);
            if (!payableAppointments.isEmpty()) {
                Appointment lastPayableAppointment = payableAppointments.get(0);
                LocalDate lastPayableAppointmentDate = LocalDate.parse(lastPayableAppointment.getAppointmentDate());
                LocalDate sixMonthsAfterLastPayableAppointment = lastPayableAppointmentDate.plusMonths(6);
                // Parse the appointment date string into a LocalDate
                LocalDate appointmentDTODate = LocalDate.parse(appointDate);
                if (appointmentDTODate.isAfter(sixMonthsAfterLastPayableAppointment) || appointmentDTODate.isEqual(sixMonthsAfterLastPayableAppointment)) {
                    // Full charge
                    consultationCharge = doctor.getConsultationCharge();
                } else {
                    // 50% charge
                    double fullCharge = Double.parseDouble(doctor.getConsultationCharge());
                    double halfCharge = fullCharge / 2;
                    consultationCharge = String.valueOf(halfCharge);
                    consultationChargeType = "0";
                }
            } else {
                consultationCharge = doctor.getConsultationCharge(); // Assuming this is the default charge when no previous payable appointments are found
            }
        } else {
            consultationCharge = "N/A"; // No charge within six months
        }

        return ResponseEntity.ok(consultationCharge);
    }


    @Override
    public List<Patient> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return patients;
    }

    @Override
    public List<Appointment> getAllAppointments(Long userId) {
        return receptionistRepository.findAllAppointmentsByUserId(userId);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
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


    public Appointment convertToAppointment(UserDTO userDTO, Patient patient, Doctor doctor, String consultationCharge,String consultationChargeType,Long loggedInUserId) {
        Appointment appointment = new Appointment();
        appointment.setAppointmentDate(userDTO.getAppointmentDate());
        appointment.setAppointmentTime(userDTO.getAppointmentTime());
        appointment.setCreatedBy(userRepository.getOne(loggedInUserId));
        appointment.setUpdatedBy(userRepository.getOne(loggedInUserId));
        appointment.setCreatedTime(LocalDateTime.now());
        appointment.setUpdatedTime(LocalDateTime.now());
        appointment.setConsultationCharge(consultationCharge);
        appointment.setConsultationChargeType(consultationChargeType);
        appointment.setPaymentMode("Cash");
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        return appointment;
    }
}