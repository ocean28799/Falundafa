import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAssets } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";

const Explore = ({
  style = {},
  imageURL,
  title = "Explore",
  subtitle = `Listen to what's trending now`,
  onPress = () => {},
  background = false,
}) => {
  const [assets] = useAssets([
    require("../../assets/explore/default.png"),
    require("../../assets/icons/play.png"),
  ]);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.68}
    >
      <ImageBackground
        style={styles.card}
        imageStyle={styles.imageStyle}
        source={
          imageURL
            ? { uri: imageURL }
            : background
            ? require("../../assets/explore/default.png")
            : require("../../assets/explore/taoism.png")
        }
        resizeMode="contain"
      >
        <LinearGradient
          style={styles.overlay}
          colors={["#22223b", "transparent"]}
          start={[0, 0]}
          end={[1, 0]}
        />
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity
          style={styles.btn}
          onPress={onPress}
          activeOpacity={0.36}
        >
          <Image
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#22223b",
            }}
            source={require("../../assets/icons/play1.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 280,
    height: 158,
    marginHorizontal: 10,
    borderBottomWidth: 4,
    borderColor: "#e5e5e5",
    borderRadius: 9,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderRadius: 8,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: null,
    height: 158,
    borderRadius: 8,
  },
  imageStyle: {
    borderRadius: 8,
  },
  title: {
    color: "#ffffff",
    fontSize: 17.68,
    fontWeight: "bold",
    fontFamily: "Roboto",
    textTransform: "uppercase",
  },
  subtitle: {
    color: "#f0efeb",
    fontSize: 11,
    letterSpacing: 0.36,
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderColor: "#b1a7a6",
    borderWidth: 1,
  },
});
