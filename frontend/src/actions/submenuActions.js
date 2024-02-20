export const SET_ACTIVE_REGISTER_USERS = 'SET_ACTIVE_REGISTER_USERS';
export const SET_ACTIVE_PROFILE_SUBMENU = 'SET_ACTIVE_PROFILE_SUBMENU';
export const SET_ACTIVE_PATIENT_MENU = 'SET_ACTIVE_PATIENT_MENU';
export const SET_ACTIVE_BOOK_APPOINTMENT_MENU = 'SET_ACTIVE_BOOK_APPOINTMENT_MENU';


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