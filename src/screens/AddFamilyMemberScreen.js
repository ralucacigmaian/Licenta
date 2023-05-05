import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  SafeAreaView,
} from "react-native";
import { Colors } from "../utils/colors";
import { useState, useCallback, useRef } from "react";
import Icon, { Icons } from "../components/Icons";
import Input from "../components/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "../components/Button";
import { SelectList } from "react-native-dropdown-select-list";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";

function AddFamilyMemberScreen({ navigation }) {
  const GENDER = {
    MALE: "MALE",
    FEMALE: "FEMALE",
  };

  const [gender, setGender] = useState(GENDER.FEMALE);
  const [name, setName] = useState();
  const [birthday, setBirthday] = useState("Introduceți data nașterii");
  const [birthdayToAdd, setBirthdayToAdd] = useState();
  const [selectFamilyRelation, setSelectFamilyRelation] = useState();
  const [photo, setPhoto] = useState();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const changeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);

    let auxDate = new Date(currentDate);

    const moment = require("moment");
    require("moment/locale/ro");

    let newDate =
      auxDate.getDate() +
      " " +
      moment(auxDate).local("ro").format("MMMM") +
      " " +
      auxDate.getFullYear();

    setBirthday(newDate);
    setBirthdayToAdd(auxDate);

    console.log(auxDate);
    console.log(newDate);

    // console.log(birthday);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const dataList = [
    { key: "1", value: "Mamă" },
    { key: "2", value: "Tată" },
    { key: "3", value: "Soră" },
    { key: "4", value: "Frate" },
    { key: "5", value: "Bunică" },
    { key: "6", value: "Bunic" },
  ];

  const sheetRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ["50%", "90%"];

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);

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

  return (
    <>
      <SafeAreaView
        style={[
          styles.container,
          {
            opacity: isOpen ? 1 : null,
            backgroundColor: isOpen ? Colors.colors.gray : "white",
          },
        ]}
      >
        <View style={styles.containerHeader}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.containerGoBack}
          >
            <Icon type={Icons.Ionicons} name="ios-chevron-back" size={32} />
          </Pressable>
          <Text style={styles.textFirst}>Adaugă un membru al familiei</Text>
        </View>
        <Text style={styles.textHeader}>
          Completează următorul formular pentru a adăuga date despre un membru
          al familiei
        </Text>
        <View
          style={[
            styles.containerForm,
            {
              backgroundColor: isOpen
                ? null
                : Colors.colors.cardBackgroundColor,
            },
          ]}
        >
          <View style={styles.containerGender}>
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
          <View style={styles.containerInputs}>
            <Input
              label="Nume"
              placeholder="Introduceți numele"
              placeholderTextColor={
                isOpen ? Colors.colors.darkDustyPurple : Colors.colors.gray
              }
              color={Colors.colors.darkDustyPurple}
              backgroundColor={isOpen ? Colors.colors.gray : "white"}
              backgroundColorTooltip={Colors.colors.darkDustyPurple}
              borderColor={Colors.colors.darkDustyPurple}
              iconName="ios-person"
              iconError="ios-alert-circle"
              iconSize={24}
              iconColor={Colors.colors.darkDustyPurple}
              style={{ fontFamily: "Montserrat-Regular" }}
            />
            <Input
              label="Data nașterii"
              placeholder={birthday}
              placeholderTextColor={
                isOpen ? Colors.colors.darkDustyPurple : Colors.colors.gray
              }
              color={Colors.colors.darkDustyPurple}
              backgroundColor={isOpen ? Colors.colors.gray : "white"}
              backgroundColorTooltip={Colors.colors.darkDustyPurple}
              borderColor={Colors.colors.darkDustyPurple}
              iconName="ios-calendar"
              iconError="ios-alert-circle"
              iconSize={24}
              iconColor={Colors.colors.darkDustyPurple}
              style={{ fontFamily: "Montserrat-Regular" }}
              // error={errors.birthday}
              // onFocus={() => {
              //   handleError(null, "birthday");
              // }}
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
            <View style={styles.containerDropDown}>
              <Text style={styles.textDropDown}>Gradul de rudenie</Text>
              <SelectList
                setSelected={setSelectFamilyRelation}
                data={dataList}
                fontFamily="Montserrat-Regular"
                search={false}
                placeholder="Selectați gradul de rudenie"
                boxStyles={{
                  backgroundColor: isOpen ? Colors.colors.gray : "white",
                  borderColor: Colors.colors.darkDustyPurple,
                }}
                inputStyles={{
                  color: isOpen
                    ? Colors.colors.darkDustyPurple
                    : Colors.colors.gray,
                }}
                dropdownStyles={{ backgroundColor: "white" }}
                dropdownTextStyles={{ color: Colors.colors.darkDustyPurple }}
              />
            </View>
            <View style={styles.containerInterests}>
              <Text style={styles.textInterests}>Interesele</Text>
              <Pressable onPress={() => setIsOpen(true)}>
                <View
                  style={[
                    styles.containerButton,
                    { backgroundColor: isOpen ? Colors.colors.gray : "white" },
                  ]}
                >
                  <View style={styles.containerIcon}>
                    <Icon
                      type={Icons.Ionicons}
                      name="ios-book"
                      size={24}
                      color={Colors.colors.darkDustyPurple}
                    />
                  </View>

                  <Text
                    style={[
                      styles.textButton,
                      {
                        color: isOpen
                          ? Colors.colors.darkDustyPurple
                          : Colors.colors.gray,
                      },
                    ]}
                  >
                    Selectați interesele
                  </Text>
                </View>
              </Pressable>
            </View>
            <Input
              label="Profile Picture"
              placeholder={
                !photo
                  ? "Select your friend's photo"
                  : "Image uploaded successfully!"
              }
              placeholderTextColor={
                isOpen ? Colors.colors.darkDustyPurple : Colors.colors.gray
              }
              color={Colors.colors.darkDustyPurple}
              backgroundColor={isOpen ? Colors.colors.gray : "white"}
              backgroundColorTooltip={Colors.colors.darkDustyPurple}
              borderColor={Colors.colors.darkDustyPurple}
              iconName="ios-images"
              iconError="ios-alert-circle"
              iconSize={24}
              iconColor={Colors.colors.darkDustyPurple}
              style={{
                fontFamily: "Montserrat-Regular",
              }}
              // error={errors.photo}
              // onFocus={() => {
              //   handleError(null, "photo");
              // }}
              onPressIn={handleSelectImage}
              // caretHidden={true}
            />
          </View>
        </View>
      </SafeAreaView>
      {isOpen ? (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => setIsOpen(false)}
        >
          <BottomSheetView>
            <Text>Hello</Text>
          </BottomSheetView>
        </BottomSheet>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
    alignItems: "center",
  },
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  containerGoBack: {
    position: "absolute",
    left: -50,
  },
  textFirst: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
  },
  textHeader: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
  containerForm: {
    width: "90%",
    height: "80%",
    marginTop: 16,
    borderRadius: 10,
    // flex: 1,
    // backgroundColor: Colors.colors.cardBackgroundColor,
  },
  containerGender: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 8,
  },
  containerInputs: {
    justifyContent: "center",
    alignItems: "center",
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
  containerDropDown: {
    width: 280,
  },
  textDropDown: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    marginBottom: 4,
  },
  containerInterests: {
    marginTop: 16,
    width: 280,
  },
  textInterests: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  containerButton: {
    marginTop: 4,
  },
  containerModal: {
    flex: 1,
    backgroundColor: "white",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
  },
  containerButton: {
    width: 280,
    height: 45,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: Colors.colors.darkDustyPurple,
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 4,
  },
  containerIcon: {
    marginLeft: 15,
    marginRight: 5,
  },
  textButton: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
  },
});

export default AddFamilyMemberScreen;
