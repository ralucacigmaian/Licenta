import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Colors } from "../utils/colors";
import Button from "./Button";

function NotificationFriendRequest({
  image,
  name,
  onPress,
  onPressAccept,
  onPressDecline,
}) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.containerImage}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        <View style={styles.containerDetailsWrapper}>
          <View style={styles.containerDetails}>
            <Text style={styles.textName}>
              {name}{" "}
              <Text style={styles.textNameDetails}>
                ți-a trimis o cerere de prietenie!
              </Text>{" "}
            </Text>
          </View>
          <View style={styles.containerButtons}>
            <View style={styles.button}>
              <Button
                backgroundColor={Colors.colors.darkDustyPurple}
                color="white"
                width={100}
                borderRadius={10}
                fontFamily="Montserrat-SemiBold"
                fontSize={14}
                shadowOpacity={0.1}
                onPress={onPressAccept}
              >
                Acceptă
              </Button>
            </View>
            <View>
              <Button
                backgroundColor="white"
                color={Colors.colors.darkDustyPurple}
                width={100}
                borderRadius={10}
                fontFamily="Montserrat-SemiBold"
                fontSize={14}
                shadowOpacity={0.1}
                onPress={onPressDecline}
              >
                Refuză
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 120,
    backgroundColor: Colors.colors.cardBackgroundColor,
    borderRadius: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  containerImage: {
    marginLeft: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  containerDetailsWrapper: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    flexDirection: "column",
  },
  containerDetails: {
    flexDirection: "row",
  },
  textName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
  },
  textNameDetails: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
  },
  containerButtons: {
    flexDirection: "row",
    marginTop: 8,
  },
  button: {
    marginRight: 16,
  },
});

export default NotificationFriendRequest;
