import {combineReducers} from '@reduxjs/toolkit';
import authReducer from './authToken';

const rootReducer = combineReducers({
  auth: authReducer,
});
export default rootReducer;
