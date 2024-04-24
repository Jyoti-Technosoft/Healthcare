package com.HealthcareManagement.Model;

import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class UserDTO {
    private Long id;
    private String email;
    private String currentPassword;
    private String password;
    private String roles;
    private String name;
    private String contact;
    private String dateOfBirth;
    private String age;
    private String gender;
    private String address;
    private String joiningDate;
    private String dayOfWork;
    private String shiftTiming;

    private String weight;
    private String height;

    private String qualification;
    private String designation;
    private String specialities;
    private String department;
    private String morningTiming;
    private String eveningTiming;
    private String doctorImageName;
    private String consultationCharge;

    private byte[] doctorImageData;

    private Long patientId;
    private Long doctorId;
    private Long appointmentId;
    private String appointmentDate;
    private String appointmentTime;

    private Long createdBy;
    private Long updatedBy;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    private String visitingDays;


    private String disease;
    private List<Medication> prescriptions = new ArrayList<>();
    private String notes;
    private LocalDateTime examinationDateTime;
    private String medicineName;
    private String dosage;
    private String timing;
    private String arrive;

    private String fromDate;
    private String toDate;
    private String fromTime;
    private String toTime;
    private String reason;

    public String getArrive() {
        return arrive;
    }

    public void setArrive(String arrive) {
        this.arrive = arrive;
    }

    public LocalDateTime getExaminationDateTime() {
        return examinationDateTime;
    }

    public void setExaminationDateTime(LocalDateTime examinationDateTime) {
        this.examinationDateTime = examinationDateTime;
    }

    public String getFromDate() {
        return fromDate;
    }

    public void setFromDate(String fromDate) {
        this.fromDate = fromDate;
    }

    public String getToDate() {
        return toDate;
    }

    public void setToDate(String toDate) {
        this.toDate = toDate;
    }

    public String getFromTime() {
        return fromTime;
    }

    public void setFromTime(String fromTime) {
        this.fromTime = fromTime;
    }

    public String getToTime() {
        return toTime;
    }

    public void setToTime(String toTime) {
        this.toTime = toTime;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
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

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDayOfWork() {
        return dayOfWork;
    }

    public void setDayOfWork(String dayOfWork) {
        this.dayOfWork = dayOfWork;
    }

    public String getShiftTiming() {
        return shiftTiming;
    }

    public void setShiftTiming(String shiftTiming) {
        this.shiftTiming = shiftTiming;
    }
    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(String joiningDate) {
        this.joiningDate = joiningDate;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
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

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Long updatedBy) {
        this.updatedBy = updatedBy;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public LocalDateTime getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(LocalDateTime updatedTime) {
        this.updatedTime = updatedTime;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getConsultationCharge() {
        return consultationCharge;
    }

    public void setConsultationCharge(String consultationCharge) {
        this.consultationCharge = consultationCharge;
    }

    public String getVisitingDays() {
        return visitingDays;
    }

    public void setVisitingDays(String visitingDays) {
        this.visitingDays = visitingDays;
    }

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public List<Medication> getPrescriptions() {
        return prescriptions;
    }

    public void setPrescriptions(List<Medication> prescriptions) {
        this.prescriptions = prescriptions;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getExaminationDate() {
        return examinationDateTime;
    }

    public void setExaminationDate(LocalDateTime examinationDateTime) {
        this.examinationDateTime = examinationDateTime;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getTiming() {
        return timing;
    }

    public void setTiming(String timing) {
        this.timing = timing;
    }
}
