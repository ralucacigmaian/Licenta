import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Colors } from "../utils/colors";
import Icon, { Icons } from "../components/Icons";
import Button from "../components/Button";

function GiftDetailsScreen({ route, navigation }) {
  const { name, price, description, image, userId, friendId, friendName } =
    route.params;

  console.log(`Gift Details Screen: ${userId} + ${friendId} + ${friendName}`);

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.containerDetails}>
        <Text style={styles.textName}>{name}</Text>
        <Text style={styles.textDescription}>{description}</Text>
        <View style={styles.containerPriceGift}>
          <Text style={styles.textPrice}>{price} RON</Text>
          <Button
            onPress={() =>
              navigation.navigate("Payment", {
                name: name,
                price: price,
                image: image,
                userId: userId,
                friendId: friendId,
                friendName: friendName,
              })
            }
            backgroundColor={Colors.colors.darkDustyPurple}
            color="white"
            width={200}
            borderRadius={10}
            fontFamily="Montserrat-SemiBold"
            fontSize={18}
          >
            Selectează cadoul
          </Button>
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
