import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Colors } from "../utils/colors";

function HomeScreenCard({ photo, name, birthday, nameday, daysLeft, onPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Image source={{ uri: photo }} style={styles.image} />
      </View>
      <View style={styles.containerDetails}>
        <Text style={styles.textName}>{name}</Text>
        {birthday && daysLeft !== 0 ? (
          <View>
            <Text style={styles.textBirthday}>Ziua de naștere este</Text>
            <Text style={styles.textBirthday}>pe data de {birthday}</Text>
          </View>
        ) : (
          daysLeft === 0 && (
            <View style={{ marginRight: 8 }}>
              <Text style={styles.textBirthday}>Astăzi este ziua de</Text>
              <Text style={styles.textBirthday}>naștere!</Text>
            </View>
          )
        )}
        {nameday && (
          <View>
            <Text style={styles.textBirthday}>Ziua onomastică este</Text>
            <Text style={styles.textBirthday}>pe data de {nameday}</Text>
          </View>
        )}
      </View>
      <View style={styles.containerDaysLeft}>
        {daysLeft === 1 ? (
          <View style={styles.containerDaysLeft}>
            <Text style={styles.textDaysLeft}>O zi</Text>
            <Text style={styles.textLeft}>rămasă</Text>
          </View>
        ) : daysLeft === 0 ? (
          <Pressable onPress={onPress}>
            <Text style={styles.textTodayBirthday}>Trimite un cadou!</Text>
          </Pressable>
        ) : (
          <View style={styles.containerDaysLeft}>
            <Text style={styles.textDaysLeft}>{daysLeft} zile</Text>
            <Text style={styles.textLeft}>rămase</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    borderRadius: 10,
    backgroundColor: Colors.colors.cardBackgroundColor,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  containerImage: {
    marginLeft: 4,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  containerDetails: {
    marginHorizontal: 16,
  },
  textName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  textBirthday: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
  },
  containerDaysLeft: {
    backgroundColor: Colors.colors.lightDustyPurple,
    marginHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: 50,
    width: 85,
  },
  textDaysLeft: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  textLeft: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    textTransform: "uppercase",
  },
  textTodayBirthday: {
    fontFamily: "Montserrat-Regular",
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
});

export default HomeScreenCard;
