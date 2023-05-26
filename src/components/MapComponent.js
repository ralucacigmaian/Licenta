import { View, Text, StyleSheet, Image } from "react-native";

function MapComponent({ image, name }) {
  return (
    <View>
      <Image source={{ uri: { image } }} style={styles.image} />
      <Text>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default MapComponent;
