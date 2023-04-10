import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../utils/colors";
import Button from "../components/Button";

function WelcomeScreen({ navigation }) {
  function onPressSignIn() {
    navigation.navigate("SignIn");
  }

  function onPressSignUp() {
    navigation.navigate("SignUp");
  }

  return (
    <LinearGradient
      colors={[
        "white",
        // Colors.colors.yellow,
        // Colors.colors.orange,
        // Colors.colors.rosy,
        // Colors.colors.pink,
        Colors.colors.dustyPurple,
      ]}
      style={styles.backgroundContainer}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require("app/assets/imageBoardScreen.png")}
            style={styles.image}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Let's Get Social!</Text>
          <Text style={styles.description}>
            Meeting new people who share your interest in the gaming community
            can be an exciting and rewarding experience. Whether you're a
            seasoned gamer or just starting out, connecting with others who
            enjoy playing video games can open up new opportunities for fun,
            socializing, and personal growth.
          </Text>
          <Text style={styles.footer}>Begin your journey now!</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttons}>
            <Button
              backgroundColor={Colors.colors.darkDustyPurple}
              color="white"
              onPress={onPressSignIn}
              width={300}
            >
              Login
            </Button>
          </View>
          <View style={styles.buttons}>
            <Button
              backgroundColor={Colors.colors.darkDustyPurple}
              color="white"
              onPress={onPressSignUp}
              width={300}
            >
              Create an account
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    // width: "100%",
    // height: "100%",
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    paddingTop: 50,
  },
  image: {
    width: 400,
    height: 290,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Montserrat-Regular",
    fontSize: 36,
    marginTop: 16,
    color: Colors.colors.darkDustyPurple,
  },
  description: {
    fontFamily: "Montserrat-Light",
    fontSize: 16,
    textAlign: "center",
    padding: 16,
    // marginHorizontal: 24,
    color: Colors.colors.darkDustyPurple,
  },
  footer: {
    fontFamily: "Montserrat-Regular",
    fontSize: 24,
    color: Colors.colors.darkDustyPurple,
  },
  buttonsContainer: {
    padding: 36,
  },
  buttons: {
    padding: 8,
  },
});

export default WelcomeScreen;
