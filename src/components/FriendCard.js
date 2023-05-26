import { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Colors } from "../utils/colors";
import Button from "./Button";
import { getUsersSentFriendRequests } from "../database/database";
import { UserContext } from "../context/AuthContext";
import { addFriendRequest, deleteFriendRequest } from "../database/database";
import { useFocusEffect } from "@react-navigation/native";

function FriendCard({
  image,
  name,
  firstInterest,
  secondInterest,
  onPress,
  idFriend,
}) {
  const [usersSentRequests, setUsersSentRequests] = useState();
  const [idFriends, setIdFriends] = useState();
  const [isSent, setIsSent] = useState(false);
  const [idFriendRequest, setIdFriendRequest] = useState();
  const authenticatedUser = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      const getFriendRequests = async () => {
        const responseSentRequests = await getUsersSentFriendRequests(
          authenticatedUser.uid
        );
        setUsersSentRequests(responseSentRequests);
      };
      getFriendRequests();
    }, [])
  );

  useEffect(() => {
    if (usersSentRequests) {
      const sentRequestIds = usersSentRequests.map(
        (request) => request.idFriend
      );
      setIdFriends(sentRequestIds);
      setIsSent(sentRequestIds.includes(idFriend));
    }
  }, [usersSentRequests]);

  const sendFriendRequest = async () => {
    const response = await addFriendRequest(authenticatedUser.uid, idFriend);
    setIdFriendRequest(response);
    setIsSent(true);
  };

  const removeFriendRequest = async () => {
    const response = await deleteFriendRequest(idFriend);
    setIsSent(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.containerHeader}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.containerButton}>
            {isSent ? (
              <Button
                backgroundColor="white"
                color={Colors.colors.darkDustyPurple}
                width={80}
                borderRadius={10}
                fontFamily="Montserrat-SemiBold"
                fontSize={14}
                textAlign="center"
                shadowOpacity={0.1}
                onPress={removeFriendRequest}
              >
                Cerere trimisă
              </Button>
            ) : (
              <Button
                backgroundColor={Colors.colors.darkDustyPurple}
                color="white"
                width={80}
                borderRadius={10}
                fontFamily="Montserrat-SemiBold"
                fontSize={14}
                textAlign="center"
                shadowOpacity={0.1}
                onPress={sendFriendRequest}
              >
                Adaugă prieten
              </Button>
            )}
          </View>
        </View>
        <View style={styles.containerBody}>
          <Text style={styles.textName}>{name}</Text>
        </View>
        <View style={styles.containerFooter}>
          <Text style={styles.textInterest}>{firstInterest}</Text>
          <Text style={styles.textInterest}>{secondInterest}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 193.5,
    height: 165,
    backgroundColor: Colors.colors.cardBackgroundColor,
    // borderColor: "black",
    // borderWidth: 1,
    borderRadius: 20,
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 70,
  },
  containerBody: {
    marginTop: 8,
    marginLeft: 8,
  },
  textName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    color: Colors.colors.darkDustyPurple,
  },
  containerFooter: {
    // flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
  },
  textInterest: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: Colors.colors.darkDustyPurple,
  },
  pressed: {
    opacity: 0.9,
  },
});

export default FriendCard;
