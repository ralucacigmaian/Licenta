import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Colors } from "../utils/colors";
import Icon, { Icons } from "./Icons";

function Card({
  id,
  idNotfication,
  name,
  date,
  image,
  onViewProfile,
  onGift,
  onEdit,
  onDelete,
  onPress,
  receivedGift,
}) {
  // Get how many days are left until the next birthday

  const birthdate = new Date(date);
  const today = new Date();
  let nextBirthday = new Date(
    today.getFullYear(),
    birthdate.getMonth(),
    birthdate.getDate()
  );
  if (today > nextBirthday) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }
  const diffTime = nextBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.textName}>{name}</Text>
        <Text style={styles.textBirthdayDate}>{date}</Text>
        <Text style={styles.textNextBirthday}>
          Birthday is coming in {diffDays} days
        </Text>
        {receivedGift ? (
          <Text style={styles.textBirthdayDate}>
            You have already sent a gift!
          </Text>
        ) : null}
        <View style={styles.buttonsContainer}>
          <View style={styles.viewProfile}>
            <Pressable
              onPress={() => {
                onViewProfile(id), onPress(id);
              }}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Icon
                type={Icons.Ionicons}
                name="ios-person-circle"
                size={24}
                color={Colors.colors.lightDustyPurple}
              />
            </Pressable>
          </View>
          <View style={styles.sendGift}>
            <Pressable
              onPress={() => {
                onGift(id), onPress(id);
              }}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Icon
                type={Icons.Ionicons}
                name="ios-gift"
                size={24}
                color={Colors.colors.lightDustyPurple}
              />
            </Pressable>
          </View>
          <View style={styles.editProfile}>
            <Pressable
              onPress={() => {
                onEdit(id), onPress(id);
              }}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Icon
                type={Icons.Ionicons}
                name="create"
                size={24}
                color={Colors.colors.lightDustyPurple}
              />
            </Pressable>
          </View>
          <View style={styles.deleteProfile}>
            <Pressable
              onPress={() => onDelete(id, idNotfication)}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Icon
                type={Icons.Ionicons}
                name="ios-trash"
                size={24}
                color={Colors.colors.lightDustyPurple}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.colors.darkDustyPurple,
    backgroundColor: Colors.colors.cardBackgroundColor,
    width: "90%",
    height: 150,
    borderRadius: 10,
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  imageContainer: {
    width: 120,
    justifyContent: "center",
    paddingLeft: 4,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
  },
  detailsContainer: {
    padding: 16,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  textName: {
    fontFamily: "Montserrat-Thin",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
    // color: "#AAAFA8",
  },
  textBirthdayDate: {
    fontFamily: "Montserrat-ThinItalic",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
  },
  textNextBirthday: {
    fontFamily: "Montserrat-ThinItalic",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  viewProfile: {
    paddingRight: 10,
  },
  sendGift: {
    paddingRight: 10,
  },
  editProfile: {
    paddingRight: 10,
  },
  deleteProfile: {
    paddingRight: 10,
  },
  pressed: {
    opacity: 0.9,
  },
});

export default Card;
