package com.HealthcareManagement.Controller;


import com.HealthcareManagement.Model.*;
import com.HealthcareManagement.Repository.DoctorRepository;
import com.HealthcareManagement.Service.EmailService;
import com.HealthcareManagement.Service.StorageService;
import com.HealthcareManagement.Service.impl.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;


@RestController
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.POST}, allowCredentials = "true")
@RequestMapping("/superAdmin")
@Api(value = "Super Admin Controller", tags = "Super Admin Controller", description = "APIs for super-admin-related operations")
public class SuperAdminController {

    @Autowired
    SuperAdminServiceImpl superAdminService;
    @Autowired
    ReceptionistServiceImpl receptionistService;
    @Autowired
    DoctorServiceImpl doctorService;

    @Autowired
    PatientServiceImpl patientService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private StorageService service;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    @PostMapping(value="/auth/registerUsers")
    @PreAuthorize("hasAnyAuthority('SuperAdmin', 'Receptionist')")
    @ApiOperation(value = "Register a new user", notes = "Registers a new user with the provided details.")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO){
        try{
            return superAdminService.registration(userDTO);
        }catch(Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping(value="/auth/registerDoctors",consumes = "multipart/form-data")
    @PreAuthorize("hasAnyAuthority('SuperAdmin', 'Receptionist')")
    public ResponseEntity<?> registerDoctors(@RequestParam("userDTOString") String userDTOString, @RequestParam("image") MultipartFile file) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        UserDTO userDTO = objectMapper.readValue(userDTOString, UserDTO.class);
        return superAdminService.registrationDoctor(userDTO,file);
    }

    @GetMapping("/auth/registerDoctors/{name}")
    @PreAuthorize("hasAnyAuthority('SuperAdmin', 'Receptionist')")
    public ResponseEntity<?>  getImageByName(@PathVariable("name") String name){
        byte[] image = superAdminService.getImage(name);

        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("image/png"))
                .body(image);
    }


    @PostMapping("/loginAdmin")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthRequest authRequest){
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
            if (authentication.isAuthenticated()) {
                //int userId = user.getId();
                String jwtToken = jwtService.generateToken(authRequest.getEmail());
                long userId = jwtService.getUserIdFromToken(jwtToken);
                String email=jwtService.getEmailFromToken(jwtToken);
                String role=jwtService.getRoleFromToken(jwtToken);
                System.out.println(userId);
                Map<String, Object> response = new HashMap<>();
                response.put("token", jwtToken);
                response.put("userId", userId);
                response.put("email",email);
                response.put("role",role);
                return ResponseEntity.ok(response);
            } else {
                throw new BadCredentialsException("Invalid email or password!");
            }
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Authentication failed: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Error occurred during authentication. Please try again later."));
        }
    }

    @GetMapping("/getReceptionist/{userId}")
    public ResponseEntity<?> getReceptionist(@PathVariable Long userId) {
        try {
            Receptionist receptionist = receptionistService.getReceptionistByUserId(userId);
            if (receptionist != null) {
                return new ResponseEntity<>(receptionist, HttpStatus.OK);
            } else{
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/getPatient/{userId}")
    @PreAuthorize("hasAnyAuthority('SuperAdmin','Patient','Receptionist','Doctor')")
    public ResponseEntity<?> getPatient(@PathVariable Long userId) {
        try {
            Patient patient = patientService.getPatientByUserId(userId);
            if (patient != null) {
                return new ResponseEntity<>(patient, HttpStatus.OK);
            } else{
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/auth/getUsers")
    @PreAuthorize("hasAuthority('SuperAdmin')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users,HttpStatus.OK);
    }

    @GetMapping("/getAllDoctorsWithImages")
    public ResponseEntity<List<Doctor>> getAllDoctorsWithImages() {
        List<Doctor> doctors = doctorService.getAllDoctorsWithImages();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/getDoctors")
    public ResponseEntity<List<Doctor>> getDoctors() {
        try {
            List<Doctor> doctors = doctorService.getAllDoctors();
            return new ResponseEntity<>(doctors, HttpStatus.OK);
        } catch (Exception e) {
            // Log the error
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/auth/sendMail/{mailId}")
    @PreAuthorize("hasAuthority('Doctor')")
    public String sendEmail(@PathVariable String mailId, @RequestBody Mail mail) {
        superAdminService.sendMail(mailId,mail);
        return "Mail sent successfully!!!";
    }

    @PostMapping("/auth/registerPatient")
    @PreAuthorize("hasAuthority('Receptionist')")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<String> registerPatient(@RequestBody PatientDTO patientDTO){
        try{
            return superAdminService.registerPatient(patientDTO);
        }catch(Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping("/forgotPassword/SendOTP/{emailId}")
    public String sendOtp(@PathVariable String emailId){
        Optional<User> userOptional = userService.getUserByEmail(emailId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String otp = generateOTP();

            // Set OTP and expiration time
            user.setOtp(otp);
            LocalDateTime now = LocalDateTime.now();
            user.setOtpCreationTime(now);
            user.setOtpExpirationTime(now.plusMinutes(10)); // OTP valid for 10 minutes

            userService.saveOTP(user); // Save the user with the new OTP details

            Mail mail = new Mail();
            mail.setTo(emailId);
            mail.setSubject("Your OTP for password reset");
            mail.setMessage("Your OTP is: " + otp);
            superAdminService.sendMail(emailId,mail);
            return "OTP sent successfully!!!";
        } else {
            return "User with email ID " + emailId + " does not exist!";
        }
    }

    @PostMapping("/forgotPassword/verifyOTP")
    public String verifyOtp(@RequestParam String emailId, @RequestParam String otp) {
        Optional<User> userOptional = userService.getUserByEmail(emailId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getOtp().equals(otp) && LocalDateTime.now().isBefore(user.getOtpExpirationTime())) {
                // OTP is correct and not expired
                return "OTP verified successfully!";
            } else {
                return "Invalid or expired OTP!";
            }
        } else {
            return "User with email ID " + emailId + " does not exist!";
        }
    }
    @PutMapping("/forgotPassword/changePassword")
    public String updatePassword(@RequestParam String emailId, @RequestParam String newPassword) {
        Optional<User> userOptional = userService.getUserByEmail(emailId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Encrypt the new password before saving it
            String encryptedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encryptedPassword);
            userService.saveUser(user);
            return "Password updated successfully!";
        } else {
            return "User with email ID " + emailId + " does not exist!";
        }
    }


    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
