import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useAssets } from "expo-asset";
import { SCREENS } from "../../constants";

const LeftChildren = () => (
  <Image
    source={require("../../assets/icons/menu.png")}
    resizeMode="cover"
    style={{ width: 39, height: 39 }}
  />
);

const MiddleChildren = ({ text }) => (
  <Text
    style={{
      fontSize: 19,
      color: "#264653",
      letterSpacing: 0.36,
    }}
  >
    {text}
  </Text>
);

const RightChildren = () => (
  <Image
    source={require("../../assets/icons/search.png")}
    resizeMode="contain"
    style={{ width: 28, height: 28 }}
  />
);

const Index = ({
  style = { marginTop: 10, marginHorizontal: 10 },
  options = {},
}) => {
  const { navigate } = useNavigation();
  const [assets] = useAssets([
    require("../../assets/icons/hamburger.png"),
    require("../../assets/icons/search.png"),
  ]);
  const config = {
    left: {
      style: {},
      show: true,
      children: <LeftChildren />,
      onPress: () => {},
      ...options?.left,
    },
    middle: {
      style: {},
      show: false,
      text: null,
      children: <MiddleChildren text="Title" />,
      ...options?.middle,
    },
    right: {
      style: {},
      show: true,
      children: <RightChildren />,
      onPress: () => navigate(SCREENS.SEARCH),
      ...options?.right,
    },
  };

  return (
    <View style={style}>
      <View style={styles.header}>
        <View style={[styles.left, config?.left?.style]}>
          {config?.left?.show && (
            <TouchableOpacity
              style={styles.btn}
              onPress={config?.left?.onPress}
            >
              {config?.left?.children}
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.middle, config?.middle?.style]}>
          {config?.middle?.show && (
            <>
              {config?.middle?.text !== null ? (
                <MiddleChildren text={config?.middle?.text} />
              ) : (
                config?.middle?.children
              )}
            </>
          )}
        </View>

        <View style={[styles.right, config?.right?.style]}>
          {config?.right?.show && (
            <TouchableOpacity
              style={styles.btn}
              onPress={config?.right?.onPress}
            >
              {config?.right?.children}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexBasis: 60,
  },
  middle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  right: {
    alignItems: "flex-end",
    flexBasis: 60,
  },
  btn: {
    padding: 10,
  },
});
