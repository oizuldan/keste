import { LOG_OUT, LOG_OUT2 } from '../types';

export const logout = () => {
  return {
    type: LOG_OUT
  };
};
export const logout2 = () => {
	return {
		type: LOG_OUT2
	};
};
