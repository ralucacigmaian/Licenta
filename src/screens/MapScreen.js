import React, { useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Image, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { SearchBar } from "react-native-elements";
import { Colors } from "../utils/colors";
import Icon, { Icons } from "../components/Icons";
import Button from "../components/Button";

const MapScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLocationName, setSelectedLocationName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const mapRef = useRef(null);

  const initialRegion = {
    latitude: 45.760696,
    longitude: 21.226788,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  const knownLocations = [
    {
      id: 1,
      name: "La Rousee",
      latitude: 45.7660188496453,
      longitude: 21.200565653969324,
      imageUrl: require("../utils/laRousse.jpeg"),
    },
    {
      id: 2,
      name: "Iulius Congress Hall",
      latitude: 45.7671365074964,
      longitude: 21.228697339240703,
      imageUrl: require("../utils/iuliusCongressHall.jpeg"),
    },
    {
      id: 3,
      name: "Arta Hotel Ballroom",
      latitude: 45.772212291836446,
      longitude: 21.283180168453427,
      imageUrl: require("../utils/artaHotel.jpeg"),
    },
    {
      id: 4,
      name: "Ambassador Hotel",
      latitude: 45.738980006386626,
      longitude: 21.206457899139096,
      imageUrl: require("../utils/ambassadorHotel.jpeg"),
    },
    {
      id: 5,
      name: "Cezar Ballroom",
      latitude: 45.76917534587921,
      longitude: 21.26801085496089,
      imageUrl: require("../utils/cezarBallroom.jpeg"),
    },
    {
      id: 6,
      name: "Tresor Le Palais",
      latitude: 45.76266249729557,
      longitude: 21.274863110404542,
      imageUrl: require("../utils/tresorLePalais.jpeg"),
    },
    {
      id: 7,
      name: "Venue Ballroom & Events",
      latitude: 45.76685918176471,
      longitude: 21.23970156622533,
      imageUrl: require("../utils/venue.jpeg"),
    },
    {
      id: 8,
      name: "Complex Flonta",
      latitude: 45.686225147112,
      longitude: 21.240596396908085,
      imageUrl: require("../utils/flonta.jpeg"),
    },
    {
      id: 9,
      name: "Galla Events",
      latitude: 45.7685393712001,
      longitude: 21.271167525748492,
      imageUrl: require("../utils/galla.jpeg"),
    },
    {
      id: 10,
      name: "VALERY",
      latitude: 45.722061358819836,
      longitude: 21.304261312253583,
      imageUrl: require("../utils/vallery.jpeg"),
    },
    {
      id: 11,
      name: "Palazzo Luxury",
      latitude: 45.776150481732145,
      longitude: 21.30107476807708,
      imageUrl: require("../utils/palazzo.jpeg"),
    },
    {
      id: 12,
      name: "Ivy Events",
      latitude: 45.77687143647016,
      longitude: 21.2673120723107,
      imageUrl: require("../utils/ivy.jpeg"),
    },
  ];

  const handleSearchInput = (text) => {
    setSearchInput(text);
    const filtered = knownLocations.filter((location) =>
      location.name.toLowerCase().includes(text.toLowerCase())
    );
    if (filtered.length > 0) {
      const { latitude, longitude, name } = filtered[0];
      setSelectedLocation({ latitude, longitude });
      setSelectedLocationName(name);

      const updatedRegion = {
        ...initialRegion,
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(updatedRegion);
    } else {
      setSelectedLocation(null);
      setSelectedLocationName("");
    }
  };

  const handleMarkerPress = (location) => {
    setSelectedLocation(location);
    setSelectedLocationName(location.name);
  };

  //   console.log(selectedLocation.name);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Caută locația"
          placeholderTextColor={Colors.colors.darkDustyPurple}
          inputStyle={{
            fontFamily: "Montserrat-Regular",
            fontSize: 18,
            color: Colors.colors.darkDustyPurple,
          }}
          value={searchInput}
          onChangeText={handleSearchInput}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          searchIcon={
            <Icon
              type={Icons.Ionicons}
              name="ios-search"
              size={26}
              color={Colors.colors.darkDustyPurple}
            />
          }
        />
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        minDelta={0.01}
      >
        {knownLocations.map((location) => (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
            onPress={() => handleMarkerPress(location)}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Image
                  source={location.imageUrl}
                  style={styles.calloutImage}
                  resizeMode="cover"
                />
                <Text style={styles.calloutText}>{location.name}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
        {/* {selectedLocation && (
          <Marker coordinate={selectedLocation} title={selectedLocationName}>
            <Image
              source={selectedLocation.imageUrl}
              style={{ width: 100, height: 100 }}
              resizeMode="cover"
            />
          </Marker>
        )} */}
      </MapView>
      {selectedLocation ? (
        <View style={styles.buttonContainer}>
          <Button
            backgroundColor={Colors.colors.darkDustyPurple}
            width={400}
            borderRadius={10}
            fontFamily="Montserrat-Regular"
            fontSize={18}
            color="white"
            onPress={() =>
              navigation.navigate("Adaugă un eveniment", {
                locationName: selectedLocation.name,
              })
            }
          >
            Selectează locația
          </Button>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "white",
    paddingHorizontal: 5,
    paddingTop: 0,
    width: Dimensions.get("window").width - 30,
    alignSelf: "center",
    transform: [{ translateX: 15 }],
    borderRadius: 10,
  },
  searchBarContainer: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    paddingHorizontal: 0,
  },
  searchBarInputContainer: {
    backgroundColor: "white",
  },
  calloutContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  calloutImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  calloutText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    marginTop: 4,
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    top: 820,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapScreen;
