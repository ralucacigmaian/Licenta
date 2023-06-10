import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  Pressable,
  Image,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useEffect, useState, useRef } from "react";
import Icon, { Icons } from "../components/Icons";
import { StatusBar } from "expo-status-bar";

function CameraScreen({ navigation, route }) {
  let cameraRef = useRef();
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);

  const { idEvent, eventType, name1, name2 } = route.params;

  const toggleCameraType = () => {
    setCameraType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const toggleFlash = () => {
    setFlashMode((current) =>
      current === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        navigation.navigate("PreviewMemory", {
          idEvent: idEvent,
          image: uri,
          eventType: eventType,
          name1: name1,
          name2: name2,
        });
        console.log("Image:", uri);
      } catch (error) {
        console.log("Error capturing photo:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Camera
        ref={cameraRef}
        type={cameraType}
        style={styles.containerCamera}
        flashMode={flashMode}
      >
        <SafeAreaView style={styles.containerButtons}>
          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={toggleCameraType}
          >
            <Icon
              type={Icons.MaterialIcons}
              name="flip-camera-ios"
              size={40}
              color="white"
            />
          </Pressable>
          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={takePhoto}
          >
            <View style={styles.containerTakePhoto}>
              <View style={styles.containerInnerCircle}></View>
            </View>
          </Pressable>
          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={toggleFlash}
          >
            {flashMode === Camera.Constants.FlashMode.off ? (
              <Icon
                type={Icons.Ionicons}
                name="ios-flash-off"
                size={40}
                color="white"
              />
            ) : (
              <Icon
                type={Icons.Ionicons}
                name="ios-flash"
                size={40}
                color="white"
              />
            )}
          </Pressable>
        </SafeAreaView>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerCamera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  containerButtons: {
    flexDirection: "row",
    height: 150,
    justifyContent: "space-around",
    alignItems: "center",
  },
  containerTakePhoto: {
    width: 80,
    height: 80,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  containerInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  pressed: {
    opacity: 0.1,
  },
});

export default CameraScreen;
