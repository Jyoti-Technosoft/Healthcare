import dashboardIcon from "../../../assets/img/dashboard-icon.png";
import doctorIcon from "../../../assets/img/doctor-icon.png";
import patientsIcon from "../../../assets/img/patients-icon.png";
import appointmentIcon from "../../../assets/img/appointment-icon.png";
import roomIcon from "../../../assets/img/room-icon.png";


const MENUS = {
  Receptionist: [
    {
      tab: "doctorList",
      label: "Doctor",
      icon: doctorIcon,
    },
    {
      tab: "patientsList",
      label: "Patients",
      icon: patientsIcon,
      aliases: ["registerPatient", "patientProfile"],
    },
    {
      tab: "showAppointments",
      label: "Appointments",
      icon: appointmentIcon,
      aliases: ["bookAppointment"],
    },
  ],

  Doctor: [
    {
      tab: "doctorAppointments",
      label: "Appointments",
      icon: appointmentIcon,
    },
    {
      tab: "patientsWithAppointment",
      label: "Patients",
      icon: patientsIcon,
    },
    {
      tab: "doctorLeaves",
      label: "Leave Management",
      icon: roomIcon,
      aliases: ["addDoctorLeaves"],
    },
  ],

  Admin: [
    {
      tab: "doctorList",
      label: "Doctor",
      icon: doctorIcon,
    },
    {
      tab: "patientsList",
      label: "Patients",
      icon: patientsIcon,
      aliases: ["registerPatient", "patientProfile"],
    },
    {
      tab: "showAppointments",
      label: "Appointments",
      icon: appointmentIcon,
      aliases: ["bookAppointment"],
    },
    {
      tab: "usersList",
      label: "Users",
      icon: patientsIcon,
      aliases: ["registerUsers"],
    },
  ],

  SuperAdmin: [
    {
      tab: "usersList",
      label: "Users",
      icon: patientsIcon,
      aliases: ["registerUsers"],
    },
  ],

  Patient: [
    { tab: "doctorList", label: "Doctors", icon: doctorIcon },
    {
      tab: "patientAppointments",
      label: "Appointments",
      icon: appointmentIcon,
    },
    { tab: "healthCalculator", label: "Health Calculator", icon: roomIcon },
  ],
};

export const getMenuForRole = (role) => {
  return MENUS[role] || [];
};

export const DASHBOARD_ITEM = {
  tab: "dashboard",
  label: "Dashboard",
  icon: dashboardIcon,
};
