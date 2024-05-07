package com.HealthcareManagement.Service.impl;

import com.HealthcareManagement.Model.*;
import com.HealthcareManagement.Repository.*;
import com.HealthcareManagement.Roles;
import com.HealthcareManagement.Service.SuperAdminService;
import com.HealthcareManagement.Service.ImageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.*;
@Service
public class SuperAdminServiceImpl implements SuperAdminService, UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    ReceptionistRepository receptionistRepository;

    @Autowired
    DoctorRepository doctorRepository;

    @Autowired
    AdminRepository adminRepository;
    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromMail;



    @Override
    public ResponseEntity<String> registration(UserDTO userDTO) {
        try {
            String email = userDTO.getEmail();
            String password = userDTO.getPassword();

            if (email == null || password == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email or Password cannot be null");
            }

            String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
            Pattern pattern = Pattern.compile(emailRegex);
            Matcher matcher = pattern.matcher(email);

            if (!matcher.matches()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email format");
            }

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long loggedInUserId = ((UserInfoDetails) authentication.getPrincipal()).getId();

            User user = new User();
            user.setEmail(userDTO.getEmail());
            user.setPassword(encoder.encode(userDTO.getPassword()));
            user.setRole(userDTO.getRoles());
            user.setCreatedTime(userDTO.getCreatedTime());
            user.setUpdatedTime(userDTO.getUpdatedTime());
            userRepository.save(user);

            if(Roles.Receptionist.name().equals(userDTO.getRoles())){
                Receptionist receptionist = convertToReceptionist(userDTO,user);
                receptionistRepository.save(receptionist);
            }else if(Roles.Patient.name().equals(userDTO.getRoles())){
                Patient patient = convertToPatient(userDTO,user,loggedInUserId);
                patientRepository.save(patient);
                String decryptedPassword = userDTO.getPassword(); // Implement this method to decrypt password
                System.out.println("Patient Email: " + email + ", Patient Password: " + decryptedPassword);
            } else if (Roles.Admin.name().equals(userDTO.getRoles())) {
                Admin admin = convertToAdmin(userDTO,user);
                adminRepository.save(admin);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User registration failed");
        }
    }

    @Override
    public ResponseEntity<?> registrationDoctor(UserDTO userDTO, MultipartFile file) throws IOException {
        if (Roles.Doctor.name().equals(userDTO.getRoles())) {
            // Create and save the user
            User user = new User();
            user.setEmail(userDTO.getEmail());
            user.setPassword(encoder.encode(userDTO.getPassword()));
            user.setRole(userDTO.getRoles());
            userRepository.save(user);

            // Create and save the doctor
            Doctor doctor = Doctor.builder()
                    .name(userDTO.getName())
                    .contact(userDTO.getContact())
                    .gender(userDTO.getGender())
                    .dateOfBirth(userDTO.getDateOfBirth())
                    .age(userDTO.getAge())
                    .address(userDTO.getAddress())
                    .joiningDate(userDTO.getJoiningDate())
                    .qualification(userDTO.getQualification())
                    .designation(userDTO.getDesignation())
                    .specialities(userDTO.getSpecialities())
                    .department(userDTO.getDepartment())
                    .morningTiming(userDTO.getMorningTiming())
                    .eveningTiming(userDTO.getEveningTiming())
                    .visitingDays(userDTO.getVisitingDays())
                    .doctorImageName(file.getOriginalFilename())
                    .doctorImageData(file.getBytes())
                    .consultationCharge(userDTO.getConsultationCharge())
                    .user(user)
                    .build();

            Doctor savedDoctor = doctorRepository.save(doctor);

            if (savedDoctor != null) {
                // Return success message if the doctor is saved successfully
                return ResponseEntity.ok("Doctor registered successfully");
            } else {
                // Return error message if saving doctor fails
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to register doctor");
            }
        } else {
            // Return error message if userDTO does not have the Doctor role
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User must have Doctor role for registration");
        }
    }

    @Transactional
    public byte[] getImage(String name) {
        Optional<Doctor> dbImage = doctorRepository.findByDoctorImageName(name);
        byte[] image = ImageUtils.decompressImage(dbImage.get().getDoctorImageData());
        return image;
    }


    public Receptionist convertToReceptionist(UserDTO userDTO, User user){
        Receptionist receptionist = new Receptionist();
        receptionist.setName(userDTO.getName());
        receptionist.setContact(userDTO.getContact());
        receptionist.setGender(userDTO.getGender());
        receptionist.setDateOfBirth(userDTO.getDateOfBirth());
        receptionist.setAge(userDTO.getAge());
        receptionist.setAddress(userDTO.getAddress());
        receptionist.setJoiningDate(userDTO.getJoiningDate());
        receptionist.setShiftTiming(userDTO.getShiftTiming());
        receptionist.setDayOfWork(userDTO.getDayOfWork());
        receptionist.setUser(user);
        return receptionist;
    }

    public Patient convertToPatient(UserDTO userDTO, User user,Long loggedInUserId){
        Patient patient = new Patient();
        patient.setName(userDTO.getName());
        patient.setContact(userDTO.getContact());
        patient.setGender(userDTO.getGender());
        patient.setDateOfBirth(userDTO.getDateOfBirth());
        patient.setAge(userDTO.getAge());
        patient.setAddress(userDTO.getAddress());
        patient.setWeight(userDTO.getWeight());
        patient.setHeight(userDTO.getHeight());
        patient.setCreatedBy(userRepository.getOne(loggedInUserId));
        patient.setUpdatedBy(userRepository.getOne(loggedInUserId));
        patient.setCreatedTime(LocalDateTime.now());
        patient.setUpdatedTime(LocalDateTime.now());
        patient.setUser(user);
        return patient;
    }

    public Admin convertToAdmin(UserDTO userDTO, User user){
        Admin admin = new Admin();
        admin.setName(userDTO.getName());
        admin.setContact(userDTO.getContact());
        admin.setGender(userDTO.getGender());
        admin.setDateOfBirth(userDTO.getDateOfBirth());
        admin.setAge(userDTO.getAge());
        admin.setAddress(userDTO.getAddress());
        admin.setCreatedTime(LocalDateTime.now());
        admin.setUpdatedTime(LocalDateTime.now());
        admin.setUser(user);
        return admin;
    }

    @Override
    public ResponseEntity<String> registerPatient(PatientDTO patientDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body("Patient registered successfully");
    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> userDetail = userRepository.findByEmail(email);
        return userDetail.map(UserInfoDetails::new).orElseThrow(()-> new UsernameNotFoundException("Email not found " +email));
    }

    public void sendMail(String mailId, Mail mail){
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(fromMail);
        simpleMailMessage.setSubject(mail.getSubject());
        simpleMailMessage.setText(mail.getMessage());
        simpleMailMessage.setTo(mailId);
        javaMailSender.send(simpleMailMessage);
    }


}
