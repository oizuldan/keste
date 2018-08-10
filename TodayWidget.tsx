
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DevMenu } from 'react-native-today-widget';
import { connect} from 'redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  widget: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const renderItem = (item) => {
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
}

const TodayWidget = (props) => (
  <View onLayout={this.onLayout} style={styles.widget}>
    <FlatList
      data={props.items[date]}
      renderItem={item => renderItem(item)}
      keyExtractor={this.keyExtractor}
    />
  </View>
);
const mapStateToProps = ({ info }) => {
	const { items } = info;
	return { items };
};
export default connect(mapStateToProps)(TodayWidget);
