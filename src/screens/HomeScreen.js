import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Button from "../components/Button";
import { firebase } from "app/config.js";
import { Colors } from "../utils/colors";
import { UserContext } from "../context/AuthContext";
// import { readData, getUsersFriend } from "../database/database";
// import { ref, onValue } from "firebase/database";
// import { realtime } from "../../config";
// import DisplayFriendsScreen from "./DisplayFriendsScreen";

function HomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
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
