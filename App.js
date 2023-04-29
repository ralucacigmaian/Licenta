import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Colors } from "./src/utils/colors";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import HomeScreen from "./src/screens/HomeScreen";
import DisplayGiftSuggestionsScreen from "./src/screens/DisplayGiftSuggestions";
import { firebase } from "./config";
import { useEffect, useState, useRef } from "react";
import Icon, { Icons } from "./src/components/Icons";
import * as Animatable from "react-native-animatable";
import DisplayFriendsScreen from "./src/screens/DisplayFriendsScreen";
import UserContextProvider from "./src/context/AuthContext";
import GiftDetailsScreen from "./src/screens/GiftDetailsScreen";
import PaymentScreen from "./src/screens/PaymentScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabArray = [
  {
    route: "Home",
    label: "Home",
    type: Icons.Ionicons,
    activeIcon: "ios-home",
    inactiveIcon: "ios-home-outline",
    component: HomeScreen,
  },
  // {
  //   route: "CreateProfile",
  //   label: "Create Your Profile",
  //   type: Icons.MaterialCommunityIcons,
  //   activeIcon: "account-circle",
  //   inactiveIcon: "account-circle-outline",
  //   component: CreateProfileScreen,
  // },
  {
    route: "AddFriend",
    label: "Add Friends",
    type: Icons.Ionicons,
    activeIcon: "ios-people-circle",
    inactiveIcon: "ios-people-circle-outline",
    component: DisplayFriendsScreen,
  },
];

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);

  // useEffect(() => {
  //   if (focused) {
  //     viewRef.current.animate({
  //       0: { scale: 0.5, rotate: "0deg" },
  //       1: { scale: 1.5, rotate: "360deg" },
  //     });
  //   } else {
  //     viewRef.current.animate({
  //       0: { scale: 1.5, rotate: "360deg" },
  //       1: { scale: 1, rotate: "0deg" },
  //     });
  //   }
  // }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.bottomTab}
    >
      <Animatable.View
        style={styles.bottomTab}
        // animation="zoomIn"
        ref={viewRef}
        duration={1000}
      >
        <Icon
          name={focused ? item.activeIcon : item.inactiveIcon}
          type={item.type}
          size={24}
          color={
            focused ? Colors.colors.dustyPurple : Colors.colors.dustyPurple
          }
        />
      </Animatable.View>
    </TouchableOpacity>
  );
};

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      // key={updateBottomTab}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          position: "absolute",
          bottom: 16,
          right: 16,
          left: 16,
          borderRadius: 16,
          backgroundColor: Colors.colors.darkDustyPurple,
          // opacity: 0.7,
          // backgroundColor: Colors.colors.lightPurple2,
        },
      }}
    >
      {TabArray.map((item, index) => {
        return (
          <Tab.Screen
            name={item.route}
            component={item.component}
            // listeners={{ focus: handleNavigation }}
            options={{
              tabBarShowLabel: false,
              // unmountOnBlur: true,
              lazy: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

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
              options={{ headerShown: false }}
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
