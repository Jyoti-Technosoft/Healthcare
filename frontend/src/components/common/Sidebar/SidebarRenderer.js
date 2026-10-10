import React from "react";


import MainDashboard from "../../MainDashboard";
import RegisterUsers from "../../Admin/RegisterUsers";
import RegisterPatient from "../../Admin/RegisterPatient";
import UserList from "../../Admin/UserList";
import ReceptionistProfile from "../../Receptionist/ReceptionistProfile";
import BookAppointment from "../../Receptionist/BookAppointment";
import PatientList from "../../Receptionist/PatientList";
import DoctorList from "../../Receptionist/DoctorList";
import DoctorProfile from "../../Doctor/DoctorProfile";
import Appointments from "../../Doctor/Appointments";
import ShowAppointments from "../../Receptionist/ShowAppointments";
import Patients from "../../Doctor/Patients";
import DoctorLeaves from "../../Doctor/DoctorLeaves";
import AddDoctorLeaves from "../../Doctor/AddDoctorLeaves";
import PatientProfile from "../../Patient/PatientProfile";
import PatientAppointments from "../../Patient/PatientAppointments";
import HealthCalculator from "../../Patient/HealthCalculator";

export const renderSidebarComponent = (activeTab) => {
  
  switch (activeTab) {
    case "dashboard":
      return <MainDashboard />;
    case "registerUsers":
      return <RegisterUsers />;
    case "registerPatient":
      return <RegisterPatient />;
    case "usersList":
      return <UserList />;
    case "receptionistProfile":
      return <ReceptionistProfile />;
    case "bookAppointment":
      return <BookAppointment />;
    case "patientsList":
      return <PatientList />;
    case "doctorList":
      return <DoctorList />;
    case "showAppointments":
      return <ShowAppointments />;
    case "doctorProfile":
      return <DoctorProfile />;
    case "doctorAppointments":
      return <Appointments />;
    case "patientsWithAppointment":
      return <Patients />;
    case "doctorLeaves":
      return <DoctorLeaves />;
    case "addDoctorLeaves":
      return <AddDoctorLeaves />;
    case "patientProfile":
      return <PatientProfile />;
    case "patientAppointments":
      return <PatientAppointments />;
    case "healthCalculator":
      return <HealthCalculator />;
    default:
      return <MainDashboard />;
  }
};
