import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import moment from 'moment';
import {
	USERNAME_CHANGED,
	PASSWORD_CHANGED,
	LOGIN_USER,
	LOGIN_USER_FAILED,
	ITEMS_FETCHED,
	FETCHED_INFO,
	FETCHED_IMAGE,
	FETCHED_ID,
	LOGIN_USER_SUCCESS
} from '../types';
import * as myColors from '../../constants';

const client = new ApolloClient({
	uri: 'https://api.graph.cool/simple/v1/cjjjjob8m30ul015677awn3le'
});

export const usernameChanged = (text: string) => {
	return {
		type: USERNAME_CHANGED,
		payload: text
	};
};

export const passwordChanged = (text: string) => {
	return {
		type: PASSWORD_CHANGED,
		payload: text
	};
};

export const idFetched = (text: string) => {
	return {
		type: FETCHED_ID,
		payload: text
	};
};

export const loginUser = (props: any) => {
	const { username, password, changeScreen } = props;

	return async (dispatch: any) => {
		dispatch({ type: LOGIN_USER });

		const urlInfo =
			'https://lit-depths-21739.herokuapp.com/info?name=' +
			username +
			'&&pass=' +
			password;
		const urlSemSchedule =
			'https://lit-depths-21739.herokuapp.com/schedule?name=' +
			username +
			'&&pass=' +
			password;
		const urlPhoto =
			'https://lit-depths-21739.herokuapp.com/image?name=' +
			username +
			'&&pass=' +
			password;

		try {
			await fetch(urlSemSchedule)
				.then(res => res.json())
				.then(async json => {
					const res = await fetchTodo(username, password);
					const items = await scheduleAndTodoToItems(json, res.todo, res.id);
					// console.log(items.all.id);
					dispatch({
						type: ITEMS_FETCHED,
						payload: items
					});
				})
				.catch(() => {
					throw 'Incorrect username or password';
				});

			const prom2 = fetch(urlInfo)
				.then(res => res.json())
				.then(json => {
					dispatch({ type: FETCHED_INFO, payload: json });
				})
				.catch(() => {
					throw 'Incorrect username or password';
				});

			const prom3 = fetch(urlPhoto)
				.then(res => res.json())
				.then(json => {
					dispatch({ type: FETCHED_IMAGE, payload: json });
				})
				.catch(() => {
					throw 'Incorrect username or password';
				});

			await Promise.all([prom2, prom3]);
			dispatch({ type: LOGIN_USER_SUCCESS });
			changeScreen();
		} catch (e) {
			dispatch({ type: LOGIN_USER_FAILED });
			alert(e);
		}
	};
};

const fetchTodo = async (username: string, password: string) => {
	let todo: string[] = [];
	let id = '';

	await client
		.mutate({
			variables: {
				email: {
					email: username,
					password: password
				}
			},
			mutation: gql`
				mutation signIn(
					$email: AUTH_PROVIDER_EMAIL = { email: "", password: "" }
				) {
					signinUser(email: $email) {
						token
						user {
							id
							toDoLists {
								date
								description
								dueTime
								title
								id
								completed
							}
						}
					}
				}
			`
		})
		.then((response: any) => {
			todo = response.data.signinUser.user.toDoLists;
			id = response.data.signinUser.user.id;
		})
		.catch(e => {
			console.log(e);
			client
				.mutate({
					variables: {
						authProvider: {
							email: {
								email: username,
								password: password
							}
						}
					},
					mutation: gql`
						mutation addUser(
							$authProvider: AuthProviderSignupData = {
								email: { email: "", password: "" }
							}
						) {
							createUser(authProvider: $authProvider) {
								email
								password
								id
							}
						}
					`
				})
				.then((response: any) => {
					let id = response.data.signinUser.user.id;
				});
		});
	// console.log(id);
	return { todo: todo, id: id };
};

const scheduleAndTodoToItems = (schedules: any, todo: any, id: string) => {
	const from = moment(schedules.Monday[0].date.from, 'DD-MM-YYYY');
	const to = moment(schedules.Monday[0].date.to, 'DD-MM-YYYY');
	const diff = to.diff(from, 'days');
	let k = 0;
	let items: any = {};
	let colorsForCourses: any = {};

	for (let i = 0; i <= diff; i++) {
		const dayName = from.format('dddd');
		const currentDay = from.add(1, 'days');

		if (schedules[dayName]) {
			const coursesArray = schedules[dayName];
			if (k !== 6) {
				coursesArray.forEach((item: any) => {
					if (!colorsForCourses[item.title]) {
						colorsForCourses[item.title] = myColors.colorArray[k++];
					}
				});
			}
		}
		const dayToString = currentDay.toISOString().split('T')[0];
		items[dayToString] = schedules[dayName] ? schedules[dayName] : [];
	}

	todo = todo.sort((element1: any, element2: any) => {
		const time1String =
			element1.date.split('T')[0].replace(new RegExp('-', 'g'), '') +
			element1.dueTime.replace(new RegExp(':', 'g'), '');
		const time1 = parseInt(time1String) / 100000;

		const time2String =
			element2.date.split('T')[0].replace(new RegExp('-', 'g'), '') +
			element2.dueTime.replace(new RegExp(':', 'g'), '');
		const time2 = parseInt(time2String) / 100000;

		return time1 - time2;
	});

	todo.forEach((item: any) => {
		const date = item.date.split('T')[0];

		if (!items[date]) items[date] = [item];
		else {
			let array = items[date];

			array.push(item);
			array = array.sort((element1: any, element2: any) => {
				let time1, time2;

				if (element1.time) {
					time1 = parseInt(
						element1.time.from.replace(new RegExp(':', 'g'), '')
					);
				} else {
					time1 = parseInt(element1.dueTime.replace(new RegExp(':', 'g'), ''));
				}

				if (element2.time) {
					time2 = parseInt(
						element2.time.from.replace(new RegExp(':', 'g'), '')
					);
				} else {
					time2 = parseInt(element2.dueTime.replace(new RegExp(':', 'g'), ''));
				}

				return time1 - time2;
			});

			items[date] = array;
		}
	});

	const all = {
		items: items,
		todo: todo,
		id: id
	};

	return { all: all, courseColors: colorsForCourses };
};
