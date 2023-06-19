import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { UserContext } from "../context/AuthContext";
import { editEvent, getUsersEvents, deleteEvent } from "../database/database";
import EventCard from "../components/EventCard";
import { Colors } from "../utils/colors";
import LottieView from "lottie-react-native";
import { ScrollView } from "react-native-gesture-handler";
import SearchBarComponent from "../components/SearchBarComponent";

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

  useFocusEffect(
    useCallback(() => {
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
    }, [authenticatedUser.uid, eventsArray])
  );

  const handleDeleteEvent = async (idEvent) => {
    const response = await deleteEvent(authenticatedUser.uid, idEvent);
    setEventsArray((prevEvents) => prevEvents.filter((x) => x.id !== idEvent));
  };

  const [searchInput, setSearchInput] = useState("");
  const [searchEventsArray, setSearchEventsArray] = useState([]);
  const [searchStatus, setSearchStatus] = useState(false);

  const handleSearchInput = useCallback((text) => {
    setSearchInput(text);

    if (text === "") {
      setSearchEventsArray([]);
      setSearchStatus(false);
      return;
    }

    const searchedEvents = eventsArray.filter(
      (event) =>
        event.eventType.toLowerCase().includes(text.toLowerCase()) ||
        event.name1.toLowerCase().includes(text.toLowerCase()) ||
        event.name2.toLowerCase().includes(text.toLowerCase()) ||
        event.eventLocation.toLowerCase().includes(text.toLowerCase())
    );

    setSearchEventsArray(searchedEvents);

    const hasSearchResults = searchedEvents.length;

    setSearchStatus(hasSearchResults);
  });

  console.log(searchStatus);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color={Colors.colors.darkDustyPurple}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      />
    );

  if (searchStatus === false) {
    return (
      <View style={styles.container}>
        <SearchBarComponent
          placeholder="Caută în lista de evenimente"
          value={searchInput}
          onChangeText={handleSearchInput}
        />
        <ScrollView>
          {eventsArray.length > 0 && (
            <Text style={styles.textEvents}>Evenimente din trecut</Text>
          )}
          {eventsArray.length > 0 && (
            <View>
              {eventsArray.map((x) => {
                if (x.hasPassed === 1) {
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
                }
              })}
            </View>
          )}
          {eventsArray.length > 0 && (
            <Text style={styles.textFutureEvents}>Evenimente viitoare</Text>
          )}
          {eventsArray.length > 0 && (
            <View>
              {eventsArray.map((x) => {
                if (x.hasPassed === 0) {
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
                }
              })}
            </View>
          )}
        </ScrollView>
        {eventsArray.length === 0 && (
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
  } else {
    if (searchStatus === 0) {
      return (
        <View style={styles.container}>
          <SearchBarComponent
            placeholder="Caută în lista de evenimente"
            value={searchInput}
            onChangeText={handleSearchInput}
          />
          <View style={styles.containerNoResult}>
            <Text style={styles.textNoResult}>
              Ne pare rău, dar nu am găsit nicio înregistrare care să corespundă
              căutării tale!
            </Text>
            <LottieView
              source={require("../utils/search_empty.json")}
              autoPlay
              loop
              style={{
                width: 300,
                height: 300,
              }}
            />
          </View>
        </View>
      );
    } else {
      if (searchStatus !== 0) {
        return (
          <View style={styles.container}>
            <SearchBarComponent
              placeholder="Caută în lista de evenimente"
              value={searchInput}
              onChangeText={handleSearchInput}
            />
            {searchEventsArray.length > 0 &&
              searchEventsArray.filter((x) => x.hasPassed === 1) && (
                <View>
                  <Text style={styles.textEvents}>Evenimente din trecut</Text>
                  {searchEventsArray.filter((x) => x.hasPassed === 1).length ===
                    0 && (
                    <Text style={styles.textNoPastEvents}>
                      Nu există rezultate corespunzătoare evenimentelor trecute!
                    </Text>
                  )}
                  {searchEventsArray.map((x) => {
                    if (x.hasPassed === 1) {
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
                    }
                  })}
                </View>
              )}
            {searchEventsArray.length > 0 &&
              searchEventsArray.filter((x) => x.hasPassed === 0) && (
                <View>
                  <Text style={styles.textFutureEvents}>
                    Evenimente viitoare
                  </Text>
                  {searchEventsArray.filter((x) => x.hasPassed === 0).length ===
                    0 && (
                    <Text style={styles.textNoPastEvents}>
                      Nu există rezultate corespunzătoare evenimentelor
                      viitoare!
                    </Text>
                  )}
                  {searchEventsArray.map((x) => {
                    if (x.hasPassed === 0) {
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
                    }
                  })}
                </View>
              )}
          </View>
        );
      }
    }
  }
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
  textFutureEvents: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
    marginLeft: 16,
    marginTop: 16,
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
    marginTop: -600,
  },
  textNoEvents: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
  containerNoResult: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 16,
  },
  textNoResult: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
  textNoPastEvents: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    marginLeft: 16,
    marginTop: 16,
  },
});

export default EventsScreen;
