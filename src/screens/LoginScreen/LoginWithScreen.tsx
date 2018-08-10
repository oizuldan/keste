import React from 'react';
import {
	Alert,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ImageBackground,
	Image,
	AsyncStorage
} from 'react-native';

import * as myConst from '../../constants';
import { profileBg, logo } from '../../assets';

interface iProps {
	navigation: any;
}

class LoginWithScreen extends React.Component<iProps> {
	public componentDidMount = async () => {
		const uid: any = await AsyncStorage.getItem('FL');
		if (!uid) {
			Alert.alert(
				'Caution',
				'We don’t collect any of your personal info, including your student account and password',
				[
					{
						text: 'Cancel',
						onPress: () => console.log('Cancel Pressed'),
						style: 'cancel'
					},
					{ text: 'OK', onPress: () => console.log('OK Pressed') }
				],
				{ cancelable: false }
			);
		}
	};

	public render() {
		return (
			<React.Fragment>
				<ImageBackground
					source={profileBg}
					style={styles.image}
					resizeMode="cover"
				>
					<Image source={logo} style={styles.logo} />
				</ImageBackground>
				<View style={styles.viewStyle}>
					<View style={styles.welcomeView}>
						<View style={styles.welcomeTextView}>
							<Text style={styles.welcomeText}>Welcome to</Text>
							<Text style={styles.welcomeText}>Keste</Text>
						</View>
						<View style={styles.line} />
					</View>

					<Text style={styles.loginWithText}>
						Login with your student account
					</Text>

					<View style={styles.buttonView}>
						<TouchableOpacity
							style={styles.buttonStyle}
							onPress={() => this.props.navigation.navigate('Login')}
						>
							<Text style={styles.buttonTextColor}>Nazarbaev University</Text>
						</TouchableOpacity>
					</View>
				</View>
			</React.Fragment>
		);
	}
}

const styles = StyleSheet.create({
	image: {
		flex: 1.5,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	viewStyle: {
		backgroundColor: 'white',
		flex: 1,
		justifyContent: 'flex-end'
	},
	buttonStyle: {
		height: 40,
		flex: 1,
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
	buttonTextColor: {
		color: 'white',
		fontSize: 16
	},
	buttonView: {
		flexDirection: 'row'
	},
	loginWithText: {
		marginLeft: 10,
		marginRight: 30,
		marginBottom: 20,
		flexWrap: 'wrap',
		color: myConst.mainColor,
		fontSize: 16
	},
	welcomeText: {
		flexWrap: 'wrap',
		fontSize: 30,
		marginLeft: 10,
		marginBottom: 5,
		fontWeight: '500'
	},
	welcomeView: {
		flexDirection: 'row',
		marginTop: 8,
		marginRight: 10,
		marginBottom: 10
	},
	welcomeTextView: {
		flexDirection: 'column',
		marginRight: 12,
		marginBottom: 10
	},
	line: {
		height: 1,
		width: 200,
		borderWidth: 1,
		borderColor: myConst.mainColor,
		alignSelf: 'center',
		flex: 1
	},
	logo: {
		width: 150,
		height: 150
	}
});

export default LoginWithScreen;
