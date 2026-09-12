package com.HealthcareManagement.Config;

import com.HealthcareManagement.Model.User;
import com.HealthcareManagement.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.default-admin.email:admin@healthcare.com}")
    private String adminEmail;

    @Value("${app.default-admin.password:admin123}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole("SuperAdmin");
            admin.setCreatedTime(LocalDateTime.now());
            admin.setUpdatedTime(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println(">>> Initialized default SuperAdmin account: " + adminEmail);
        }
    }
}
