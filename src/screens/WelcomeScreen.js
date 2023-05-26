import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../utils/colors";
import Button from "../components/Button";
import LottieView from "lottie-react-native";
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
        "white",
      ]}
      style={styles.backgroundContainer}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.imageContainer}>
          <LottieView
            source={require("../utils/homeScreen2.json")}
            autoPlay
            loop
            style={{
              width: 300,
              height: 300,
            }}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Stai la curent cu evenimentele din viața ta!
          </Text>
          <Text style={styles.description}>
            Zilele de naștere și zilele onomastice sunt momente speciale în
            viața noastră, atât pentru noi cât și pentru familia și prietenii
            noștri. Astfel, poți fi informat despre aniversările prietenilor,
            având șansa de a le oferi cadouri!
          </Text>
          <Text style={styles.footer}>Înregistrează-te chiar acum!</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttons}>
            <Button
              backgroundColor={Colors.colors.darkDustyPurple}
              color="white"
              onPress={onPressSignIn}
              width={300}
              borderRadius={10}
              fontFamily="Montserrat-SemiBold"
              fontSize={18}
              shadowOpacity={0.5}
            >
              Conectează-te
            </Button>
          </View>
          <View style={styles.buttons}>
            <Button
              backgroundColor="white"
              color={Colors.colors.darkDustyPurple}
              onPress={onPressSignUp}
              width={300}
              borderRadius={10}
              fontFamily="Montserrat-SemiBold"
              fontSize={18}
              shadowOpacity={0.5}
            >
              Creează un cont
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
    justifyContent: "space-evenly",
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
    fontFamily: "Montserrat-SemiBold",
    fontSize: 28,
    // marginTop: 16,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
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
    fontFamily: "Montserrat-SemiBold",
    fontSize: 24,
    color: Colors.colors.darkDustyPurple,
  },
  buttonsContainer: {
    padding: 30,
  },
  buttons: {
    padding: 8,
  },
});

export default WelcomeScreen;
