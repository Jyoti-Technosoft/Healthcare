// reducers/submenuReducer.js
import { ACTIVE_TAB, MIDDLE_COMPO, SET_ACTIVE_REGISTER_USERS, SET_ACTIVE_PROFILE_SUBMENU, SET_ACTIVE_PATIENT_MENU, SET_ACTIVE_BOOK_APPOINTMENT_MENU, SET_ACTIVE_PATIENT_LIST, SET_ACTIVER_DOCTOR_LIST, SET_ACTIVE_DOCTOR_PROFILE, SET_DOCTOR_APPOINTMENTS, SET_SHOW_APPOINTMENTS, SET_ACTIVE_DASHBOARD, SET_CONSULTANCY_PAGE } from '../actions/submenuActions';

const initialState = {
  activeTab: "dashboard",
  // resetPreviousTab: null,
  middleCompo: null,


  activeDashboard: null,
  activeRegisterUsers: null,
  activeProfileSubMenu: null,
  activePatientMenu: null,
  activeBookAppointmentMenu: null,
  patientListMenu: null,
  doctorListMenu: null,
  doctorProfileMenu: null,
  doctorAppointments: null,
  showAppointments: null,
  consultancyPage: null,
};

const submenuReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload,

      };
    case MIDDLE_COMPO:
      return {
        ...state,
        middleCompo: action.payload,
      };
    // case RESET_PREVIOUS_TAB:
    //   return {
    //     ...state,
    //     middleCompo: null,
    //   };




    case SET_ACTIVE_DASHBOARD:
      return {
        ...state,
        activeDashboard: action.payload,
      };
    case SET_ACTIVE_REGISTER_USERS:
      return {
        ...state,
        activeRegisterUsers: action.payload,
      };
    case SET_ACTIVE_PROFILE_SUBMENU:
      return {
        ...state,
        activeProfileSubMenu: action.payload,
      };
    case SET_ACTIVE_PATIENT_MENU:
      return {
        ...state,
        activePatientMenu: action.payload,
      };
    case SET_ACTIVE_BOOK_APPOINTMENT_MENU:
      return {
        ...state,
        activeBookAppointmentMenu: action.payload,
      };
    case SET_ACTIVE_PATIENT_LIST:
      return {
        ...state,
        patientListMenu: action.payload,
      };
    case SET_ACTIVER_DOCTOR_LIST:
      return {
        ...state,
        doctorListMenu: action.payload,
      };
    case SET_ACTIVE_DOCTOR_PROFILE:
      return {
        ...state,
        doctorProfileMenu: action.payload,
      };
    case SET_DOCTOR_APPOINTMENTS:
      return {
        ...state,
        doctorAppointments: action.payload,
      };
    case SET_SHOW_APPOINTMENTS:
      return {
        ...state,
        showAppointments: action.payload,
      };
    case SET_CONSULTANCY_PAGE:
      return {
        ...state,
        consultancyPage: action.payload,
      };
    default:
      return state;
  }
};


export default submenuReducer;


