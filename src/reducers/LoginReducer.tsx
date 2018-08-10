import {
	USERNAME_CHANGED,
	PASSWORD_CHANGED,
	LOGIN_USER,
	FETCHED_ID,
	LOGIN_USER_FAILED,
	LOG_OUT,
	LOGIN_USER_SUCCESS
} from '../screens/types';

const INITIAL_STATE = {
	username: '',
	password: '',
	loading: false,
	success: '',
	id: ''
};

export default (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case USERNAME_CHANGED:
			return { ...state, username: action.payload };
		case PASSWORD_CHANGED:
			return { ...state, password: action.payload };
		case LOGIN_USER:
			return {
				...state,
				loading: true
			};
		case LOGIN_USER_SUCCESS:
			return {
				...state,
				loading: false
			};
		case FETCHED_ID:
			return { ...state, id: action.payload };
		case LOG_OUT:
			return {
				...state,
				loading: false,
				password: ''
			};
		case LOGIN_USER_FAILED:
			return {
				...state,
				loading: false,
				password: ''
			};
		default:
			return state;
	}
};
