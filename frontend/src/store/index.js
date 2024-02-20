// store/index.js
import { createStore, combineReducers } from 'redux';
import counterReducer from '../reducers/counterReducer';
import submenuReducer from '../reducers/submenuReducer';

const rootReducer = combineReducers({
    submenu: submenuReducer,
    // Add other reducers here if needed
  });
  
  const store = createStore(rootReducer);

export default store;
