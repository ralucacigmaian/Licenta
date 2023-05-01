import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { UserContext } from "../context/AuthContext";
import { getUsersFriend } from "../database/database";
import { Colors } from "../utils/colors";
import LottieView from "lottie-react-native";
import SentGiftCard from "../components/SentGiftCard";

function DisplayGiftHistoryScreen() {
  const [giftSent, setGiftSent] = useState();
  const authenticatedUser = useContext(UserContext);

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsArray = await getUsersFriend(authenticatedUser.uid);
      const giftIsSent = friendsArray.filter(
        (friend) => friend.receivedGift === 1
      );
      setGiftSent(giftIsSent);
    };
    fetchFriends();
  }, []);

  let numberOfSentGifts;

  if (giftSent) {
    numberOfSentGifts = giftSent.length;
  }

  const today = new Date();
  const now = new Date();
  now.setHours(0, 0, 0, 0); // set time of day to 0:00:00.000
  const today2 = now.getTime();
  const oneWeekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;

  let giftSentToday = [];
  let giftSentWeek = [];

  if (giftSent && giftSent.length !== 0) {
    const getTodayGifts = () => {
      if (giftSent) {
        giftSent.map((x) => {
          if (new Date(x.giftDate).toDateString() === today.toDateString()) {
            giftSentToday.push(x);
          }
        });
      }
    };
    getTodayGifts();

    const getWeekGifts = () => {
      if (giftSent) {
        giftSent.map((x) => {
          const giftDate = new Date(x.giftDate);
          if (giftDate.getTime() >= oneWeekAgo && giftDate.getTime() < today2) {
            giftSentWeek.push(x);
          }
        });
      }
    };

    getWeekGifts();
  }

  return (
    <View style={styles.container}>
      {numberOfSentGifts !== undefined ? (
        numberOfSentGifts > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {giftSentToday && (
              <View>
                <Text style={styles.textTodayGifts}>
                  Cadouri trimise astăzi
                </Text>
                <View style={styles.containerTodayGifts}>
                  {giftSentToday.map((x) => (
                    <View style={styles.containerForTodayGifts}>
                      <SentGiftCard
                        friendName={x.name}
                        giftName={x.giftName}
                        price={x.giftPrice}
                        photo={x.image}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
            {giftSentWeek && (
              <View style={styles.containerForWeekGifts}>
                <Text style={styles.textWeekGifts}>
                  Cadouri trimise în ultimele 7 zile
                </Text>
                <View style={styles.containerWeekGifts}>
                  {giftSentWeek.map((x) => (
                    <View style={styles.containerForWeekGifts}>
                      <SentGiftCard
                        friendName={x.name}
                        giftName={x.giftName}
                        price={x.giftPrice}
                        photo={x.image}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        ) : (
          <View style={styles.containerNoGift}>
            <Text style={styles.textNoGifts}>
              Ne pare rău, nu ai trimis niciun cadou încă!
            </Text>
            <LottieView
              source={require("../utils/130394-christmas-gift.json")}
              autoPlay
              loop
              style={{
                width: 200,
                height: 200,
                backgroundColor: "white",
              }}
            />
          </View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  containerNoGift: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textNoGifts: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
  containerSentGifts: {
    justifyContent: "center",
    alignItems: "center",
  },
  textSentGifts: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  containerGift: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  containerTodayGifts: {
    justifyContent: "center",
    alignItems: "center",
  },
  textTodayGifts: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.dustyPurple,
    textAlign: "left",
  },
  containerForTodayGifts: {
    marginTop: 16,
  },
  textWeekGifts: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.dustyPurple,
  },
  containerWeekGifts: {
    justifyContent: "center",
    alignItems: "center",
  },
  containerForWeekGifts: {
    marginTop: 16,
  },
});

export default DisplayGiftHistoryScreen;
