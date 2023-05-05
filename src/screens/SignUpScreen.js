import { useContext, useReducer, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Pressable,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../components/Button";
import Input from "../components/Input";
import { Colors } from "../utils/colors";
import { firebase } from "app/config.js";
import * as ImagePicker from "expo-image-picker";
import { addImage } from "../database/database";
import { UserContext } from "../context/AuthContext";

function SignUpScreen({ navigation }) {
  const [inputs, setInputs] = useState({
    email: "",
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [photo, setPhoto] = useState(null);

  const authenticatedUser = useContext(UserContext);

  const handleSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.canceled) {
      setPhoto(result.uri);
    }
  };

  const firebaseErrorTypeOne =
    "Firebase: The email address is already in use by another account. (auth/email-already-in-use).";

  const registerUser = async (
    email,
    name,
    phoneNumber,
    password,
    confirmPassword
  ) => {
    let valid = true;
    if (!inputs.email) {
      valid = false;
      handleError("Please input your email", "email");
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      valid = false;
      handleError("Please input a valid email", "email");
    }
    if (!inputs.name) {
      valid = false;
      handleError("Please input your name", "name");
    }
    if (!inputs.phoneNumber) {
      valid = false;
      handleError("Please input your phone number", "phoneNumber");
    } else if (inputs.phoneNumber.length !== 10) {
      valid = false;
      handleError("Please input a valid phone number", "phoneNumber");
    }
    if (!inputs.password) {
      valid = false;
      handleError("Please input your password", "password");
    } else if (inputs.password.length < 8) {
      valid = false;
      handleError(
        "Please input a password with a length of at least 8 characters",
        "password"
      );
    }
    if (!inputs.confirmPassword) {
      valid = false;
      handleError("Please confirm your password", "confirmPassword");
    } else if (inputs.password !== inputs.confirmPassword) {
      if (inputs.password.length === 0) {
        valid = false;
        handleError("Please input your password firstly", "confirmPassword");
      } else {
        valid = false;
        handleError("Passwords do not match", "confirmPassword");
      }
    }
    if (!photo) {
      valid = false;
      handleError("Please select your profile picture!", "photo");
    }

    console.log(valid);

    if (valid) {
      console.log(inputs);
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        // .then(() => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            email,
            name,
            phoneNumber,
          })
          .catch((error) => {
            alert(error.message);
          });
        const userId = firebase.auth().currentUser.uid;
        // authenticatedUser.getUserId(userId);
        const imagePath = `users/${userId}.jpeg`;
        const responseImage = await addImage(photo, imagePath);
        console.log(responseImage);
        console.log(userId);
        navigation.navigate("Home");
        // })
      } catch (error) {
        // alert(error.message);
        if (error.message === firebaseErrorTypeOne) {
          handleError("An account with this email already exists!", "email");
        }
      }
    }
  };

  const [errors, setErrors] = useState({});

  // const validate = () => {
  //   Keyboard.dismiss();
  //   let valid = true;
  //   if (!inputs.email) {
  //     ok = 1;
  //     handleError("Please input your email", "email");
  //     valid = false;
  //   } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
  //     handleError("Please input a valid email", "email");
  //   }
  //   if (!inputs.name) {
  //     ok = 1;
  //     handleError("Please input your name", "name");
  //   }
  //   if (!inputs.phoneNumber) {
  //     ok = 1;
  //     handleError("Please input your phone number", "phoneNumber");
  //   } else if (inputs.phoneNumber.length !== 10) {
  //     ok = 1;
  //     handleError("Please input a valid phone number", "phoneNumber");
  //   }
  //   if (!inputs.password) {
  //     ok = 1;
  //     handleError("Please input your password", "password");
  //   } else if (inputs.password.length < 8) {
  //     ok = 1;
  //     handleError(
  //       "Please input a password with a length of at least 8 characters",
  //       "password"
  //     );
  //   }
  //   if (!inputs.confirmPassword) {
  //     ok = 1;
  //     handleError("Please confirm your password", "confirmPassword");
  //   } else if (inputs.password !== inputs.confirmPassword) {
  //     if (inputs.password.length === 0) {
  //       ok = 1;
  //       handleError("Please input your password firstly", "confirmPassword");
  //     } else {
  //       ok = 1;
  //       handleError("Passwords do not match", "confirmPassword");
  //     }
  //   }
  // };

  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.description}>Enter your details to Register</Text>
          <View style={styles.form}>
            <Text style={styles.text}>Register</Text>
            <View style={styles.inputs}>
              <View style={styles.input}>
                <Input
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
                  label="Name"
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.colors.gray}
                  color={Colors.colors.darkDustyPurple}
                  backgroundColor="white"
                  backgroundColorTooltip={Colors.colors.darkDustyPurple}
                  borderColor={Colors.colors.darkDustyPurple}
                  iconName="ios-person-circle"
                  iconError="ios-alert-circle"
                  iconSize={24}
                  iconColor={Colors.colors.darkDustyPurple}
                  style={{ fontFamily: "Montserrat-Regular" }}
                  onChangeText={(text) => handleOnChange(text, "name")}
                  error={errors.name}
                  onFocus={() => {
                    handleError(null, "name");
                  }}
                />
              </View>
              <View style={styles.input}>
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  placeholderTextColor={Colors.colors.gray}
                  color={Colors.colors.darkDustyPurple}
                  backgroundColor="white"
                  backgroundColorTooltip={Colors.colors.darkDustyPurple}
                  borderColor={Colors.colors.darkDustyPurple}
                  iconName="ios-call"
                  iconError="ios-alert-circle"
                  iconSize={24}
                  iconColor={Colors.colors.darkDustyPurple}
                  style={{ fontFamily: "Montserrat-Regular" }}
                  keyboarType="phone-pad"
                  onChangeText={(text) => handleOnChange(text, "phoneNumber")}
                  error={errors.phoneNumber}
                  onFocus={() => {
                    handleError(null, "phoneNumber");
                  }}
                  // maxLength={20}
                />
              </View>
              <View style={styles.input}>
                <Input
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
              <View style={styles.input}>
                <Input
                  label="Confirm password"
                  placeholder="Confirm your password"
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
                  onChangeText={(text) =>
                    handleOnChange(text, "confirmPassword")
                  }
                  error={errors.confirmPassword}
                  onFocus={() => {
                    handleError(null, "confirmPassword");
                  }}
                  password
                />
              </View>
              <View style={styles.imageContainer}>
                <Input
                  label="Profile Picture"
                  placeholder={
                    !photo
                      ? "Select your profile photo"
                      : "Image uploaded successfully!"
                  }
                  placeholderTextColor={Colors.colors.gray}
                  color={Colors.colors.darkDustyPurple}
                  backgroundColor="white"
                  backgroundColorTooltip={Colors.colors.darkDustyPurple}
                  borderColor={Colors.colors.darkDustyPurple}
                  iconName="ios-images"
                  iconError="ios-alert-circle"
                  iconSize={24}
                  iconColor={Colors.colors.darkDustyPurple}
                  style={{
                    fontFamily: "Montserrat-Regular",
                  }}
                  error={errors.photo}
                  onFocus={() => {
                    handleError(null, "photo");
                  }}
                  onPressIn={handleSelectImage}
                  caretHidden={true}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                color="white"
                backgroundColor={Colors.colors.darkDustyPurple}
                width={200}
                onPress={() => {
                  registerUser(
                    inputs.email,
                    inputs.name,
                    inputs.phoneNumber,
                    inputs.password
                  );
                }}
              >
                Register
              </Button>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.textFooter}>Already have an account? Login </Text>
          <Pressable style={({ pressed }) => pressed && styles.pressed}>
            <Text
              style={styles.textHere}
              onPress={() => navigation.navigate("SignIn")}
            >
              here
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Montserrat-Regular",
    fontSize: 32,
    color: Colors.colors.darkDustyPurple,
  },
  description: {
    fontFamily: "Montserrat-Light",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    paddingTop: 4,
  },
  form: {
    marginTop: 8,
    backgroundColor: Colors.colors.dustyPurple,
    width: "80%",
    height: 680,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    padding: 8,
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
  input: {},
  buttonContainer: {
    marginBottom: 16,
    marginTop: 4,
  },
  footer: {
    paddingTop: 30,
    flexDirection: "row",
    justifyContent: "center",
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
});

export default SignUpScreen;
