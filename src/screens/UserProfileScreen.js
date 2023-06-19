import { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  Modal,
  SafeAreaView,
  TextInput,
  Switch,
} from "react-native";
import { Colors } from "../utils/colors";
import { firebase } from "app/config.js";
import {
  addImage,
  editNotification,
  editNotificationEvent,
  editNotificationFamilyMember,
  getImageURL,
} from "../database/database";
import Icon, { Icons } from "../components/Icons";
import * as ImagePicker from "expo-image-picker";
import Option from "../components/Option";
import { UserContext } from "../context/AuthContext";
import * as MailComposer from "expo-mail-composer";
import Button from "../components/Button";
import { showMessage } from "react-native-flash-message";
import { useFocusEffect } from "@react-navigation/native";
import { getUsersNotification } from "../database/database";

function UserProfileScreen({ navigation, route }) {
  const { userId } = route.params;
  const [userDetails, setUserDetails] = useState();
  const [userPhoto, setUserPhoto] = useState();
  const authenticatedUser = useContext(UserContext);

  const editPhoto = async (photo, id) => {
    const newPhotoPath = `users/${userId}.jpeg`;
    const response = await addImage(photo, newPhotoPath);
  };

  const handleSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.canceled) {
      setUserPhoto(result.uri);
      editPhoto(result.uri, userId);
    }
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setUserDetails(snapshot.data());
        } else {
          console.log("User doesn't exist");
        }
      });
    const fetchUserPhoto = async (userId) => {
      const photoPath = `users/${userId}.jpeg`;
      const responsePhoto = await getImageURL(photoPath);
      setUserPhoto(responsePhoto);
    };
    fetchUserPhoto(userId);
  }, []);

  console.log(userDetails);

  const handleLogOut = () => {
    authenticatedUser.logout();
    firebase.auth().signOut();
  };

  const [notificationFriends, setNotificationFriends] = useState([]);
  const [notificationFamilyMembers, setNotificationFamilyMembers] = useState(
    []
  );
  const [notificationEvents, setNotificationEvents] = useState([]);
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);

  const [isSwitchFriendsOn, setIsSwitchFriendsOn] = useState();
  const [isSwitchFamilyMembersOn, setIsSwitchFamilyMembersOn] = useState();
  const [isSwitchEventsOn, setIsSwitchEventsOn] = useState();

  useFocusEffect(
    useCallback(() => {
      async function sendNotification() {
        try {
          let response = [];
          let auxFriendsArray = [];
          let auxFamilyMembersArray = [];
          let auxEventsArray = [];
          response = await getUsersNotification(authenticatedUser.uid);
          for (const key in response) {
            if (
              response[key].birthday !== null &&
              response[key].familyRelation === null &&
              response[key].name !== null &&
              response[key].eventDate === null &&
              response[key].eventLocation === null &&
              response[key].eventType === null &&
              response[key].name1 === null &&
              response[key].name2 === null &&
              response[key].toBeSent === 1
            ) {
              auxFriendsArray.push(response[key]);
              setNotificationFriends(auxFriendsArray);
            }
            if (
              response[key].birthday !== null &&
              response[key].familyRelation !== null &&
              response[key].name !== null &&
              response[key].eventDate === null &&
              response[key].eventLocation === null &&
              response[key].eventType === null &&
              response[key].name1 === null &&
              response[key].name2 === null &&
              response[key].toBeSent === 1
            ) {
              auxFamilyMembersArray.push(response[key]);
              setNotificationFamilyMembers(auxFamilyMembersArray);
            }
            if (
              (response[key].birthday === null &&
                response[key].familyRelation === null &&
                response[key].name === null &&
                response[key].eventDate !== null &&
                response[key].eventLocation !== null &&
                response[key].eventType !== null &&
                response[key].name1 !== null) ||
              (response[key].name2 !== null && response[key].toBeSent === 1)
            ) {
              auxEventsArray.push(response[key]);
              setNotificationEvents(auxEventsArray);
            }
          }
          return response;
        } catch (error) {
          console.log(error);
        }
      }

      sendNotification();
    }, [])
  );

  useEffect(() => {
    setIsSwitchFriendsOn(notificationFriends.length > 0);
  }, [notificationFriends]);

  useEffect(() => {
    setIsSwitchFamilyMembersOn(notificationFamilyMembers.length > 0);
  }, [notificationFamilyMembers]);

  useEffect(() => {
    setIsSwitchEventsOn(notificationEvents.length > 0);
  }, [notificationEvents]);

  const handleSwitchPressFriends = async () => {
    if (isSwitchFriendsOn) {
      setIsSwitchFriendsOn(false);
      const response = await editNotification(authenticatedUser.uid, 0);
    }
    if (!isSwitchFriendsOn) {
      setIsSwitchFriendsOn(true);
      const response = await editNotification(authenticatedUser.uid, 1);
    }
  };

  const handleSwitchPressFamilyMembers = async () => {
    if (isSwitchFamilyMembersOn) {
      setIsSwitchFamilyMembersOn(false);
      const response = await editNotificationFamilyMember(
        authenticatedUser.uid,
        0
      );
    }
    if (!isSwitchFamilyMembersOn) {
      setIsSwitchFamilyMembersOn(true);
      const response = await editNotificationFamilyMember(
        authenticatedUser.uid,
        1
      );
    }
  };

  const handleSwitchPressEvents = async () => {
    if (isSwitchEventsOn) {
      setIsSwitchEventsOn(false);
      const response = await editNotificationEvent(authenticatedUser.uid, 0);
    }
    if (!isSwitchEventsOn) {
      setIsSwitchEventsOn(true);
      const response = await editNotificationEvent(authenticatedUser.uid, 1);
    }
  };

  // console.log(notificationFriends);
  // console.log(notificationFamilyMembers);
  // console.log(notificationEvents);

  const handleNotificationIsOpen = () => {
    setNotificationIsOpen(true);
  };

  // const handleSwitchPressFriends = () => {
  //   if (notificationFriends.length > 0) {
  //     setIsSwitchFriendsOn(true);
  //   } else {
  //     setIsSwitchFriendsOn(false);
  //   }
  // };

  // const handleDeleteAccount = () => {
  //   Alert.alert(
  //     "Ștergere cont",
  //     "Sunteți sigur că doriți să ștergeți acest cont?",
  //     [
  //       {
  //         text: "Da",
  //         onPress: () => {
  //           const user = firebase.auth().currentUser;
  //           const userId = user.uid;
  //           user
  //             .delete()
  //             .then(() => {
  //               console.log("User account deleted.");
  //               firebase
  //                 .firestore()
  //                 .collection("users")
  //                 .doc(userId)
  //                 .delete()
  //                 .then(() => {
  //                   console.log("User document deleted.");
  //                   handleLogOut();
  //                 })
  //                 .catch((error) => {
  //                   console.log("Error deleting user document: ", error);
  //                 });
  //             })
  //             .catch((error) => {
  //               console.log("Error deleting user account: ", error);
  //             });
  //         },
  //       },
  //       {
  //         text: "Nu",
  //         style: "cancel",
  //       },
  //     ],
  //     { cancelable: false }
  //   );
  // };

  const [aboutIsOpen, setAboutIsOpen] = useState(false);
  const [problemReportIsOpen, setProblemReportIsOpen] = useState(false);

  const [isMailAvailable, setIsMailAvailable] = useState(false);

  useEffect(() => {
    const checkMailAvailability = async () => {
      const isAvailable = await MailComposer.isAvailableAsync();
      setIsMailAvailable(isAvailable);
    };

    checkMailAvailability();
  }, []);

  const handleAboutIsOpen = () => {
    setAboutIsOpen(true);
  };

  const handleProblemReportIsOpen = () => {
    if (isMailAvailable) {
      setProblemReportIsOpen(true);
    } else {
      showMessage({
        message:
          "Este necesară folosirea unui device fizic pentru a raporta o problemă!",
        icon: "info",
        style: { backgroundColor: Colors.colors.darkDustyPurple },
        titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
        textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
      });
    }
  };

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const sendMail = () => {
    let valid = true;

    if (!body) {
      valid = false;
      showMessage({
        message: "Vă rugăm să introduceți problema întâmpinată!",
        icon: "info",
        style: { backgroundColor: Colors.colors.darkDustyPurple },
        titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
        textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
      });
    }

    setSubject(`Problemă raportată de către ${userDetails.name}`);

    if (valid) {
      MailComposer.composeAsync({
        recipients: ["cigmaianraluca@yahoo.com"],
        subject: subject,
        body: body,
      }).then((result) => {
        if (result.status === "sent") {
          showMessage({
            message: "Problema a fost raportată cu succes!",
            icon: "info",
            style: { backgroundColor: Colors.colors.darkDustyPurple },
            titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
            textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
          });
          setProblemReportIsOpen(false);
        } else {
          showMessage({
            message: "A apărut o problema! Încearcă din nou!",
            icon: "info",
            style: { backgroundColor: Colors.colors.darkDustyPurple },
            titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
            textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
          });
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Modal visible={aboutIsOpen} transparent={true} animationType="fade">
        <SafeAreaView style={styles.containerModal}>
          <View style={styles.modalView}>
            <Pressable
              style={({ pressed }) => pressed && styles.pressed}
              onPress={() => setAboutIsOpen(false)}
            >
              <Icon
                type={Icons.Ionicons}
                name="ios-close"
                size={18}
                color={Colors.colors.gray}
              />
            </Pressable>
            <Text style={styles.textAbout}>
              Aplicația mobilă Celebrate Together pornește de la presupunerea că
              evenimentele importante din viața noastră, precum zilele de
              naștere, zilele onomastice ale familiei și ale prietenilor ar
              trebui marcate și păstrate în memoria noastră, alături de
              momentele cheie de pe parcursul vieții, totodată având ocazia de a
              dărui apropiaților noștri cele mai frumoase și personalizate
              cadouri bazate pe propriile interese. Datorită timpului limitat,
              există posibilitatea de a trece cu vederea peste evenimentele
              importante, lucru pe care aplicația Celebrate Together dorește
              să-l rezolve.
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
      <Modal
        visible={problemReportIsOpen}
        transparent={true}
        animationType="fade"
      >
        <SafeAreaView style={styles.containerModal}>
          <View style={styles.modalView}>
            <Pressable
              style={({ pressed }) => pressed && styles.pressed}
              onPress={() => setProblemReportIsOpen(false)}
            >
              <Icon
                type={Icons.Ionicons}
                name="ios-close"
                size={18}
                color={Colors.colors.gray}
              />
            </Pressable>
            <View style={styles.containerReportProblem}>
              <Text style={styles.textReportProblem}>
                Raportează problema întâmpinată
              </Text>
              <View style={styles.containerProblemInput}>
                <TextInput
                  placeholder="Descrie problema ta"
                  placeholderTextColor={Colors.colors.gray}
                  editable
                  multiline
                  numberOfLines={20}
                  style={{ fontFamily: "Montserrat-Regular", fontSize: 16 }}
                  onChangeText={setBody}
                />
              </View>
              <View style={styles.containerButtonProblem}>
                <Button
                  backgroundColor={Colors.colors.darkDustyPurple}
                  color="white"
                  width={200}
                  borderRadius={10}
                  fontFamily="Montserrat-SemiBold"
                  fontSize={16}
                  onPress={sendMail}
                >
                  Raportează
                </Button>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <Modal
        visible={notificationIsOpen}
        transparent={true}
        animationType="fade"
      >
        <SafeAreaView style={styles.containerModal}>
          <View style={styles.modalView}>
            <Pressable
              style={({ pressed }) => pressed && styles.pressed}
              onPress={() => setNotificationIsOpen(false)}
            >
              <Icon
                type={Icons.Ionicons}
                name="ios-close"
                size={18}
                color={Colors.colors.gray}
              />
            </Pressable>
            <View style={styles.containerTriggerNotifications}>
              <Text style={styles.textNotificationType}>
                Selectează tipul de notificari dorite
              </Text>
              <View style={styles.containerNotificationType}>
                <Text style={styles.textNotification}>
                  Notificări pentru zilele de naștere ale prietenilor
                </Text>
                <Switch
                  value={isSwitchFriendsOn}
                  onValueChange={handleSwitchPressFriends}
                  trackColor={{
                    false: Colors.colors.gray,
                    true: Colors.colors.darkDustyPurple,
                  }}
                />
              </View>
              <View style={styles.containerNotificationType}>
                <Text style={styles.textNotification}>
                  Notificări pentru zilele de naștere ale membriilor familiei
                </Text>
                <Switch
                  value={isSwitchFamilyMembersOn}
                  onValueChange={handleSwitchPressFamilyMembers}
                  trackColor={{
                    false: Colors.colors.gray,
                    true: Colors.colors.darkDustyPurple,
                  }}
                />
              </View>
              <View style={styles.containerNotificationTypeEvent}>
                <Text style={styles.textNotificationEvent}>
                  Notificări pentru evenimente
                </Text>
                <Switch
                  value={isSwitchEventsOn}
                  onValueChange={handleSwitchPressEvents}
                  trackColor={{
                    false: Colors.colors.gray,
                    true: Colors.colors.darkDustyPurple,
                  }}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <View style={styles.containerProfile}>
        <View style={styles.containerImage}>
          <Image source={{ uri: userPhoto }} style={styles.image} />
          <Pressable onPress={() => handleSelectImage()}>
            <View style={styles.editButtonContainer}>
              <Icon
                type={Icons.Feather}
                name="edit-2"
                size={20}
                color="white"
              />
            </View>
          </Pressable>
        </View>
        {userDetails ? (
          <View style={styles.containerDetails}>
            <Text style={styles.textUserName}>{userDetails.name}</Text>
            <Text style={styles.textEmail}>
              {userDetails.email} | {userDetails.phoneNumber}
            </Text>
            <View style={styles.containerOptions}>
              <Option
                type={Icons.Octicons}
                name="clock"
                information="Vezi istoricul cadourilor"
                onPress={() => navigation.navigate("Istoricul Cadourilor")}
              />
              <Option
                type={Icons.Octicons}
                name="bell"
                information="Notificări"
                onPress={handleNotificationIsOpen}
              />
              {/* <Option information="Ajutor" /> */}
              <Option
                type={Icons.Octicons}
                name="question"
                information="Despre"
                onPress={handleAboutIsOpen}
              />
              <Option
                type={Icons.MaterialCommunityIcons}
                name="alert-circle-outline"
                information="Raportează o problemă"
                onPress={handleProblemReportIsOpen}
              />
              {/* <Option
                type={Icons.AntDesign}
                name="delete"
                information="Ștergere cont"
                onPress={handleDeleteAccount}
              /> */}
            </View>
          </View>
        ) : null}
      </View>
      <Pressable
        onPress={handleLogOut}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.containerButtons}>
          <Icon
            type={Icons.MaterialIcons}
            name="logout"
            size={30}
            color={Colors.colors.darkDustyPurple}
          />
          <Text style={styles.textLogout}>Deconectare</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
    // justifyContent: "space-evenly",
    alignItems: "center",
    justifyContent: "space-around",
  },
  containerProfile: {
    height: "80%",
    width: "85%",
    backgroundColor: Colors.colors.cardBackgroundColor,
    borderRadius: 10,
    alignItems: "center",
    // top: -30,
  },
  containerImage: {
    marginTop: 16,
  },
  image: {
    height: 230,
    width: 230,
    borderRadius: 230,
  },
  containerDetails: {
    top: -16,
    justifyContent: "center",
    alignItems: "center",
  },
  textUserName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 24,
    color: Colors.colors.darkDustyPurple,
  },
  textEmail: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.dustyPurple,
  },
  editButtonContainer: {
    borderWidth: 1,
    borderColor: Colors.colors.cardBackgroundColor,
    backgroundColor: Colors.colors.darkDustyPurple,
    shadowColor: Colors.colors.gray,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    height: 40,
    width: 40,
    borderRadius: 30,
    left: 150,
    top: -35,
    justifyContent: "center",
    alignItems: "center",
  },
  containerOptions: {
    marginTop: 30,
    height: 300,
    justifyContent: "space-evenly",
  },
  containerButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.colors.lightDustyPurple,
    width: 150,
    height: 50,
    borderRadius: 10,
  },
  textLogout: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 15,
    color: Colors.colors.darkDustyPurple,
  },
  pressed: {
    opacity: 0.9,
  },
  containerModal: {
    flex: 1,
    backgroundColor: Colors.colors.transparent,
    justifyContent: "center",
  },
  modalView: {
    margin: 16,
    backgroundColor: Colors.colors.backgroundColor,
    borderRadius: 10,
    padding: 16,
    // alignItems: "center",
    // flexDirection: "column",
  },
  textAbout: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
    marginVertical: 16,
  },
  textReportProblem: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    color: Colors.colors.darkDustyPurple,
    marginVertical: 16,
    textAlign: "center",
  },
  containerProblemInput: {
    height: 100,
    backgroundColor: Colors.colors.cardBackgroundColor,
    borderRadius: 10,
    marginVertical: 16,
  },
  containerButtonProblem: {
    justifyContent: "center",
    alignItems: "center",
  },
  textNotificationType: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
  containerNotificationType: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  textNotification: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    marginRight: 8,
  },
  containerNotificationTypeEvent: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  textNotificationEvent: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    marginRight: 72,
  },
});

export default UserProfileScreen;
