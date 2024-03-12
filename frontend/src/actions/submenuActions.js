export const SET_ACTIVE_DASHBOARD = 'SET_ACTIVE_DASHBOARD'; 
export const SET_ACTIVE_REGISTER_USERS = 'SET_ACTIVE_REGISTER_USERS';
export const SET_ACTIVE_PROFILE_SUBMENU = 'SET_ACTIVE_PROFILE_SUBMENU';
export const SET_ACTIVE_PATIENT_MENU = 'SET_ACTIVE_PATIENT_MENU';
export const SET_ACTIVE_BOOK_APPOINTMENT_MENU = 'SET_ACTIVE_BOOK_APPOINTMENT_MENU';
export const SET_ACTIVE_PATIENT_LIST = 'SET_ACTIVE_PATIENT_LIST';
export const SET_ACTIVER_DOCTOR_LIST = 'SET_ACTIVER_DOCTOR_LIST';
export const SET_ACTIVE_DOCTOR_PROFILE = 'SET_ACTIVE_DOCTOR_PROFILE';
export const SET_DOCTOR_APPOINTMENTS = 'SET_DOCTOR_APPOINTMENTS';
export const SET_SHOW_APPOINTMENTS = 'SET_SHOW_APPOINTMENTS'; 
export const SET_CONSULTANCY_PAGE = 'SET_CONSULTANCY_PAGE'; 


export const ACTIVE_TAB = 'ACTIVE_TAB';
// export const RESET_PREVIOUS_TAB = 'RESET_PREVIOUS_TAB';

export const MIDDLE_COMPO = 'MIDDLE_COMPO';


export const setActiveTab = (submenu) => ({
  type: ACTIVE_TAB, 
  payload: submenu,
});
// export const setResetPreviousTab = (submenu) => ({
//   type: RESET_PREVIOUS_TAB, 
//   payload: submenu,
// });

export const setMiddleCompo = (submenu) => ({
  type: MIDDLE_COMPO, 
  payload: submenu,
});





export const setActiveDashboard = (submenu) => ({
  type: SET_ACTIVE_DASHBOARD,
  payload: submenu,
});
export const setActiveRegisterUsers = (submenu) => ({
  type: SET_ACTIVE_REGISTER_USERS,
  payload: submenu,
});
export const setActiveProfileSubMenu = (submenu) => ({
  type: SET_ACTIVE_PROFILE_SUBMENU,
  payload: submenu,
});
export const setActivePatientMenu = (submenu) => ({ 
  type: SET_ACTIVE_PATIENT_MENU,
  payload: submenu,
});
export const setBookAppointmentMenu = (submenu) => ({
  type: SET_ACTIVE_BOOK_APPOINTMENT_MENU,
  payload: submenu,
});
export const setPatientListMenu = (submenu) => ({
  type: SET_ACTIVE_PATIENT_LIST,
  payload: submenu,
});
export const setDoctorListMenu = (submenu) => ({
  type: SET_ACTIVER_DOCTOR_LIST,
  payload: submenu,
});
export const setDoctorProfileMenu = (submenu) => ({
  type: SET_ACTIVE_DOCTOR_PROFILE,
  payload: submenu,
});
export const setDoctorAppointments = (submenu) => ({
  type: SET_DOCTOR_APPOINTMENTS,
  payload: submenu,
});
export const setShowAppointmentsMenu = (submenu) => ({
  type: SET_SHOW_APPOINTMENTS,
  payload: submenu,
});
export const setConsultancyPage = (submenu) => ({
  type: SET_CONSULTANCY_PAGE,
  payload: submenu,
});
