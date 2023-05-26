import { View, Text, StyleSheet, Pressable } from "react-native";

function Button({
  onPress,
  children,
  backgroundColor,
  color,
  width,
  borderRadius,
  textTransform,
  fontFamily,
  fontSize,
  textAlign,
  shadowOpacity,
}) {
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
          borderRadius && { borderRadius },
          shadowOpacity && { shadowOpacity },
        ]}
      >
        <Text
          style={[
            styles.text,
            color && { color },
            textTransform && { textTransform },
            fontFamily && { fontFamily },
            fontSize && { fontSize },
            textAlign && { textAlign },
          ]}
        >
          {children}
        </Text>
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
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    // shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  text: {
    // fontFamily: "Montserrat-Light",
    // fontSize: 16,
    // textTransform: "uppercase",
  },
});

export default Button;
