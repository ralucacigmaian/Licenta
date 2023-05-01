import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
  Image,
  Pressable,
} from "react-native";
import { Colors } from "./src/utils/colors";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import {
  NavigationContainer,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import HomeScreen from "./src/screens/HomeScreen";
import DisplayGiftSuggestionsScreen from "./src/screens/DisplayGiftSuggestions";
import { firebase } from "./config";
import { useEffect, useState, useRef, useContext, useCallback } from "react";
import Icon, { Icons } from "./src/components/Icons";
import * as Animatable from "react-native-animatable";
import DisplayFriendsScreen from "./src/screens/DisplayFriendsScreen";
import UserContextProvider from "./src/context/AuthContext";
import GiftDetailsScreen from "./src/screens/GiftDetailsScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import { getImageURL } from "./src/database/database";
import DisplayGiftHistoryScreen from "./src/screens/DisplayGiftHistoryScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       alert("Failed to get push token for push notification!");
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     // console.log(token);
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }

//   if (Platform.OS === "android") {
//     Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   return token;
// }

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  // const [userPhoto, setUserPhoto] = useState();

  // const [expoPushToken, setExpoPushToken] = useState("");
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) =>
  //     setExpoPushToken(token)
  //   );

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

  // console.log(expoPushToken);

  let [fontsLoaded] = useFonts({
    "Montserrat-Black": require("app/assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-BlackItalic": require("app/assets/fonts/Montserrat-BlackItalic.ttf"),
    "Montsserat-Bold": require("app/assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-BoldItalic": require("app/assets/fonts/Montserrat-BoldItalic.ttf"),
    "Montserrat-ExtraBold": require("app/assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-ExtraBoldItalic": require("app/assets/fonts/Montserrat-ExtraBoldItalic.ttf"),
    "Montserrat-ExtraLight": require("app/assets/fonts/Montserrat-ExtraLight.ttf"),
    "Montserrat-ExtraLightItalic": require("app/assets/fonts/Montserrat-ExtraLightItalic.ttf"),
    "Montserrat-Italic-Variable": require("app/assets/fonts/Montserrat-Italic-VariableFont_wght.ttf"),
    "Montserrat-Italic": require("app/assets/fonts/Montserrat-Italic.ttf"),
    "Montserrat-Light": require("app/assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-LightItalic": require("app/assets/fonts/Montserrat-LightItalic.ttf"),
    "Montserrat-Medium": require("app/assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-MediumItalic": require("app/assets/fonts/Montserrat-MediumItalic.ttf"),
    "Montserrat-Regular": require("app/assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("app/assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-SemiBoldItalic": require("app/assets/fonts/Montserrat-SemiBoldItalic.ttf"),
    "Montserrat-Thin": require("app/assets/fonts/Montserrat-Thin.ttf"),
    "Montserrat-ThinItalic": require("app/assets/fonts/Montserrat-ThinItalic.ttf"),
    "Monserrat-Variable": require("app/assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  // console.log(userPhoto);

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // getUsersImage();

  function BottomTabNavigator({ navigation }) {
    const [userPhoto, setUserPhoto] = useState();
    // useEffect(() => {
    //   async function getUsersImage() {
    //     if (user) {
    //       const imagePath = `users/${user.uid}.jpeg`;
    //       const responseImage = await getImageURL(imagePath);
    //       setUserPhoto(responseImage);
    //     }
    //   }
    //   const interval = setInterval(() => {
    //     getUsersImage();
    //   }, 10);
    //   return () => clearInterval(interval);
    // }, []);
    useFocusEffect(
      useCallback(() => {
        async function getUsersImage() {
          if (user) {
            const imagePath = `users/${user.uid}.jpeg`;
            const responseImage = await getImageURL(imagePath);
            setUserPhoto(responseImage);
          }
        }
        getUsersImage();
      }, [])
    );
    return (
      <Tab.Navigator
        screenOptions={{
          title: null,
          headerShown: true,
          headerShadowVisible: false,
          tabBarStyle: {
            // height: 60,
            // position: "absolute",
            // bottom: 16,
            // right: 16,
            // left: 16,
            // borderRadius: 16,
            backgroundColor: Colors.colors.dustyPurple,
            // opacity: 0.7,
            // backgroundColor: Colors.colors.lightPurple2,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Icon
                type={Icons.Ionicons}
                name={focused ? "ios-home" : "ios-home-outline"}
                size={30}
                color="white"
              />
            ),
            tabBarLabel: "Acasă",
            tabBarLabelStyle: {
              fontFamily: "Montserrat-Regular",
              fontSize: 16,
              color: "white",
            },
            headerRight: () => (
              <Pressable
                style={{
                  marginRight: 10,
                  paddingTop: 55,
                }}
                onPress={() =>
                  navigation.navigate("Profilul Meu", { userId: user.uid })
                }
              >
                <Image
                  source={{ uri: userPhoto }}
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                />
              </Pressable>
            ),
          }}
        />
        <Tab.Screen
          name="Add Friends"
          component={DisplayFriendsScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Icon
                type={Icons.Ionicons}
                name={
                  focused ? "ios-people-circle" : "ios-people-circle-outline"
                }
                size={30}
                color="white"
              />
            ),
            tabBarLabel: "Prieteni",
            tabBarLabelStyle: {
              fontFamily: "Montserrat-Regular",
              fontSize: 16,
              color: "white",
            },
          }}
        />
      </Tab.Navigator>
    );
  }

  if (!user) {
    return (
      <UserContextProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                  headerShown: true,
                  headerLargeTitleShadowVisible: false,
                  headerBackTitleVisible: false,
                  headerTintColor: Colors.colors.darkDustyPurple,
                  title: null,
                }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                  headerShown: true,
                  headerLargeTitleShadowVisible: false,
                  headerBackTitleVisible: false,
                  headerTintColor: Colors.colors.darkDustyPurple,
                  title: null,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </UserContextProvider>
    );
  }

  return (
    <UserContextProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Bottom Navigator"
              component={BottomTabNavigator}
              options={{
                headerShown: false,
                headerLargeTitleShadowVisible: false,
                title: null,
              }}
            />
            <Stack.Screen
              name="Display Gift Suggestions"
              component={DisplayGiftSuggestionsScreen}
              options={{
                headerShown: true,
                headerLargeTitleShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: Colors.colors.darkDustyPurple,
                title: null,
              }}
            />
            <Stack.Screen
              name="Display Gift Details"
              component={GiftDetailsScreen}
              options={{
                headerShown: true,
                headerTransparent: true,
                headerLargeTitleShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: Colors.colors.darkDustyPurple,
                title: null,
              }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{
                headerShow: true,
                headerLargeTitleShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: Colors.colors.darkDustyPurple,
                title: null,
              }}
            />
            <Stack.Screen
              name="Profilul Meu"
              component={UserProfileScreen}
              options={{
                headerShown: true,
                headerLargeTitleShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: Colors.colors.darkDustyPurple,
                headerTitleStyle: {
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: 20,
                },
              }}
            />
            <Stack.Screen
              name="Istoricul Cadourilor"
              component={DisplayGiftHistoryScreen}
              options={{
                headerShown: true,
                headerLargeTitleShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: Colors.colors.darkDustyPurple,
                headerTitleStyle: {
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: 20,
                },
              }}
            />
            {/* <Stack.Screen name="CreateProfile" component={CreateProfileScreen} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </UserContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
});
