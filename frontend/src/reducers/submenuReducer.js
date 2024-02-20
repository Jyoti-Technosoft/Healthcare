// reducers/submenuReducer.js
import { SET_ACTIVE_REGISTER_USERS, SET_ACTIVE_PROFILE_SUBMENU, SET_ACTIVE_PATIENT_MENU, SET_ACTIVE_BOOK_APPOINTMENT_MENU } from '../actions/submenuActions';

const initialState = {
  activeRegisterUsers: null,
  activeProfileSubMenu: null,
  activePatientMenu: null,
  activeBookAppointmentMenu: null,
};

const submenuReducer = (state = initialState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};


export default submenuReducer;


