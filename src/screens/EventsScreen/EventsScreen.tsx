import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { MyNavigator } from '../../components';
import { mainBg } from '../../assets';

interface EventsScreenProps {
	navigation: any;
	items: any;
}

class EventsScreen extends React.Component<EventsScreenProps> {
	private renderItem = (item: any) => {
		const date = item.item.date.split('T')[0].split('-');
		const dateString = date[2] + '.' + date[1] + '.' + date[0];
		return (
			<TouchableOpacity
				style={[styles.item]}
				onPress={() =>
					this.props.navigation.navigate('EditEvent', {
						date: dateString,
						time: item.item.dueTime,
						title: item.item.title,
						description: item.item.description,
						id: item.item.id,
						dueDate: item.item.date,
						completed: item.item.completed
					})
				}
			>
				<View
					style={[
						styles.coloredBox,
						{ backgroundColor: item.item.completed ? '#32CD32' : '#ff4c4c' }
					]}
				/>
				<View style={styles.timeBoxWrapper}>
					<Text style={styles.timeText}>{item.item.dueTime}</Text>
					<Text style={styles.dateText}>{dateString}</Text>
				</View>
				<View style={styles.descriptionWrapper}>
					<Text style={styles.descriptionTitleText}>{item.item.title}</Text>
					<Text style={styles.descriptionText}>{item.item.description}</Text>
				</View>
			</TouchableOpacity>
		);
	};

	private keyExtractor = (item: any) => item.id;

	public render() {
		return (
			<React.Fragment>
				<MyNavigator
					title="Today"
					background={mainBg}
					rightComponent={<Icon name="md-add" color="#FFFFFF" size={30} />}
					rightAction={() => this.props.navigation.navigate('AddEvent')}
				/>
				{this.props.items.todo.length !== 0 ? (
					<FlatList
						data={this.props.items.todo}
						renderItem={item => this.renderItem(item)}
						keyExtractor={this.keyExtractor}
					/>
				) : (
					<Text style={styles.noEvents}>No events</Text>
				)}
			</React.Fragment>
		);
	}
}

const styles = StyleSheet.create({
	item: {
		backgroundColor: 'white',
		flex: 1,
		flexDirection: 'row',
		borderTopLeftRadius: 8,
		borderBottomLeftRadius: 8,
		marginLeft: 17,
		marginTop: 17
	},
	coloredBox: {
		width: 6,
		borderTopLeftRadius: 8,
		borderBottomLeftRadius: 8,
		marginRight: 5
	},
	timeBoxWrapper: {
		paddingLeft: 3,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	dateText: {
		alignSelf: 'center',
		marginRight: 5,
		color: '#706969'
	},
	timeText: {
		alignSelf: 'center',
		marginRight: 5,
		fontSize: 16
	},
	descriptionWrapper: {
		flexDirection: 'column',
		flex: 1,
		padding: 10
	},
	descriptionTitleText: {
		fontSize: 16,
		fontWeight: '500'
	},
	descriptionText: {
		fontSize: 12,
		marginTop: 3,
		color: '#706969'
	},
	noEvents: {
		fontSize: 20,
		color: '#6d6d6d',
		fontWeight: 'bold',
		alignSelf: 'center',
	}
});

const mapStateToProps = ({ info }) => {
	const { items } = info;
	return { items };
};

export default connect(mapStateToProps)(EventsScreen);
