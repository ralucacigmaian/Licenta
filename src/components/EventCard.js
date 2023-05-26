import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../utils/colors";
import Icon, { Icons } from "./Icons";

function EventCard({ eventType, name1, name2, date, hour, location }) {
  const moment = require("moment");
  require("moment/locale/ro");

  const eventDate = new Date(date);
  console.log(eventDate);

  moment.locale("ro");
  let newDate =
    eventDate.getDate() +
    " " +
    moment(eventDate).format("MMM") +
    " " +
    eventDate.getFullYear();
  console.log(newDate);

  return (
    <View style={styles.container}>
      <View style={styles.containerIcon}>
        {eventType === "Botez" && (
          <Icon
            type={Icons.FontAwesome5}
            name="baby-carriage"
            size={30}
            color={Colors.colors.darkDustyPurple}
          />
        )}
        {eventType === "Majorat" && (
          <Icon
            type={Icons.FontAwesome5}
            name="birthday-cake"
            size={30}
            color={Colors.colors.darkDustyPurple}
          />
        )}
        {eventType === "Nuntă" && (
          <Icon
            type={Icons.MaterialCommunityIcons}
            name="ring"
            size={40}
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
      <View style={styles.containerDate}>
        <Text style={styles.textDate}>{newDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 387,
    height: 100,
    backgroundColor: Colors.colors.cardBackgroundColor,
    borderRadius: 10,
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  containerIcon: {
    backgroundColor: Colors.colors.lightDustyPurple,
    width: 70,
    height: 70,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  containerName: {
    marginLeft: 8,
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
    position: "absolute",
    left: 290,
    height: 55,
    width: 85,
    backgroundColor: Colors.colors.lightDustyPurple,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textDate: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
});

export default EventCard;
