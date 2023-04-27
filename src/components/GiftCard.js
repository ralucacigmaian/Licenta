import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  SafeAreaView,
} from "react-native";
import { Colors } from "../utils/colors";
import Button from "./Button";
import Icon, { Icons } from "./Icons";

function GiftCard({ image, name, price, description }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [favourite, setFavourite] = useState(false);

  return (
    <Pressable onPress={() => setModalVisible(true)}>
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <SafeAreaView style={styles.modalContainer}>
          <Pressable onPress={() => setModalVisible(false)}>
            <View style={styles.modalView}>
              <View style={styles.modalInformation}>
                <View style={styles.modalImageContainer}>
                  <Image source={{ uri: image }} style={styles.modalImage} />
                </View>
                <Text style={styles.textModalName}>{name}</Text>
                <Text style={styles.textModalDescription}>{description}</Text>
                <Text style={styles.textModalPrice}>{price}$</Text>
                <View style={styles.buttonModalCart}>
                  <Button
                    backgroundColor={Colors.colors.darkDustyPurple}
                    color="white"
                    width={200}
                  >
                    Add to cart
                  </Button>
                </View>
              </View>
            </View>
          </Pressable>
        </SafeAreaView>
      </Modal>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        <View style={styles.informationContainer}>
          <View style={styles.detailsContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textName}
            >
              {name}
            </Text>
            <Text style={styles.textPrice}>{price}$</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              backgroundColor={Colors.colors.darkDustyPurple}
              color="white"
              width={200}
            >
              Add to cart
            </Button>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    backgroundColor: Colors.colors.cardBackgroundColor,
    borderRadius: 10,
    marginRight: 10,
    // flexDirection: "row",
  },
  imageContainer: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    // width: "90%",
    height: 200,
    width: 250,
    // height: "80%",
    borderRadius: 10,
  },
  informationContainer: {
    justifyContent: "center",
    flexDirection: "column",
    marginLeft: 10,
    // width: "50%",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  textName: {
    fontFamily: "Montserrat-SemiBoldItalic",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
  textPrice: {
    fontFamily: "Montserrat-Light",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.colors.transparent,
    justifyContent: "center",
  },
  modalView: {
    margin: 16,
    backgroundColor: Colors.colors.backgroundColor,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    // flexDirection: "column",
  },
  modalImageContainer: {
    height: 160,
    width: 160,
    borderRadius: 160,
    backgroundColor: "white",
    position: "absolute",
    alignSelf: "center",
    marginTop: -80,
  },
  modalImage: {
    height: 160,
    width: 160,
    borderRadius: 160,
  },
  textModalName: {
    marginTop: 90,
    fontFamily: "Montserrat-SemiBoldItalic",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
  },
  textModalDescription: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    textAlign: "center",
    color: Colors.colors.dustyPurple,
    marginTop: 10,
  },
  textModalPrice: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    textAlign: "center",
    color: Colors.colors.darkDustyPurple,
    marginTop: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  buttonModalCart: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});

export default GiftCard;
