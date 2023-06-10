import { View, Text, StyleSheet, Image } from "react-native";
import { Colors } from "../utils/colors";

function DisplayMemoryScreen({ route }) {
  const { image, eventType, name1, name2 } = route.params;

  return (
    <View style={styles.container}>
      {eventType === "Botez" && (
        <Text style={styles.textMemory}>
          Amintirea de la botezul lui {name1}
        </Text>
      )}
      {eventType === "Majorat" && (
        <Text style={styles.textMemory}>
          Amintirea de la majoratul lui {name1}
        </Text>
      )}
      {eventType === "Nuntă" && (
        <Text style={styles.textMemory}>
          Amintirea de la nunta lui {name1} și {name2}
        </Text>
      )}
      <View style={styles.containerImage}>
        <Image source={{ uri: image }} style={styles.image} />
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
  textMemory: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
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
});

export default DisplayMemoryScreen;
