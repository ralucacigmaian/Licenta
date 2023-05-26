import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { firebase } from "app/config.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/AuthContext";
import {
  getImageURL,
  getUsersReceivedFriendRequests,
  getUsersFriends,
  getUsersFamilyMembers,
} from "../database/database";
import FriendCard from "../components/FriendCard";
import { Interests } from "../utils/interests";
import { Colors } from "../utils/colors";
import AddedFriendCard from "../components/AddedFriendCard";
import { useFocusEffect } from "@react-navigation/native";

function FriendRecommendationScreen({ navigation }) {
  const [usersArray, setUsersArray] = useState([]);
  const [friendsArray, setFriendsArray] = useState([]);
  const [familyArray, setFamilyArray] = useState([]);
  const [receivedFriendRequests, setReceivedFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const authenticatedUser = useContext(UserContext);

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

      const getFriends = async () => {
        const responseUsersFriends = await getUsersFriends(
          authenticatedUser.uid
        );
        setFriendsArray(responseUsersFriends);
      };

      const getFamily = async () => {
        const responseUsersFamily = await getUsersFamilyMembers(
          authenticatedUser.uid
        );
        setFamilyArray(responseUsersFamily);
      };
      const getReceivedFriendRequests = async () => {
        const responseReceivedRequests = await getUsersReceivedFriendRequests(
          authenticatedUser.uid
        );
        setReceivedFriendRequests(responseReceivedRequests);
      };

      getUsers().catch((error) => {
        console.log("Error getting users: ", error);
      });

      getReceivedFriendRequests().catch((error) => {
        console.log("Errog getting received friend requests: ", error);
      });

      getFriends().catch((error) => {
        console.log("Error getting friends: ", error);
      });

      getFamily().catch((error) => {
        console.log("Error getting family members: ", error);
      });
    }, [])
  );
  const filteredUsersArray = usersArray.filter(
    (x) =>
      x.id !== authenticatedUser.uid &&
      !receivedFriendRequests.some((y) => y.idFriend === x.id) &&
      !friendsArray.some((z) => z.id === x.id)
  );

  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <View style={styles.containerFamily}>
        <Text style={styles.textFamily}>Familie</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {familyArray.length > 0 ? (
            familyArray.map((x) => {
              return (
                <View style={styles.containerCardFamily}>
                  <AddedFriendCard
                    image={x.image}
                    name={x.name}
                    birthday={x.birthday}
                    onPress={() =>
                      navigation.navigate("Profilul Prietenului", {
                        name: x.name,
                        familyRelation: x.familyRelation,
                        birthday: x.birthday,
                        image: x.image,
                        interests: x.interests,
                        phoneNumber: x.phoneNumber,
                        idUser: authenticatedUser.uid,
                        idFriend: x.id,
                        isGift: true,
                      })
                    }
                    onGift={() =>
                      navigation.navigate("Display Gift Suggestions", {
                        idFriend: x.id,
                        name: x.name,
                      })
                    }
                  />
                </View>
              );
            })
          ) : (
            <Text style={styles.textNoFamily}>
              Nu ai adăugat membrii familiei încă!
            </Text>
          )}
        </ScrollView>
      </View>
      <View style={styles.containerAddedFriends}>
        <Text style={styles.textAddedFriends}>Prieteni</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {friendsArray.length > 0 ? (
            friendsArray.map((x) => {
              // if (x.receivedGift === 0) {
              return (
                <View style={styles.containerCardAddedFriend}>
                  <AddedFriendCard
                    image={x.image}
                    name={x.name}
                    birthday={x.birthday}
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
                        isGift: true,
                      })
                    }
                    onGift={() =>
                      navigation.navigate("Display Gift Suggestions", {
                        idFriend: x.id,
                        name: x.name,
                      })
                    }
                  />
                </View>
              );
              // }
            })
          ) : (
            <Text style={styles.textNoFriendsAdded}>
              Nu ai adaugăt prieteni încă!
            </Text>
          )}
        </ScrollView>
      </View>
      <View style={styles.containerFriends}>
        <Text style={styles.textFriends}>Poate îi cunoști</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {filteredUsersArray.length > 0 ? (
            filteredUsersArray.map((x) => {
              const firstInterest = Interests.find(
                (obj) => obj.id === x.interests[0]
              );
              const secondInterest = Interests.find(
                (obj) => obj.id === x.interests[1]
              );
              console.log(secondInterest);
              return (
                <View style={styles.containerCardFriend}>
                  <FriendCard
                    image={x.image}
                    name={x.name}
                    firstInterest={firstInterest.title}
                    secondInterest={secondInterest.title}
                    idFriend={x.id}
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
            <Text style={styles.textNoFriends}>
              Nu există prieteni disponibili
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  // containerFriends: {
  //   flexDirection: "row",
  //   justifyContent: "space-evenly",
  // },
  containerAddedFriends: {},
  textAddedFriends: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
    marginLeft: 16,
    marginTop: 8,
  },
  containerCardAddedFriend: {
    marginLeft: 16,
    marginTop: 8,
  },
  containerCardFriend: {
    marginLeft: 16,
  },
  textFriends: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  textNoFriendsAdded: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    marginLeft: 16,
    marginTop: 8,
  },
  textNoFriends: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    marginLeft: 16,
  },
  textFamily: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
    marginLeft: 16,
  },
  textNoFamily: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    marginLeft: 16,
  },
  containerCardFamily: {
    marginLeft: 16,
    marginTop: 8,
  },
});

export default FriendRecommendationScreen;