import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import * as myConst from '../constants';

interface GPAInputProps {
	id: string;
	grade: string;
	percentage: string;
	description: string;
	onChangeGrade: Function;
	onChangePercentage: Function;
	onChangeDescription: Function;
	onDelete: Function;
}

class GPAInput extends React.Component<GPAInputProps> {
	public render() {
		if (this.props.id === '1') {
			return (
				<View style={styles.containerStyle}>
					<TextInput
						style={styles.firstInput}
						onChangeText={(grade: number) => {
							this.props.onChangeGrade(this.props.id, grade);
						}}
						value={this.props.grade}
						placeholder="grade"
						underlineColor={myConst.mainColor}
						keyboardType="number-pad"
					/>

					<TextInput
						style={styles.firstInput}
						underlineColor={myConst.mainColor}
						onChangeText={(percentage: number) =>
							this.props.onChangePercentage(this.props.id, percentage)
						}
						value={this.props.percentage}
						placeholder="%"
						keyboardType="number-pad"
					/>
					<TextInput
						style={styles.descriptionInput}
						underlineColor={myConst.mainColor}
						onChangeText={(description: string) =>
							this.props.onChangeDescription(this.props.id, description)
						}
						value={this.props.description}
						placeholder="mid/quiz/final"
					/>
				</View>
			);
		} else {
			return (
				<View style={styles.wrapper}>
					<View style={styles.containerStyle2}>
						<TextInput
							style={styles.firstInput}
							underlineColor={myConst.mainColor}
							onChangeText={(grade: number) => {
								this.props.onChangeGrade(this.props.id, grade);
							}}
							value={this.props.grade}
							placeholder="grade"
							keyboardType="decimal-pad"
						/>

						<TextInput
							style={styles.firstInput}
							underlineColor={myConst.mainColor}
							onChangeText={(percentage: number) =>
								this.props.onChangePercentage(this.props.id, percentage)
							}
							value={this.props.percentage}
							placeholder="%"
							keyboardType="decimal-pad"
						/>
						<TextInput
							style={styles.descriptionInput}
							underlineColor={myConst.mainColor}
							onChangeText={(description: string) =>
								this.props.onChangeDescription(this.props.id, description)
							}
							value={this.props.description}
							placeholder="description"
						/>
						<TouchableOpacity
							style={styles.delete}
							onPress={() => this.props.onDelete(this.props.id)}
						>
							<EvilIcons name="trash" size={30} color="red" />
						</TouchableOpacity>
					</View>
				</View>
			);
		}
	}
}
const styles = StyleSheet.create({
	containerStyle: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: '#FFF',
		padding: 10,
		paddingTop: 0
	},
	containerStyle2: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: '#FFF',
		padding: 10,
		paddingTop: 0
	},
	wrapper: {
		paddingTop: 5
	},
	firstInput: {
		flex: 2,
		marginLeft: 10,
		marginRight: 10
	},
	descriptionInput: {
		flex: 3,
		marginLeft: 10,
		marginRight: 5
	},
	delete: {
		marginTop: 10,
		alignSelf: 'center'
	}
});
export default GPAInput;
