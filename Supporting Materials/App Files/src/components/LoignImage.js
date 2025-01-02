import React from "react";
import { Image, StyleSheet } from "react-native";

export default function LoginImage() {
  return (
    <Image source={require("../assets/4957136.jpg")} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    marginBottom: 0,
  },
});
