import React from 'react';
import {
	StyleSheet,
	View,
	KeyboardAvoidingView,
	Text,
	ImageBackground,
	AsyncStorage,
	Dimensions,
	Animated,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native';
import SharedGroupPreferences from 'react-native-shared-group-preferences';

import { TextInput } from 'react-native-paper';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import * as myConst from '../../constants';
import { profileBg, logo } from '../../assets';
import {
	usernameChanged,
	passwordChanged,
	loginUser,
	idFetched
} from './LoginAction';

const appGroupIdentifier = "group.keste";

const window = Dimensions.get('window');

interface LoginScreenProps {
	navigation: any;
	usernameChanged: any;
	passwordChanged: any;
	loginUser: any;
	username: string;
	password: string;
	success: string;
	loading: boolean;
	idFetched: any;
	id: string;
	todo: any;
	items: any;
	image: string;
	information: string[];
	loginSuccess: any;
	courseColors: any;
}
interface LoginScreenState {
	activeInputRef: any;
}

class LoginScreen extends React.Component<LoginScreenProps, LoginScreenState> {
	public state = {
		activeInputRef: 0
	};

	public imageHeight = new Animated.Value(IMAGE_HEIGHT);

	public componentWillMount() {
		if (Platform.OS == 'ios') {
			this.keyboardWillShowSub = Keyboard.addListener(
				'keyboardWillShow',
				this.keyboardWillShow
			);
			this.keyboardWillHideSub = Keyboard.addListener(
				'keyboardWillHide',
				this.keyboardWillHide
			);
		} else {
			this.keyboardWillShowSub = Keyboard.addListener(
				'keyboardDidShow',
				this.keyboardDidShow
			);
			this.keyboardWillHideSub = Keyboard.addListener(
				'keyboardDidHide',
				this.keyboardDidHide
			);
		}
	}

	public componentWillUnmount() {
		this.keyboardWillShowSub.remove();
		this.keyboardWillHideSub.remove();
	}

	private keyboardWillShow = (event: any) => {
		Animated.timing(this.imageHeight, {
			duration: event.duration,
			toValue: IMAGE_HEIGHT_SMALL
		}).start();
	};

	private keyboardWillHide = (event: any) => {
		Animated.timing(this.imageHeight, {
			duration: event.duration,
			toValue: IMAGE_HEIGHT
		}).start();
	};

	private keyboardDidShow = (event: any) => {
		Animated.timing(this.imageHeight, {
			toValue: IMAGE_HEIGHT_SMALL
		}).start();
	};

	private keyboardDidHide = (event: any) => {
		Animated.timing(this.imageHeight, {
			toValue: IMAGE_HEIGHT
		}).start();
	};

	private onChangeUsername = (username: string) => {
		this.props.usernameChanged(username);
	};

	private onChangePassword = (password: string) => {
		this.props.passwordChanged(password);
	};

	private onHandlePress = (username: string, password: string) => {
		Keyboard.dismiss();
		const changeScreen = this.changeScreen;
		username = username.toLowerCase();
		this.props.loginUser({ username, password, changeScreen });
	};

	private changeScreen = async () => {
		const UID = {
			username: this.props.username,
			items: this.props.items,
			image: this.props.image,
			info: this.props.information,
			courseColors: this.props.courseColors
		};
		const FL = { firstLogin: true };

		AsyncStorage.multiSet([
			['UID', JSON.stringify(UID)],
			['FL', JSON.stringify(FL)]
		]);

		SharedGroupPreferences.setItem('UID', UID, appGroupIdentifier);

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

	private renderButton = () => {
		if (this.props.loading) {
			return <ActivityIndicator />;
		}
		return (
			<TouchableOpacity
				style={styles.buttonStyle}
				onPress={() =>
					this.onHandlePress(this.props.username, this.props.password)
				}
			>
				<Text style={styles.buttonTextStyle}>Sign In</Text>
			</TouchableOpacity>
		);
	};

	public render() {
		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={{ flex: 1, alignItems: 'center' }}>
					<ImageBackground
						source={profileBg}
						style={styles.image}
						resizeMode="cover"
					>
						<Animated.Image
							source={logo}
							style={[styles.logo, { height: this.imageHeight }]}
						/>

						<KeyboardAvoidingView style={styles.container} behavior="padding">
							<View style={styles.loginCard}>
								<View style={styles.welcomeView}>
									<View style={styles.welcomeTextView}>
										<Text style={styles.welcomeText}>Login</Text>
									</View>
									<View style={styles.line} />
								</View>

								<View style={styles.textInputStyle}>
									<Icon1
										style={styles.iconStyle}
										name="user"
										size={16}
										color="#b3b3b3"
									/>
									<TextInput
										style={styles.textStyle}
										ref="1"
										autoCapitalize="none"
										placeholder="Registrar account"
										underlineColor={myConst.mainColor}
										returnKeyType="next"
										enablesReturnKeyAutomatically
										value={this.props.username}
										onChangeText={this.onChangeUsername}
										onFocus={this.handleFocus.bind(this, 1)}
										onSubmitEditing={this.changeInputFocus.bind(this, 1)}
									/>
								</View>

								<View style={styles.textInputStyle}>
									<Icon2
										style={styles.iconStyle}
										name="key-variant"
										size={16}
										color="#b3b3b3"
									/>
									<TextInput
										style={styles.textStyle}
										ref="2"
										autoCapitalize="none"
										placeholder="Password"
										underlineColor={myConst.mainColor}
										returnKeyType="go"
										secureTextEntry
										enablesReturnKeyAutomatically
										value={this.props.password}
										onChangeText={this.onChangePassword}
										onSubmitEditing={() =>
											this.onHandlePress(
												this.props.username,
												this.props.password
											)
										}
										onFocus={this.handleFocus.bind(this, 2)}
									/>
								</View>
								{this.renderButton()}
							</View>
						</KeyboardAvoidingView>
					</ImageBackground>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const IMAGE_HEIGHT = window.width / 2.5;
const IMAGE_HEIGHT_SMALL = window.width / 7;

const styles = StyleSheet.create({
	image: {
		flex: 2,
		width: '100%',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	container: {
		borderRadius: 8,
		backgroundColor: 'white',
		marginBottom: 10
	},
	loginCard: {
		margin: 10
	},
	iconStyle: {
		padding: 10
	},
	textStyle: {
		width: '80%'
	},
	textInputStyle: {
		marginLeft: 5,
		marginRight: 5,
		flexDirection: 'row',
		alignItems: 'center'
	},
	buttonStyle: {
		alignSelf: 'stretch',
		margin: 10,
		justifyContent: 'center',
		height: 40,
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
	},
	welcomeText: {
		flexWrap: 'wrap',
		fontSize: 30,
		margin: 5,
		fontWeight: '500'
	},
	welcomeTextView: {
		flexDirection: 'column',
		marginRight: 12,
		marginBottom: 10
	},
	welcomeView: {
		flexDirection: 'row',
		marginTop: 20
	},
	line: {
		height: 1,
		width: 200,
		borderWidth: 1,
		borderColor: myConst.mainColor,
		alignSelf: 'center',
		flex: 1,
		marginBottom: 10
	},
	logo: {
		height: IMAGE_HEIGHT,
		resizeMode: 'contain',
		alignSelf: 'center',
		position: 'absolute',
		top: 100
	},
	scrollView: {
		width: '100%'
	},
	scrollViewContent: {
		flex: 2,
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingBottom: 8
	}
});

const mapStateToProps = ({ login, info }) => {
	const { username, password, success, loading, id } = login;
	const { todo, items, image, information, courseColors } = info;
	return {
		username,
		password,
		success,
		loading,
		id,
		todo,
		items,
		image,
		information,
		courseColors
	};
};

const mapDispatchToProps = {
	usernameChanged,
	passwordChanged,
	loginUser,
	idFetched
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LoginScreen);
