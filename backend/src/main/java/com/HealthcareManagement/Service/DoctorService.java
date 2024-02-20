package com.HealthcareManagement.Service;

import com.HealthcareManagement.Model.Doctor;
import com.HealthcareManagement.Model.Receptionist;

public interface DoctorService {
    public Doctor getDoctorByUserId(Long id);
}
