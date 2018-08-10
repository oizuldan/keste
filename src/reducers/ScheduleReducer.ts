import {
	FETCHED_IMAGE,
	ITEMS_FETCHED,
	FETCHED_INFO,
	ITEMS_CHANGED,
	COURSE_COLORS_FROM_STORAGE,
	LOG_OUT2,
	LOGIN_USER_FAILED
} from '../screens/types';

const INITIAL_STATE = {
	items: {},
	image: '',
	information: [],
	courseColors: {}
};

export default (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case LOGIN_USER_FAILED:
			return {
				...state,
				items: {},
				information: [],
				courseColors: {}
			};
		case ITEMS_FETCHED:
			return {
				...state,
				items: action.payload.all,
				courseColors: action.payload.courseColors
			};
		case FETCHED_IMAGE:
			return { ...state, image: action.payload };
		case FETCHED_INFO:
			return { ...state, information: action.payload };
		case ITEMS_CHANGED:
			return { ...state, items: action.payload };
		case LOG_OUT2:
			return {
				...state
			};
		case COURSE_COLORS_FROM_STORAGE:
			return { ...state, courseColors: action.payload };
		default:
			return state;
	}
};
