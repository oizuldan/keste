import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer';
import ScheduleReducer from './ScheduleReducer';

export default combineReducers({
	login: LoginReducer,
	info: ScheduleReducer
});
