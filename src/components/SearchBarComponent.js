import { View, Text, StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";
import { Colors } from "../utils/colors";
import Icon, { Icons } from "./Icons";

function SearchBarComponent({ placeholder, value, onChangeText }) {
  return (
    <View>
      <SearchBar
        platform="ios"
        placeholder={placeholder}
        placeholderTextColor={Colors.colors.darkDustyPurple}
        inputStyle={{
          fontFamily: "Montserrat-Regular",
          fontSize: 18,
          color: Colors.colors.darkDustyPurple,
        }}
        value={value}
        onChangeText={onChangeText}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
        searchIcon={
          <Icon
            type={Icons.Ionicons}
            name="ios-search"
            size={26}
            color={Colors.colors.darkDustyPurple}
          />
        }
        cancelButtonTitle="Anulează"
        cancelButtonProps={{
          buttonTextStyle: {
            fontFamily: "Montserrat-Regular",
            fontSize: 18,
            color: Colors.colors.darkDustyPurple,
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    paddingHorizontal: 0,
  },
  searchBarInputContainer: {
    backgroundColor: Colors.colors.cardBackgroundColor,
  },
});

export default SearchBarComponent;
