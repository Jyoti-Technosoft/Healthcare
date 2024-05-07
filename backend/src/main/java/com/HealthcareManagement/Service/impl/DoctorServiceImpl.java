package com.HealthcareManagement.Service.impl;

import com.HealthcareManagement.Model.*;
import com.HealthcareManagement.Repository.*;
import com.HealthcareManagement.Service.DoctorService;
import com.HealthcareManagement.Service.ImageUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Statement;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    DoctorRepository doctorRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    HealthReportRepository healthReportRepository;
    @Autowired
    MedicationRepository medicationRepository;
    @Autowired
    DoctorLeaveRepository doctorLeaveRepository;

    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromMail;

    @Override
    public Doctor getDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Doctor not found with ID: " + userId));
    }

    @Override
    public ResponseEntity<String> updateprofile(Long userId, UserDTO userDTO) {
        try {
            // Check if the provided user ID is valid
            if (userId == null || userId <= 0) {
                throw new IllegalArgumentException("Invalid user id");
            }

            // Retrieve the receptionist entity from the database
            Optional<Doctor> existingDoctorOption = doctorRepository.findById(userId);
            if (existingDoctorOption.isPresent()) {
                Doctor existingDoctor = existingDoctorOption.get();

                // Retrieve the associated User entity
                User user = existingDoctor.getUser();

                // Check if the current password matches
                if (encoder.matches(userDTO.getCurrentPassword(), user.getPassword())) {
                    // Update the receptionist entity with data from the UserDTO
                    existingDoctor.setName(userDTO.getName());
                    existingDoctor.setContact(userDTO.getContact());
                    existingDoctor.setGender(userDTO.getGender());
                    existingDoctor.setDateOfBirth(userDTO.getDateOfBirth());
                    existingDoctor.setAddress(userDTO.getAddress());
                    existingDoctor.setAge(userDTO.getAge());

                    // Update the associated User entity with email and password
                    user.setEmail(userDTO.getEmail());
                    user.setPassword(encoder.encode(userDTO.getPassword()));

                    // Save changes to receptionist and user entities
                    doctorRepository.save(existingDoctor);
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
    public ResponseEntity<String> healthReport(UserDTO userDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long loggedInUserId = ((UserInfoDetails) authentication.getPrincipal()).getId();

            Optional<Appointment> optionalAppointment = appointmentRepository.findById(userDTO.getAppointmentId());
            if (optionalAppointment.isPresent()) {
                Appointment appointment = optionalAppointment.get();
                HealthReport report = convertToHealthReport(userDTO, appointment, loggedInUserId);
                healthReportRepository.save(report);
                return ResponseEntity.status(HttpStatus.OK).body("Health report submitted!!!");
            } else {
                return ResponseEntity.badRequest().body("Appointment not found");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Health report submission failed");
        }
    }

    @Override
    public List<HealthReport> getAllHealthreport() {
        List<HealthReport> healthReports = healthReportRepository.findAll();
        if (!healthReports.isEmpty()) {
            // Iterate through each health report and fetch prescriptions for each one
            for (HealthReport healthReport : healthReports) {
                List<Medication> prescriptions = medicationRepository.findByHealthReportId(healthReport.getId());
                healthReport.setPrescriptions(prescriptions);
            }
        }
        return healthReports;
    }

    @Override
    public List<HealthReport> getHealthreport(Long appointmentId) {
        List<HealthReport> healthReports = healthReportRepository.findByAppointmentId(appointmentId);
        if (!healthReports.isEmpty()) {
            // Iterate through each health report and fetch prescriptions for each one
            for (HealthReport healthReport : healthReports) {
                List<Medication> prescriptions = medicationRepository.findByHealthReportId(healthReport.getId());
                healthReport.setPrescriptions(prescriptions);
            }
        }
        return healthReports;
    }

    @Override
    public ResponseEntity<String> doctorLeaveRequest(Long doctorId, UserDTO userDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long loggedInUserId = ((UserInfoDetails) authentication.getPrincipal()).getId();

            Optional<Doctor> existingDoctor = doctorRepository.findById(doctorId);
            if (existingDoctor.isPresent()) {
                Doctor existingDocId = existingDoctor.get();
                DoctorLeave doctorLeave = convertToDoctorLeaveRequest(userDTO, existingDocId, loggedInUserId);

                String fromTime, toTime;
                if (doctorLeave.getFromTime() == null || doctorLeave.getToTime() == null || doctorLeave.getFromTime().isEmpty() || doctorLeave.getToTime().isEmpty()) {
                    // Set fromTime to start of the day and toTime to end of the day
                    fromTime = "00:00";
                    toTime = "23:59";
                }else {
                    String leaveTimeRange = doctorLeave.getFromTime() + " to " + doctorLeave.getToTime();
                    String[] timeRangeParts = leaveTimeRange.split(" to ");
                    fromTime = timeRangeParts[0];
                    toTime = timeRangeParts[1];
                }
                // Check for appointments during leave period
                List<Appointment> appointmentsDuringLeave = appointmentRepository.findAppointmentsDuringLeave(doctorLeave.getFromDate(), doctorLeave.getToDate(), fromTime, toTime, doctorId);


                if (!appointmentsDuringLeave.isEmpty()) {
                    // Display appointments during leave
                    System.out.println("Appointments during doctor's leave period:");
                    for (Appointment appointment : appointmentsDuringLeave) {
                        System.out.println("Appointment ID: " + appointment.getId());
                        System.out.println("Doctor ID: " + appointment.getDoctor().getId());
                        System.out.println("Patient ID: " + appointment.getPatient().getId());
                        System.out.println("Appointment date: " + appointment.getAppointmentDate());
                        System.out.println("Appointment time: " + appointment.getAppointmentTime());
                        System.out.println("******************************************************");
                        // Add more details as needed

                        // Convert appointment date string to LocalDate
                        LocalDate appointmentDate = LocalDate.parse(appointment.getAppointmentDate());
                        String[] timeParts = appointment.getAppointmentTime().split(" to ");
                        String startHour = timeParts[0];
                        String endHour = timeParts[1];
                        // Parse strings into LocalTime objects
                        LocalTime startingTime = LocalTime.parse(startHour, DateTimeFormatter.ofPattern("HH:mm"));
                        LocalTime endingTime = LocalTime.parse(endHour, DateTimeFormatter.ofPattern("HH:mm"));

                        // Add one hour to the start time
                        LocalTime newStartTime = startingTime.plusHours(1);


                        // Find the next available date after the existing appointment date
                        LocalDate nextAvailableDate = appointmentDate.plusDays(1);
                        System.out.println("Next available date: " +nextAvailableDate);
                        // Format the next available date along with the day name
//                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy");
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE");
                        String formattedNextAvailableDate = nextAvailableDate.format(formatter);
                        System.out.println("******************************************************>>>>>>>>>>>>>>>>>>>>>>>>");
                        // Assuming you have an instance of DoctorLeaveRepository called doctorLeaveRepository
                        List<DoctorLeave> fullDayLeaves = doctorLeaveRepository.findFullDayLeavesByDoctorId(doctorId);
                        System.out.println("Full days leaves::::::::>>>>>>>>>> " +fullDayLeaves);

                        if (!endingTime.equals(LocalTime.of(17, 0)) && doctorLeave.getFromTime() != null && doctorLeave.getToTime() != null && !doctorLeave.getFromTime().isEmpty() && !doctorLeave.getToTime().isEmpty()) {
                            // Move to the next day for rescheduling
                            nextAvailableDate = appointmentDate.plusDays(1);
                            // Reset starting time to 9:00 for the next day
                            //newStartTime = LocalTime.of(9, 0);

                            // Iterate over each hour slot from 9:00 to 16:00
                            for (LocalTime hour = newStartTime; hour.isBefore(LocalTime.of(16, 0)); hour = hour.plusHours(1)) {
                                // Define the start and end times for the current hour slot
                                LocalTime startTime = hour; // e.g., 9:00
                                LocalTime endTime = hour.plusHours(1); // e.g., 10:00

                                // Convert LocalDate and LocalTime objects to strings
                                String appointmentDateString = appointmentDate.toString();
                                String startTimeString = startTime.toString();
                                String endTimeString = endTime.toString();
                                String timeRange = startTimeString + " to " + endTimeString;

                                // Check if the doctor is on leave on the next available date

                                    // Count the number of appointments within the current hour slot
                                    int totalAppointmentsWithinHour = appointmentRepository.countAppointmentsByDoctorIdAndDateTimeRange(
                                            doctorId, appointmentDateString, startTimeString, endTimeString);
                                    int remainingSlots = 20 - totalAppointmentsWithinHour;
                                    // Print the count of appointments for the current hour slot
                                    System.out.println("Appointments for " + timeRange + " & slots::-->> " + remainingSlots);

                                    // Check if remaining slots are available
                                    if (remainingSlots > 0) {
                                        // Update the appointment's date and time
                                        appointment.setAppointmentDate(appointmentDateString);
                                        appointment.setAppointmentTime(timeRange); // Update with the start time of the available slot
                                        appointment.setUpdatedTime(LocalDateTime.now());
                                        // Save the updated appointment
                                        appointmentRepository.save(appointment);

                                        // Send email to affected patient
                                        sendLeaveNotificationEmail(appointment.getPatient().getUser().getEmail(), doctorLeave, appointment, appointmentDateString, timeRange);

                                        System.out.println("Appointment rescheduled to " + nextAvailableDate + " at " + timeRange);
                                        break;
                                    }
                                }
                            }
                        else {
                            // Check for available dates until the doctor is available
                            boolean doctorOnLeaveOnNextAvailableDate = doctorLeaveRepository.existsByDoctorIdAndDate(doctorId, nextAvailableDate.toString());
                            while (doctorOnLeaveOnNextAvailableDate || !matchesVisitingDays(existingDocId.getVisitingDays(), nextAvailableDate.getDayOfWeek().toString())) {
                                // Move to the next day
                                nextAvailableDate = nextAvailableDate.plusDays(1);

                                // Check if the doctor is on leave on the next available date
                                doctorOnLeaveOnNextAvailableDate = doctorLeaveRepository.existsByDoctorIdAndDate(doctorId, nextAvailableDate.toString());
                            }
                            // Iterate over each hour slot from 9:00 to 16:00
                            for (int hour = 9; hour < 17; hour++) {
                                // Define the start and end times for the current hour slot
                                LocalTime startTime = LocalTime.of(hour, 0); // e.g., 9:00
                                LocalTime endTime = LocalTime.of(hour + 1, 0); // e.g., 10:00

                                // Convert LocalDate and LocalTime objects to strings
                                String appointmentDateString = nextAvailableDate.toString();
                                String startTimeString = startTime.toString();
                                String endTimeString = endTime.toString();
                                String timeRange = startTimeString + " to " + endTimeString;


                                    // Count the number of appointments within the current hour slot
                                    int totalAppointmentsWithinHour = appointmentRepository.countAppointmentsByDoctorIdAndDateTimeRange(
                                            doctorId, appointmentDateString, startTimeString, endTimeString);
                                    int remainingSlots = 20 - totalAppointmentsWithinHour;
                                    // Print the count of appointments for the current hour slot
                                    System.out.println("Appointments for " + timeRange + " & slots::-->> " + remainingSlots);

                                    // Check if remaining slots are available
                                    if (remainingSlots > 0 ) {
                                        // Update the appointment's date and time
                                        appointment.setAppointmentDate(appointmentDateString);
                                        appointment.setAppointmentTime(timeRange); // Update with the start time of the available slot
                                        appointment.setUpdatedTime(LocalDateTime.now());
                                        // Save the updated appointment
                                        appointmentRepository.save(appointment);
                                        // Send email to affected patient
                                        sendLeaveNotificationEmail(appointment.getPatient().getUser().getEmail(), doctorLeave, appointment, appointmentDateString, timeRange);
                                        System.out.println("Appointment rescheduled to " + nextAvailableDate + " at " + timeRange);
                                        break;
                                    }
                            }
                        }
                    }
                }
                doctorLeaveRepository.save(doctorLeave);
                return ResponseEntity.status(HttpStatus.CREATED).body("Leave applied successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor id not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Leave not apply");
        }
    }


    private void sendLeaveNotificationEmail(String patientEmail, DoctorLeave doctorLeave, Appointment appointment, String newAppointmentDate, String newAppointmentTime) {
        Mail mail = new Mail();
        mail.setSubject("Appointment Notification");

        if (doctorLeave.getFromTime() == null && doctorLeave.getToTime() == null && doctorLeave.getFromTime().isEmpty() && doctorLeave.getToTime().isEmpty() && doctorLeave.getFromDate().compareTo(doctorLeave.getToDate()) > 0) {
            // Full-day leave
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String formattedAppointmentDate = LocalDate.parse(doctorLeave.getFromDate()).format(dateFormatter);

            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
            DateTimeFormatter twelveHourFormatter = DateTimeFormatter.ofPattern("hh:mm a");

            String[] newTimeRange = newAppointmentTime.split("to");
            String newStartTime = newTimeRange[0];
            String newEndTime = newTimeRange[1];

            String formattedNewStartTime = LocalTime.parse(newStartTime.trim(), timeFormatter).format(twelveHourFormatter);
            String formattedNewEndTime = LocalTime.parse(newEndTime.trim(), timeFormatter).format(twelveHourFormatter);

            mail.setMessage("Dear Patient,\n\n"
                    + "This is to inform you that your appointment with the doctor has been affected due to the doctor's unavailability.\n"
                    + "The doctor will be unavailable for the entire day.\n"
                    + "So Your appointment is reschedule on below given date and time.\n\n"
                    + "New Appointment Date: " + LocalDate.parse(newAppointmentDate).format(dateFormatter) + "\n"
                    + "New Appointment Time: " + formattedNewStartTime + " to " + formattedNewEndTime + "\n"
                    + "Thank you.");
        }
        else {
            // Partial-day leave
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String formattedAppointmentDate = LocalDate.parse(doctorLeave.getFromDate()).format(dateFormatter);

            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
            DateTimeFormatter twelveHourFormatter = DateTimeFormatter.ofPattern("hh:mm a");

            String appointmentTime = appointment.getAppointmentTime();

            // Extracting the time portion before parsing
            String[] timeRange = appointmentTime.split(" to ");
            String startTime = timeRange[0];
            String endTime = timeRange[1];

            String[] newTimeRange = newAppointmentTime.split("to");
            String newStartTime = newTimeRange[0];
            String newEndTime = newTimeRange[1];

            String formattedStartTime = LocalTime.parse(startTime.trim(), timeFormatter).format(twelveHourFormatter);
            String formattedEndTime = LocalTime.parse(endTime.trim(), timeFormatter).format(twelveHourFormatter);

            String formattedNewStartTime = LocalTime.parse(newStartTime.trim(), timeFormatter).format(twelveHourFormatter);
            String formattedNewEndTime = LocalTime.parse(newEndTime.trim(), timeFormatter).format(twelveHourFormatter);

            mail.setMessage("Dear Patient,\n\n"
                    + "This is to inform you that your appointment with the doctor has been affected due to the doctor's unavailability.\n"
                    + "So Your appointment is reschedule on below given date and time.\n\n"
                    + "Appointment Date: " + LocalDate.parse(newAppointmentDate).format(dateFormatter) + "\n"
                    + "Appointment Time: " + formattedNewStartTime + " to " + formattedNewEndTime + "\n"
                    + "Thank you.");
        }
        sendMail(patientEmail, mail);
    }

    public void sendMail(String mailId, Mail mail){
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(fromMail);
        simpleMailMessage.setSubject(mail.getSubject());
        simpleMailMessage.setText(mail.getMessage());
        simpleMailMessage.setTo(mailId);
        javaMailSender.send(simpleMailMessage);
    }

    // Method to check if the given visiting days string matches the specified day
    private boolean matchesVisitingDays(String visitingDays, String day) {
        // Split the visiting days string into individual days
        String[] days = visitingDays.split("[,-]");

        // Check if the specified day matches any of the days in the visiting days array
        for (String d : days) {
            if (d.trim().equalsIgnoreCase(day)) {
                return true;
            }
        }
        return false;
    }

    private boolean isDateWithinLeavePeriod(LocalDate date, DoctorLeave doctorLeave) {
        LocalDate fromDate = LocalDate.parse(doctorLeave.getFromDate());
        LocalDate toDate = LocalDate.parse(doctorLeave.getToDate());
        // Check if the date is equal to or after fromDate and equal to or before toDate
        return !date.isBefore(fromDate) && !date.isAfter(toDate);
    }


    public DoctorLeave convertToDoctorLeaveRequest(UserDTO userDTO,Doctor doctor,Long loggedInUserId){
        DoctorLeave doctorLeave = new DoctorLeave();
        doctorLeave.setFromDate(userDTO.getFromDate());
        doctorLeave.setToDate(userDTO.getToDate());
        doctorLeave.setFromTime(userDTO.getFromTime());
        doctorLeave.setToTime(userDTO.getToTime());
        doctorLeave.setReason(userDTO.getReason());
        doctorLeave.setCreatedBy(userRepository.getOne(loggedInUserId));
        doctorLeave.setUpdatedBy(userRepository.getOne(loggedInUserId));
        doctorLeave.setCreatedTime(LocalDateTime.now());
        doctorLeave.setUpdatedTime(LocalDateTime.now());
        doctorLeave.setDoctor(doctor);
        return doctorLeave;
    }


    public HealthReport convertToHealthReport(UserDTO userDTO, Appointment appointment,Long loggedInUserId){
        HealthReport report = new HealthReport();
        report.setDisease(userDTO.getDisease());
        // Create a new list to hold medications
        List<Medication> medications = new ArrayList<>();
        // Check if prescriptions exist in userDTO and not null
        if (userDTO.getPrescriptions() != null) {
            // Iterate over prescriptions in userDTO
            for (Medication medicationDTO : userDTO.getPrescriptions()) {
                Medication medication = new Medication();
                // Set properties of medication from userDTO
                medication.setMedicineName(medicationDTO.getMedicineName());
                medication.setDosage(medicationDTO.getDosage());
                medication.setTiming(medicationDTO.getTiming());
                // Set the healthReport for medication
                medication.setHealthReport(report); // This line is crucial
                // Add medication to the list
                medications.add(medication);
            }
        }
        // Set the prescriptions list in the health report
        report.setCreatedBy(userRepository.getOne(loggedInUserId));
        report.setUpdatedBy(userRepository.getOne(loggedInUserId));
        report.setCreatedTime(LocalDateTime.now());
        report.setUpdatedTime(LocalDateTime.now());
        report.setExaminationDateTime(LocalDateTime.now());
        report.setPrescriptions(medications);
        report.setNotes(userDTO.getNotes());
        report.setAppointment(appointment);
        return report;
    }


    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

//    @Transactional
//    public List<Doctor> getAllDoctorsWithImages() {
//        List<Doctor> doctors = doctorRepository.findAll();
//        // Make sure each doctor's image data is loaded
//        doctors.forEach(doctor -> doctor.getDoctorImageData());
//        return doctors;
//    }

    public List<Doctor> getAllDoctorsWithImages() {
        return doctorRepository.findAll();
    }

}
