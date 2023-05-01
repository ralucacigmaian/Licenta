import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon, { Icons } from "./Icons";
import { Colors } from "../utils/colors";

function Option({ type, name, information, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.container}>
        <View style={styles.containerIcon}>
          <Icon
            type={type}
            name={name}
            size={30}
            color={Colors.colors.darkDustyPurple}
          />
        </View>
        <View style={styles.containerText}>
          <Text style={styles.textInformation}>{information}</Text>
        </View>
        <View style={styles.containerRedirect}>
          <Icon
            type={Icons.Ionicons}
            name="ios-chevron-forward"
            size={30}
            color={Colors.colors.darkDustyPurple}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    // borderColor: "red",
    // borderWidth: 2,
    // width: "100%",
    width: 320,
  },
  containerIcon: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: Colors.colors.lightDustyPurple,
    justifyContent: "center",
    alignItems: "center",
  },
  containerText: {
    marginLeft: 16,
  },
  textInformation: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  containerRedirect: {
    // justifyContent: "flex-end",
    // alignItems: "flex-end",
    position: "absolute",
    right: 0,
  },
  pressed: {
    opacity: 0.9,
  },
});

export default Option;
