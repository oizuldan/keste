import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ImageBackground
} from 'react-native';

const MyNavigator = (props: any) => {
	return (
		<ImageBackground
			source={props.background}
			style={styles.imageBg}
			resizeMode="cover"
		>
			<View style={styles.container}>
				<TouchableOpacity style={styles.left} onPress={props.leftAction}>
					{props.leftComponent}
				</TouchableOpacity>
				<Text style={styles.center}>{props.title}</Text>
				<TouchableOpacity style={styles.right} onPress={props.rightAction}>
					{props.rightComponent}
				</TouchableOpacity>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	imageBg: {
		width: '100%',
		height: 75,
	},
	container: {
		flexDirection: 'row',
		paddingTop: 24,
		paddingBottom: 12,
		justifyContent: 'center'
	},
	left: {
		position: 'absolute',
		left: 20,
		top: 24
	},
	center: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold',
		justifyContent: 'center'
	},
	right: {
		position: 'absolute',
		right: 20,
		top: 24
	}
});
export default MyNavigator;
