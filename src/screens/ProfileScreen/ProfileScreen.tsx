import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
	Image,
	ActivityIndicator,
	AsyncStorage,
	Linking
} from 'react-native';
import ParallaxScroll from 'react-native-parallax-scroll';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackActions, NavigationActions } from 'react-navigation';

import * as myConst from '../../constants';
import { profileBg } from '../../assets';
import { logout, logout2 } from './LogoutAction';

interface ProfileScreenProps {
	image: string;
	navigation: any;
	information: string[][];
	logout: any;
	logout2: any;
}
interface ProfileScreenState {
	loading: boolean;
}

class ProfileScreen extends React.Component<
	ProfileScreenProps,
	ProfileScreenState
> {
	public state = {
		loading: false
	};

	private onHandlePress = async () => {
		this.setState(prevState => {
			return { loading: !prevState.loading };
		});

		AsyncStorage.removeItem('UID');

		this.props.logout();
		this.props.logout2();

		this.setState(prevState => {
			return { loading: !prevState.loading };
		});

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
	};

	public render() {
		const name = this.props.information[1] + ' ' + this.props.information[2];
		const idCard = this.props.information[0];
		const email = this.props.information[3];
		const course = this.props.information[4];
		const major = this.props.information[5];

		return (
			<React.Fragment>
				<ParallaxScroll
					style={{ flex: 1 }}
					isHeaderFixed={false}
					parallaxHeight={285}
					renderParallaxBackground={() => (
						<ImageBackground
							source={profileBg}
							style={styles.image}
							resizeMode="cover"
						>
							<Image
								source={{ uri: this.props.image }}
								style={styles.profilePhoto}
							/>
							<Text style={styles.nameText}>{name}</Text>
							<Text style={styles.idText}>{idCard}</Text>
						</ImageBackground>
					)}
					parallaxBackgroundScrollSpeed={5}
					parallaxForegroundScrollSpeed={2.5}
				>
					{!this.state.loading ? (
						<View style={styles.wrapper}>
							<View style={styles.personalInfoView}>
								<View style={styles.personalInfoCard}>
									<Text style={styles.personalInfoLabel}>Study year </Text>
								</View>

								<View style={styles.personalInfoTextWrapper}>
									<Text style={styles.personalInfoText}>{course}</Text>
								</View>
							</View>

							<View style={styles.personalInfoView}>
								<View style={styles.personalInfoCard}>
									<Text style={styles.personalInfoLabel}>Major </Text>
								</View>

								<View style={styles.personalInfoTextWrapper}>
									<Text style={styles.personalInfoText}>{major}</Text>
								</View>
							</View>

							<View style={styles.personalInfoView}>
								<View style={styles.personalInfoCard}>
									<Text style={styles.personalInfoLabel}>Email </Text>
								</View>

								<View style={styles.personalInfoTextWrapper}>
									<Text style={styles.personalInfoText}>{email}</Text>
								</View>
							</View>

							<View style={styles.creatorsNameWrapper}>
								<Text
									style={styles.creatorsNameText}
									onPress={() =>
										Linking.openURL('https://www.instagram.com/y.e.r.k.e/')
									}
								>
									@y.e.r.k.e
								</Text>
								<Text
									style={styles.creatorsNameText}
									onPress={() =>
										Linking.openURL('https://www.instagram.com/oizuldan/')
									}
								>
									@oizuldan
								</Text>
							</View>
						</View>
					) : (
						<React.Fragment>
							<ActivityIndicator style={styles.loading} />
							<Text style={styles.loadingText}>Logging out</Text>
						</React.Fragment>
					)}
				</ParallaxScroll>

				<TouchableOpacity
					style={styles.logoutButton}
					onPress={() => this.onHandlePress()}
				>
					<MaterialCommunityIcons name="logout" size={30} color="white" />
				</TouchableOpacity>
			</React.Fragment>
		);
	}
}

const styles = StyleSheet.create({
	image: {
		width: '100%',
		flex: 1,
		paddingTop: 50
	},
	wrapper: {
		flex: 2
	},
	container: {
		flexDirection: 'row',
		paddingTop: 12,
		paddingBottom: 12,
		justifyContent: 'center'
	},
	center: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold'
	},
	profilePhoto: {
		width: 150,
		height: 150,
		borderRadius: 75,
		alignSelf: 'center',
		borderWidth: 1,
		borderColor: 'white',
		shadowColor: 'black',
		shadowOffset: { width: 10, height: 10 },
		shadowOpacity: 0.8,
		shadowRadius: 2
	},
	nameText: {
		justifyContent: 'center',
		fontSize: 22,
		alignSelf: 'center',
		color: 'white',
		marginBottom: 3,
		marginTop: 8,
		fontWeight: '600'
	},
	idText: {
		justifyContent: 'center',
		fontSize: 16,
		alignSelf: 'center',
		color: 'white'
	},
	personalInfoCard: {
		width: '100%',
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		paddingTop: 10,
		paddingBottom: 5
	},
	personalInfoText: {
		justifyContent: 'center',
		fontSize: 16,
		fontWeight: '500',
		marginLeft: 10
	},
	personalInfoTextWrapper: {
		paddingTop: 5,
		paddingBottom: 10
	},
	personalInfoLabel: {
		justifyContent: 'center',
		fontSize: 16,
		marginRight: 5,
		fontWeight: '500',
		color: myConst.mainColor,
		marginLeft: 10
	},
	personalInfoView: {
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: 'white',
		marginTop: 10,
		marginLeft: 5,
		marginRight: 5,
		borderRadius: 8
	},
	logoutButton: {
		position: 'absolute',
		top: 30,
		right: 10
	},
	loading: {
		alignSelf: 'center',
		marginTop: 20
	},
	loadingText: {
		alignSelf: 'center',
		fontSize: 16,
		color: '#b6b6b6'
	},
	creatorsNameWrapper: {
		margin: '25%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
		marginBottom: 10
	},
	creatorsNameText: {
		color: '#CCCCCC',
		fontSize: 14
	}
});
const mapStateToProps = ({ info }) => {
	const { image, information } = info;
	return { image, information };
};
const mapDispatchToProps = {
	logout,
	logout2
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileScreen);
