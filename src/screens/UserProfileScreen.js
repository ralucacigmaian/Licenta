import { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Colors } from "../utils/colors";
import { firebase } from "app/config.js";
import { addImage, getImageURL } from "../database/database";
import Icon, { Icons } from "../components/Icons";
import * as ImagePicker from "expo-image-picker";
import Option from "../components/Option";
import { UserContext } from "../context/AuthContext";

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
    authenticatedUser.logout;
    firebase.auth().signOut();
  };

  return (
    <View style={styles.container}>
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
              />
              {/* <Option information="Ajutor" /> */}
              <Option
                type={Icons.Octicons}
                name="question"
                information="Despre"
              />
              <Option
                type={Icons.MaterialCommunityIcons}
                name="alert-circle-outline"
                information="Raportează o problemă"
              />
              <Option
                type={Icons.AntDesign}
                name="delete"
                information="Ștergere cont"
              />
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
});

export default UserProfileScreen;
