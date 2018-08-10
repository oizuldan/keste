import {
	USERNAME_CHANGED,
	FETCHED_IMAGE,
	FETCHED_INFO,
	COURSE_COLORS_FROM_STORAGE,
	ITEMS_CHANGED
} from '../types';

export const usernameFetched = (username: string) => {
	return {
		type: USERNAME_CHANGED,
		payload: username
	};
};

export const infoFetched = (info: string[]) => {
	return {
		type: FETCHED_INFO,
		payload: info
	};
};

export const itemsFetched = (all: any) => {
	return {
		type: ITEMS_CHANGED,
		payload: all
	};
};

export const colorsForCoursesFetched = (courseColors: any) => {
	return {
		type: COURSE_COLORS_FROM_STORAGE,
		payload: courseColors
	};
};

export const imageFetched = (image: string) => {
	return {
		type: FETCHED_IMAGE,
		payload: image
	};
};
