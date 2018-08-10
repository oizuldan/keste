import React from 'react';
import {
	StyleSheet,
	KeyboardAvoidingView,
	TouchableOpacity,
	Text,
	View,
	AsyncStorage,
	TouchableWithoutFeedback,
	Keyboard,
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

import { MyNavigator } from '../../components';
import * as myConst from '../../constants';
import { scheduleBg } from '../../assets';
import { eventAdded } from './EventAction';

const client = new ApolloClient({
	uri: 'https://api.graph.cool/simple/v1/cjjjjob8m30ul015677awn3le'
});

interface AddEventScreenProps {
	navigation: any;
	items: any;
	eventAdded: any;
}
interface AddEventScreenState {
	title: string;
	description: string;
	dueTime: string;
	dueDate: string;
	chosenDate: Date;
	isDateTimePickerVisible: boolean;
	toDoId: string;
	activeInputRef: any;
	width: number;
	height: number;
	opacity: number;
	loading: boolean;
}

class AddEventScreen extends React.Component<
	AddEventScreenProps,
	AddEventScreenState
> {
	public state = {
		title: '',
		description: '',
		isDateTimePickerVisible: false,
		dueDate: '',
		dueTime: '',
		chosenDate: new Date(),
		toDoId: '',
		activeInputRef: 0,
		width: 3,
		height: 3,
		opacity: 0.3,
		loading: false
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

	private saveEvent = () => {
		this.setState(prevState => {
			return { loading: !prevState.loading };
		});

		let todoArray = this.props.items.todo;

		client
			.mutate({
				variables: {
					date: this.state.chosenDate,
					dueTime: this.state.dueTime,
					title: this.state.title,
					description: this.state.description,
					userId: this.props.items.id
				},
				mutation: gql`
					mutation addToDo(
						$date: DateTime!
						$title: String!
						$description: String!
						$userId: ID
						$dueTime: String
					) {
						createToDoList(
							date: $date
							title: $title
							description: $description
							userId: $userId
							dueTime: $dueTime
						) {
							id
							date
						}
					}
				`
			})
			.then((response: any) => {
				const obj = {
					date: response.data.createToDoList.date,
					description: this.state.description,
					title: this.state.title,
					dueTime: this.state.dueTime,
					id: response.data.createToDoList.id,
					completed: false
				};

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
				const date = this.state.chosenDate.toISOString().split('T')[0];

				if (!items[date]) items[date] = [obj];
				else {
					let array = items[date];
					array.push(obj);
					array = array.sort((element1: any, element2: any) => {
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
					items[date] = array;
				}

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
		return (
			<React.Fragment>
				<MyNavigator
					title="Add event"
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
							value={this.state.title}
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
							value={this.state.description}
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
										Pick an event date
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

						<DateTimePicker
							mode="datetime"
							isVisible={this.state.isDateTimePickerVisible}
							onConfirm={this.handleTimePicked}
							onCancel={this.hideDateTimePicker}
						/>
						{this.state.loading ? (
							<ActivityIndicator style={{ marginTop: 30 }} />
						) : (
							<TouchableOpacity
								style={styles.buttonStyle}
								onPress={() => {
									{
										Keyboard.dismiss();
									}
									this.saveEvent();
								}}
								disabled={!this.state.title || !this.state.dueTime}
							>
								<Text style={styles.buttonTextStyle}>Save</Text>
							</TouchableOpacity>
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
		padding: 10,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		height: 40,
		backgroundColor: '#cccccc80',
		borderRadius: 8
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
		borderBottomColor: '#adadb1',
		alignItems: 'center',
		marginLeft: 5
	},
	pickedDateViewStyle: {
		borderBottomWidth: 2,
		borderBottomColor: '#0071bc',
		alignItems: 'flex-start',
		marginLeft: 5,
		marginTop: 10
	},
	pickerPlaceholderStyle: {
		marginBottom: 10,
		color: '#6d6d6d',
		fontSize: 16
	},
	pickedDateStyle: {
		marginBottom: 8,
		fontSize: 16
	},
	buttonStyle: {
		height: 40,
		marginTop: 20,
		marginBottom: 30,
		marginRight: 30,
		marginLeft: 30,
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
)(AddEventScreen);
