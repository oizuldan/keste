import React from "react";
import { View, StyleSheet } from "react-native";

const Card = (props: any) => {
  return <View style={[styles.containerStyle, { borderLeftColor: props.courseColor }]}>{props.children}</View>;
};

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 6,
    borderWidth: 0,
    borderLeftWidth: 4,
    backgroundColor: "#FFF",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    padding: 10
  }
});

export default Card;
