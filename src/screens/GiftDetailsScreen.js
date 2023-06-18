import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../utils/colors";
import Icon, { Icons } from "../components/Icons";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import ReviewCard from "../components/ReviewCard";
import { showMessage } from "react-native-flash-message";
import { addReview, getReviews } from "../database/database";
import { firebase } from "app/config.js";

function GiftDetailsScreen({ route, navigation }) {
  const {
    name,
    price,
    description,
    image,
    userId,
    friendId,
    friendName,
    giftIndex,
    giftCode,
  } = route.params;

  console.log(`Gift Details Screen: ${userId} + ${friendId} + ${friendName}`);

  const rating = 5;

  const [usersArray, setUsersArray] = useState();
  const [reviewsArray, setReviewsArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      const userArray = [];
      const responseUsers = await firebase
        .firestore()
        .collection("users")
        .get();
      for (const user of responseUsers.docs) {
        userArray.push({
          id: user.id,
          name: user.data().name,
          birthday: user.data().birthdateToAdd.toDate(),
          email: user.data().email,
          phoneNumber: user.data().phoneNumber,
          interests: user.data().selectedInterests,
        });
      }
      setUsersArray(userArray);
    };

    getUsers().catch((error) => {
      console.log("Error getting users: ", error);
    });

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const reviews = await getReviews();
        setReviewsArray(reviews);
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // console.log(reviewsArray);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);

  const handleViewReviews = () => {
    setIsOpen(true);
  };

  const handleAddReview = () => {
    setIsOpen(false);
    setIsOpenAdd(true);
    setDefaultRating(0);
  };

  const [defaultRating, setDefaultRating] = useState(0);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  console.log(defaultRating);

  const [reviewDescription, setReviewDescription] = useState("");
  const [date, setDate] = useState(new Date());

  const handleOnChange = (text, input) => {
    setReviewDescription((prevState) => ({ ...prevState, [input]: text }));
  };

  const submitReview = async () => {
    let valid = true;

    if (defaultRating === 0) {
      valid = false;
      showMessage({
        message: "Vă rugăm să selectați nota!",
        icon: "info",
        style: { backgroundColor: Colors.colors.darkDustyPurple },
        titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
        textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
      });
    }

    if (!reviewDescription) {
      valid = false;
      showMessage({
        message: "Vă rugăm să introduceți descrierea review-ului!",
        icon: "info",
        style: { backgroundColor: Colors.colors.darkDustyPurple },
        titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
        textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
      });
    }

    if (valid) {
      const response = await addReview(
        userId,
        giftIndex,
        giftCode,
        defaultRating,
        reviewDescription.description,
        date
      );

      const newReview = {
        idUser: userId,
        giftIndex: giftIndex,
        giftCode: giftCode,
        rating: defaultRating,
        reviewDescription: reviewDescription.description,
        date: date,
      };

      setReviewsArray((prevReviewsArray) => [...prevReviewsArray, newReview]);

      setIsOpenAdd(false);
      showMessage({
        message: "Review-ul a fost adăugat cu succes!",
        icon: "info",
        style: { backgroundColor: Colors.colors.darkDustyPurple },
        titleStyle: { fontFamily: "Montserrat-Regular", fontSize: 16 },
        textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14 },
      });
    }
  };

  const [numberOfFullStars, setNumberOfFullStars] = useState(0);
  const [existHalfStar, setExistHalfStar] = useState(false);

  useEffect(() => {
    if (reviewCount > 0) {
      let totalRating = 0;
      let countReviews = 0;

      for (const x of reviewsArray) {
        if (x.giftCode === giftCode && x.giftIndex) {
          totalRating = totalRating + x.rating;
          countReviews++;
        }
      }

      console.log("Total rating: ", totalRating);
      console.log("Count reviews: ", countReviews);

      const averageRating = totalRating / countReviews;

      console.log("Average rating: ", averageRating);

      setNumberOfFullStars(Math.floor(averageRating));
      setExistHalfStar(averageRating % 1 !== 0);

      console.log("Number of full stars: ", numberOfFullStars);
      console.log("Exist half star: ", existHalfStar);
    } else {
      console.log("There are no reviews!");
    }
  }, [reviewsArray.length]);

  const handleRating = () => {
    const stars = [];

    for (let i = 0; i < numberOfFullStars; i++) {
      stars.push(
        <Icon
          type={Icons.FontAwesome}
          name="star"
          size={22}
          color={Colors.colors.darkDustyPurple}
        />
      );
    }

    if (existHalfStar) {
      stars.push(
        <Icon
          type={Icons.FontAwesome}
          name="star-half-empty"
          size={22}
          color={Colors.colors.darkDustyPurple}
        />
      );
    }

    if (reviewCount === 0) {
      for (let i = 0; i < 5; i++) {
        stars.push(
          <Icon
            type={Icons.FontAwesome}
            name="star-o"
            size={22}
            color={Colors.colors.darkDustyPurple}
          />
        );
      }
    }

    return stars;
  };

  const reviewCount = reviewsArray.filter(
    (x) => x.giftCode === giftCode && x.giftIndex === giftIndex
  ).length;

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Modal visible={isOpen} transparent={true} animationType="fade">
        <SafeAreaView style={styles.containerModal}>
          <View style={styles.modalView}>
            <View style={styles.containerButtons}>
              <Pressable
                style={({ pressed }) => pressed && styles.pressed}
                onPress={() => setIsOpen(false)}
              >
                <Icon
                  type={Icons.Ionicons}
                  name="ios-close"
                  size={18}
                  color={Colors.colors.gray}
                />
              </Pressable>
              <Pressable onPress={handleAddReview}>
                <Icon
                  type={Icons.Ionicons}
                  name="ios-add"
                  size={18}
                  color={Colors.colors.gray}
                />
              </Pressable>
            </View>
            <View style={styles.containerRatingModal}>{handleRating()}</View>
            <View style={styles.containerNumberOfRatingsModal}>
              <Text style={styles.textNumberOfReviews}>
                {reviewCount} review-uri
              </Text>
              {reviewCount === 0 && (
                <Text style={styles.textAddReview}>
                  Adaugă un review chiar acum!
                </Text>
              )}
            </View>
            {reviewsArray.length > 0 &&
              reviewsArray.map((x) => {
                const options = {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                };
                const formatDate = new Date(x.date);
                const formatter = new Intl.DateTimeFormat("ro-RO", options);
                const formattedDate = formatter.format(formatDate);
                if (x.giftCode === giftCode && x.giftIndex === giftIndex) {
                  const getUserName = usersArray.find((y) => x.idUser === y.id);
                  if (getUserName) {
                    return (
                      <ReviewCard
                        name={getUserName.name}
                        description={x.reviewDescription}
                        date={formattedDate}
                        numberOfStars={x.rating}
                      />
                    );
                  }
                }
              })}
          </View>
        </SafeAreaView>
      </Modal>
      <Modal visible={isOpenAdd} transparent={true} animationType="fade">
        <SafeAreaView style={styles.containerModal}>
          <View style={styles.modalView}>
            <Pressable
              style={({ pressed }) => pressed && styles.pressed}
              onPress={() => setIsOpenAdd(false)}
            >
              <Icon
                type={Icons.Ionicons}
                name="ios-close"
                size={18}
                color={Colors.colors.gray}
              />
            </Pressable>
            <View style={styles.containerAddRating}>
              <Text style={styles.textAddRating}>Acordă o notă</Text>
              <View>
                <View style={styles.containerRating}>
                  {maxRating.map((item, key) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        key={item}
                        onPress={() => setDefaultRating(item)}
                      >
                        {item <= defaultRating ? (
                          <Icon
                            type={Icons.FontAwesome}
                            name="star"
                            size={28}
                            color={Colors.colors.darkDustyPurple}
                          />
                        ) : (
                          <Icon
                            type={Icons.FontAwesome}
                            name="star-o"
                            size={28}
                            color={Colors.colors.darkDustyPurple}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
            <View style={styles.containerRatingInput}>
              <TextInput
                placeholder="Descrie experiența ta"
                placeholderTextColor={Colors.colors.gray}
                editable
                multiline
                numberOfLines={20}
                style={{ fontFamily: "Montserrat-Regular", fontSize: 16 }}
                onChangeText={(text) => handleOnChange(text, "description")}
              />
            </View>
            <View style={styles.containerButtonAddReview}>
              <Button
                backgroundColor={Colors.colors.darkDustyPurple}
                color="white"
                width={200}
                borderRadius={10}
                fontFamily="Montserrat-SemiBold"
                fontSize={16}
                onPress={submitReview}
              >
                Adaugă review
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.containerDetails}>
        <Text style={styles.textName}>{name}</Text>
        <Pressable onPress={handleViewReviews}>
          <View style={styles.containerRating}>
            {handleRating()}
            <View style={styles.containerNumberOfRatings}>
              <Text style={styles.textNumberOfReviews}>
                ({reviewCount} review-uri)
              </Text>
            </View>
          </View>
        </Pressable>
        <Text numberOfLines={5} style={styles.textDescription}>
          {description}
        </Text>
        <View style={styles.containerPriceGift}>
          <Text style={styles.textPrice}>{price} RON</Text>
          <Button
            onPress={() =>
              navigation.navigate("Payment", {
                name: name,
                price: price,
                image: image,
                userId: userId,
                friendId: friendId,
                friendName: friendName,
              })
            }
            backgroundColor={Colors.colors.darkDustyPurple}
            color="white"
            width={200}
            borderRadius={10}
            fontFamily="Montserrat-SemiBold"
            fontSize={18}
          >
            Selectează cadoul
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colors.cardBackgroundColor,
  },
  image: {
    height: "65%",
  },
  containerDetails: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 550,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: Colors.colors.cardBackgroundColor,
    shadowColor: Colors.colors.gray,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  textName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 28,
    color: Colors.colors.darkDustyPurple,
  },
  textDescription: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.dustyPurple,
    marginVertical: 8,
  },
  containerPriceGift: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textPrice: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 24,
    color: Colors.colors.darkDustyPurple,
  },
  containerButton: {
    width: 180,
    height: 50,
    borderRadius: 24,
    backgroundColor: Colors.colors.darkDustyPurple,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  textSelectGift: {
    fontFamily: "Montserrat-Regular",
    fontSize: 20,
    color: "white",
  },
  pressed: {
    opacity: 0.9,
  },
  containerRating: {
    flexDirection: "row",
    // justifyContent: "center",
    // marginTop: -10,
  },
  textNumberOfReviews: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
  },
  containerNumberOfRatings: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  containerModal: {
    flex: 1,
    backgroundColor: Colors.colors.transparent,
    justifyContent: "center",
  },
  modalView: {
    margin: 16,
    backgroundColor: Colors.colors.backgroundColor,
    borderRadius: 10,
    padding: 16,
    // alignItems: "center",
    // flexDirection: "column",
  },
  containerRatingModal: {
    flexDirection: "row",
    justifyContent: "center",
  },
  containerNumberOfRatingsModal: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  containerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  containerAddRating: {
    justifyContent: "center",
    alignItems: "center",
  },
  textAddRating: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: Colors.colors.darkDustyPurple,
    marginBottom: 4,
  },
  containerRatingInput: {
    height: 100,
    backgroundColor: Colors.colors.cardBackgroundColor,
    borderRadius: 10,
    marginVertical: 16,
  },
  containerButtonAddReview: {
    justifyContent: "center",
    alignItems: "center",
  },
  textNoReviews: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
    marginTop: 4,
  },
  textAddReview: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    marginTop: 8,
  },
});

export default GiftDetailsScreen;
