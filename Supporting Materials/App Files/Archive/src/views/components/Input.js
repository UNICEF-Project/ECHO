import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../conts/colors";

export default function Input({
  label,
  iconName,
  error,
  passsword,
  onFocus = () => {},
  ...props
}) {
  return (
    <View style={style.main}>
      <Text style={style.label}>{label}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  main: {
    marginBottom: 20,
  },
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: Colors.gery,
  },
});
