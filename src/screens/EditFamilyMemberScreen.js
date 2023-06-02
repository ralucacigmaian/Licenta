import { useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../utils/colors";
import Input from "../components/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "../components/Button";
import { SelectList } from "react-native-dropdown-select-list";
import Icon, { Icons } from "../components/Icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Interests } from "../utils/interests";
import Interest from "../components/Interest";
import * as ImagePicker from "expo-image-picker";
import { addImage, editFamilyMember } from "../database/database";
import { showMessage } from "react-native-flash-message";

function EditFamilyMemberScreen({ route, navigation }) {
  const {
    name,
    image,
    birthday,
    familyRelation,
    phoneNumber,
    interests,
    idUser,
    idFamilyMember,
  } = route.params;

  const moment = require("moment");
  require("moment/locale/ro");

  let auxDate = new Date(birthday);

  let newDate =
    auxDate.getDate() +
    " " +
    moment(auxDate).local("ro").format("MMMM") +
    " " +
    auxDate.getFullYear();

  const [inputs, setInputs] = useState({
    name: name,
    phoneNumber: phoneNumber,
  });
  const [errors, setErrors] = useState({});
  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const [date, setDate] = useState(new Date());
  const [birthdate, setBirthdate] = useState(newDate);
  const [birthdateToAdd, setBirthdateToAdd] = useState();
  const [showPicker, setShowPicker] = useState(false);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
    } else {
      toggleDatePicker();
    }
  };

  const confirmDate = () => {
    const moment = require("moment");
    require("moment/locale/ro");

    let auxDate = new Date(date);

    let newDate =
      auxDate.getDate() +
      " " +
      moment(auxDate).local("ro").format("MMMM") +
      " " +
      auxDate.getFullYear();

    console.log(newDate);

    setBirthdate(newDate);
    setBirthdateToAdd(auxDate);

    toggleDatePicker();
  };

  const [selectFamilyRelation, setSelectFamilyRelation] = useState();
  const [errorFamilyRelation, setErrorFamilyRelation] = useState(false);
  const dataList = [
    { key: "Mamă", value: "       Mamă" },
    { key: "Tată", value: "       Tată" },
    { key: "Soră", value: "       Soră" },
    { key: "Frate", value: "       Frate" },
    { key: "Bunică", value: "       Bunică" },
    { key: "Bunic", value: "       Bunic" },
  ];

  const selectedFamilyRelation = dataList.find((x) => x.key === familyRelation);

  const bottomSheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = useMemo(() => ["55%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
    setIsOpen(true);
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const [selectedInterests, setSelectedInterests] = useState(interests);

  const handleSelectInterests = (id) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const [photo, setPhoto] = useState(image);

  const handleSelectImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissions.granted === false) {
      alert(
        "Nu ai acordat permisiune aplicației să îți acceseze galeria dispozitivului!"
      );
    }

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

  const submitEditFamilyMember = async () => {
    let valid = true;

    if (!inputs.name) {
      valid = false;
      handleError("Vă rugăm să introduceți numele!", "name");
    }

    if (!inputs.phoneNumber) {
      valid = false;
      handleError("Vă rugăm să introduceți numărul de telefon!", "phoneNumber");
    } else if (inputs.phoneNumber.length !== 10) {
      valid = false;
      handleError(
        "Vă rugăm să introduceți un număr de telefon valid!",
        "phoneNumber"
      );
    }

    if (selectedInterests.length === 0) {
      valid = false;
      handleError("Vă rugăm să selectați interesele!", "interests");
    }

    if (selectedInterests.length < 5) {
      valid = false;
      handleError("Vă rugăm să selectați cel puțin 5 interese!", "interests");
    }

    if (valid) {
      try {
        const imagePath = `familyMembers/${idUser}/${idFamilyMember}.jpeg`;
        const responseImage = await addImage(photo, imagePath);
        const responseData = await editFamilyMember(idUser, idFamilyMember, {
          birthday: birthdateToAdd,
          familyRelation: familyRelation,
          interests: selectedInterests,
          name: inputs.name,
          phoneNumber: inputs.phoneNumber,
        });
      } catch (error) {
        console.log(error);
      }
      navigation.navigate("ContactList");
      showMessage({
        message: `Membrul familiei ${name} a fost editat cu succes!`,
        icon: "info",
        style: { backgroundColor: Colors.colors.darkDustyPurple },
        titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
        textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.containerForm}>
        <Text style={styles.textEdit}>
          Completează următorul formular pentru a edita datele despre membrul
          familiei
        </Text>
        <View style={styles.containerImage}>
          <Image source={{ uri: photo }} style={styles.image} />
          <Pressable onPress={() => handleSelectImage()}>
            <View style={styles.containerIcon}>
              <Icon
                type={Icons.MaterialIcons}
                name="add-to-photos"
                size={20}
                color="white"
              />
            </View>
          </Pressable>
        </View>
        <View style={styles.containerInformation}>
          <Input
            value={inputs.name}
            label="Nume"
            placeholder="Introduceți numele"
            placeholderTextColor={Colors.colors.gray}
            color={Colors.colors.darkDustyPurple}
            backgroundColor="white"
            backgroundColorTooltip={Colors.colors.darkDustyPurple}
            borderColor={Colors.colors.darkDustyPurple}
            iconName="ios-person-circle"
            iconError="ios-alert-circle"
            iconSize={28}
            iconColor={Colors.colors.darkDustyPurple}
            style={{
              fontFamily: "Montserrat-Regular",
              color: Colors.colors.gray,
            }}
            onChangeText={(text) => handleOnChange(text, "name")}
            error={errors.name}
            onFocus={() => {
              handleError(null, "name");
            }}
          />
          <Input
            label="Date nașterii"
            placeholder={birthdate}
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
            caretHidden={true}
            onPressIn={toggleDatePicker}
          />
          {showPicker && (
            <View>
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                style={styles.containerDatePicker}
                maximumDate={new Date()}
                textColor={Colors.colors.darkDustyPurple}
              />
              <View style={styles.containerButtons}>
                <Button
                  backgroundColor="white"
                  color={Colors.colors.darkDustyPurple}
                  width={100}
                  borderRadius={30}
                  fontFamily="Montserrat-SemiBold"
                  fontSize={14}
                  onPress={toggleDatePicker}
                  shadowOpacity={0.5}
                >
                  Anulează
                </Button>
                <Button
                  backgroundColor={Colors.colors.darkDustyPurple}
                  color="white"
                  width={100}
                  borderRadius={30}
                  fontFamily="Montserrat-SemiBold"
                  fontSize={14}
                  onPress={confirmDate}
                  shadowOpacity={0.5}
                >
                  Confirmă
                </Button>
              </View>
            </View>
          )}
          <View style={styles.containerDropDown}>
            <Text style={styles.textDropDown}>Gradul de rudenie</Text>
            <SelectList
              defaultOption={selectedFamilyRelation}
              setSelected={setSelectFamilyRelation}
              data={dataList}
              fontFamily="Montserrat-Regular"
              search={false}
              placeholder="       Selectați gradul de rudenie"
              boxStyles={{
                backgroundColor: "white",
                borderColor: errorFamilyRelation
                  ? "red"
                  : Colors.colors.grayBorder,
              }}
              inputStyles={{
                color: Colors.colors.gray,
              }}
              dropdownStyles={{ backgroundColor: "white" }}
              dropdownTextStyles={{ color: Colors.colors.darkDustyPurple }}
              arrowicon={
                <View
                  style={{
                    left: -222,
                  }}
                >
                  <Icon
                    type={Icons.MaterialCommunityIcons}
                    name="account-heart"
                    size={19}
                    color={Colors.colors.darkDustyPurple}
                  />
                </View>
              }
              onSelect={() => console.log(selectFamilyRelation)}
            />
          </View>
          <Input
            value={inputs.phoneNumber}
            label="Numărul de telefon"
            placeholder="Introduceți numărul de telefon"
            placeholderTextColor={Colors.colors.gray}
            color={Colors.colors.darkDustyPurple}
            backgroundColor="white"
            backgroundColorTooltip={Colors.colors.darkDustyPurple}
            borderColor={Colors.colors.darkDustyPurple}
            iconName="ios-call"
            iconError="ios-alert-circle"
            iconSize={24}
            iconColor={Colors.colors.darkDustyPurple}
            style={{
              fontFamily: "Montserrat-Regular",
              color: Colors.colors.gray,
            }}
            keyboarType="phone-pad"
            onChangeText={(text) => handleOnChange(text, "phoneNumber")}
            error={errors.phoneNumber}
            onFocus={() => {
              handleError(null, "phoneNumber");
            }}
          />
          <View style={styles.containerInterests}>
            <Input
              label="Interese"
              placeholder="Selectați interesele"
              placeholderTextColor={Colors.colors.gray}
              color={Colors.colors.darkDustyPurple}
              backgroundColor="white"
              backgroundColorTooltip={Colors.colors.darkDustyPurple}
              borderColor={Colors.colors.darkDustyPurple}
              iconName="ios-book"
              iconError="ios-alert-circle"
              iconSize={24}
              iconColor={Colors.colors.darkDustyPurple}
              style={{ fontFamily: "Montserrat-Regular" }}
              error={errors.interests}
              onFocus={() => {
                handleError(null, "interests");
              }}
              onPressIn={handlePresentModalPress}
              caretHidden={true}
            />
          </View>
          <View style={styles.containerButton}>
            <Button
              onPress={submitEditFamilyMember}
              backgroundColor={Colors.colors.darkDustyPurple}
              color="white"
              width={280}
              borderRadius={10}
              fontFamily="Montserrat-SemiBold"
              fontSize={16}
              shadowOpacity={0.5}
            >
              Editează
            </Button>
          </View>
        </View>
      </View>
      {isOpen ? (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          onClose={() => setIsOpen(false)}
          style={styles.shadow}
        >
          <View style={styles.containerBottomSheet}>
            <Text style={styles.textBottomSheet}>
              Selectați cel puțin 5 interese
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: 16,
                justifyContent: "center",
              }}
            >
              {Interests.map((x) => (
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
            </View>
          </View>
        </BottomSheet>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  containerForm: {
    width: "90%",
    backgroundColor: Colors.colors.cardBackgroundColor,
    borderRadius: 10,
  },
  textEdit: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
    marginTop: 16,
    marginHorizontal: 16,
  },
  containerImage: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 130,
  },
  containerInformation: {
    marginTop: -32,
    justifyContent: "center",
    alignItems: "center",
  },
  containerDatePicker: {
    height: 120,
    width: 280,
  },
  containerButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  containerDropDown: {
    width: 280,
    marginBottom: 8,
  },
  textDropDown: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    marginBottom: 4,
  },
  containerBottomSheet: {
    justifyContent: "center",
    alignItems: "center",
  },
  textBottomSheet: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    color: Colors.colors.darkDustyPurple,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  interest: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
  containerInterests: {
    marginTop: -8,
  },
  containerButton: {
    marginTop: 4,
    marginBottom: 16,
  },
  containerIcon: {
    borderWidth: 1,
    borderColor: Colors.colors.cardBackgroundColor,
    backgroundColor: Colors.colors.darkDustyPurple,
    shadowColor: Colors.colors.gray,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    height: 40,
    width: 40,
    borderRadius: 30,
    bottom: 40,
    left: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditFamilyMemberScreen;
