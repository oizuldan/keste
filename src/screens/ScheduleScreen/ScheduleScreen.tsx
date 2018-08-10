import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Agenda } from 'react-native-calendars';

import { MyNavigator } from '../../components';
import { scheduleBg } from '../../assets';
import * as myConst from '../../constants';

interface ScheduleScreenProps {
  image: string;
  examSchedule: string[][];
  navigation: any;
  id: string;
  todo: object[];
  items: any;
  emptyDatesAdded: any;
  courseColors: any;
}

interface ScheduleScreenState {
  items: any;
}

class ScheduleScreen extends React.Component<
  ScheduleScreenProps,
  ScheduleScreenState
> {
  public state = {
    items: this.props.items.items
  };

  private renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text style={styles.emptyDateText}>No plans for this day</Text>
      </View>
    );
  };

  private rowHasChanged = (r1: string, r2: string) => {
    return r1 !== r2;
  };

  private timeToString = (time: string) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  private renderItem = (item: any) => {
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

  private loadItems = (day: any) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
        }
      }

      const newItems: any = {};

      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.state.items[key];
      });

      this.setState({
        items: newItems
      });
    }, 1000);
  };

  public render() {
    return (
      <React.Fragment>
        <MyNavigator title="Schedule" background={scheduleBg} />

        <Agenda
          style={{ flex: 1 }}
          items={this.state.items}
          loadItemsForMonth={this.loadItems}
          renderItem={this.renderItem}
          rowHasChanged={this.rowHasChanged}
          renderEmptyDate={this.renderEmptyDate}
          theme={theme}
        />
      </React.Fragment>
    );
  }
}

const theme = {
  selectedDayBackgroundColor: myConst.mainColor,
  todayTextColor: myConst.mainColor,
  dotColor: myConst.mainColor,
  selectedDotColor: '#cccccc',
  monthTextColor: myConst.mainColor,
  textMonthFontSize: 20,
  agendaKnobColor: '#cccccc',
  agendaTodayColor: myConst.mainColor
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    // marginRight: 10,
    marginTop: 20,
    flexDirection: 'row'
  },
  emptyDateText: {
    color: '#b9b9b9',
    paddingBottom: 8
  },
  emptyDate: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#b9b9b9',
    marginTop: 17,
    alignItems: 'flex-end',
    flexDirection: 'row'
  },
  renderItemTextDescription: {
    fontSize: 12,
    marginTop: 3,
    color: '#706969'
  },
  renderItemTextTitle: {
    fontSize: 16,
    fontWeight: '500'
  },
  timeWrapper: {
    flexDirection: 'column',
    alignSelf: 'center',
    paddingLeft: 3
  },
  timeText: {
    alignSelf: 'center',
    marginRight: 5
  },
  informationWrapper: {
    padding: 10,
    flexDirection: 'column',
    flex: 1
  },
  coloredBox: {
    width: 6,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginRight: 5
  }
});

const mapStateToProps = ({ info }) => {
  const { items, courseColors } = info;
  return { items, courseColors };
};

export default connect(mapStateToProps)(ScheduleScreen);
