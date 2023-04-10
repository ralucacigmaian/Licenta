import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { Colors } from "../utils/colors";
import { Chip } from "@rneui/themed";
import { useState } from "react";

function Interest({ children, id, onPress, active }) {
  // const [active, setActive] = useState(false);

  // const handleOnPress = () => {
  //   setActive(!active);
  // };

  return (
    <Pressable>
      <View style={styles.container}>
        <Chip
          title={children}
          color={
            active ? Colors.colors.dustyPurple : Colors.colors.backgroundColor
          }
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
  },
});

export default Interest;
