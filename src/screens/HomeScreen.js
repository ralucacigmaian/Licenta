import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Button from "../components/Button";
import { firebase } from "app/config.js";
import { Colors } from "../utils/colors";
import { UserContext } from "../context/AuthContext";

function HomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);
  const authenticatedUser = useContext(UserContext);

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
          const userName = snapshot.data();
          authenticatedUser.getUserName(userName.name);
        } else {
          console.log("User doesn't exist");
        }
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello {name.name}, add your friends now</Text>
      <Button onPress={() => firebase.auth().signOut()}>Logout</Button>
      {/* <Button onPress={() => navigation.navigate("AddFriend")}>Go</Button> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colors.backgroundColor,
  },
});

export default HomeScreen;
