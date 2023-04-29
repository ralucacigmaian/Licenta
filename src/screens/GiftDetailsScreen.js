import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Colors } from "../utils/colors";
import Icon, { Icons } from "../components/Icons";

function GiftDetailsScreen({ route, navigation }) {
  const { name, price, description, image, userId, friendId } = route.params;

  console.log(`Gift Details Screen: ${userId} + ${friendId}`);

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.containerDetails}>
        <Text style={styles.textName}>{name}</Text>
        <Text style={styles.textDescription}>{description}</Text>
        <View style={styles.containerPriceGift}>
          <Text style={styles.textPrice}>${price}</Text>
          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={() =>
              navigation.navigate("Payment", {
                name: name,
                price: price,
                image: image,
                userId: userId,
                friendId: friendId,
              })
            }
          >
            <View style={styles.containerButton}>
              <Text style={styles.textSelectGift}>Select Gift</Text>
              <Icon
                type={Icons.Ionicons}
                name="ios-gift"
                size={24}
                color="white"
              />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colors.cardBackgroundColor,
  },
  image: {
    height: "65%",
  },
  containerDetails: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 550,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: Colors.colors.cardBackgroundColor,
    shadowColor: Colors.colors.gray,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  textName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 30,
    color: Colors.colors.darkDustyPurple,
  },
  textDescription: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.dustyPurple,
  },
  containerPriceGift: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textPrice: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 24,
    color: Colors.colors.darkDustyPurple,
  },
  containerButton: {
    width: 180,
    height: 50,
    borderRadius: 24,
    backgroundColor: Colors.colors.darkDustyPurple,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  textSelectGift: {
    fontFamily: "Montserrat-Regular",
    fontSize: 20,
    color: "white",
  },
  pressed: {
    opacity: 0.9,
  },
});

export default GiftDetailsScreen;
