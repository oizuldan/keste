import { ITEMS_CHANGED } from '../types';

export const eventAdded = (array: object[]) => {
	return {
		type: ITEMS_CHANGED,
		payload: array
	};
};
