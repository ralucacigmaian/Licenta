import { View, Text, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import Input from "../components/Input";
import { Colors } from "../utils/colors";
import { SelectList } from "react-native-dropdown-select-list";
import Icon, { Icons } from "../components/Icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "../components/Button";
import { showMessage } from "react-native-flash-message";
import { addEvent, addNotificationEvent } from "../database/database";
import { UserContext } from "../context/AuthContext";

function AddEventScreen({ navigation, route }) {
  const authenticatedUser = useContext(UserContext);
  const [eventType, setEventType] = useState();
  const [errorEventType, setErrorEventType] = useState(false);
  const dataEventType = [
    { key: "Botez", value: "     Botez" },
    { key: "Majorat", value: "     Majorat" },
    { key: "Nuntă", value: "     Nuntă" },
  ];

  const [eventLocation, setEventLocation] = useState();

  useEffect(() => {
    if (route.params) {
      const { locationName } = route.params;
      setEventLocation(locationName);
    }
  }, [route.params]);

  console.log(eventLocation);

  const [inputs, setInputs] = useState({
    name1: "",
    name2: "",
  });

  const [errors, setErrors] = useState({});

  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const [date, setDate] = useState(new Date());
  const [eventDate, setEventDate] = useState("Selectați data evenimentului");
  const [eventHour, setEventHour] = useState("Selectați ora evenimentului");
  const [eventDateToAdd, setEventDateToAdd] = useState();
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
      setEventDate(newDate);
    }

    if (showHourPicker) {
      toggleHourPicker();
      setEventHour(newHour);
    }

    setEventDateToAdd(auxDate);
  };

  const toggleHourPicker = () => {
    setShowHourPicker(!showHourPicker);
  };

  const submitForm = async (
    eventType,
    name1,
    name2,
    eventDate,
    eventHour,
    eventLocation
  ) => {
    let valid = true;

    if (!eventType) {
      valid = false;
      setErrorEventType(true);
      showMessage({
        message: "Vă rugăm să selectați tipul evenimentului!",
        icon: "warning",
        style: { backgroundColor: Colors.colors.darkDustyPurple },
        titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
        textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
      });
    }

    if (eventType === "Botez") {
      if (!inputs.name1) {
        valid = false;
        handleError("Vă rugăm să introduceți numele!", "name1");
      }
    }

    if (eventType === "Majorat") {
      if (!inputs.name1) {
        valid = false;
        handleError("Vă rugăm să introduceți numele!", "name1");
      }
    }

    if (eventType === "Nuntă") {
      if (!inputs.name1) {
        valid = false;
        handleError("Vă rugăm să introduceți numele!", "name1");
      }
      if (!inputs.name2) {
        valid = false;
        handleError("Vă rugăm să introduceți numele!", "name2");
      }
    }

    if (eventDate === "Selectați data evenimentului") {
      valid = false;
      handleError("Vă rugăm să selectați data evenimentului!", "eventDate");
    }

    if (eventHour === "Selectați ora evenimentului") {
      valid = false;
      handleError("Vă rugăm să selectați ora evenimentului!", "eventHour");
    }

    if (!eventLocation) {
      valid = false;
      handleError(
        "Vă rugăm să selectați locația evenimentului!",
        "eventLocation"
      );
    }

    if (valid) {
      const responseAddEvent = await addEvent(
        authenticatedUser.uid,
        eventType,
        inputs.name1,
        inputs.name2,
        eventDateToAdd,
        eventHour,
        eventLocation
      );
      const responseAddNotification = await addNotificationEvent(
        authenticatedUser.uid,
        eventType,
        inputs.name1,
        inputs.name2,
        eventDateToAdd,
        eventLocation
      );
      navigation.navigate("EventList");
      showMessage({
        message: "Evenimentul a fost adăugat cu succes!",
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
        <Text style={styles.textHeader}>
          Completează următorul formular pentru a adăuga un eveniment
        </Text>
        <View style={styles.containerInputs}>
          <View style={styles.containerDropDown}>
            <Text style={styles.textDropDown}>Tipul evenimentului</Text>
            <SelectList
              setSelected={setEventType}
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
          {eventType === "Botez" && (
            <Input
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
              style={{ fontFamily: "Montserrat-Regular" }}
              onChangeText={(text) => handleOnChange(text, "name1")}
              error={errors.name1}
              onFocus={() => {
                handleError(null, "name1");
              }}
            />
          )}
          {eventType === "Majorat" && (
            <Input
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
              style={{ fontFamily: "Montserrat-Regular" }}
              onChangeText={(text) => handleOnChange(text, "name1")}
              error={errors.name1}
              onFocus={() => {
                handleError(null, "name1");
              }}
            />
          )}
          {eventType === "Nuntă" && (
            <View>
              <Input
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
                style={{ fontFamily: "Montserrat-Regular" }}
                onChangeText={(text) => handleOnChange(text, "name1")}
                error={errors.name1}
                onFocus={() => {
                  handleError(null, "name1");
                }}
              />
              <Input
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
                style={{ fontFamily: "Montserrat-Regular" }}
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
            placeholder={eventDate}
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
            placeholder={eventHour}
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
            placeholder={
              eventLocation ? eventLocation : "Selectați locația evenimentului"
            }
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
            onPressIn={() => navigation.navigate("Map")}
          />
          <View style={styles.containerButton}>
            <Button
              onPress={() =>
                submitForm(
                  eventType,
                  inputs.name1,
                  inputs.name2,
                  eventDateToAdd,
                  eventHour,
                  eventLocation
                )
              }
              backgroundColor={Colors.colors.darkDustyPurple}
              color="white"
              width={280}
              borderRadius={10}
              fontFamily="Montserrat-SemiBold"
              fontSize={16}
              shadowOpacity={0.5}
            >
              Adaugă evenimentul
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
    justifyContent: "center",
    alignItems: "center",
  },
  textHeader: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    marginTop: 16,
    textAlign: "center",
  },
  containerInputs: {
    marginTop: 16,
  },
  containerDropDown: {
    width: 280,
    marginBottom: 16,
  },
  textDropDown: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    marginBottom: 4,
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

export default AddEventScreen;
