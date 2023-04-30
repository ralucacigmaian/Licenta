import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { async } from "@firebase/util";

export const UserContext = createContext({
  uid: "",
  fid: "",
  userName: "",
  friendName: "",
  expoPushToken: "",
  getUserId: () => {},
  getFriendId: () => {},
  getUserName: () => {},
  getFriendName: () => {},
  getExpoPushToken: () => {},
  logout: () => {},
});

function UserContextProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [friendId, setFriendId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [friendName, setFriendName] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState(null);

  useEffect(() => {
    async function fetchUserId() {
      const storeUserId = await AsyncStorage.getItem("uid");
      if (storeUserId) {
        setUserId(storeUserId);
      }
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    async function fetchFriendId() {
      const storeFriendId = await AsyncStorage.getItem("fid");
      if (storeFriendId) {
        setFriendId(storeFriendId);
      }
    }
    fetchFriendId();
  }, []);

  useEffect(() => {
    async function fetchUserName() {
      const storeUserName = await AsyncStorage.getItem("userName");
      if (storeUserName) {
        setUserName(storeUserName);
      }
    }
    fetchUserName();
  }, []);

  useEffect(() => {
    async function fetchFriendName() {
      const storeFriendName = await AsyncStorage.getItem("friendName");
      if (storeFriendName) {
        setFriendName(storeFriendName);
      }
    }
    fetchFriendName();
  }, []);

  useEffect(() => {
    async function fetchExpoPushToken() {
      const storeExpoPushToken = await AsyncStorage.getItem("expoPushToken");
      if (storeExpoPushToken) {
        setExpoPushToken(storeExpoPushToken);
      }
    }
    fetchExpoPushToken();
  }, []);

  function getUserId(id) {
    setUserId(id);
    AsyncStorage.setItem("uid", id);
  }

  function getFriendId(id) {
    setFriendId(id);
    AsyncStorage.setItem("fid", id);
  }

  function getUserName(name) {
    setUserName(name);
    AsyncStorage.setItem("userName", name);
  }

  function getFriendName(name) {
    setFriendName(name);
    AsyncStorage.setItem("friendName", name);
  }

  function getExpoPushToken(token) {
    setExpoPushToken(token);
    AsyncStorage.setItem("expoPushToken", token);
  }

  function logout() {
    setUserId(null);
  }
  const value = {
    uid: userId,
    fid: friendId,
    userName: userName,
    friendName: friendName,
    expoPushToken: expoPushToken,
    getUserId: getUserId,
    getFriendId: getFriendId,
    getUserName: getUserName,
    getFriendName: getFriendName,
    getExpoPushToken: getExpoPushToken,
    logout: logout,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider;
