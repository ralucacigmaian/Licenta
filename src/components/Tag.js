import { View, Text, StyleSheet } from "react-native";
import { Chip } from "@rneui/themed";
import { Colors } from "../utils/colors";

function Tag({ children, onPress }) {
  return (
    <View>
      <Chip
        title={children}
        // color={
        //   active ? Colors.colors.dustyPurple : Colors.colors.backgroundColor
        // }
        titleStyle={{
          color: Colors.colors.darkDustyPurple,
          fontFamily: "Montserrat-Regular",
          fontSize: 13,
        }}
        buttonStyle={{
          borderColor: Colors.colors.darkDustyPurple,
          borderWidth: 1,
        }}
        radius="xl"
        size="sm"
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

export default Tag;
