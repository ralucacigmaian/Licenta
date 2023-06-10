import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { UserContext } from "../context/AuthContext";
import { editEvent, getUsersEvents, deleteEvent } from "../database/database";
import EventCard from "../components/EventCard";
import { Colors } from "../utils/colors";
import LottieView from "lottie-react-native";
import { ScrollView } from "react-native-gesture-handler";

function EventsScreen() {
  const authenticatedUser = useContext(UserContext);
  const [eventsArray, setEventsArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const getEvents = async () => {
        const responseEvents = await getUsersEvents(authenticatedUser.uid);
        setEventsArray(responseEvents);
        setLoading(false);
      };

      getEvents().catch((error) => {
        console.log("Error getting events: ", error);
      });
    }, [])
  );

  useEffect(() => {
    const checkEvent = async () => {
      const now = new Date();
      const localOffset = now.getTimezoneOffset() * 60000;
      const localNow = new Date(now - localOffset);

      for (const x of eventsArray) {
        const eventDateTime = new Date(x.eventDate);
        const eventTimePart = x.eventHour.split(":");
        eventDateTime.setUTCHours(parseInt(eventTimePart[0], 10));
        eventDateTime.setUTCMinutes(parseInt(eventTimePart[1], 10));

        if (eventDateTime < localNow) {
          const response = await editEvent(authenticatedUser.uid, x.id, {
            hasPassed: 1,
          });
          // console.log(`Event ${x.eventType}, ${x.name1}, ${x.name2} has passed`);
        } else {
          // console.log(`Event ${x.eventType}, ${x.name1}, ${x.name2} is upcoming`);
        }
      }
    };
    checkEvent();
  }, [authenticatedUser.uid, eventsArray]);

  const handleDeleteEvent = async (idEvent) => {
    const response = await deleteEvent(authenticatedUser.uid, idEvent);
    setEventsArray((prevEvents) => prevEvents.filter((x) => x.id !== idEvent));
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      {eventsArray.length > 0 && (
        <Text style={styles.textEvents}>Evenimente</Text>
      )}
      {eventsArray.length > 0 ? (
        <ScrollView style={styles.scrollView}>
          {eventsArray.map((x) => {
            return (
              <View key={x.id} style={styles.containerEvent}>
                <EventCard
                  idUser={authenticatedUser.uid}
                  idEvent={x.id}
                  eventType={x.eventType}
                  name1={x.name1}
                  name2={x.name2}
                  date={x.eventDate}
                  hour={x.eventHour}
                  location={x.eventLocation}
                  hasPassed={x.hasPassed}
                  hasMemory={x.hasMemory}
                  imageMemory={x.imageMemory}
                  onDelete={handleDeleteEvent}
                />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.containerNoEvents}>
          <Text style={styles.textNoEvents}>
            Ne pare rău, nu există evenimente adăugate!
          </Text>
          <LottieView
            source={require("../utils/noEvents.json")}
            autoPlay
            loop
            style={{
              width: 200,
              height: 200,
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  textEvents: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
    marginLeft: 16,
  },
  containerEvents: {
    flex: 1,
    marginTop: 16,
    // justifyContent: "center",
    alignItems: "center",
  },
  containerEvent: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  containerNoEvents: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textNoEvents: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
});

export default EventsScreen;
