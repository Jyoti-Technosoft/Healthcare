package com.HealthcareManagement.Service.impl;

import com.HealthcareManagement.Model.User;
import com.HealthcareManagement.Repository.UserRepository;
import com.HealthcareManagement.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
}
