import { View, Text, StyleSheet, Image } from "react-native";
import { Colors } from "../utils/colors";

function SentGiftCard({ photo, friendName, giftName, date, price }) {
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Image source={{ uri: photo }} style={styles.image} />
      </View>
      <View style={styles.containerDetails}>
        <Text style={styles.textFriendName}>{friendName}</Text>
        <View style={styles.containerGiftName}>
          <Text style={styles.textGiftName}>{giftName}</Text>
        </View>
      </View>
      <View style={styles.containerPrice}>
        <Text style={styles.textPrice}>{price} RON</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 150,
    backgroundColor: Colors.colors.cardBackgroundColor,
    borderRadius: 10,
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  containerImage: {
    paddingLeft: 4,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 120,
  },
  textFriendName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
  },
  containerGiftName: {
    maxWidth: 180,
  },
  textGiftName: {
    fontFamily: "Montserrat-Italic",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  containerDetails: {
    padding: 16,
  },
  containerPrice: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 4,
  },
  textPrice: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
});

export default SentGiftCard;
