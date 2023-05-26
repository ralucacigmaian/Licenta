import { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../utils/colors";
import { Interests } from "../utils/interests";
import Interest from "../components/Interest";
import Button from "../components/Button";
import {
  addFriendRequest,
  addNotification,
  deleteFriendRequest,
} from "../database/database";
import {
  getUsersSentFriendRequests,
  getUsersReceivedFriendRequests,
  addFriend,
  deleteReceivedFriendRequest,
} from "../database/database";
import { UserContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

function FriendProfileScreen({ route }) {
  const {
    name,
    email,
    birthday,
    image,
    interests,
    phoneNumber,
    idUser,
    idFriend,
    isGift,
    familyRelation,
  } = route.params;

  const birthdate = new Date(birthday);
  const ageDifMs = Date.now() - birthdate.getTime();
  const ageDate = new Date(ageDifMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  const options = { day: "numeric", month: "long", year: "numeric" };
  const formatter = new Intl.DateTimeFormat("ro-RO", options);
  const formattedBirthday = formatter.format(birthdate);

  //   console.log(`idUser: ${idUser} + idFriend: ${idFriend}`);

  const [isSent, setIsSent] = useState(false);
  const [idFriendRequest, setIdFriendRequest] = useState();

  const [usersSentRequests, setUsersSentRequests] = useState();
  const [usersReceivedRequests, setUsersReceivedRequests] = useState();
  const [idFriends, setIdFriends] = useState();
  const [isReceived, setIsReceived] = useState(false);
  const [friendRequestDeleted, setFriendRequestDeleted] = useState(false);
  const authenticatedUser = useContext(UserContext);

  const navigation = useNavigation();

  useEffect(() => {
    const getSentFriendRequests = async () => {
      const responseSentRequests = await getUsersSentFriendRequests(
        authenticatedUser.uid
      );
      setUsersSentRequests(responseSentRequests);
    };
    getSentFriendRequests();

    const getReceivedFriendRequests = async () => {
      const responseReceivedRequests = await getUsersReceivedFriendRequests(
        authenticatedUser.uid
      );
      setUsersReceivedRequests(responseReceivedRequests);
    };
    getReceivedFriendRequests();
  }, []);

  //   useEffect(() => {
  //     if (usersSentRequests) {
  //       const sentRequestIds = usersSentRequests.map(
  //         (request) => request.idFriend
  //       );
  //       setIdFriends(sentRequestIds);
  //       setIsSent(sentRequestIds.includes(idFriend));
  //     }
  //   }, [usersSentRequests]);

  //   useEffect(() => {
  //     if (usersReceivedRequests) {
  //       const receivedRequestIds = usersReceivedRequests.map((x) => x.idFriend);
  //       setIsReceived(receivedRequestIds.includes(idUser));
  //     }
  //   }, [usersReceivedRequests]);

  useEffect(() => {
    if (usersSentRequests) {
      const sentRequestIds = usersSentRequests.map(
        (request) => request.idFriend
      );
      setIsSent(sentRequestIds.includes(idFriend));
    }

    if (usersReceivedRequests) {
      const receivedRequestIds = usersReceivedRequests.map(
        (request) => request.idFriend
      );
      setIsReceived(receivedRequestIds.includes(idFriend));
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
      const responseDeleteRequest = await deleteReceivedFriendRequest(idFriend);
      const responseAddNotification = await addNotification(
        idFriend,
        idUser,
        name,
        birthday
      );
      setFriendRequestDeleted(!friendRequestDeleted);
      navigation.navigate("Notifications");
    };

    const declineFriendRequest = async (idFriend) => {
      const responseDeleteRequest = await deleteReceivedFriendRequest(idFriend);
      setFriendRequestDeleted(!friendRequestDeleted);
      navigation.navigate("Notifications");
    };
  }, [usersSentRequests, usersReceivedRequests, friendRequestDeleted]);

  const sendFriendRequest = async () => {
    const response = await addFriendRequest(idUser, idFriend);
    setIdFriendRequest(response);
    setIsSent(true);
  };

  const removeFriendRequest = async () => {
    const response = await deleteFriendRequest(idFriend);
    setIsSent(false);
  };

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
    const responseDeleteRequest = await deleteReceivedFriendRequest(idFriend);
    const responseAddNotification = await addNotification(
      idFriend,
      idUser,
      name,
      birthday
    );
    setFriendRequestDeleted(!friendRequestDeleted);
    navigation.navigate("Notifications");
  };

  const declineFriendRequest = async (idFriend) => {
    const responseDeleteRequest = await deleteReceivedFriendRequest(idFriend);
    setFriendRequestDeleted(!friendRequestDeleted);
    navigation.navigate("Notifications");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.containerInformation}>
        <Text style={styles.textName}>{name}</Text>
        <View style={styles.containerAge}>
          <Text style={styles.textAge}>{age}</Text>
        </View>
      </View>
      <View style={styles.containerBirthday}>
        <Text style={styles.textBirthday}>{formattedBirthday}</Text>
      </View>
      <View style={styles.containerProfile}>
        <View style={styles.containerBody}>
          <View style={styles.containerContact}>
            {email ? (
              <View style={styles.containerEmail}>
                <Text style={styles.textContactType}>E-mail</Text>
                <Text style={styles.textContact}>{email}</Text>
              </View>
            ) : (
              <View style={styles.containerEmail}>
                <Text style={styles.textContactType}>Grad de rudenie</Text>
                <Text style={styles.textContact}>{familyRelation}</Text>
              </View>
            )}
            <View style={styles.containerPhoneNumber}>
              <Text style={styles.textContactType}>Număr de telefon</Text>
              <Text style={styles.textContact}>{phoneNumber}</Text>
            </View>
          </View>
          <View style={styles.containerInterests}>
            {interests.map((x) => {
              const interestsObj = Interests.find((obj) => obj.id === x);
              return (
                <View style={styles.containerInterest}>
                  <Interest active={Colors.colors.lightDustyPurple}>
                    {interestsObj.title}
                  </Interest>
                </View>
              );
            })}
          </View>
          <View style={styles.containerButton}>
            {isGift ? (
              <Button
                backgroundColor={Colors.colors.darkDustyPurple}
                color="white"
                width={280}
                borderRadius={10}
                fontFamily="Montserrat-SemiBold"
                fontSize={16}
                shadowOpacity={0.5}
                onPress={() => {
                  // Handle button click action for sending a gift
                }}
              >
                Trimite un cadou
              </Button>
            ) : (
              <>
                {isReceived ? (
                  <View style={styles.containerAcceptDecline}>
                    <View style={styles.button}>
                      <Button
                        backgroundColor={Colors.colors.darkDustyPurple}
                        color="white"
                        width={130}
                        borderRadius={10}
                        fontFamily="Montserrat-SemiBold"
                        fontSize={16}
                        shadowOpacity={0.1}
                        onPress={() =>
                          acceptFriendRequest(
                            idUser,
                            idFriend,
                            name,
                            birthday,
                            interests,
                            image,
                            email,
                            phoneNumber
                          )
                        }
                      >
                        Acceptă
                      </Button>
                    </View>
                    <View style={styles.button}>
                      <Button
                        backgroundColor="white"
                        color={Colors.colors.darkDustyPurple}
                        width={130}
                        borderRadius={10}
                        fontFamily="Montserrat-SemiBold"
                        fontSize={16}
                        shadowOpacity={0.1}
                        onPress={() => {
                          declineFriendRequest(idFriend);
                        }}
                      >
                        Refuză
                      </Button>
                    </View>
                  </View>
                ) : isSent ? (
                  <Button
                    backgroundColor="white"
                    color={Colors.colors.darkDustyPurple}
                    width={280}
                    borderRadius={10}
                    fontFamily="Montserrat-SemiBold"
                    fontSize={16}
                    shadowOpacity={0.5}
                    onPress={removeFriendRequest}
                  >
                    Cerere trimisă
                  </Button>
                ) : (
                  <Button
                    backgroundColor={Colors.colors.darkDustyPurple}
                    color="white"
                    width={280}
                    borderRadius={10}
                    fontFamily="Montserrat-SemiBold"
                    fontSize={16}
                    shadowOpacity={0.5}
                    onPress={sendFriendRequest}
                  >
                    Adaugă prieten
                  </Button>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    height: "75%",
  },
  containerInformation: {
    flexDirection: "row",
    marginTop: -200,
    marginLeft: 40,
    // borderWidth: 1,
    // borderColor: "red",
  },
  textName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 34,
    color: "white",
  },
  containerAge: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginLeft: 16,
  },
  textAge: {
    fontFamily: "Montserrat-Regular",
    fontSize: 24,
    color: "white",
    marginTop: 7,
  },
  containerBirthday: {
    marginLeft: 40,
  },
  textBirthday: {
    fontFamily: "Montserrat-Italic",
    fontSize: 16,
    color: "white",
  },
  containerProfile: {
    // borderWidth: 1,
    // borderColor: "pink",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  containerBody: {
    width: "85%",
    height: 320,
    backgroundColor: "white",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  containerContact: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  textContact: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  containerEmail: {
    justifyContent: "center",
    alignItems: "center",
  },
  containerPhoneNumber: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContactType: {
    fontFamily: "Montserrat-Italic",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
  },
  containerInterests: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
  },
  containerInterest: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
  containerButton: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  containerAcceptDecline: {
    flexDirection: "row",
  },
  button: {
    marginHorizontal: 16,
  },
});

export default FriendProfileScreen;
