import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable,
  Platform,
  ScrollView,
  Image,
  YellowBox,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors } from "../utils/colors";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Interest from "../components/Interest";
import { useContext, useEffect, useState } from "react";
import Icon, { Icons } from "../components/Icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Interests } from "../utils/interests";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import {
  addFriend,
  addImage,
  getUsersFriend,
  deleteFriend,
  editImage,
  editFriend,
} from "../database/database";
import { UserContext } from "../context/AuthContext";
import { async } from "@firebase/util";

function DisplayFriendsScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const GENDER = {
    MALE: "MALE",
    FEMALE: "FEMALE",
  };

  // Inputs

  const [gender, setGender] = useState(GENDER.FEMALE);
  const [name, setName] = useState(null);
  const [birthday, setBirthday] = useState("Select your friend's birthday");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [photo, setPhoto] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const authenticatedUser = useContext(UserContext);
  let userId = authenticatedUser.uid;

  console.log(userId);

  // Error Handling

  const [errors, setErrors] = useState({});

  const handleOnChangeName = (text, input) => {
    setName((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  // Show Date Picker

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const changeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);

    let auxDate = new Date(currentDate);

    let newDate =
      auxDate.getDate() +
      " " +
      moment(auxDate).format("MMMM") +
      " " +
      auxDate.getFullYear();

    setBirthday(newDate);

    console.log(newDate);

    // console.log(birthday);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  // Handle Select Interests

  const handleSelectInterests = (id) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // Handle Select Image

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

  // Handle Submit Form

  const [numberOfFriends, setNumberOfFriends] = useState(0);

  let valid;

  const submitForm = async () => {
    valid = true;

    if (!name) {
      valid = false;
      handleError("Please input your friend's name!", "name");
    }
    if (birthday === "Select your friend's birthday") {
      valid = false;
      handleError("Please input your friend's birthday!", "birthday");
    }
    if (selectedInterests.length < 5) {
      valid = false;
      handleError("Please select at least 5 interests", "interest");
      setSubmitted(true);
    }
    if (!photo) {
      valid = false;
      handleError("Please select your friend's picture!", "photo");
    }

    // console.log(photo);

    if (valid) {
      try {
        const response = await addFriend(
          userId,
          gender,
          name,
          birthday,
          selectedInterests
        );
        const imagePath = `friends/${userId}/${response}.jpeg`;
        const responseImage = await addImage(photo, imagePath);
        setNumberOfFriends(numberOfFriends + 1);
      } catch (error) {
        console.log(error);
      }
      setGender(GENDER.FEMALE);
      setName("");
      setBirthday("Select your friend's birthday");
      setSelectedInterests([]);
      setPhoto(null);
      setSubmitted(false);
      setErrors({});
      setModalVisible(false);
    }
  };

  // Retrieve information from database

  const [retrievedArray, setRetrievedArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsArray = await getUsersFriend(userId);
      setRetrievedArray(friendsArray);
      setLoading(false);
    };
    fetchFriends();
  }, [userId, numberOfFriends]);

  // View Friend Profile

  const [modalProfileVisible, setModalProfileVisible] = useState(false);
  const [currentFriendId, setCurrentFriendId] = useState(null);
  const [currentFriend, setCurrentFriend] = useState(null);

  const handleViewProfile = (friendId) => {
    setModalProfileVisible(true);
    setCurrentFriendId(friendId);
    setCurrentFriend(
      retrievedArray.find((currentFriend) => currentFriend.key === friendId)
    );
  };
  // console.log(currentFriend);

  // Delete information from database

  const handleDeleteFriend = (friendId) => {
    let formattedPathToDelete = `friends/${userId}/${friendId}.jpeg`;
    deleteFriend(userId, friendId, formattedPathToDelete)
      .then(() => {
        console.log(`Friend ${friendId} was deleted successfully!`);
        setNumberOfFriends(numberOfFriends - 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Edit information from database

  const [modalEditProfileVisible, setModalEditProfileVisible] = useState(false);
  const [editSelectedInterests, setEditSelectedInterests] = useState([]);
  const [newInterests, setNewInterests] = useState([]);
  let aux = [];

  const handleEditProfile = (friendId) => {
    setModalEditProfileVisible(true);
    setCurrentFriendId(friendId);
    setCurrentFriend(
      retrievedArray.find((currentFriend) => currentFriend.key === friendId)
    );
  };

  useEffect(() => {
    if (selectedFriendId) {
      setCurrentFriend(
        retrievedArray.find(
          (currentFriend) => currentFriend.key === selectedFriendId
        )
      );
      if (currentFriend) {
        setEditSelectedInterests(currentFriend.interests);
        setNewInterests(currentFriend.interests);
      }
    }
    console.log(selectedFriendId);
    // console.log(currentFriend.interests);
  }, [selectedFriendId]);

  const handleEditSelectedInterests = (id) => {
    if (newInterests.includes(id)) {
      setNewInterests(newInterests.filter((i) => i !== id));
    } else {
      setNewInterests([...newInterests, id]);
    }
  };

  const submitEditProfile = async () => {
    try {
      const newImagePath = `friends/${userId}/${currentFriendId}.jpeg`;
      if (photo) {
        const response = await addImage(photo, newImagePath);
      }
      if (newInterests.length >= 5) {
        const reponnseInterests = await editFriend(userId, selectedFriendId, {
          gender: currentFriend.gender,
          name: currentFriend.name.name,
          birthday: currentFriend.birthday,
          interests: newInterests,
        });
      }
      setNumberOfFriends((prevNumber) => prevNumber + 1);
      setModalEditProfileVisible(false);
      setPhoto();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView bounces={false} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Modal visible={modalVisible} transparent={true} animationType="fade">
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalView}>
                <View style={styles.form}>
                  <Text style={styles.textDescription}>
                    Add information about your friend
                  </Text>
                  <View style={styles.sexPicker}>
                    <View style={styles.female}>
                      <Pressable onPress={() => setGender(GENDER.FEMALE)}>
                        <Icon
                          type={Icons.Ionicons}
                          name="female"
                          size={40}
                          color={
                            gender === GENDER.FEMALE
                              ? Colors.colors.darkDustyPurple
                              : Colors.colors.dustyPurple
                          }
                        />
                      </Pressable>
                    </View>
                    <View style={styles.male}>
                      <Pressable onPress={() => setGender(GENDER.MALE)}>
                        <Icon
                          type={Icons.Ionicons}
                          name="male"
                          size={40}
                          color={
                            gender === GENDER.MALE
                              ? Colors.colors.darkDustyPurple
                              : Colors.colors.dustyPurple
                          }
                        />
                      </Pressable>
                    </View>
                  </View>
                  <Input
                    label="Name"
                    placeholder="Enter your friend's name"
                    placeholderTextColor={Colors.colors.gray}
                    color={Colors.colors.darkDustyPurple}
                    backgroundColor="white"
                    backgroundColorTooltip={Colors.colors.darkDustyPurple}
                    borderColor={Colors.colors.darkDustyPurple}
                    iconName="ios-person"
                    iconError="ios-alert-circle"
                    iconSize={24}
                    iconColor={Colors.colors.darkDustyPurple}
                    style={{ fontFamily: "Montserrat-Regular" }}
                    onChangeText={(text) => handleOnChangeName(text, "name")}
                    error={errors.name}
                    onFocus={() => {
                      handleError(null, "name");
                    }}
                  />
                  <Input
                    label="Birthday"
                    placeholder={birthday}
                    placeholderTextColor={Colors.colors.gray}
                    color={Colors.colors.darkDustyPurple}
                    backgroundColor="white"
                    backgroundColorTooltip={Colors.colors.darkDustyPurple}
                    borderColor={Colors.colors.darkDustyPurple}
                    iconName="ios-calendar"
                    iconError="ios-alert-circle"
                    iconSize={24}
                    iconColor={Colors.colors.darkDustyPurple}
                    style={{ fontFamily: "Montserrat-Regular" }}
                    error={errors.birthday}
                    onFocus={() => {
                      handleError(null, "birthday");
                    }}
                    onPressIn={toggleDatePicker}
                    caretHidden={true}
                  />
                  {showDatePicker && (
                    <Modal
                      visible={showDatePicker}
                      onRequestClose={() => setShowDatePicker(false)}
                      transparent={true}
                      animationType="slide"
                    >
                      <View style={styles.calendar}>
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={date}
                          mode="date"
                          is24Hour={true}
                          display="spinner"
                          onChange={changeDate}
                          textColor={Colors.colors.darkDustyPurple}
                          accentColor={Colors.colors.darkDustyPurple}
                        />
                        <View style={styles.submitDateButton}>
                          <Button
                            onPress={() => setShowDatePicker(false)}
                            color="white"
                            backgroundColor={Colors.colors.darkDustyPurple}
                            width={200}
                          >
                            Submit
                          </Button>
                        </View>
                      </View>
                    </Modal>
                  )}
                  <View style={styles.interestsTextContainer}>
                    <Text style={styles.textInterests}>
                      Pick your friend's interests
                    </Text>
                    {submitted && selectedInterests.length < 5 ? (
                      <Text style={styles.errorInterests}>
                        Select at least 5 interests
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.horizontalContainer}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={styles.interestsContainer}
                    >
                      {Interests.slice(0, 9).map((x) => (
                        <View style={styles.interest}>
                          <Interest
                            key={x.id}
                            onPress={() => handleSelectInterests(x.id)}
                            active={selectedInterests.includes(x.id)}
                          >
                            {x.title}
                          </Interest>
                        </View>
                      ))}
                    </ScrollView>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={styles.interestsContainer}
                    >
                      {Interests.slice(9, 19).map((x) => (
                        <View style={styles.interest}>
                          <Interest
                            key={x.id}
                            onPress={() => handleSelectInterests(x.id)}
                            active={selectedInterests.includes(x.id)}
                          >
                            {x.title}
                          </Interest>
                        </View>
                      ))}
                    </ScrollView>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={styles.interestsContainer}
                    >
                      {Interests.slice(19, 29).map((x) => (
                        <View style={styles.interest}>
                          <Interest
                            key={x.id}
                            onPress={() => handleSelectInterests(x.id)}
                            active={selectedInterests.includes(x.id)}
                          >
                            {x.title}
                          </Interest>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>
                <View style={styles.imageContainer}>
                  <Input
                    label="Profile Picture"
                    placeholder={
                      !photo
                        ? "Select your friend's photo"
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
                <View style={styles.buttonContainer}>
                  <Button
                    backgroundColor={Colors.colors.darkDustyPurple}
                    color="white"
                    width={200}
                    onPress={submitForm}
                  >
                    Submit
                  </Button>
                </View>
              </View>
            </SafeAreaView>
          </Modal>
          {currentFriendId ? (
            <Modal
              visible={modalProfileVisible}
              transparent={true}
              animationType="fade"
            >
              <SafeAreaView style={styles.modalContainer}>
                <Pressable onPress={() => setModalProfileVisible(false)}>
                  <View style={styles.modalViewProfile}>
                    <View style={styles.profileImageContainer}>
                      <Image
                        source={{ uri: currentFriend.image }}
                        style={styles.profileImage}
                      />
                    </View>
                    <View style={styles.profileNameContainer}>
                      <Text style={styles.textProfileName}>
                        {currentFriend.name}
                      </Text>
                    </View>
                    <View style={styles.profileInformationContainer}>
                      <View style={styles.profileInformation}>
                        <Text style={styles.textInformation}>
                          {currentFriend.birthday}
                        </Text>
                        <Text style={styles.textDescriptionInformation}>
                          Birthday
                        </Text>
                      </View>
                      <View style={styles.profileInformation}>
                        <Text
                          style={[
                            styles.textInformation,
                            { textTransform: "capitalize" },
                          ]}
                        >
                          {currentFriend.gender}
                        </Text>
                        <Text style={styles.textDescriptionInformation}>
                          Gender
                        </Text>
                      </View>
                    </View>
                    <View style={styles.profileInterestsContainer}>
                      {currentFriend.interests.map((x) => {
                        const interestObj = Interests.find(
                          (obj) => obj.id === x
                        );
                        return (
                          <View style={styles.profileInterest}>
                            <Interest
                              key={interestObj.id}
                              style={styles.textInterest}
                              active={true}
                            >
                              {interestObj.title}
                            </Interest>
                          </View>
                        );
                      })}
                    </View>
                    {/* <Button onPress={() => setModalProfileVisible(false)}>
                    close
                  </Button> */}
                  </View>
                </Pressable>
              </SafeAreaView>
            </Modal>
          ) : null}
          {currentFriendId ? (
            <Modal
              visible={modalEditProfileVisible}
              transparent={true}
              animationType="fade"
            >
              <SafeAreaView style={styles.modalContainer}>
                <Pressable onPress={() => setModalEditProfileVisible(false)}>
                  <View style={styles.modalViewProfile}>
                    <View style={styles.profileImageContainer}>
                      <Image
                        source={{ uri: photo ? photo : currentFriend.image }}
                        style={styles.profileImage}
                      />
                      <Pressable onPress={() => handleSelectImage()}>
                        <View style={styles.editButtonContainer}>
                          <Icon
                            type={Icons.Feather}
                            name="edit-2"
                            size={18}
                            color="white"
                          />
                        </View>
                      </Pressable>
                    </View>
                    <View style={styles.profileNameContainer}>
                      <Text style={styles.textProfileName}>
                        {currentFriend.name}
                      </Text>
                    </View>
                    <View style={styles.profileInformationContainer}>
                      <View style={styles.profileInformation}>
                        <Text style={styles.textInformation}>
                          {currentFriend.birthday}
                        </Text>
                        <Text style={styles.textDescriptionInformation}>
                          Birthday
                        </Text>
                      </View>
                      <View style={styles.profileInformation}>
                        <Text
                          style={[
                            styles.textInformation,
                            { textTransform: "capitalize" },
                          ]}
                        >
                          {currentFriend.gender}
                        </Text>
                        <Text style={styles.textDescriptionInformation}>
                          Gender
                        </Text>
                      </View>
                    </View>
                    <View style={styles.editInterestsContainer}>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        // style={styles.interestsContainer}
                      >
                        {Interests.slice(0, 9).map((x) => (
                          <View style={styles.profileInterest}>
                            <Interest
                              key={x.id}
                              onPress={() => handleEditSelectedInterests(x.id)}
                              active={newInterests.includes(x.id)}
                              style={styles.textInterest}
                            >
                              {x.title}
                            </Interest>
                          </View>
                        ))}
                      </ScrollView>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        // style={styles.interestsContainer}
                      >
                        {Interests.slice(9, 19).map((x) => (
                          <View style={styles.profileInterest}>
                            <Interest
                              key={x.id}
                              onPress={() => handleEditSelectedInterests(x.id)}
                              active={newInterests.includes(x.id)}
                              style={styles.textInterest}
                            >
                              {x.title}
                            </Interest>
                          </View>
                        ))}
                      </ScrollView>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        // style={styles.interestsContainer}
                      >
                        {Interests.slice(19, 29).map((x) => (
                          <View style={styles.profileInterest}>
                            <Interest
                              key={x.id}
                              onPress={() => handleEditSelectedInterests(x.id)}
                              active={newInterests.includes(x.id)}
                              style={styles.textInterest}
                            >
                              {x.title}
                            </Interest>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                    {newInterests.length < 5 ? (
                      <Text style={styles.errorEditInterests}>
                        Select at least 5 interests
                      </Text>
                    ) : null}
                    <Button
                      onPress={submitEditProfile}
                      backgroundColor={Colors.colors.darkDustyPurple}
                      color="white"
                      width={200}
                    >
                      Edit
                    </Button>
                  </View>
                </Pressable>
              </SafeAreaView>
            </Modal>
          ) : null}
          <Button
            backgroundColor={Colors.colors.darkDustyPurple}
            color="white"
            width={200}
            onPress={() => setModalVisible(true)}
          >
            Add Event
          </Button>
        </View>
        {loading ? (
          <ActivityIndicator style={styles.loadingContainer} />
        ) : (
          retrievedArray.map((x) => {
            return (
              <View style={styles.cardsContainer}>
                <Card
                  id={x.key}
                  name={x.name}
                  date={x.birthday}
                  image={x.image}
                  onViewProfile={handleViewProfile}
                  onEdit={handleEditProfile}
                  onDelete={handleDeleteFriend}
                  onPress={setSelectedFriendId}
                />
              </View>
            );
          })
        )}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colors.backgroundColor,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardsContainer: {
    paddingTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.colors.transparent,
    justifyContent: "center",
  },
  modalView: {
    margin: 16,
    backgroundColor: Colors.colors.backgroundColor,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    // flexDirection: "column",
  },
  form: {
    // justifyContent: "center",
    // alignItems: "center",
  },
  textDescription: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    marginBottom: 8,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
  sexPicker: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  textBirthday: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    marginVertical: 5,
    color: Colors.colors.darkDustyPurple,
  },
  birthdayContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.colors.darkDustyPurple,
    height: 45,
    width: 280,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    zIndex: 1,
  },
  textDescriptionBirthday: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.gray,
    top: -20,
    left: 45,
  },
  date: {
    top: 4,
    left: -8,
  },
  calendar: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 0,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.colors.darkDustyPurple,
    width: "92%",
    // height: 360,
  },
  submitDateButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 16,
  },
  horizontalContainer: {
    height: 100,
    marginTop: 4,
    // flex: 0,
    // flexDirection: "column",
  },
  interestsTextContainer: {
    marginTop: 20,
  },
  interestsContainer: {
    // marginVertical: 8,
    // flexWrap: "wrap",
    flexDirection: "row",
    flex: 1,
    width: 280,
  },
  textInterests: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  errorInterests: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  interest: {
    // marginBottom: 4,
    marginRight: 4,
  },
  imageContainer: {
    width: 270,
  },
  textImageContainer: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    paddingBottom: 4,
    paddingTop: 16,
  },
  uploadContainer: {
    height: 45,
    borderColor: Colors.colors.darkDustyPurple,
    borderWidth: 1,
    borderRadius: 10,
  },
  textDescriptionImage: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.gray,
    top: -20,
    left: 45,
  },
  textDescriptionUploadedImage: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: Colors.colors.gray,
    top: -20,
    left: 45,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
  },
  buttonContainer: {
    paddingTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "red",
  },
  modalViewProfile: {
    flex: 0,
    margin: 16,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    // flexDirection: "column",
  },
  profileImageContainer: {
    height: 160,
    width: 160,
    borderRadius: 160,
    backgroundColor: "white",
    position: "absolute",
    alignSelf: "center",
    marginTop: -80,
  },
  profileImage: {
    height: 160,
    width: 160,
    borderRadius: 160,
  },
  profileNameContainer: {
    marginTop: 70,
  },
  textProfileName: {
    fontFamily: "Montserrat-Regular",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
  },
  profileInformationContainer: {
    backgroundColor: Colors.colors.cardBackgroundColor,
    height: 50,
    width: "70%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  profileInformation: {
    justifyContent: "center",
  },
  textInformation: {
    fontFamily: "Montserrat-ThinItalic",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
  textDescriptionInformation: {
    fontFamily: "Montserrat-Regular",
    fontSize: 10,
    textTransform: "uppercase",
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
  profileInterestsContainer: {
    backgroundColor: Colors.colors.cardBackgroundColor,
    width: "95%",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    flex: 0,
  },
  profileInterest: {
    margin: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  textInterest: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
  },
  editButtonContainer: {
    borderWidth: 1,
    borderColor: Colors.colors.cardBackgroundColor,
    backgroundColor: Colors.colors.darkDustyPurple,
    shadowColor: Colors.colors.gray,
    shadowOffset: 1,
    shadowOpacity: 1,
    height: 30,
    width: 30,
    borderRadius: 30,
    left: 110,
    top: -30,
    justifyContent: "center",
    alignItems: "center",
  },
  editInterestsContainer: {
    flex: 0,
    backgroundColor: Colors.colors.cardBackgroundColor,
    width: "95%",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  errorEditInterests: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    marginBottom: 8,
    color: Colors.colors.darkDustyPurple,
  },
});

export default DisplayFriendsScreen;
