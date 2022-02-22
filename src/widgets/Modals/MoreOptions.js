import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("screen");

const MoreOptions = ({
  visible = false,
  onClose = () => {},
  title = "Song Title",
  moreOptions = [
    {
      text: "Play",
      onPress: () => alert("Play song"),
    },
    {
      text: "Add to favorite",
      onPress: () => alert("Add song to favorite"),
    },
    {
      text: "Add to playlist",
      onPress: () => alert("Add song to playlist"),
    },
  ],
}) => {
  const [animation, setAnimation] = useState("slideInUp");

  const closeModal = () => {
    setAnimation("fadeOutDown");

    const x = setTimeout(() => {
      onClose(false);
      clearTimeout(x);
    }, 300);
  };

  useEffect(() => {
    if (visible) {
      setAnimation("slideInUp");
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={[
          {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width,
            height,
            backgroundColor: "rgba(0, 0, 0, .5)",
            zIndex: 999,
          },
        ]}
        activeOpacity={1}
        onPress={closeModal}
      />
      <Animatable.View
        style={styles.modal}
        animation={animation}
        duration={300}
      >
        <Text
          style={{
            color: "#3a506b",
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            letterSpacing: 0.36,
            fontStyle: "italic",
          }}
        >
          {title}
        </Text>
        {moreOptions.map(({ text, onPress }, key) => (
          <TouchableOpacity key={key} onPress={onPress} activeOpacity={0.6}>
            <LinearGradient
              start={[0, 1]}
              end={[1, 0]}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: "#E6E6E6",
                marginBottom: 10,
                borderRadius: 5,
                borderBottomWidth: 1.68,
                borderColor: "#9b9b7a",
              }}
              colors={["#abc4ff", "#b6ccfe", "#c1d3fe", "#ccdbfd", "#d7e3fc"]}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 16,
                  letterSpacing: 0.36,
                  fontWeight: "700",
                }}
              >
                {text}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </Animatable.View>
    </Modal>
  );
};

export default MoreOptions;

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    paddingVertical: 24,
    paddingHorizontal: 40,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    zIndex: 9999,
  },
});
