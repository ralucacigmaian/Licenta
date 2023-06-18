import { View, Text, StyleSheet, Image } from "react-native";
import { Colors } from "../utils/colors";
import Icon, { Icons } from "./Icons";

function ReviewCard({ numberOfStars, date, description, name }) {
  const handleRating = () => {
    const stars = [];
    for (let i = 0; i < numberOfStars; i++) {
      stars.push(
        <Icon
          type={Icons.FontAwesome}
          name="star"
          size={22}
          color={Colors.colors.darkDustyPurple}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerInformation}>
        <View style={styles.containerRating}>{handleRating()}</View>
        <View style={styles.containerDate}>
          <Text style={styles.textDate}>{date}</Text>
        </View>
      </View>
      <View style={styles.containerName}>
        <Text style={styles.textForName}>
          Adăugat de către <Text style={styles.textName}>{name}</Text>
        </Text>
      </View>
      <View style={styles.containerDescription}>
        <Text style={styles.textDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.colors.cardBackgroundColor,
    borderRadius: 10,
    marginTop: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  containerInformation: {
    flexDirection: "row",
  },
  containerRating: {
    flexDirection: "row",
    marginTop: 8,
  },
  containerDate: {
    justifyContent: "center",
    marginLeft: 16,
    marginTop: 8,
  },
  textDate: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
  containerName: {
    marginTop: 8,
  },
  textForName: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
  },
  textName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
  },
  containerDescription: {
    marginVertical: 8,
  },
  textDescription: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
});

export default ReviewCard;
