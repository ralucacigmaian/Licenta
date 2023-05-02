import { useContext, useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import Button from "../components/Button";
import { firebase } from "app/config.js";
import { Colors } from "../utils/colors";
import { UserContext } from "../context/AuthContext";
import {
  registerForPushNotificationsAsync,
  scheduleNotification,
  sendPushNotification,
  sendPushNotificationHandler,
} from "../notifications/notifications";
import * as Notifications from "expo-notifications";
import { getUsersFriend, getUsersNotification } from "../database/database";
import { getImageURL } from "../database/database";
import Category from "../components/Category";
import { Icons } from "../components/Icons";
import HomeScreenCard from "../components/HomeScreenCard";
import { useFocusEffect } from "@react-navigation/native";
import { NameDay } from "../utils/nameDay";

function HomeScreen({ navigation }) {
  const [user, setUser] = useState();
  const [userId, setUserId] = useState(null);
  const authenticatedUser = useContext(UserContext);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setUser(snapshot.data());
          const userName = snapshot.data();
          authenticatedUser.getUserName(userName.name);
        } else {
          console.log("User doesn't exist");
        }
      });
  }, []);

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) =>
  //     setExpoPushToken(token)
  //   );

  //   authenticatedUser.getExpoPushToken(expoPushToken);

  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       setNotification(notification);
  //     });

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log(response);
  //     });

  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  useEffect(() => {
    async function sendNotification() {
      try {
        let response = [];
        response = await getUsersNotification(authenticatedUser.uid);
        setNotification(response);
        return response;
      } catch (error) {
        console.log(error);
      }
    }

    sendNotification().then((response) => {
      for (const key in response) {
        const birthdate = new Date(response[key].birthday);
        const today = new Date();
        let nextBirthday = new Date(
          today.getFullYear(),
          birthdate.getMonth(),
          birthdate.getDate()
        );
        if (today > nextBirthday) {
          nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        const diffTime = nextBirthday.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        scheduleNotification(
          "Atenție!",
          `Ziua prietenului tău, ${response[key].name}, este în ${diffDays} zile`,
          11,
          20
        );
      }
    });
  }, []);

  const [friends, setFriends] = useState();
  const [selectedCategory, setSelectedCategory] = useState("Toate");

  // useEffect(() => {
  //   const fetchFriends = async () => {
  //     const friendsArray = await getUsersFriend(authenticatedUser.uid);
  //     setFriends(friendsArray);
  //   };
  //   fetchFriends();
  // }, [selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      const fetchFriends = async () => {
        const friendsArray = await getUsersFriend(authenticatedUser.uid);
        setFriends(friendsArray);
      };
      fetchFriends();
    }, [])
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchFriends = async () => {
  //       const friendsArray = await getUsersFriend(userId);
  //       setRetrievedArray(friendsArray);
  //       setLoading(false);
  //     };
  //     fetchFriends();
  //   }, [userId, numberOfFriends])
  // );

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  let numberOfFriends;

  if (friends) {
    numberOfFriends = friends.length;
  }

  let oneWeekFriends = [];

  const handleShowAll = () => {
    if (friends) {
      friends.map((x) => {
        const birthdate = new Date(x.birthday);
        const today = new Date();
        let nextBirthday = new Date(
          today.getFullYear(),
          birthdate.getMonth(),
          birthdate.getDate()
        );
        if (today > nextBirthday) {
          nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        const diffTime = nextBirthday.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7 && x.receivedGift === 0) {
          oneWeekFriends.push(x);
        }
      });
    }
  };

  handleShowAll();

  let oneWeekNameFriends = [];
  let nameDayFriends = [];

  const handleShowName = () => {
    if (friends) {
      NameDay.forEach((day) => {
        day.name.forEach((name) => {
          friends.map((x) => {
            if (x.name.includes(name) && !nameDayFriends.includes(x)) {
              nameDayFriends.push(x);
            }
          });
        });
      });
      if (nameDayFriends) {
        NameDay.map((x) => {
          const date = x.date;
          const name = [x.name];
          nameDayFriends.map((y) => {
            if (name.some((z) => z.includes(y.name))) {
              const today = new Date();
              const dateParts = date.split(" ");
              const month = dateParts[1];
              const day = parseInt(dateParts[0], 10) + 1;
              const year = today.getFullYear();
              const newDate = new Date(`${month} ${day}, ${year}`);

              const timeDiff = newDate.getTime() - today.getTime();
              const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

              if (daysDiff <= 7 && y.receivedGift === 0) {
                const friendWithNameDay = { ...y, nameDay: newDate };
                oneWeekNameFriends.push(friendWithNameDay);
              }
            }
          });
        });
      }
    }
  };

  handleShowName();
  console.log(oneWeekNameFriends);

  return (
    <SafeAreaView style={styles.container}>
      {user && (
        <View style={styles.containerWelcome}>
          <Text style={styles.textWelcome}>Bine ai venit, {user.name}!</Text>
        </View>
      )}
      <View style={styles.containerHorizontal}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 50,
            marginHorizontal: 16,
          }}
        >
          <View style={styles.containerCategory}>
            <Category
              iconType={Icons.MaterialIcons}
              iconName="event-note"
              categoryName="Toate"
              isSelected={selectedCategory === "Toate"}
              onPress={handleCategoryPress}
            />
          </View>
          <View style={styles.containerCategory}>
            <Category
              iconType={Icons.FontAwesome5}
              iconName="birthday-cake"
              categoryName="Zile de naștere"
              isSelected={selectedCategory === "Zile de naștere"}
              onPress={handleCategoryPress}
            />
          </View>
          <View style={styles.containerCategory}>
            <Category
              iconType={Icons.FontAwesome5}
              iconName="crown"
              categoryName="Zile onomastice"
              isSelected={selectedCategory === "Zile onomastice"}
              onPress={handleCategoryPress}
            />
          </View>
          <View style={styles.containerCategory}>
            <Category
              iconType={Icons.FontAwesome5}
              iconName="user-friends"
              categoryName="Familie"
              isSelected={selectedCategory === "Familie"}
              onPress={handleCategoryPress}
            />
          </View>
          <View style={styles.containerCategory}>
            <Category
              iconType={Icons.FontAwesome5}
              iconName="users"
              categoryName="Prieteni"
              isSelected={selectedCategory === "Prieteni"}
              onPress={handleCategoryPress}
            />
          </View>
          <View style={styles.containerCategory}>
            <Category
              iconType={Icons.FontAwesome5}
              iconName="gifts"
              categoryName="Sărbători"
              isSelected={selectedCategory === "Sărbători"}
              onPress={handleCategoryPress}
            />
          </View>
        </ScrollView>
      </View>
      {numberOfFriends !== undefined ? (
        numberOfFriends > 0 ? (
          <View style={styles.containerEvents}>
            {selectedCategory === "Toate"
              ? oneWeekFriends.map((x) => <View></View>)
              : null}
            {selectedCategory === "Zile de naștere" ? (
              <View style={styles.containerOneWeek}>
                <Text style={styles.textHeaderOneWeek}>
                  Zile de naștere în următoarele 7 zile
                </Text>
                <ScrollView>
                  {oneWeekFriends.map((x) => {
                    const birthday = x.birthday;
                    const auxBirthday = new Date(birthday);
                    const options = {
                      day: "numeric",
                      month: "long",
                    };
                    const outputBirthday = auxBirthday.toLocaleDateString(
                      "ro-RO",
                      options
                    );

                    const today = new Date();
                    let nextBirthday = new Date(
                      today.getFullYear(),
                      auxBirthday.getMonth(),
                      auxBirthday.getDate()
                    );

                    if (today > nextBirthday) {
                      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
                    }
                    const diffTime = nextBirthday.getTime() - today.getTime();
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <View style={styles.containerEachOneWeek}>
                        <HomeScreenCard
                          photo={x.image}
                          name={x.name}
                          birthday={outputBirthday}
                          daysLeft={diffDays}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            ) : null}
            {selectedCategory === "Prieteni" ? (
              <View style={styles.containerOneWeek}>
                <Text style={styles.textHeaderOneWeek}>
                  Zile de naștere în următoarele 7 zile
                </Text>
                <ScrollView>
                  {oneWeekFriends.map((x) => {
                    const birthday = x.birthday;
                    const auxBirthday = new Date(birthday);
                    const options = {
                      day: "numeric",
                      month: "long",
                    };
                    const outputBirthday = auxBirthday.toLocaleDateString(
                      "ro-RO",
                      options
                    );

                    const today = new Date();
                    let nextBirthday = new Date(
                      today.getFullYear(),
                      auxBirthday.getMonth(),
                      auxBirthday.getDate()
                    );

                    if (today > nextBirthday) {
                      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
                    }
                    const diffTime = nextBirthday.getTime() - today.getTime();
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <View style={styles.containerEachOneWeek}>
                        <HomeScreenCard
                          photo={x.image}
                          name={x.name}
                          birthday={outputBirthday}
                          daysLeft={diffDays}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            ) : null}
            {selectedCategory === "Zile onomastice" ? (
              <View style={styles.containerOneWeek}>
                <Text style={styles.textHeaderOneWeek}>
                  Zile onomastice în următoarele 7 zile
                </Text>
                <ScrollView>
                  {oneWeekNameFriends.map((x) => {
                    const nameDay = x.nameDay;
                    const auxNameDay = new Date(nameDay);
                    const options = {
                      day: "numeric",
                      month: "long",
                    };
                    const outputNameDay = auxNameDay.toLocaleDateString(
                      "ro-RO",
                      options
                    );

                    const today = new Date();
                    let nextNameDay = new Date(
                      today.getFullYear(),
                      auxNameDay.getMonth(),
                      auxNameDay.getDate()
                    );

                    if (today > nextNameDay) {
                      nextNameDay.setFullYear(nextNameDay.getFullYear() + 1);
                    }
                    const diffTime = nextNameDay.getTime() - today.getTime();
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <View style={styles.containerEachOneWeek}>
                        <HomeScreenCard
                          photo={x.image}
                          name={x.name}
                          nameday={outputNameDay}
                          daysLeft={diffDays}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.containerNoEvents}>
            <Text style={styles.textNoEvents}>
              Ne pare rău, nu ai adăugat niciun membru al familiei sau prieten
              încă!
            </Text>
          </View>
        )
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colors.backgroundColor,
  },
  containerWelcome: {
    marginLeft: 16,
  },
  containerCategory: {
    marginRight: 16,
  },
  containerHorizontal: {},
  textWelcome: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
  },
  containerNoEvents: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textNoEvents: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
    marginHorizontal: 16,
  },
  containerEvents: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  containerOneWeek: {},
  textHeaderOneWeek: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  containerEachOneWeek: {
    marginTop: 16,
  },
});

export default HomeScreen;
