package com.HealthcareManagement.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "Doctor")
@Builder
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    @Column(unique = true)
    private String contact;
    private String gender;
    private String dateOfBirth;
    private String age;
    private String address;
    private String joiningDate;
    private String qualification;
    private String designation;
    private String specialities;
    private String department;
    private String morningTiming;
    private String eveningTiming;
    private String doctorImageName;

    @Lob
    @Column(name = "imagedata",length = 1000)
    private byte[] doctorImageData;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonManagedReference
    private User user;

    public Doctor(){

    }

    public Doctor(Long id, String name, String contact, String gender, String dateOfBirth, String age, String address, String joiningDate, String qualification, String designation, String specialities, String department, String morningTiming, String eveningTiming, String doctorImageName,  byte[] doctorImageData, User user) {
        this.id = id;
        this.name = name;
        this.contact = contact;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.age = age;
        this.address = address;
        this.joiningDate = joiningDate;
        this.qualification = qualification;
        this.designation = designation;
        this.specialities = specialities;
        this.department = department;
        this.morningTiming = morningTiming;
        this.eveningTiming = eveningTiming;
        this.doctorImageName = doctorImageName;
        this.doctorImageData = doctorImageData;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getSpecialities() {
        return specialities;
    }

    public void setSpecialities(String specialities) {
        this.specialities = specialities;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getMorningTiming() {
        return morningTiming;
    }

    public void setMorningTiming(String morningTiming) {
        this.morningTiming = morningTiming;
    }

    public String getEveningTiming() {
        return eveningTiming;
    }

    public void setEveningTiming(String eveningTiming) {
        this.eveningTiming = eveningTiming;
    }

    public String getDoctorImageName() {
        return doctorImageName;
    }

    public void setDoctorImageName(String doctorImageName) {
        this.doctorImageName = doctorImageName;
    }


    public byte[] getDoctorImageData() {
        return doctorImageData;
    }

    public void setDoctorImageData(byte[] doctorImageData) {
        this.doctorImageData = doctorImageData;
    }

    public String getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(String joiningDate) {
        this.joiningDate = joiningDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
