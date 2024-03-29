import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { Colors } from "../utils/colors";
import { editFriend } from "../database/database";
import { useState } from "react";
import Button from "../components/Button";
import { showMessage } from "react-native-flash-message";

const API_URL = "http://localhost:3000";

function PaymentScreen({ route, navigation }) {
  const { name, price, image, userId, friendId, friendName } = route.params;
  const newPrice = price + "00";
  console.log(newPrice);

  const today = new Date();
  const formattedDate = `${
    today.getMonth() + 1
  }/${today.getDate()}/${today.getFullYear()}`;

  // console.log(formattedDate);

  console.log(`Payment Screen: ${userId} + ${friendId} + ${friendName}`);

  const stripe = useStripe();

  const subscribe = async () => {
    try {
      const response = await fetch("http://localhost:3000/pay", {
        method: "POST",
        body: JSON.stringify({ newPrice }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) return Alert.alert(data.message);
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        appearance: {
          font: {
            family: "AvenirNext-Regular",
            scale: 1.15,
          },
          shapes: {
            borderRadius: 12,
            borderWidth: 0.5,
          },
          primaryButton: {
            shapes: {
              borderRadius: 10,
            },
            colors: {
              text: "#FFFFFF",
            },
          },
          colors: {
            icon: Colors.colors.darkDustyPurple,
            primary: Colors.colors.darkDustyPurple,
            background: "#FFFFFF",
            componentBackground: Colors.colors.cardBackgroundColor,
            componentBorder: Colors.colors.gray,
            componentDivider: Colors.colors.gray,
            primaryText: Colors.colors.darkDustyPurple,
            secondaryText: Colors.colors.dustyPurple,
            componentText: Colors.colors.gray,
            placeholderText: Colors.colors.gray,
          },
        },
        applePay: {
          merchantCountryCode: "US",
        },
      });
      if (initSheet.error) {
        // return Alert.alert(initSheet.error.message);
        showMessage({
          message: "Plata nu a putut fi inițializată! Încearcă din nou!",
          // floating: true,
          // position: top,
          icon: "warning",
          style: { backgroundColor: Colors.colors.darkDustyPurple },
          titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
          textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
        });
        return;
      }
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error) {
        showMessage({
          message: "Plata a fost anulată! Încearcă din nou!",
          // floating: true,
          // position: top,
          icon: "warning",
          style: { backgroundColor: Colors.colors.darkDustyPurple },
          titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
          textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
        });
        return;
      }
      showMessage({
        message: "Plata a fost înregistrată cu succes! Vă mulțumim!",
        // floating: true,
        // position: top,
        icon: "warning",
        style: { backgroundColor: Colors.colors.darkDustyPurple },
        titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
        textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
      });
      // editFriend(userId, friendId, {
      //   receivedGift: 1,
      //   giftName: name,
      //   giftPrice: price,
      //   giftDate: formattedDate,
      // });
      navigation.navigate("Bottom Navigator");
    } catch (error) {
      console.log(error);
      // Alert.alert("Something went wrong, try again later!");
      showMessage({
        message: "A apărut o eroare, încearcă mai târziu!",
        // floating: true,
        // position: top,
        icon: "warning",
        style: { backgroundColor: Colors.colors.darkDustyPurple },
        titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
        textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
      });
      return;
    }
  };

  return (
    <StripeProvider
      publishableKey="pk_test_51N1ptgEwzgbH762k0WllAijIzcQpImth7MIXkaZcmtXJppoW0JIKyIlX3AKbffvro6FUR7rTbxSeQjOFpRsEFBzs00cE5eiiGl"
      merchantIdentifier="merchant.com.stripe.react.native"
    >
      <View style={styles.container}>
        <View style={styles.containerGift}>
          <Text style={styles.textGift}>
            Ai ales următorul cadou pentru {friendName}
          </Text>
          <Image source={{ uri: image }} style={styles.image} />
          <Text style={styles.textName}>{name}</Text>
        </View>
        <View style={styles.containerButton}>
          <Button
            onPress={subscribe}
            backgroundColor={Colors.colors.darkDustyPurple}
            color="white"
            width={200}
            borderRadius={10}
            fontFamily="Montserrat-SemiBold"
            fontSize={18}
          >
            Efectuează plata
          </Button>
        </View>
      </View>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-evenly",
  },
  containerGift: {
    justifyContent: "center",
    alignItems: "center",
  },
  textGift: {
    fontFamily: "Montserrat-Regular",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
    marginBottom: 20,
  },
  textName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
    marginTop: 20,
    textAlign: "center",
  },
  image: {
    height: 400,
    width: 400,
    borderRadius: 10,
  },
  containerCard: {
    width: 280,
  },
  textCardDetails: {
    marginVertical: 5,
    textAlign: "left",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  card: {
    backgroundColor: "#FFFFFF",
  },
  cardContainer: {
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.colors.darkDustyPurple,
  },
  containerButton: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.colors.darkDustyPurple,
    width: 350,
    height: 60,
    borderRadius: 350 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    fontFamily: "Montserrat-Regular",
    fontSize: 20,
    color: "white",
  },
});

export default PaymentScreen;
