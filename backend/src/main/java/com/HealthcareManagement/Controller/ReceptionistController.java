package com.HealthcareManagement.Controller;

import com.HealthcareManagement.Model.*;
import com.HealthcareManagement.Repository.AppointmentRepository;
import com.HealthcareManagement.Repository.DoctorLeaveRepository;
import com.HealthcareManagement.Service.ReceptionistService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.POST}, allowCredentials = "true")
@RequestMapping("/receptionist")
@Api(value = "Receptionist Controller", tags = "Receptionist Controller", description = "APIs for Receptionist-related operations")
public class ReceptionistController {

    @Autowired
    ReceptionistService receptionistService;

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    DoctorLeaveRepository doctorLeaveRepository;

    @PutMapping("/auth/updateReceptionistProfile/{userId}")
    @PreAuthorize("hasAuthority('Receptionist')")
    public ResponseEntity<String> UpdateProfile(@PathVariable Long userId, @RequestBody UserDTO userDTO, @RequestHeader("Authorization") String authHeader){
        try{
            return receptionistService.updateprofile(userId,userDTO);
        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/auth/searchPatient")
    @PreAuthorize("hasAuthority('Receptionist')")
    public List<Map<String, Object>> searchPatients(@RequestParam String query) {
        List<Object[]> resultList = receptionistService.searchPatients(query);
        return convertResultListToMapList(resultList);
    }
    private List<Map<String, Object>> convertResultListToMapList(List<Object[]> resultList) {
        List<Map<String, Object>> mapList = new ArrayList<>();
        for (Object[] row : resultList) {
            Map<String, Object> rowMap = new HashMap<>();
            rowMap.put("id", row[0]);
            rowMap.put("name", row[1]);
            rowMap.put("contact", row[2]);
            rowMap.put("gender", row[3]);
            rowMap.put("dateOfBirth", row[4]);
            rowMap.put("age", row[5]);
            rowMap.put("weight", row[6]);
            rowMap.put("height", row[7]);
            rowMap.put("address", row[8]);
            rowMap.put("createdById", row[9]);
            rowMap.put("createdByEmail", row[10]);
            rowMap.put("updatedById", row[11]);
            rowMap.put("updatedByEmail", row[12]);
            rowMap.put("createdTime", row[13]);
            rowMap.put("updatedTime", row[14]);
            rowMap.put("userId", row[15]);
            rowMap.put("userEmail", row[16]);
            mapList.add(rowMap);
        }
        return mapList;
    }

    @PostMapping("/auth/bookAppointment")
    @PreAuthorize("hasAnyAuthority('Receptionist','Admin')")
    public ResponseEntity<String> BookAppointment( @RequestBody UserDTO userDTO, @RequestHeader("Authorization") String authHeader){
        try{
            return receptionistService.bookAppointment(userDTO);
        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }
    @GetMapping("/auth/availableSlots")
    @PreAuthorize("hasAnyAuthority('Receptionist','Admin')")
    public ResponseEntity<Map<String, Integer>> getAppointmentSlots(
            @RequestParam("doctorId") Long doctorId,
            @RequestParam("date") String date) {

        LocalDate appointmentDate = LocalDate.parse(date);

        // Initialize a map to store available slots for each hour
        TreeMap<String, Integer> availableSlotsMap = new TreeMap<>();

        // Iterate through each hour of the day from 0:00 to 23:00 (24-hour format)
        for (int hour = 9; hour < 17; hour++) {
            // Define the start and end times for the current hour slot
            LocalTime startTime = LocalTime.of(hour, 0);
            LocalTime endTime = LocalTime.of(hour + 1, 0); // Assuming appointments are for the entire hour

            // Format the start and end times as time range string "HH:mm - HH:mm"
            String startTimeString = startTime.toString();
            String endTimeString = endTime.toString();
            String timeRange = startTimeString + " to " + endTimeString;

            // Count appointments within the hour
            int totalAppointmentsWithinHour = appointmentRepository.countAppointmentsByDoctorIdAndDateTimeRange(
                    doctorId, date, startTimeString, endTimeString);

            // Calculate available slots
            int remainingSlots = 20 - totalAppointmentsWithinHour;

            // Store available slots for this hour range
            availableSlotsMap.put(timeRange, remainingSlots);
        }

        return ResponseEntity.ok(availableSlotsMap);
    }




    @GetMapping("/auth/patientConsultationCharge")
    @PreAuthorize("hasAnyAuthority('Receptionist','Admin')")
    public ResponseEntity<String> getConsultationCharge(@RequestParam("patientId") Long patientId,@RequestParam("doctorId") Long doctorId, @RequestParam("date") String appointmentDate) {
        try{
            return receptionistService.calculateConsultationCharge(patientId,doctorId,appointmentDate);
        }catch(Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/auth/getAppointments/{userId}")
    @PreAuthorize("hasAnyAuthority('Receptionist','Admin')")
    public List<Appointment> getAppointment(@PathVariable Long userId){
        try{
            return receptionistService.getAllAppointments(userId);
        }catch(Exception e){
            e.printStackTrace();
            throw e;
        }
    }
    @GetMapping("/auth/getAppointments")
    @PreAuthorize("hasAnyAuthority('Receptionist','Admin')")
    public List<Appointment> getAllAppointments(){
        try{
            return receptionistService.getAllAppointments();
        }catch(Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/auth/getDoctors")
    @PreAuthorize("hasAnyAuthority('Receptionist','Admin','Patient')")
    public List<Doctor> getAllDoctors(){
        try{
            return receptionistService.getAllDoctors();
        }catch(Exception e){
            e.printStackTrace();
            throw e;
        }
    }


    @GetMapping("/auth/allPatientsList")
    @PreAuthorize("hasAnyAuthority('Receptionist','Admin')")
    public List<Patient> displayPatient() {
       return receptionistService.getAllPatients();
    }


    @PutMapping("/auth/todayAppointment")
    @PreAuthorize("hasAuthority('Receptionist')")
    public ResponseEntity<String> updateArrivalStatus(@RequestParam("appointmentIds") List<Long> appointmentIds) {
        List<Appointment> appointments = appointmentRepository.findAllById(appointmentIds);

        if (appointments.isEmpty()) {
            return new ResponseEntity<>("No appointments found", HttpStatus.NOT_FOUND);
        }
        appointments.forEach(appointment -> {
            appointment.setArrive("1");
            appointmentRepository.save(appointment);
        });

        return new ResponseEntity<>("Arrival status updated successfully", HttpStatus.OK);
    }

    @GetMapping("/auth/getAllDoctorsLeaveRequest")
    @PreAuthorize("hasAnyAuthority('Receptionist','Admin')")
    public List<DoctorLeave> getAllDoctorsLeaveRequest(){
        try{
            return doctorLeaveRepository.findAll();
        }catch(Exception e){
            e.printStackTrace();
            throw e;
        }
    }

}
