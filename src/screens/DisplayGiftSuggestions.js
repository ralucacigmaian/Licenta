import { async } from "@firebase/util";
import { isLoading } from "expo-font";
import { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { UserContext } from "../context/AuthContext";
import { getFemaleInterests, getFriendInterests } from "../database/database";
import GiftCard from "../components/GiftCard";
import { Colors } from "../utils/colors";
import Tag from "../components/Tag";
import { Interests } from "../utils/interests";

function DisplayGiftSuggestionsScreen() {
  const authenticatedUser = useContext(UserContext);
  let userId = authenticatedUser.uid;
  let friendId = authenticatedUser.fid;
  let userName = authenticatedUser.userName;
  let friendName = authenticatedUser.friendName;
  console.log(
    "Current user: " +
      userId +
      "\nCurrent friend: " +
      friendId +
      "\nCurrent friend name: " +
      friendName
  );

  const [interests, setInterests] = useState([]);
  const [loadingGiftSuggestions, setLoadingGiftSuggestions] = useState(true);
  const [femaleGifts, setFemaleGifts] = useState([]);

  let interestsArray = [];

  useEffect(() => {
    const fetchData = async () => {
      interestsArray = await getFriendInterests(userId, friendId);
      setInterests(interestsArray);
      let formattedInterests = [];
      if (interestsArray) {
        try {
          const formatArray = interestsArray.interests.map((code) => {
            const codeString = `F${code < 10 ? "0" + code : code}`;
            formattedInterests.push(codeString);
          });
        } catch (error) {
          console.log(error.message);
        }
      }
      // console.log(formattedInterests);
      const codesToFetch = ["F001", "F002", "F003"];
      let femaleGiftSuggestions = [];
      for (let i = 0; i < formattedInterests.length; i++) {
        for (let j = 0; j < codesToFetch.length; j++) {
          const femaleArray = await getFemaleInterests(
            formattedInterests[i],
            codesToFetch[j]
          );
          femaleGiftSuggestions.push(femaleArray);
        }
      }
      setLoadingGiftSuggestions(false);
      setFemaleGifts(femaleGiftSuggestions);
    };
    fetchData();
  }, [friendId]);

  // console.log(femaleGifts);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const fetchInterests = async () => {
  //       interestsArray = await getFriendInterests(userId, friendId);
  //       setInterests(interestsArray);
  //       setLoading(false);
  //     };
  //     // fetchInterests();
  //     const fetchFemaleInterests = async () => {
  //       let femaleGiftSuggestions = [];
  //       const formattedInterests = getFormattedArray(interestsArray);
  //       const codesToFetch = ["F001", "F002", "F003"];
  //       for (let i = 0; i < formattedInterests.length; i++) {
  //         for (let j = 0; j < codesToFetch.length; j++) {
  //           const femaleArray = await getFemaleInterests(
  //             formattedInterests[i],
  //             codesToFetch[j]
  //           );
  //           femaleGiftSuggestions.push(femaleArray);
  //           setLoadingGiftSuggestions(false);

  //           // console.log(femaleGiftSuggestions);
  //         }
  //       }
  //       setFemaleGiftSuggestions(femaleGiftSuggestions);
  //     };
  //     // fetchFemaleInterests();
  //   };
  //   fetchData();
  // }, []);
  console.log("aici");
  console.log(interests.interests);
  // console.log(femaleGiftSuggestions);

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>Find the</Text>
          <Text style={styles.textHeader}>best present</Text>
        </View>
        {interests.interests && interests.interests.includes(0) ? (
          <View>
            <Text style={styles.textGift}>
              Gifts based on Card Games, Board Games & Puzzles
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {femaleGifts.slice(0, 3).map((x) => {
                return (
                  <GiftCard
                    name={x.informationInterests.name}
                    price={x.informationInterests.price}
                    description={x.informationInterests.description}
                    image={x.imageInterests}
                  />
                );
              })}
            </ScrollView>
          </View>
        ) : null}
        {interests.interests && interests.interests.includes(1) ? (
          <View>
            <Text style={styles.textGift}>Gifts based on Video Games</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {femaleGifts.slice(3, 6).map((x) => {
                return (
                  <GiftCard
                    name={x.informationInterests.name}
                    price={x.informationInterests.price}
                    description={x.informationInterests.description}
                    image={x.imageInterests}
                  />
                );
              })}
            </ScrollView>
          </View>
        ) : null}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    paddingLeft: 10,
  },
  textHeader: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 30,
    color: Colors.colors.darkDustyPurple,
  },
  textSubHeader: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  loadingContainer: {
    flex: 1,
  },
  giftContainer: {
    paddingTop: 10,
  },
  giftsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  textGift: {
    fontFamily: "Montserrat-SemiBoldItalic",
    fontSize: 18,
    color: Colors.colors.darkDustyPurple,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  textTagContainer: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    color: Colors.colors.darkDustyPurple,
    marginHorizontal: 10,
    marginVertical: 10,
  },
});

export default DisplayGiftSuggestionsScreen;
