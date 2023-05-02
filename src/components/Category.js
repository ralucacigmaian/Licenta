import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Colors } from "../utils/colors";
import Icon, { Icons } from "./Icons";

function Category({ iconType, iconName, categoryName, onPress, isSelected }) {
  const [isPressed, setIsPressed] = useState(isSelected);
  const [selectedCategory, setSelectedCategory] = useState("Toate");

  useEffect(() => {
    setIsPressed(isSelected);
  }, [isSelected]);

  const handlePress = () => {
    setIsPressed(true);
    setSelectedCategory(categoryName);
    onPress(categoryName);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        isPressed && styles.containerPressed,
        pressed && styles.pressed,
      ]}
    >
      <Icon
        type={iconType}
        name={iconName}
        size={34}
        color={
          isPressed
            ? Colors.colors.lightDustyPurple
            : Colors.colors.darkDustyPurple
        }
      />
      <Text
        style={[
          styles.textCategoryName,
          isPressed && styles.textCategoryNamePressed,
          categoryName === "Zile de naștere" && styles.textCategoryNameMargin,
          categoryName === "Zile onomastice" && styles.textCategoryNameMargin,
        ]}
      >
        {categoryName}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.9,
  },
  container: {
    height: 110,
    width: 110,
    borderRadius: 10,
    backgroundColor: Colors.colors.lightDustyPurple,
    justifyContent: "center",
    alignItems: "center",
  },
  containerPressed: {
    backgroundColor: Colors.colors.darkDustyPurple,
  },
  textCategoryName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: Colors.colors.darkDustyPurple,
    textAlign: "center",
    marginTop: 2,
  },
  textCategoryNamePressed: {
    color: Colors.colors.lightDustyPurple,
  },
  textCategoryNameMargin: {
    marginTop: 8,
  },
});

export default Category;
