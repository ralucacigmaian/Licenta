import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { UserContext } from "../context/AuthContext";
import { getUsersEvents } from "../database/database";
import EventCard from "../components/EventCard";
import { Colors } from "../utils/colors";

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

  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <Text style={styles.textEvents}>Evenimente</Text>
      <View style={styles.containerEvents}>
        {eventsArray.length > 0 ? (
          eventsArray.map((x) => {
            return (
              <View style={styles.containerEvent}>
                <EventCard
                  eventType={x.eventType}
                  name1={x.name1}
                  name2={x.name2}
                  date={x.eventDate}
                  hour={x.eventHour}
                  location={x.eventLocation}
                />
              </View>
            );
          })
        ) : (
          <Text>Ne pare rău, nu există evenimente adăugate!</Text>
        )}
      </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  containerEvent: {
    marginTop: 16,
  },
});

export default EventsScreen;
