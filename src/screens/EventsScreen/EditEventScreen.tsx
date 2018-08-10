import React from 'react';
import {
	StyleSheet,
	KeyboardAvoidingView,
	TouchableOpacity,
	Text,
	View,
	AsyncStorage,
	SegmentedControlIOS,
	Keyboard,
	TouchableWithoutFeedback,
	Platform,
	ActivityIndicator,
	BackHandler
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { TextInput } from 'react-native-paper';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-boost';
import Icon from 'react-native-vector-icons/Ionicons';
import SegmentControl from 'react-native-segment-controller';

import * as myConst from '../../constants';
import { MyNavigator } from '../../components';
import { scheduleBg } from '../../assets';
import { eventAdded } from './EventAction';

const client = new ApolloClient({
	uri: 'https://api.graph.cool/simple/v1/cjjjjob8m30ul015677awn3le'
});

interface EditEventScreenProps {
	navigation: any;
	items: any;
	eventAdded: any;
}
interface EditEventScreenState {
	title: string;
	description: string;
	dueTime: string;
	dueDate: string;
	chosenDate: any;
	isDateTimePickerVisible: boolean;
	toDoId: string;
	activeInputRef: any;
	width: number;
	height: number;
	opacity: number;
	completed: any;
	selectedIndex: number;
	loading: boolean;
}

class EditEventScreen extends React.Component<
	EditEventScreenProps,
	EditEventScreenState
> {
	public state = {
		title: '',
		description: '',
		isDateTimePickerVisible: false,
		dueDate: '',
		dueTime: '',
		chosenDate: null,
		toDoId: '',
		activeInputRef: 0,
		width: 3,
		height: 3,
		opacity: 0.3,
		completed: null,
		loading: false,
		selectedIndex: this.props.navigation.getParam('completed') ? 0 : 1
	};

	public componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	public componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	private handleBackPress = () => {
		this.props.navigation.goBack(); // works best when the goBack is async
		return true;
	};

	private onChangeTitle = (title: string) => {
		this.setState({ title });
	};

	private onChangeDescription = (description: string) => {
		this.setState({ description });
	};

	private showDateTimePicker = () =>
		this.setState({ isDateTimePickerVisible: true });

	private hideDateTimePicker = () =>
		this.setState({ isDateTimePickerVisible: false });

	private handleTimePicked = (chosenDate: Date) => {
		const hours = chosenDate.getHours().toString();
		let mins = chosenDate.getMinutes().toString();

		if (mins.length === 1) {
			mins = '0' + mins;
		}

		const time = hours + ':' + mins;
		const dueDate = chosenDate.toLocaleDateString();

		this.setState({ dueDate: dueDate, chosenDate: chosenDate, dueTime: time });
		this.hideDateTimePicker();
	};

	private saveEvent = (
		dueDate: string,
		time: string,
		Description: string,
		Title: string,
		id: string,
		completed: boolean,
		todo: any
	) => {
		this.setState(prevState => {
			return { loading: !prevState.loading };
		});

		let todoArray = todo;
		const date = this.state.chosenDate ? this.state.chosenDate : dueDate;
		const dueTime = this.state.dueTime ? this.state.dueTime : time;
		const title = this.state.title ? this.state.title : Title;
		const description = this.state.description
			? this.state.description
			: Description;
		const completion = this.state.selectedIndex === 0 ? true : false;

		client
			.mutate({
				variables: {
					date: date,
					dueTime: dueTime,
					title: title,
					description: description,
					id: id,
					completed: completion
				},
				mutation: gql`
					mutation updateToDo(
						$date: DateTime!
						$title: String!
						$description: String!
						$id: ID!
						$dueTime: String
						$completed: Boolean
					) {
						updateToDoList(
							date: $date
							title: $title
							description: $description
							id: $id
							dueTime: $dueTime
							completed: $completed
						) {
							id
							date
						}
					}
				`
			})
			.then((response: any) => {
				todoArray = todoArray.filter((item: any) => item.id !== id);
				const obj = {
					date: response.data.updateToDoList.date,
					dueTime: dueTime,
					title: title,
					description: description,
					id: response.data.updateToDoList.id,
					completed: completion
				};

				if (!todoArray) todoArray = [];
				todoArray.push(obj);

				todoArray = todoArray.sort((element1: any, element2: any) => {
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

				let items = this.props.items.items;
				const date = dueDate.split('T')[0];
				let arrayToFilter = items[date];

				arrayToFilter = arrayToFilter.filter((item: any) => item.id !== id);

				items[date] = arrayToFilter;

				const chosenDate = this.state.chosenDate
					? this.state.chosenDate.toISOString().split('T')[0]
					: date;

				let arrayToPush: any = items[chosenDate] ? items[chosenDate] : [];
				arrayToPush.push(obj);

				arrayToPush = arrayToPush.sort((element1: any, element2: any) => {
					let time1, time2;

					if (element1.time) {
						time1 = parseInt(
							element1.time.from.replace(new RegExp(':', 'g'), '')
						);
					} else {
						time1 = parseInt(
							element1.dueTime.replace(new RegExp(':', 'g'), '')
						);
					}

					if (element2.time) {
						time2 = parseInt(
							element2.time.from.replace(new RegExp(':', 'g'), '')
						);
					} else {
						time2 = parseInt(
							element2.dueTime.replace(new RegExp(':', 'g'), '')
						);
					}

					return time1 - time2;
				});

				items[chosenDate] = arrayToPush;

				const all = { items: items, todo: todoArray, id: this.props.items.id };

				this.props.eventAdded(all);
				let UID = {
					items: all
				};

				AsyncStorage.mergeItem('UID', JSON.stringify(UID));
				this.setState(prevState => {
					return { loading: !prevState.loading };
				});
			})
			.then(() =>
				this.props.navigation.dispatch(
					StackActions.reset({
						index: 0,
						actions: [
							NavigationActions.navigate({
								routeName: 'Tabs2'
							})
						]
					})
				)
			)
			.catch(e => alert(e));
	};

	private deleteEvent = (id: string, dueDate: any) => {
		this.setState(prevState => {
			return { loading: !prevState.loading };
		});

		let todoArray = this.props.items.todo;

		client
			.mutate({
				variables: {
					id: id
				},
				mutation: gql`
					mutation deleteToDo($id: ID!) {
						deleteToDoList(id: $id) {
							id
						}
					}
				`
			})
			.then(() => {
				todoArray = todoArray.filter((item: any) => item.id !== id);

				let items = this.props.items.items;
				const date = dueDate.split('T')[0];
				let array = items[date];

				array = array.filter((item: any) => item.id !== id);
				items[date] = array;

				const all = { items: items, todo: todoArray, id: this.props.items.id };

				this.props.eventAdded(all);

				let UID = {
					items: all
				};
				AsyncStorage.mergeItem('UID', JSON.stringify(UID));
				this.setState(prevState => {
					return { loading: !prevState.loading };
				});
			})
			.then(() =>
				this.props.navigation.dispatch(
					StackActions.reset({
						index: 0,
						actions: [
							NavigationActions.navigate({
								routeName: 'Tabs2'
							})
						]
					})
				)
			)
			.catch(e => alert(e));
	};

	private handleFocus(ref: number) {
		this.setState({
			activeInputRef: ref
		});
	}

	private changeInputFocus(direction = 1) {
		const focusingRef = this.state.activeInputRef + direction;
		this.refs[`${focusingRef}`].focus();
	}

	public render() {
		const title = this.props.navigation.getParam('title');
		const description = this.props.navigation.getParam('description');
		const time = this.props.navigation.getParam('time');
		const date = this.props.navigation.getParam('date');
		const dueDate = this.props.navigation.getParam('dueDate');
		const id = this.props.navigation.getParam('id');
		const completed = this.props.navigation.getParam('completed');

		return (
			<React.Fragment>
				<MyNavigator
					title="Edit event"
					background={scheduleBg}
					leftComponent={
						<Icon name="ios-arrow-back" color="#FFFFFF" size={30} />
					}
					leftAction={() => this.props.navigation.goBack()}
				/>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<KeyboardAvoidingView
						style={styles.container}
						keyboardVerticalOffset={64}
						behavior="padding"
					>
						<TextInput
							style={styles.textStyle}
							ref="1"
							label="Event name"
							returnKeyType="next"
							underlineColor="#0071bc"
							value={this.state.title ? this.state.title : title}
							onChangeText={this.onChangeTitle}
							onSubmitEditing={this.changeInputFocus.bind(this, 1)}
							onFocus={this.handleFocus.bind(this, 1)}
						/>

						<TextInput
							style={styles.textStyle}
							ref="2"
							label="Description"
							returnKeyType="next"
							underlineColor="#0071bc"
							value={
								this.state.description ? this.state.description : description
							}
							onChangeText={this.onChangeDescription}
							onFocus={this.handleFocus.bind(this, 2)}
						/>

						<TouchableOpacity
							ref="3"
							onPress={() => {
								this.showDateTimePicker();
							}}
						>
							{!this.state.dueDate ? (
								<View style={{ marginTop: 40 }}>
									<Text style={styles.pickerPlaceholderStyle}>
										The event is on {date} at {time}
									</Text>

									<View style={styles.pickerStyle} />
								</View>
							) : (
								<View style={{ marginTop: 32 }}>
									<Text
										style={{
											color: '#3f51b5',
											fontSize: 12
										}}
									>
										Event date
									</Text>

									<View style={styles.pickedDateViewStyle}>
										<Text style={styles.pickedDateStyle}>
											The event is on {this.state.dueDate} at{' '}
											{this.state.dueTime}
										</Text>
									</View>
								</View>
							)}
						</TouchableOpacity>
						{Platform.OS === 'ios' ? (
							<SegmentedControlIOS
								values={['Completed', 'Not completed']}
								style={styles.segmentedControl}
								selectedIndex={this.state.selectedIndex}
								tintColor={myConst.mainColor}
								onChange={event => {
									this.setState({
										selectedIndex: event.nativeEvent.selectedSegmentIndex
									});
								}}
							/>
						) : (
							<SegmentControl
								values={['Completed', 'Not completed']}
								// s={styles.segmentedControl}
								selectedIndex={this.state.selectedIndex}
								borderRadius={5}
								onTabPress={(index: number) => {
									this.setState({
										selectedIndex: index
									});
								}}
								activeTabStyle={{
									backgroundColor: myConst.mainColor
								}}
								tabStyle={{ marginTop: 15, borderColor: myConst.mainColor }}
								tabTextStyle={{ color: myConst.mainColor }}
							/>
						)}

						<DateTimePicker
							mode="datetime"
							isVisible={this.state.isDateTimePickerVisible}
							onConfirm={this.handleTimePicked}
							onCancel={this.hideDateTimePicker}
						/>

						{this.state.loading ? (
							<ActivityIndicator style={{ marginTop: 30 }} />
						) : (
							<React.Fragment>
								<TouchableOpacity
									style={[styles.buttonStyle, { marginTop: 30 }]}
									onPress={() => {
										{
											Keyboard.dismiss();
										}
										this.saveEvent(
											dueDate,
											time,
											description,
											title,
											id,
											completed,
											this.props.items.todo
										);
									}}
								>
									<Text style={styles.buttonTextStyle}>Save</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										styles.buttonStyle,
										{
											backgroundColor: 'red',
											marginTop: 20
										}
									]}
									onPress={() => {
										{
											Keyboard.dismiss();
										}
										this.deleteEvent(id, dueDate);
									}}
								>
									<Text style={styles.buttonTextStyle}>Delete</Text>
								</TouchableOpacity>
							</React.Fragment>
						)}
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
			</React.Fragment>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: 'white',
		padding: 10
	},
	backButton: {
		paddingLeft: 20,
		paddingRight: 20
	},
	textStyle: {
		alignSelf: 'stretch',
		paddingLeft: 5,
		marginTop: 5,
		marginBottom: 5
	},
	iconStyle: {
		marginLeft: 10
	},
	navBarButtonStyle: {
		color: 'white',
		fontSize: 16
	},
	textInputStyle: {
		marginTop: 5,
		marginLeft: 30,
		marginRight: 30,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		height: 40,
		backgroundColor: '#cccccc80',
		borderRadius: 8
	},
	segmentedControl: {
		marginTop: 20
	},
	datePickerStyle: {
		height: 20,
		width: 100,
		justifyContent: 'center'
	},
	dateViewStyle: {
		flex: 1,
		marginTop: 100,
		flexDirection: 'row'
	},
	pickerStyle: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#6d6d6d',
		alignItems: 'center',
		marginLeft: 5
	},
	pickedDateViewStyle: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#6d6d6d',
		alignItems: 'flex-start',
		marginLeft: 5,
		marginTop: 10
	},
	pickerPlaceholderStyle: {
		marginBottom: 10,
		color: 'black',
		fontSize: 16
	},
	pickedDateStyle: {
		marginBottom: 8,
		fontSize: 16
	},
	buttonStyle: {
		height: 40,
		marginRight: 20,
		marginLeft: 20,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: myConst.mainColor,
		borderRadius: 8,
		shadowOffset: {
			width: 3,
			height: 3
		},
		shadowOpacity: 0.3,
		elevation: 2
	},
	buttonTextStyle: {
		fontSize: 16,
		alignSelf: 'center',
		color: 'white'
	}
});

const mapStateToProps = ({ info }) => {
	const { items } = info;
	return { items };
};

const mapDispatchToProps = {
	eventAdded
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditEventScreen);
