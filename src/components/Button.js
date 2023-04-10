import { View, Text, StyleSheet, Pressable } from "react-native";

function Button({ onPress, children, backgroundColor, color, width }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View
        style={[
          styles.container,
          backgroundColor && { backgroundColor },
          width && { width },
        ]}
      >
        <Text style={[styles.text, color && { color }]}>{children}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.9,
  },
  container: {
    // width: 300,
    height: 50,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  text: {
    fontFamily: "Montserrat-Light",
    fontSize: 16,
    textTransform: "uppercase",
  },
});

export default Button;
