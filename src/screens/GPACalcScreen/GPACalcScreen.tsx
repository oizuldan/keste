import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { MyNavigator, GPAInput } from '../../components';
import * as myConst from '../../constants/';
import { GPABg } from '../../assets';

const DismissKeyboard = require('dismissKeyboard');

interface GPACalcScreenProps {
	navigation: any;
}
interface GPACalcScreenState {
	average: any;
	percentageSum: number;
	items: object[];
}

class GPACalcScreen extends React.Component<
	GPACalcScreenProps,
	GPACalcScreenState
> {
	public state = {
		average: null,
		percentageSum: 0,
		items: [
			{
				id: '1',
				grade: '',
				percentage: '',
				description: ''
			}
		]
	};

	private handleGrade = (id: string, grade: string) => {
		let items = this.state.items;

		for (let i = 0; i < items.length; i++) {
			if (items[i].id === id) {
				items[i].grade = grade;
			}
		}

		this.setState({ items });
	};

	private handlePercentage = (id: string, percentage: string) => {
		let items = this.state.items;

		for (let i = 0; i < items.length; i++) {
			if (items[i].id === id) {
				items[i].percentage = percentage;
			}
		}

		this.setState({ items });
	};

	private handleDescription = (id: string, description: string) => {
		let items = this.state.items;

		for (let i = 0; i < items.length; i++) {
			if (items[i].id === id) {
				items[i].description = description;
			}
		}

		this.setState({ items });
	};

	private handleCalculate = () => {
		{
			Keyboard.dismiss();
		}
		let sum = 0;
		let percentageSum = 0;

		this.state.items.map(item => {
			percentageSum += Number(item.percentage);
			sum += Number(item.grade) * Number(item.percentage);
		});

		sum /= percentageSum;
		this.setState({
			average: Number(sum.toFixed(2)),
			percentageSum: Number(percentageSum.toFixed(2))
		});
	};

	private addNewInput = (e: any) => {
		e.preventDefault();

		if (!this.state.items.length) {
			return;
		}

		const newItem = {
			id: new Date().getTime().toString(),
			grade: '',
			percentage: '',
			description: ''
		};

		this.setState({
			items: [...this.state.items, newItem]
		});
	};

	private handleDelete = (id: any) => {
		this.setState(
			{
				items: this.state.items.filter(item => item.id !== id)
			},
			this.handleCalculate
		);
	};

	private refresh = () => {
		this.setState(
			{
				items: [
					{
						id: '1',
						grade: '',
						percentage: '',
						description: ''
					}
				]
			},
			this.handleCalculate
		);
	};

	public render() {
		return (
			<React.Fragment>
				<MyNavigator
					title="GPA"
					background={GPABg}
					rightComponent={<Icon name="refresh" color="#FFFFFF" size={30} />}
					rightAction={this.refresh}
				/>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<KeyboardAvoidingView
						behavior="padding"
						style={styles.keyboardAvoidingStyle}
					>
						<ScrollView>
							{this.state.items.map(item => (
								<GPAInput
									id={item.id}
									key={item.id}
									grade={item.grade}
									percentage={item.percentage}
									description={item.description}
									onChangeGrade={this.handleGrade}
									onChangePercentage={this.handlePercentage}
									onChangeDescription={this.handleDescription}
									onDelete={this.handleDelete}
								/>
							))}

							<View style={styles.controlButtons}>
								<TouchableOpacity onPress={this.addNewInput}>
									<Text style={styles.addButton}>+</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.calculateButton}
									onPress={() => {
										this.handleCalculate();
									}}
								>
									<Text style={styles.calcuteButtonTextStyle}>Calculate</Text>
								</TouchableOpacity>
								{!this.state.average ? (
									<Text style={[styles.resultText, { marginTop: 8 }]}>
										Please insert something
									</Text>
								) : (
									<React.Fragment>
										<View style={styles.percentageWrapper}>
											<Text style={styles.resultText}>
												You avarage mark is{' '}
											</Text>
											<Text style={styles.resultTextPercent}>
												{this.state.average}%
											</Text>
											<Text style={styles.resultText}> out of </Text>
											<Text style={styles.resultTextPercent}>
												{this.state.percentageSum}%
											</Text>
										</View>
									</React.Fragment>
								)}
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
			</React.Fragment>
		);
	}
}

const styles = StyleSheet.create({
	addButton: {
		fontSize: 48,
		color: myConst.mainColor
	},
	controlButtons: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	resultText: {
		fontSize: 16
	},
	resultTextPercent: {
		fontSize: 16,
		color: myConst.mainColor
	},
	calculateButton: {
		height: 40,
		width: '80%',
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
	calcuteButtonTextStyle: {
		fontSize: 16,
		alignSelf: 'center',
		color: 'white'
	},
	keyboardAvoidingStyle: {
		flex: 1
	},
	percentageWrapper: {
		flexDirection: 'row',
		marginTop: 8,
		flexWrap: 'wrap'
	}
});

export default GPACalcScreen;
