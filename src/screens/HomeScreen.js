import { useContext, useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import Button from "../components/Button";
import { firebase } from "app/config.js";
import { Colors } from "../utils/colors";
import { UserContext } from "../context/AuthContext";
import {
  registerForPushNotificationsAsync,
  scheduleNotification,
  sendPushNotification,
  sendPushNotificationHandler,
} from "../notifications/notifications";
import * as Notifications from "expo-notifications";
import { getUsersNotification } from "../database/database";
import { getImageURL } from "../database/database";

function HomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);
  const authenticatedUser = useContext(UserContext);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

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

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) =>
  //     setExpoPushToken(token)
  //   );

  //   authenticatedUser.getExpoPushToken(expoPushToken);

  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       setNotification(notification);
  //     });

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log(response);
  //     });

  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  useEffect(() => {
    async function sendNotification() {
      try {
        let response = [];
        response = await getUsersNotification(authenticatedUser.uid);
        setNotification(response);
        return response;
      } catch (error) {
        console.log(error);
      }
    }

    sendNotification().then((response) => {
      for (const key in response) {
        const birthdate = new Date(response[key].birthday);
        const today = new Date();
        let nextBirthday = new Date(
          today.getFullYear(),
          birthdate.getMonth(),
          birthdate.getDate()
        );
        if (today > nextBirthday) {
          nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        const diffTime = nextBirthday.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        scheduleNotification(
          "Atenție!",
          `Ziua prietenului tău, ${response[key].name}, este în ${diffDays} zile`,
          11,
          20
        );
      }
    });
  }, []);

  const handleLogOut = () => {
    authenticatedUser.logout;
    firebase.auth().signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello {name.name}, add your friends now</Text>
      <Button onPress={handleLogOut}>Logout</Button>
      {/* <Button onPress={sendPushNotification(expoPushToken)}>
        Send Notificare
      </Button> */}
      {/* <Button
        onPress={() =>
          sendPushNotificationHandler(expoPushToken, "Anaa", "are mere")
        }
      >
        Notificare
      </Button> */}
      {/* <Button onPress={() => scheduleNotification("imp", "place", 19, 23)}>
        alo
      </Button> */}
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
