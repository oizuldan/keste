import React from 'react';
import { AsyncStorage, ActivityIndicator, Dimensions } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import {
	usernameFetched,
	infoFetched,
	itemsFetched,
	imageFetched,
	colorsForCoursesFetched
} from './DispatcherAction';

const window = Dimensions.get('window');

interface iProps {
	usernameFetched: any;
	infoFetched: any;
	itemsFetched: any;
	imageFetched: any;
	navigation: any;
	colorsForCoursesFetched: any;
}

class Dispatcher extends React.Component<iProps> {
	public async componentDidMount() {
		try {
			const uid: any = await AsyncStorage.getItem('UID');

			if (!uid) {
				this.props.navigation.dispatch(
					StackActions.reset({
						index: 0,
						actions: [
							NavigationActions.navigate({
								routeName: 'LoginWith'
							})
						]
					})
				);
				return;
			}

			const json: any = await JSON.parse(uid);

			await this.props.usernameFetched(json.username);
			await this.props.itemsFetched(json.items);
			await this.props.colorsForCoursesFetched(json.courseColors);
			await this.props.infoFetched(json.info);
			await this.props.imageFetched(json.image);

			this.props.navigation.dispatch(
				StackActions.reset({
					index: 0,
					actions: [
						NavigationActions.navigate({
							routeName: 'Tabs'
						})
					]
				})
			);
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		return (
			<ActivityIndicator
				style={{
					position: 'absolute',
					top: window.height / 2,
					left: window.width / 2
				}}
			/>
		);
	}
}

const mapDispatchToProps = {
	usernameFetched,
	infoFetched,
	itemsFetched,
	imageFetched,
	colorsForCoursesFetched
};

export default connect(
	null,
	mapDispatchToProps
)(Dispatcher);
