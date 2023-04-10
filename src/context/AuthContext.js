import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext({
  uid: "",
  getUserId: () => {},
  logout: () => {},
});

function UserContextProvider({ children }) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUserId() {
      const storeUserId = await AsyncStorage.getItem("uid");
      if (storeUserId) {
        setUserId(storeUserId);
      }
    }
    fetchUserId();
  }, []);
  function getUserId(id) {
    setUserId(id);
    AsyncStorage.setItem("uid", id);
  }
  function logout() {
    setUserId(null);
  }
  const value = {
    uid: userId,
    getUserId: getUserId,
    logout: logout,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider;
