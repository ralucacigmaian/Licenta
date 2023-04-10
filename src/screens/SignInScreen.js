import { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Keyboard,
} from "react-native";
import { Colors } from "../utils/colors";
import Input from "../components/Input";
import Button from "../components/Button";
import { firebase } from "app/config.js";
import { UserContext } from "../context/AuthContext";

function SignInScreen({ navigation }) {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const authenticatedUser = useContext(UserContext);

  const [errorLogin, setErrorLogin] = useState("");
  const firebaseErrorTypeOne =
    "Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).";
  const firebaseErrorTypeTwo =
    "Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).";

  async function loginUser(email, password) {
    try {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const id = user.user.uid;
      authenticatedUser.getUserId(id);
      console.log(authenticatedUser.uid);
    } catch (error) {
      // console.log(error.message);
      validate();
      if (error.message === firebaseErrorTypeOne) {
        setErrorLogin(
          "Your account doesn't exist! Verify your email and password or create an account!"
        );
      } else if (error.message === firebaseErrorTypeTwo) {
        setErrorLogin("Your password is incorret! Verify it and try again!");
      } else {
        setErrorLogin("");
      }
    }
  }

  const [errors, setErrors] = useState({});

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.email) {
      handleError("Please input your email", "email");
      valid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError("Please input a valid email", "email");
    }
    if (!inputs.password) {
      handleError("Please input your password", "password");
    } else if (inputs.password.length < 8) {
      handleError(
        "Please input a password with a length of at least 8 characters",
        "password"
      );
    }
  };

  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  // console.log(inputs);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome Back!</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>Log into your account</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.text}>Login</Text>
          <View style={styles.inputs}>
            <View style={styles.input}>
              <Input
                value={inputs.email}
                label="Email"
                placeholder="Enter your email address"
                placeholderTextColor={Colors.colors.gray}
                color={Colors.colors.darkDustyPurple}
                backgroundColor="white"
                backgroundColorTooltip={Colors.colors.darkDustyPurple}
                borderColor={Colors.colors.darkDustyPurple}
                iconName="mail"
                iconError="ios-alert-circle"
                iconSize={24}
                iconColor={Colors.colors.darkDustyPurple}
                style={{ fontFamily: "Montserrat-Regular" }}
                autoCapitalize="none"
                onChangeText={(text) => handleOnChange(text, "email")}
                error={errors.email}
                onFocus={() => {
                  handleError(null, "email");
                }}
              />
            </View>
            <View style={styles.input}>
              <Input
                value={inputs.password}
                label="Password"
                placeholder="Enter your password"
                placeholderTextColor={Colors.colors.gray}
                color={Colors.colors.darkDustyPurple}
                backgroundColor="white"
                backgroundColorTooltip={Colors.colors.darkDustyPurple}
                borderColor={Colors.colors.darkDustyPurple}
                iconName="lock-closed"
                iconError="ios-alert-circle"
                iconNameOn="ios-eye"
                iconNameOff="ios-eye-off"
                iconSize={24}
                iconColor={Colors.colors.darkDustyPurple}
                style={{ fontFamily: "Montserrat-Regular" }}
                onChangeText={(text) => handleOnChange(text, "password")}
                error={errors.password}
                onFocus={() => {
                  handleError(null, "password");
                }}
                password
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              color="white"
              backgroundColor={Colors.colors.darkDustyPurple}
              width={200}
              onPress={() => {
                loginUser(inputs.email, inputs.password);
              }}
            >
              Login
            </Button>
          </View>
          <View>
            {errorLogin ? (
              <Text style={styles.textErrorLogin}>{errorLogin}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.textFooter}>
            Don't have an account? Create one{" "}
          </Text>
          <Pressable style={({ pressed }) => pressed && styles.pressed}>
            <Text
              onPress={() => {
                navigation.navigate("SignUp");
              }}
              style={styles.textHere}
            >
              here
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    paddingTop: 30,
  },
  title: {
    fontFamily: "Montserrat-Regular",
    fontSize: 32,
    color: Colors.colors.darkDustyPurple,
  },
  descriptionContainer: {
    padding: 16,
  },
  description: {
    fontFamily: "Montserrat-Light",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  form: {
    marginTop: 32,
    backgroundColor: Colors.colors.dustyPurple,
    width: "80%",
    height: 400,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderRadius: 10,
  },
  text: {
    padding: 24,
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
    fontSize: 28,
    color: Colors.colors.darkDustyPurple,
    textTransform: "uppercase",
  },
  inputs: {
    paddingRight: 20,
    paddingLeft: 20,
  },
  input: {
    paddingBottom: 16,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    padding: 24,
    flexDirection: "row",
    paddingTop: 115,
  },
  textFooter: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
  },
  textHere: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
  },
  pressed: {
    opacity: 0.5,
  },
  textErrorLogin: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
    marginTop: 6,
  },
});

export default SignInScreen;
