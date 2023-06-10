import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  SafeAreaView,
} from "react-native";
import { Colors } from "../utils/colors";
import Icon, { Icons } from "./Icons";
import Button from "./Button";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { deleteEvent, deleteImage } from "../database/database";
import { showMessage } from "react-native-flash-message";

function EventCard({
  idUser,
  idEvent,
  eventType,
  name1,
  name2,
  date,
  hour,
  location,
  hasPassed,
  hasMemory,
  imageMemory,
  onDelete,
}) {
  const moment = require("moment");
  require("moment/locale/ro");

  const eventDate = new Date(date);

  moment.locale("ro");
  let newDate =
    eventDate.getDate() +
    " " +
    moment(eventDate).format("MMMM") +
    " " +
    eventDate.getFullYear();

  const navigation = useNavigation();

  const [isOpen, setIsOpen] = useState(false);

  const handleOptions = () => {
    setIsOpen(true);
  };

  const handleAddMemory = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Ofera permisiuni");
    } else {
      navigation.navigate("CameraScreen", {
        idEvent: idEvent,
        eventType: eventType,
        name1: name1,
        name2: name2,
      });
      setIsOpen(false);
    }
  };

  const handleViewMemory = () => {
    navigation.navigate("ViewMemory", {
      image: imageMemory,
      eventType: eventType,
      name1: name1,
      name2: name2,
    });
    setIsOpen(false);
  };

  const handleDeleteEvent = async () => {
    const response = await deleteEvent(idUser, idEvent);
    if (hasMemory === 1) {
      const responseDeleteMemory = await deleteImage(
        `memories/${idUser}/${idEvent}.jpeg`
      );
    }
    onDelete(idEvent);
    showMessage({
      message: `Evenimentul a fost șters cu succes!`,
      icon: "info",
      style: { backgroundColor: Colors.colors.darkDustyPurple },
      titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
      textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
    });
    setIsOpen(false);
  };

  const handleEditEvent = () => {
    navigation.navigate("EditEvent", {
      idEvent: idEvent,
      eventType: eventType,
      name1: name1,
      name2: name2,
      eventDate: newDate,
      eventHour: hour,
      eventLocation: location,
    });
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Modal visible={isOpen} transparent={true} animationType="fade">
        <SafeAreaView style={styles.containerModal}>
          <View style={styles.modalView}>
            <Pressable
              style={({ pressed }) => pressed && styles.pressed}
              onPress={() => setIsOpen(false)}
            >
              <Icon
                type={Icons.Ionicons}
                name="ios-close"
                size={18}
                color={Colors.colors.gray}
              />
            </Pressable>
            <View style={styles.containerButtons}>
              <View>
                {hasPassed === 1 && hasMemory === 0 ? (
                  <View style={styles.containerButtonModal}>
                    <Button
                      backgroundColor="white"
                      color={Colors.colors.darkDustyPurple}
                      width={280}
                      borderRadius={10}
                      fontFamily="Montserrat-SemiBold"
                      fontSize={16}
                      shadowOpacity={0.5}
                      textAlign="center"
                      onPress={handleAddMemory}
                    >
                      Adaugă amintire
                    </Button>
                  </View>
                ) : (
                  hasMemory === 1 && (
                    <View style={styles.containerButtonModal}>
                      <Button
                        backgroundColor="white"
                        color={Colors.colors.darkDustyPurple}
                        width={280}
                        borderRadius={10}
                        fontFamily="Montserrat-SemiBold"
                        fontSize={16}
                        shadowOpacity={0.5}
                        textAlign="center"
                        onPress={handleViewMemory}
                      >
                        Vezi amintire
                      </Button>
                    </View>
                  )
                )}
                <View style={styles.containerButtonModal}>
                  <Button
                    backgroundColor={Colors.colors.darkDustyPurple}
                    color="white"
                    width={280}
                    borderRadius={10}
                    fontFamily="Montserrat-SemiBold"
                    fontSize={16}
                    shadowOpacity={0.5}
                    textAlign="center"
                    onPress={handleDeleteEvent}
                  >
                    Șterge evenimentul
                  </Button>
                </View>
              </View>
              <View>
                {hasMemory === 0 && (
                  <View style={styles.containerButtonModal}>
                    <Button
                      backgroundColor="white"
                      color={Colors.colors.darkDustyPurple}
                      width={280}
                      borderRadius={10}
                      fontFamily="Montserrat-SemiBold"
                      fontSize={16}
                      shadowOpacity={0.5}
                      textAlign="center"
                      onPress={handleEditEvent}
                    >
                      Editează date despre eveniment
                    </Button>
                  </View>
                )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <View style={styles.containerIcon}>
        {eventType === "Botez" && (
          <Icon
            type={Icons.FontAwesome5}
            name="baby-carriage"
            size={40}
            color={Colors.colors.darkDustyPurple}
          />
        )}
        {eventType === "Majorat" && (
          <Icon
            type={Icons.FontAwesome5}
            name="birthday-cake"
            size={40}
            color={Colors.colors.darkDustyPurple}
          />
        )}
        {eventType === "Nuntă" && (
          <Icon
            type={Icons.MaterialCommunityIcons}
            name="ring"
            size={50}
            color={Colors.colors.darkDustyPurple}
          />
        )}
      </View>
      <View style={styles.containerName}>
        {eventType === "Botez" && (
          <Text style={styles.textEventFor}>
            Botezul lui <Text style={styles.textName}>{name1}</Text>
          </Text>
        )}
        {eventType === "Majorat" && (
          <Text style={styles.textEventFor}>
            Majoratul lui <Text style={styles.textName}>{name1}</Text>
          </Text>
        )}
        {eventType === "Nuntă" && (
          <Text style={styles.textEventFor}>
            Nunta lui <Text style={styles.textName}>{name1}</Text> &{" "}
            <Text style={styles.textName}>{name2}</Text>
          </Text>
        )}
        <View style={styles.containerHour}>
          <Icon
            type={Icons.MaterialCommunityIcons}
            name="clock-time-two"
            size={20}
            color={Colors.colors.darkDustyPurple}
          />
          <Text style={styles.textHour}>{hour}</Text>
        </View>
        <View style={styles.containerDate}>
          <Icon
            type={Icons.Ionicons}
            name="ios-calendar"
            size={20}
            color={Colors.colors.darkDustyPurple}
          />
          <Text style={styles.textDate}>{newDate}</Text>
        </View>
        <View style={styles.containerLocation}>
          <Icon
            type={Icons.Ionicons}
            name="ios-location-sharp"
            size={20}
            color={Colors.colors.darkDustyPurple}
          />
          <Text style={styles.textLocation}>{location}</Text>
        </View>
      </View>
      <View style={styles.containerOptions}>
        <Pressable
          style={({ pressed }) => pressed && styles.pressed}
          onPress={handleOptions}
        >
          <Icon
            type={Icons.SimpleLineIcons}
            name="options-vertical"
            size={24}
            color={Colors.colors.darkDustyPurple}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 387,
    height: 120,
    backgroundColor: Colors.colors.cardBackgroundColor,
    borderRadius: 10,
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  containerIcon: {
    backgroundColor: Colors.colors.lightDustyPurple,
    width: 90,
    height: 90,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  containerName: {
    marginLeft: 16,
  },
  textEventFor: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  textName: {
    fontFamily: "Montserrat-SemiBold",
  },
  containerHour: {
    flexDirection: "row",
    alignItems: "center",
  },
  textHour: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
    marginLeft: 4,
  },
  containerLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  textLocation: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
    marginLeft: 4,
  },
  containerDate: {
    flexDirection: "row",
    alignItems: "center",
  },
  textDate: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
    marginLeft: 4,
  },
  containerOptions: {
    position: "absolute",
    left: 350,
  },
  pressed: {
    opacity: 0.1,
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
  containerButtons: {
    justifyContent: "center",
    alignItems: "center",
  },
  containerButtonModal: {
    marginTop: 16,
  },
});

export default EventCard;
