import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Colors } from "../utils/colors";
import Button from "./Button";

function AddedFriendCard({ onPress, image, name, birthday, onGift }) {
  const today = new Date();
  const targetDate = new Date(birthday);

  targetDate.setFullYear(today.getFullYear());

  if (targetDate < today) {
    targetDate.setFullYear(today.getFullYear() + 1);
  }

  const timeDifference = targetDate.getTime() - today.getTime();
  const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.containerHeader}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.containerButton}>
            <Button
              backgroundColor={Colors.colors.darkDustyPurple}
              color="white"
              width={80}
              borderRadius={10}
              fontFamily="Montserrat-SemiBold"
              fontSize={14}
              textAlign="center"
              shadowOpacity={0.1}
              onPress={onGift}
            >
              Trimite un cadou
            </Button>
          </View>
        </View>
        <View style={styles.containerBody}>
          <Text style={styles.textName}>{name}</Text>
        </View>
        <View style={styles.containerFooter}>
          {remainingDays === 366 ? (
            <Text style={styles.textRemainingDays}>
              Astăzi este ziua de naștere!
            </Text>
          ) : (
            <Text style={styles.textBirthday}>
              <Text style={styles.textRemainingDays}>{remainingDays}</Text> de
              zile până la ziua de naștere
            </Text>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 193.5,
    height: 165,
    backgroundColor: Colors.colors.cardBackgroundColor,
    // borderColor: "black",
    // borderWidth: 1,
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.9,
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 70,
  },
  containerBody: {
    marginTop: 8,
    marginLeft: 8,
  },
  textName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    color: Colors.colors.darkDustyPurple,
  },
  containerFooter: {
    // flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
  },
  textBirthday: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
  },
  textRemainingDays: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
  },
});

export default AddedFriendCard;
