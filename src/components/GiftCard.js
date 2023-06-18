import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Colors } from "../utils/colors";
import Button from "./Button";
import Icon, { Icons } from "./Icons";

const { width } = Dimensions.get("screen");

function GiftCard({ image, name, price, description, onDetails }) {
  const [modalVisible, setModalVisible] = useState(false);
  // const [favourite, setFavourite] = useState(false);
  // const rating = 5;

  // const handleRating = () => {
  //   const stars = [];
  //   for (let i = 0; i < rating; i++) {
  //     stars.push(
  //       <Icon
  //         type={Icons.AntDesign}
  //         name="star"
  //         size={16}
  //         color={Colors.colors.darkDustyPurple}
  //       />
  //     );
  //   }
  //   return stars;
  // };

  return (
    <Pressable onPress={onDetails}>
      <View style={styles.container}>
        <View style={styles.containerImage}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        <View style={styles.containerName}>
          <Text numberOfLines={1} style={styles.textName}>
            {name}
          </Text>
        </View>
        {/* <View style={styles.containerRating}>{handleRating()}</View> */}
        <View style={styles.containerPrice}>
          <Text style={styles.textPrice}>{price} RON</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    width: 193.5,
    height: 250,
    backgroundColor: Colors.colors.cardBackgroundColor,
    // borderColor: "black",
    // borderWidth: 1,
    borderRadius: 20,
    marginBottom: 16,
  },
  containerImage: {
    // justifyContent: "center",
    alignItems: "center",
  },
  containerName: {
    // marginHorizontal: 10,
    marginTop: 4,
  },
  containerPrice: {
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 4,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "80%",
    width: "90%",
    borderRadius: 20,
    marginTop: 10,
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
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
    marginTop: -30,
    marginHorizontal: 16,
  },
  textPrice: {
    fontFamily: "Montserrat-SemiBold",
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
  containerRating: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -10,
  },
});

export default GiftCard;
