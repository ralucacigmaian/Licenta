import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../utils/colors";
import { SelectList } from "react-native-dropdown-select-list";
import { useState, useEffect, useContext } from "react";
import Icon, { Icons } from "../components/Icons";
import Input from "../components/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "../components/Button";
import { editEvent } from "../database/database";
import { UserContext } from "../context/AuthContext";
import { showMessage } from "react-native-flash-message";

function EditEventScreen({ route, navigation }) {
  const {
    idEvent,
    eventType,
    name1,
    name2,
    eventDate,
    eventHour,
    eventLocation,
    locationName,
  } = route.params;

  const authenticatedUser = useContext(UserContext);

  const [selectEventType, setSelectEventType] = useState(eventType);
  const [errorEventType, setErrorEventType] = useState(false);
  const dataEventType = [
    { key: "Botez", value: "     Botez" },
    { key: "Majorat", value: "     Majorat" },
    { key: "Nuntă", value: "     Nuntă" },
  ];

  const selectedEventType = dataEventType.find((x) => x.key === eventType);

  const [date, setDate] = useState(new Date());
  const [eventDateToAdd, setEventDateToAdd] = useState();
  const [selectEventDate, setSelectEventDate] = useState(eventDate);
  const [selectEventHour, setSelectEventHour] = useState(eventHour);
  const [selectEventLocation, setSelectEventLocation] = useState(eventLocation);
  const [inputs, setInputs] = useState({
    name1: name1,
    name2: name2,
  });

  console.log(eventType);
  console.log(`name1: ${inputs.name1}, name2: ${inputs.name2}`);

  useEffect(() => {
    if (route.params) {
      setSelectEventLocation(locationName);
      console.log(`The eventLocation from EditEventScreen: ${locationName}`);
    }
  }, [route.params]);

  const [showPicker, setShowPicker] = useState(false);
  const [showHourPicker, setShowHourPicker] = useState(false);

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

    let newHour = `${auxDate.getHours() < 10 ? "0" : ""}${auxDate.getHours()}:${
      auxDate.getMinutes() < 10 ? "0" : ""
    }${auxDate.getMinutes()}`;

    console.log(newHour);

    if (showPicker) {
      toggleDatePicker();
      setSelectEventDate(newDate);
    }

    if (showHourPicker) {
      toggleHourPicker();
      setSelectEventHour(newHour);
    }

    setEventDateToAdd(auxDate);
  };

  const toggleHourPicker = () => {
    setShowHourPicker(!showHourPicker);
  };

  const [errors, setErrors] = useState({});
  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const submitEditEvent = async () => {
    let valid = true;

    if (selectEventType === "Botez") {
      if (!inputs.name1) {
        valid = false;
        handleError("Vă rugăm să introduceți numele!", "name1");
      }
    }

    if (selectEventType === "Majorat") {
      if (!inputs.name1) {
        valid = false;
        handleError("Vă rugăm să introduceți numele!", "name1");
      }
    }

    if (selectEventType === "Nuntă") {
      if (!inputs.name1) {
        valid = false;
        handleError("Vă rugăm să introduceți numele!", "name1");
      }
      if (!inputs.name2) {
        valid = false;
        handleError("Vă rugăm să introduceți numele!", "name2");
      }
    }

    if (selectEventType === "Botez" || selectEventType === "Majorat") {
      inputs.name2 = "";
    }

    if (valid) {
      try {
        const response = await editEvent(authenticatedUser.uid, idEvent, {
          eventType: selectEventType,
          name1: inputs.name1,
          name2: inputs.name2,
          eventDate: eventDateToAdd,
          eventHour: selectEventHour,
          eventLocation: selectEventLocation,
        });
      } catch (error) {
        console.log(error);
      }
      navigation.navigate("EventList");
      showMessage({
        message: "Evenimentul a fost editat cu succes!",
        icon: "info",
        style: { backgroundColor: Colors.colors.darkDustyPurple },
        titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
        textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerForm}>
        <Text style={styles.textEdit}>
          Completează următorul formular pentru a edita datele despre eveniment
        </Text>
        <View style={styles.containerInfomration}>
          <View style={styles.containerDropDown}>
            <Text style={styles.textDropDown}>Tipul evenimentului</Text>
            <SelectList
              defaultOption={selectedEventType}
              setSelected={setSelectEventType}
              data={dataEventType}
              fontFamily="Montserrat-Regular"
              search={false}
              placeholder="     Selectați tipul evenimentului"
              boxStyles={{
                backgroundColor: "white",
                borderColor: errorEventType ? "red" : Colors.colors.grayBorder,
              }}
              inputStyles={{
                color: Colors.colors.gray,
              }}
              dropdownStyles={{ backgroundColor: "white" }}
              dropdownTextStyles={{ color: Colors.colors.darkDustyPurple }}
              arrowicon={
                <View
                  style={{
                    left: -230,
                  }}
                >
                  <Icon
                    type={Icons.MaterialCommunityIcons}
                    name="party-popper"
                    size={19}
                    color={Colors.colors.darkDustyPurple}
                  />
                </View>
              }
              onSelect={() => console.log(eventType)}
            />
          </View>
          {selectEventType === "Botez" && (
            <Input
              value={inputs.name1}
              label="Numele botezatului"
              placeholder="Introduceți numele"
              backgroundColor="white"
              color={Colors.colors.darkDustyPurple}
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
              onChangeText={(text) => handleOnChange(text, "name1")}
              error={errors.name1}
              onFocus={() => {
                handleError(null, "name1");
              }}
            />
          )}
          {selectEventType === "Majorat" && (
            <Input
              value={inputs.name1}
              label="Numele sărbătoritului"
              placeholder="Introduceți numele"
              backgroundColor="white"
              color={Colors.colors.darkDustyPurple}
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
              onChangeText={(text) => handleOnChange(text, "name1")}
              error={errors.name1}
              onFocus={() => {
                handleError(null, "name1");
              }}
            />
          )}
          {selectEventType === "Nuntă" && (
            <View>
              <Input
                value={inputs.name1}
                label="Numele miresei"
                placeholder="Introduceți numele"
                backgroundColor="white"
                color={Colors.colors.darkDustyPurple}
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
                onChangeText={(text) => handleOnChange(text, "name1")}
                error={errors.name1}
                onFocus={() => {
                  handleError(null, "name1");
                }}
              />
              <Input
                value={inputs.name2}
                label="Numele mirelui"
                placeholder="Introduceți numele"
                backgroundColor="white"
                color={Colors.colors.darkDustyPurple}
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
                onChangeText={(text) => handleOnChange(text, "name2")}
                error={errors.name2}
                onFocus={() => {
                  handleError(null, "name2");
                }}
              />
            </View>
          )}
          <Input
            label="Data evenimentului"
            placeholder={selectEventDate}
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
            error={errors.eventDate}
            onFocus={() => {
              handleError(null, "eventDate");
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
                minimumDate={new Date()}
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
          <Input
            label="Ora evenimentului"
            placeholder={selectEventHour}
            placeholderTextColor={Colors.colors.gray}
            color={Colors.colors.darkDustyPurple}
            backgroundColor="white"
            backgroundColorTooltip={Colors.colors.darkDustyPurple}
            borderColor={Colors.colors.darkDustyPurple}
            iconName="alarm"
            iconError="ios-alert-circle"
            iconSize={24}
            iconColor={Colors.colors.darkDustyPurple}
            style={{ fontFamily: "Montserrat-Regular" }}
            error={errors.eventHour}
            onFocus={() => {
              handleError(null, "eventHour");
            }}
            caretHidden={true}
            onPressIn={toggleHourPicker}
          />
          {showHourPicker && (
            <View>
              <DateTimePicker
                mode="time"
                display="spinner"
                value={date}
                onChange={onChange}
                is24Hour={true}
                style={styles.containerDatePicker}
                // maximumDate={new Date()}
                textColor={Colors.colors.darkDustyPurple}
                locale="ro-RO"
                minuteInterval={15}
                accentColor={Colors.colors.darkDustyPurple}
              />
              <View style={styles.containerButtons}>
                <Button
                  backgroundColor="white"
                  color={Colors.colors.darkDustyPurple}
                  width={100}
                  borderRadius={30}
                  fontFamily="Montserrat-SemiBold"
                  fontSize={14}
                  onPress={toggleHourPicker}
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
          <Input
            label="Locația evenimentului"
            placeholder={eventLocation ? eventLocation : selectEventLocation}
            placeholderTextColor={Colors.colors.gray}
            color={Colors.colors.darkDustyPurple}
            backgroundColor="white"
            backgroundColorTooltip={Colors.colors.darkDustyPurple}
            borderColor={Colors.colors.darkDustyPurple}
            iconName="map"
            iconError="ios-alert-circle"
            iconSize={24}
            iconColor={Colors.colors.darkDustyPurple}
            style={{ fontFamily: "Montserrat-Regular" }}
            error={errors.eventLocation}
            onFocus={() => {
              handleError(null, "eventLocation");
            }}
            caretHidden={true}
            onPressIn={() =>
              navigation.navigate("Map", {
                idEvent: idEvent,
                eventType: selectEventType,
                eventDate: selectEventDate,
                eventHour: selectEventHour,
              })
            }
          />
          <View style={styles.containerButton}>
            <Button
              onPress={submitEditEvent}
              backgroundColor={Colors.colors.darkDustyPurple}
              color="white"
              width={280}
              borderRadius={10}
              fontFamily="Montserrat-SemiBold"
              fontSize={16}
              shadowOpacity={0.5}
            >
              Editează evenimentul
            </Button>
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
  containerInfomration: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  textDropDown: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    marginBottom: 4,
  },
  containerDropDown: {
    width: 280,
    marginBottom: 16,
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
  containerButton: {
    marginTop: 8,
    marginBottom: 16,
  },
});

export default EditEventScreen;
