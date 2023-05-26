import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { UserContext } from "../context/AuthContext";
import {
  getUsersReceivedFriendRequests,
  getImageURL,
  deleteReceivedFriendRequest,
  addFriend,
  addNotification,
} from "../database/database";
import { firebase } from "app/config.js";
import NotificationFriendRequest from "../components/NotificationFriendRequest";
import { useFocusEffect } from "@react-navigation/native";

function NotificationsScreen({ navigation }) {
  const [usersArray, setUsersArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receivedFriendRequest, setReceivedFriendRequest] = useState();
  const [usersWhoSentRequest, setUserWhoSentRequest] = useState([]);
  const [friendRequestDeleted, setFriendRequestDeleted] = useState(false);
  const authenticatedUser = useContext(UserContext);

  //   useEffect(() => {
  //     const getUsers = async () => {
  //       const userArray = [];
  //       const responseUsers = await firebase
  //         .firestore()
  //         .collection("users")
  //         .get();
  //       for (const user of responseUsers.docs) {
  //         const imagePath = `users/${user.id}.jpeg`;
  //         const imageURL = await getImageURL(imagePath);
  //         userArray.push({
  //           id: user.id,
  //           name: user.data().name,
  //           birthday: user.data().birthdateToAdd.toDate(),
  //           email: user.data().email,
  //           phoneNumber: user.data().phoneNumber,
  //           interests: user.data().selectedInterests,
  //           image: imageURL,
  //         });
  //       }
  //       setUsersArray(userArray);
  //       setLoading(false);
  //     };
  //     getUsers().catch((error) => {
  //       console.log("Error getting users: ", error);
  //     });

  //     const getReceivedFriendRequests = async () => {
  //       const responseReceivedRequests = await getUsersReceivedFriendRequests(
  //         authenticatedUser.uid
  //       );
  //       setReceivedFriendRequest(responseReceivedRequests);
  //     };
  //     getReceivedFriendRequests();
  //   }, [friendRequestDeleted]);

  useFocusEffect(
    useCallback(() => {
      const getUsers = async () => {
        const userArray = [];
        const responseUsers = await firebase
          .firestore()
          .collection("users")
          .get();
        for (const user of responseUsers.docs) {
          const imagePath = `users/${user.id}.jpeg`;
          const imageURL = await getImageURL(imagePath);
          userArray.push({
            id: user.id,
            name: user.data().name,
            birthday: user.data().birthdateToAdd.toDate(),
            email: user.data().email,
            phoneNumber: user.data().phoneNumber,
            interests: user.data().selectedInterests,
            image: imageURL,
          });
        }
        setUsersArray(userArray);
        setLoading(false);
      };
      getUsers().catch((error) => {
        console.log("Error getting users: ", error);
      });

      const getReceivedFriendRequests = async () => {
        const responseReceivedRequests = await getUsersReceivedFriendRequests(
          authenticatedUser.uid
        );
        setReceivedFriendRequest(responseReceivedRequests);
      };
      getReceivedFriendRequests();
    }, [friendRequestDeleted])
  );

  useEffect(() => {
    let auxArray = [];
    if (receivedFriendRequest) {
      if (usersArray) {
        usersArray.map((x) => {
          receivedFriendRequest.map((y) => {
            if (y.idFriend === x.id) {
              auxArray.push(x);
            }
          });
        });
      }
      setUserWhoSentRequest(auxArray);
    } else {
      console.log("Nu există cereri de prietenie!");
    }

    const acceptFriendRequest = async (
      idUser,
      idFriend,
      name,
      birthday,
      interests,
      image,
      email,
      phoneNumber
    ) => {
      const responseAddFriend = await addFriend(
        idUser,
        idFriend,
        name,
        birthday,
        interests,
        image,
        email,
        phoneNumber
      );
      const responseAddNotification = await addNotification(
        idFriend,
        idUser,
        name,
        birthday
      );
      const responseDeleteRequest = await deleteReceivedFriendRequest(idFriend);
      setFriendRequestDeleted(!friendRequestDeleted);
    };

    const declineFriendRequest = async (idFriend) => {
      const responseDeleteRequest = await deleteReceivedFriendRequest(idFriend);
      setFriendRequestDeleted(!friendRequestDeleted);
    };
  }, [receivedFriendRequest, usersArray, friendRequestDeleted]);

  const acceptFriendRequest = async (
    idUser,
    idFriend,
    name,
    birthday,
    interests,
    image,
    email,
    phoneNumber
  ) => {
    const responseAddFriend = await addFriend(
      idUser,
      idFriend,
      name,
      birthday,
      interests,
      image,
      email,
      phoneNumber
    );

    await Promise.all(
      usersArray.map(async (x) => {
        if (x.id === authenticatedUser.uid) {
          const responseAddFriendWhoSentRequest = await addFriend(
            idFriend,
            idUser,
            x.name,
            x.birthday,
            x.interests,
            x.image,
            x.email,
            x.phoneNumber
          );
        }
      })
    );
    const responseAddNotification = await addNotification(
      idFriend,
      idUser,
      name,
      birthday
    );
    const responseDeleteRequest = await deleteReceivedFriendRequest(idFriend);
    setFriendRequestDeleted(!friendRequestDeleted);
  };

  const declineFriendRequest = async (idFriend) => {
    const responseDeleteRequest = await deleteReceivedFriendRequest(idFriend);
    setFriendRequestDeleted(!friendRequestDeleted);
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      {usersWhoSentRequest.length !== 0 ? (
        usersWhoSentRequest.map((x) => {
          return (
            <View style={styles.containerNotifications}>
              <NotificationFriendRequest
                image={x.image}
                name={x.name}
                onPressAccept={() =>
                  acceptFriendRequest(
                    authenticatedUser.uid,
                    x.id,
                    x.name,
                    x.birthday,
                    x.interests,
                    x.image,
                    x.email,
                    x.phoneNumber
                  )
                }
                onPressDecline={() => declineFriendRequest(x.id)}
                onPress={() =>
                  navigation.navigate("Profilul Prietenului", {
                    name: x.name,
                    email: x.email,
                    birthday: x.birthday,
                    image: x.image,
                    interests: x.interests,
                    phoneNumber: x.phoneNumber,
                    idUser: authenticatedUser.uid,
                    idFriend: x.id,
                  })
                }
              />
            </View>
          );
        })
      ) : (
        <Text>Ne pare rău, nu ai primit nicio cerere de prietenie!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // justifyContent: "center",
  },
  containerNotifications: {
    alignItems: "center",
    marginBottom: 16,
  },
});

export default NotificationsScreen;
