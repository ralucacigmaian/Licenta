import { View, Text, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../utils/colors";
import Button from "../components/Button";
import { addImage, editEvent } from "../database/database";
import { UserContext } from "../context/AuthContext";
import { useContext } from "react";
import { showMessage } from "react-native-flash-message";

function PreviewMemoryScreen({ route, navigation }) {
  const { idEvent, image, eventType, name1, name2 } = route.params;
  const authenticatedUser = useContext(UserContext);

  const remakeMemory = () => {
    navigation.goBack();
  };

  const addMemory = async () => {
    const imagePath = `memories/${authenticatedUser.uid}/${idEvent}.jpeg`;
    const response = await addImage(image, imagePath);
    const responseEdit = await editEvent(authenticatedUser.uid, idEvent, {
      hasMemory: 1,
    });
    showMessage({
      message: "Amintirea a fost adăugată cu succes!",
      icon: "warning",
      style: { backgroundColor: Colors.colors.darkDustyPurple },
      titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
      textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
    });
    navigation.navigate("EventList");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {eventType === "Botez" && (
        <Text style={styles.textAddMemory}>
          Dorești să adaugi această amintire pentru botezului lui {name1}?
        </Text>
      )}
      {eventType === "Majorat" && (
        <Text style={styles.textAddMemory}>
          Dorești să adaugi această amintire pentru majoratul lui {name1}?
        </Text>
      )}
      {eventType === "Nuntă" && (
        <Text style={styles.textAddMemory}>
          Dorești să adaugi această amintire pentru nunta lui {name1} și {name2}
          ?
        </Text>
      )}
      <View style={styles.containerImage}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
      <View style={styles.containerButtons}>
        <Button
          backgroundColor="white"
          color={Colors.colors.darkDustyPurple}
          width={130}
          borderRadius={10}
          fontFamily="Montserrat-SemiBold"
          fontSize={16}
          shadowOpacity={0.1}
          onPress={remakeMemory}
        >
          Refă amintire
        </Button>
        <Button
          backgroundColor={Colors.colors.darkDustyPurple}
          color="white"
          width={130}
          borderRadius={10}
          fontFamily="Montserrat-SemiBold"
          fontSize={16}
          shadowOpacity={0.1}
          onPress={addMemory}
        >
          Adaugă amintire
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  textAddMemory: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
  containerImage: {
    marginTop: 32,
  },
  image: {
    width: 300,
    height: 500,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Colors.colors.darkDustyPurple,
  },
  containerButtons: {
    marginTop: 32,
    flexDirection: "row",
    width: 300,
    justifyContent: "space-between",
  },
});

export default PreviewMemoryScreen;
