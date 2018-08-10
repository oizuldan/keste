import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

class TodaySchedule extends Component {

  renderItem = (item) => {
    return item.type ? (
      <View style={styles.item}>
        <View
          style={[
            styles.coloredBox,
            { backgroundColor: this.props.courseColors[item.title] }
          ]}
        />

        <View style={styles.timeWrapper}>
          <Text style={styles.timeText}>{item.time.from}</Text>
          <Text style={styles.timeText}>{item.time.to}</Text>
        </View>

        <View style={styles.informationWrapper}>
          <Text style={styles.renderItemTextTitle}>{item.title}</Text>
          <Text style={styles.renderItemTextDescription}>
            Room: {item.room}
          </Text>
          <Text style={styles.renderItemTextDescription}>
            Professor: {item.profName}
          </Text>
          {item.type.charAt(item.type.length - 1) === 'L' && (
            <Text style={styles.renderItemTextDescription}>Lecture</Text>
          )}
          {item.type.charAt(item.type.length - 1) === 'b' && (
            <Text style={styles.renderItemTextDescription}>Lab</Text>
          )}
          {item.type.charAt(item.type.length - 1) === 'T' && (
            <Text style={styles.renderItemTextDescription}>Tutorial</Text>
          )}
          {item.type.charAt(item.type.length - 1) === 'R' && (
            <Text style={styles.renderItemTextDescription}>Recitation</Text>
          )}
          {item.type.charAt(item.type.length - 1) === 'S' && (
            <Text style={styles.renderItemTextDescription}>Seminar</Text>
          )}
          {item.type.charAt(item.type.length - 1) === 'P' && (
            <Text style={styles.renderItemTextDescription}>Practice</Text>
          )}
        </View>
      </View>
    ) : (
      <View style={styles.item}>
        <View
          style={[
            styles.coloredBox,
            { backgroundColor: item.completed ? '#32CD32' : '#ff4c4c' }
          ]}
        />
        <View style={styles.timeWrapper}>
          <Text style={styles.timeText}>{item.dueTime}</Text>
        </View>
        <View style={styles.informationWrapper}>
          <Text style={styles.renderItemTextTitle}>{item.title}</Text>
          <Text style={styles.renderItemTextDescription}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const date = new Date().toLocaleString().split('T')[0];

    return (
      <View onLayout={this.onLayout} style={styles.widget}>
        <FlatList
          data={this.props.items[date]}
          renderItem={item => this.renderItem(item)}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  widget: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
const mapStateToProps = ({ info }) => {
	const { items } = info;
	return { items };
};

export default connect(mapStateToProps)(TodaySchedule);
