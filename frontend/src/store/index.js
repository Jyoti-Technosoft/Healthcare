import { createStore, combineReducers } from 'redux';
import submenuReducer from '../reducers/submenuReducer';
import menuSlice from '../slice/menuSlice';
const rootReducer = combineReducers({
    submenu: submenuReducer,
    menu: menuSlice,  
  });
  
  const store = createStore(rootReducer);

export default store;
