import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Tooltip } from "@rneui/base";
import { Colors } from "../utils/colors";

function Input({
  label,
  color,
  backgroundColor,
  backgroundColorTooltip,
  borderColor,
  iconName,
  iconNameOn,
  iconNameOff,
  iconError,
  iconSize,
  iconColor,
  error,
  password,
  onPress,
  onFocus = () => {},
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(password);
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, color && { color }]}>{label} </Text>
      <View
        style={[
          styles.inputContainer,
          backgroundColor && { backgroundColor },
          // borderColor && { borderColor },
          {
            borderColor: error ? "red" : isFocused ? { borderColor } : null,
          },
        ]}
      >
        <Ionicons
          name={iconName}
          size={iconSize}
          color={iconColor}
          style={styles.icon}
        />
        <TextInput
          secureTextEntry={hidePassword}
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onPress={onPress}
          {...props}
        />
        {error ? (
          <View style={styles.tooltipContainer}>
            <Tooltip
              visible={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              popover={<Text style={styles.error}>{error}</Text>}
              width={220}
              height={error.length + 30}
              backgroundColor={backgroundColorTooltip}
              withOverlay={false}
              // withPointer={false}
            >
              <Ionicons name={iconError} size={iconSize} color={iconColor} />
            </Tooltip>
          </View>
        ) : (
          <View style={styles.hideYourPassword}>
            <Ionicons
              name={hidePassword ? iconNameOn : iconNameOff}
              size={iconSize}
              color={iconColor}
              onPress={() => setHidePassword(!hidePassword)}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: 280,
  },
  label: {
    marginVertical: 5,
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
  inputContainer: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 5,
  },
  tooltipContainer: {
    position: "absolute",
    right: 10,
  },
  error: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "white",
    textAlign: "center",
    // marginTop: 5,
  },
  hideYourPassword: {
    position: "absolute",
    right: 10,
  },
});

export default Input;
