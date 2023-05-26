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
import {
  getFemaleInterests,
  getFriendInterests,
  getGiftSuggestions,
} from "../database/database";
import GiftCard from "../components/GiftCard";
import { Colors } from "../utils/colors";
import Tag from "../components/Tag";
import { Interests } from "../utils/interests";

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
          const giftSuggestions = await getGiftSuggestions(
            formattedInterests[i],
            codesToFetch[j]
          );
          auxArray.push(giftSuggestions);
        }
      }
      setLoadingGiftSuggestions(false);
      setGifts(auxArray);
    };
    fetchData();
  }, [idFriend]);

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>
            Alege cel mai bun cadou pentru {name}
          </Text>
        </View>
        {interests.interests && interests.interests.includes(0) ? (
          <View>
            <Text style={styles.textGift}>🃏 Jocuri de cărți</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalContainer}
            >
              {gifts.slice(0, 3).map((x) => {
                return (
                  <GiftCard
                    name={x.giftInformation.name}
                    price={x.giftInformation.price}
                    description={x.giftInformation.description}
                    image={x.giftImage}
                    onDetails={() =>
                      navigation.navigate("Display Gift Details", {
                        name: x.giftInformation.name,
                        price: x.giftInformation.price,
                        description: x.giftInformation.description,
                        image: x.giftImage,
                        userId: userId,
                        friendId: idFriend,
                        friendName: name,
                      })
                    }
                  />
                );
              })}
            </ScrollView>
          </View>
        ) : null}
        {interests.interests && interests.interests.includes(1) ? (
          <View>
            <Text style={styles.textGift}>🎮 Jocuri video</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalContainer}
            >
              {gifts.slice(3, 6).map((x) => {
                return (
                  <GiftCard
                    name={x.giftInformation.name}
                    price={x.giftInformation.price}
                    description={x.giftInformation.description}
                    image={x.giftImage}
                    onDetails={() =>
                      navigation.navigate("Display Gift Details", {
                        name: x.giftInformation.name,
                        price: x.giftInformation.price,
                        description: x.giftInformation.description,
                        image: x.giftImage,
                        userId: userId,
                        friendId: idFriend,
                        friendName: name,
                      })
                    }
                  />
                );
              })}
            </ScrollView>
          </View>
        ) : null}
        {interests.interests && interests.interests.includes(2) ? (
          <View>
            <Text style={styles.textGift}>
              🎶 Muzică & Festivaluri muzicale
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalContainer}
            >
              {gifts.slice(6, 9).map((x) => {
                return (
                  <GiftCard
                    name={x.giftInformation.name}
                    price={x.giftInformation.price}
                    description={x.giftInformation.description}
                    image={x.giftImage}
                    onDetails={() =>
                      navigation.navigate("Display Gift Details", {
                        name: x.giftInformation.name,
                        price: x.giftInformation.price,
                        description: x.giftInformation.description,
                        image: x.giftImage,
                        userId: userId,
                        friendId: idFriend,
                        friendName: name,
                      })
                    }
                  />
                );
              })}
            </ScrollView>
          </View>
        ) : null}
        {interests.interests && interests.interests.includes(3) ? (
          <View>
            <Text style={styles.textGift}>🎤 Interpretare vocală</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalContainer}
            >
              {gifts.slice(9, 12).map((x) => {
                return (
                  <GiftCard
                    name={x.giftInformation.name}
                    price={x.giftInformation.price}
                    description={x.giftInformation.description}
                    image={x.giftImage}
                    onDetails={() =>
                      navigation.navigate("Display Gift Details", {
                        name: x.giftInformation.name,
                        price: x.giftInformation.price,
                        description: x.giftInformation.description,
                        image: x.giftImage,
                        userId: userId,
                        friendId: idFriend,
                        friendName: name,
                      })
                    }
                  />
                );
              })}
            </ScrollView>
          </View>
        ) : null}
        {interests.interests && interests.interests.includes(4) ? (
          <View>
            <Text style={styles.textGift}>
              💄 Frumusețe & Îngrijire personală
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalContainer}
            >
              {gifts.slice(12, 15).map((x) => {
                return (
                  <GiftCard
                    name={x.giftInformation.name}
                    price={x.giftInformation.price}
                    description={x.giftInformation.description}
                    image={x.giftImage}
                    onDetails={() =>
                      navigation.navigate("Display Gift Details", {
                        name: x.giftInformation.name,
                        price: x.giftInformation.price,
                        description: x.giftInformation.description,
                        image: x.giftImage,
                        userId: userId,
                        friendId: idFriend,
                        friendName: name,
                      })
                    }
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
    paddingLeft: 16,
  },
  textHeader: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 28,
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
    marginHorizontal: 16,
    marginVertical: 16,
  },
  textTagContainer: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    color: Colors.colors.darkDustyPurple,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  horizontalContainer: {
    paddingLeft: 10,
  },
});

export default DisplayGiftSuggestionsScreen;
