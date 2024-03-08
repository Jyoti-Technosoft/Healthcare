// store/index.js
import { createStore, combineReducers } from 'redux';
import counterReducer from '../reducers/counterReducer';
import submenuReducer from '../reducers/submenuReducer';
import menuSlice from '../slice/menuSlice';
const rootReducer = combineReducers({
    submenu: submenuReducer,
    menu: menuSlice,  
    // Add other reducers here if needed
  });
  
  const store = createStore(rootReducer);

export default store;
