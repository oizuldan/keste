import React from 'react';
import IconFeather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation';
import * as myConst from './constants';

import {
	EventsScreen,
	LoginScreen,
	ScheduleScreen,
	GPACalcScreen,
	ProfileScreen,
	AddEventScreen,
	EditEventScreen,
	DispatcherScreen,
	LoginWithScreen
} from './screens';

export const TabStack = createBottomTabNavigator(
	{
		Schedule: ScheduleScreen,
		Events: EventsScreen,
		GPA: GPACalcScreen,
		Profile: ProfileScreen
	},
	{
		initialRouteName: 'Schedule',
		navigationOptions: ({ navigation }: any) => ({
			tabBarIcon: ({ tintColor }: any) => {
				const { routeName } = navigation.state;
				if (routeName === 'Schedule') {
					return <IconFeather name="calendar" size={30} color={tintColor} />;
				}
				if (routeName === 'Events') {
					return (
						<MaterialIcons
							name="format-list-bulleted"
							size={30}
							color={tintColor}
						/>
					);
				}
				if (routeName === 'GPA') {
					return (
						<Ionicons
							style={{ paddingTop: 4 }}
							name="ios-calculator"
							size={34}
							color={tintColor}
						/>
					);
				}
				if (routeName === 'Profile') {
					return <IconFeather name="user" size={30} color={tintColor} />;
				}
			}
		}),
		tabBarOptions: {
			activeTintColor: myConst.mainColor,
			inactiveTintColor: '#cccccc',
			showLabel: false
		}
	}
);

export const TabStack2 = createBottomTabNavigator(
	{
		Schedule: ScheduleScreen,
		Events: EventsScreen,
		GPA: GPACalcScreen,
		Profile: ProfileScreen
	},
	{
		initialRouteName: 'Events',
		navigationOptions: ({ navigation }: any) => ({
			tabBarIcon: ({ tintColor }: any) => {
				const { routeName } = navigation.state;
				if (routeName === 'Schedule') {
					return <IconFeather name="calendar" size={30} color={tintColor} />;
				}
				if (routeName === 'Events') {
					return (
						<MaterialIcons
							name="format-list-bulleted"
							size={30}
							color={tintColor}
						/>
					);
				}
				if (routeName === 'GPA') {
					return (
						<Ionicons
							style={{ paddingTop: 4 }}
							name="ios-calculator"
							size={34}
							color={tintColor}
						/>
					);
				}
				if (routeName === 'Profile') {
					return <IconFeather name="user" size={30} color={tintColor} />;
				}
			}
		}),
		tabBarOptions: {
			activeTintColor: myConst.mainColor,
			inactiveTintColor: '#cccccc',
			showLabel: false
		},
		lazy: false
	}
);

const RootStack = createStackNavigator(
	{
		Dispatcher: {
			screen: DispatcherScreen
		},
		LoginWith: {
			screen: LoginWithScreen
		},
		Login: {
			screen: LoginScreen
		},
		Tabs: {
			screen: TabStack
		},
		Tabs2: {
			screen: TabStack2
		},
		AddEvent: {
			screen: AddEventScreen
		},
		EditEvent: {
			screen: EditEventScreen
		}
	},
	{
		headerMode: 'none'
	}
);

export default RootStack;
