import { async } from "@firebase/util";
import { isLoading } from "expo-font";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { UserContext } from "../context/AuthContext";
import {
  getFemaleInterests,
  getFriendInterests,
  getGiftSuggestions,
} from "../database/database";
import GiftCard from "../components/GiftCard";
import { Colors } from "../utils/colors";
import Tag from "../components/Tag";
import { Interests } from "../utils/interests";
import SearchBarComponent from "../components/SearchBarComponent";
import LottieView from "lottie-react-native";
import { useFocusEffect } from "@react-navigation/native";

function DisplayGiftSuggestionsScreen({ navigation, route }) {
  const authenticatedUser = useContext(UserContext);
  let userId = authenticatedUser.uid;
  const { name, idFriend } = route.params;
  console.log(
    "Current user: " +
      userId +
      "\nCurrent friend: " +
      idFriend +
      "\nCurrent friend name: " +
      name
  );

  const [interests, setInterests] = useState([]);
  const [loadingGiftSuggestions, setLoadingGiftSuggestions] = useState(true);
  const [gifts, setGifts] = useState([]);

  let interestsArray = [];

  useEffect(() => {
    const fetchData = async () => {
      interestsArray = await getFriendInterests(userId, idFriend);
      setInterests(interestsArray);
      let formattedInterests = [];
      if (interestsArray) {
        try {
          const formatArray = interestsArray.interests.map((code) => {
            const codeString = `I${code < 10 ? "0" + code : code}`;
            formattedInterests.push(codeString);
          });
        } catch (error) {
          console.log(error.message);
        }
      }
      let auxArray = [];
      const codesToFetch = ["I001", "I002", "I003"];
      for (let i = 0; i < formattedInterests.length; i++) {
        for (let j = 0; j < codesToFetch.length; j++) {
          const code = codesToFetch[j];
          const index = `I${(i + 1).toString().padStart(2, "0")}`;
          const giftSuggestions = await getGiftSuggestions(
            formattedInterests[i],
            codesToFetch[j]
          );
          auxArray.push({
            index: index,
            code: code,
            giftSuggestions: giftSuggestions,
          });
        }
      }
      setLoadingGiftSuggestions(false);
      setGifts(auxArray);
    };
    fetchData();
  }, [idFriend]);

  const [searchInput, setSearchInput] = useState("");
  const [searchGiftsArray, setSearchGiftsArray] = useState([]);
  const [searchStatus, setSearchStatus] = useState(false);

  const handleSearchInput = useCallback((text) => {
    setSearchInput(text);

    if (text === "") {
      setSearchGiftsArray([]);
      setSearchStatus(false);
      return;
    }

    const searchedGifts = gifts.filter((gift) =>
      gift.giftSuggestions.giftInformation.name
        .toLowerCase()
        .includes(text.toLowerCase())
    );

    setSearchGiftsArray(searchedGifts);

    const hasSearchResults = searchedGifts.length;

    setSearchStatus(hasSearchResults);
  });

  console.log(searchGiftsArray);

  if (loadingGiftSuggestions) {
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
  }

  if (searchStatus === false) {
    return (
      <ScrollView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <SearchBarComponent
            placeholder="Caută în lista de cadouri"
            value={searchInput}
            onChangeText={handleSearchInput}
          />
          <View style={styles.header}>
            <Text style={styles.textHeader}>
              Alege cel mai bun cadou pentru {name}
            </Text>
          </View>
          <View style={styles.containerGift}>
            {gifts.length > 0 &&
              gifts.map((x, index) => {
                const { index: giftIndex, code, giftSuggestions } = x;
                return (
                  <GiftCard
                    key={index}
                    image={giftSuggestions.giftImage}
                    name={giftSuggestions.giftInformation.name}
                    price={giftSuggestions.giftInformation.price}
                    onDetails={() =>
                      navigation.navigate("Display Gift Details", {
                        name: giftSuggestions.giftInformation.name,
                        price: giftSuggestions.giftInformation.price,
                        description:
                          giftSuggestions.giftInformation.description,
                        image: giftSuggestions.giftImage,
                        userId: userId,
                        friendId: idFriend,
                        friendName: name,
                        giftIndex: giftIndex,
                        giftCode: code,
                      })
                    }
                  />
                );
              })}
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  } else {
    if (searchStatus === 0) {
      return (
        <View style={styles.container}>
          <SearchBarComponent
            placeholder="Caută în lista de cadouri"
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
          <ScrollView style={styles.container}>
            <View style={styles.container}>
              <SearchBarComponent
                placeholder="Caută în lista de evenimente"
                value={searchInput}
                onChangeText={handleSearchInput}
              />
              <View style={styles.header}>
                <Text style={styles.textHeader}>
                  Alege cel mai bun cadou pentru {name}
                </Text>
              </View>
              <View style={styles.containerGift}>
                {searchGiftsArray.length > 0 &&
                  searchGiftsArray.map((x, index) => {
                    const { index: giftIndex, code, giftSuggestions } = x;
                    return (
                      <GiftCard
                        key={index}
                        image={giftSuggestions.giftImage}
                        name={giftSuggestions.giftInformation.name}
                        price={giftSuggestions.giftInformation.price}
                        onDetails={() =>
                          navigation.navigate("Display Gift Details", {
                            name: giftSuggestions.giftInformation.name,
                            price: giftSuggestions.giftInformation.price,
                            description:
                              giftSuggestions.giftInformation.description,
                            image: giftSuggestions.giftImage,
                            userId: userId,
                            friendId: idFriend,
                            friendName: name,
                            giftIndex: giftIndex,
                            giftCode: code,
                          })
                        }
                      />
                    );
                  })}
              </View>
            </View>
          </ScrollView>
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
  header: {
    marginLeft: 16,
  },
  textHeader: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    color: Colors.colors.darkDustyPurple,
  },
  textSubHeader: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  containerGift: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 16,
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
});

export default DisplayGiftSuggestionsScreen;
