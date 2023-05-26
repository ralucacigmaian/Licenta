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
import { showMessage } from "react-native-flash-message";

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
  const firebaseErrorTypeThree =
    "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).";

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
        showMessage({
          message: "Contul tău nu există!",
          description: "Verifică e-mail-ul și parola sau crează-ți un cont!",
          icon: "warning",
          style: { backgroundColor: Colors.colors.darkDustyPurple },
          titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
          textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
        });
        setErrorLogin(
          "Your account doesn't exist! Verify your email and password or create an account!"
        );
      } else if (error.message === firebaseErrorTypeTwo) {
        showMessage({
          message: "Parola ta este incorectă!",
          description: "Verifică parola și încearcă din nou!",
          icon: "warning",
          style: { backgroundColor: Colors.colors.darkDustyPurple },
          titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
          textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
        });
        setErrorLogin("Your password is incorret! Verify it and try again!");
      } else {
        console.log(error.message);

        // Contul este disabled

        // showMessage({
        //   message: "Parola ta este incorectă!",
        //   description: "Verifică parola și încearcă din nou!",
        //   icon: "warning",
        //   style: { backgroundColor: Colors.colors.darkDustyPurple },
        //   titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
        //   textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
        // });
      }
    }
  }

  const [errors, setErrors] = useState({});

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.email) {
      handleError("Vă rugăm să introduceți adresa de e-mail!", "email");
      valid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError(
        "Vă rugăm să introduceți o adresă de e-mail validă!",
        "email"
      );
    }
    if (!inputs.password) {
      handleError("Vă rugăm să introduceți parola!", "password");
    } else if (inputs.password.length < 8) {
      handleError(
        "Vă rugăm să introduceți o parolă care să conțină cel puțin 8 caractere!",
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
    <View style={styles.container}>
      <View style={styles.containerForm}>
        <View style={styles.containerText}>
          <Text style={styles.textWelcome}>Bine ai revenit!</Text>
          <Text style={styles.textInformation}>
            Completează următorul formular pentru a te conecta la contul tău
          </Text>
        </View>
        <View style={styles.containerInput}>
          <Input
            value={inputs.email}
            label="E-mail"
            placeholder="Introduceți adresa de e-mail"
            placeholderTextColor={Colors.colors.gray}
            color={Colors.colors.darkDustyPurple}
            backgroundColor="white"
            backgroundColorTooltip={Colors.colors.darkDustyPurple}
            borderColor={Colors.colors.darkDustyPurple}
            iconName="mail"
            iconError="ios-alert-circle"
            iconSize={24}
            iconColor={Colors.colors.darkDustyPurple}
            style={{
              fontFamily: "Montserrat-Regular",
            }}
            autoCapitalize="none"
            onChangeText={(text) => handleOnChange(text, "email")}
            error={errors.email}
            onFocus={() => {
              handleError(null, "email");
            }}
          />
          <Input
            value={inputs.password}
            label="Parolă"
            placeholder="Introduceți parola"
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
        <View style={styles.containerButton}>
          <Button
            onPress={() => loginUser(inputs.email, inputs.password)}
            backgroundColor={Colors.colors.darkDustyPurple}
            color="white"
            width={280}
            borderRadius={10}
            fontFamily="Montserrat-SemiBold"
            fontSize={16}
            shadowOpacity={0.5}
          >
            Conectează-te
          </Button>
          {/* {errorLogin
            ? showMessage({
                message: errorLogin,
              })
            : null} */}
        </View>
      </View>
      <View style={styles.containerFooter}>
        <Text style={styles.textFooter}>
          Nu ai deja un cont? Îți poți crea unul{" "}
        </Text>
        <Text
          style={styles.textHere}
          onPress={() => navigation.navigate("SignUp")}
        >
          aici
        </Text>
        <Text style={styles.textFooter}>.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-evenly",
    alignItems: "center",
    // borderColor: "red",
    // borderWidth: 1,
  },
  containerForm: {
    width: "90%",
    // height: "90%",
    backgroundColor: Colors.colors.cardBackgroundColor,
    borderRadius: 10,
  },
  containerText: {
    justifyContent: "center",
    alignItems: "center",
    // marginVertical: 16,
    marginTop: 32,
  },
  textWelcome: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 24,
    color: Colors.colors.darkDustyPurple,
  },
  textInformation: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
    marginTop: 16,
  },
  containerInput: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  containerButton: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  containerFooter: {
    flexDirection: "row",
  },
  textFooter: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  textHere: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: "white",
  // },
  // header: {
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // titleContainer: {
  //   paddingTop: 30,
  // },
  // title: {
  //   fontFamily: "Montserrat-Regular",
  //   fontSize: 32,
  //   color: Colors.colors.darkDustyPurple,
  // },
  // descriptionContainer: {
  //   padding: 16,
  // },
  // description: {
  //   fontFamily: "Montserrat-Light",
  //   fontSize: 16,
  //   color: Colors.colors.darkDustyPurple,
  // },
  // form: {
  //   marginTop: 32,
  //   backgroundColor: Colors.colors.dustyPurple,
  //   width: "80%",
  //   height: 400,
  //   shadowColor: "black",
  //   shadowOffset: { width: 2, height: 2 },
  //   shadowOpacity: 0.5,
  //   shadowRadius: 10,
  //   borderRadius: 10,
  // },
  // text: {
  //   padding: 24,
  //   textAlign: "center",
  //   fontFamily: "Montserrat-Regular",
  //   fontSize: 28,
  //   color: Colors.colors.darkDustyPurple,
  //   textTransform: "uppercase",
  // },
  // inputs: {
  //   paddingRight: 20,
  //   paddingLeft: 20,
  // },
  // input: {
  //   paddingBottom: 16,
  // },
  // buttonContainer: {
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // footer: {
  //   padding: 24,
  //   flexDirection: "row",
  //   paddingTop: 115,
  // },
  // textFooter: {
  //   fontFamily: "Montserrat-Regular",
  //   fontSize: 14,
  //   color: Colors.colors.darkDustyPurple,
  // },
  // textHere: {
  //   fontFamily: "Montserrat-SemiBold",
  //   fontSize: 14,
  //   color: Colors.colors.darkDustyPurple,
  // },
  // pressed: {
  //   opacity: 0.5,
  // },
  // textErrorLogin: {
  //   fontFamily: "Montserrat-Regular",
  //   fontSize: 14,
  //   color: Colors.colors.darkDustyPurple,
  //   textAlign: "center",
  //   marginTop: 6,
  // },
});

export default SignInScreen;
