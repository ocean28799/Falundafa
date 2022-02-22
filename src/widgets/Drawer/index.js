import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { StatusBar } from "expo-status-bar";
import { useAssets } from "expo-asset";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { connect } from "react-redux";
import * as Animatable from "react-native-animatable";

import { SCREENS } from "../../constants";

const menus = [
  { name: "home", title: "Trang chủ", screen: SCREENS.HOME },
  { name: "lecture", title: "Bài giảng", screen: SCREENS.LECTURE },
  { name: "dafasongs", title: "Nhạc đại pháp", screen: SCREENS.DAFASONGS },
  {
    name: "practicesongs",
    title: "Nhạc luyện công",
    screen: SCREENS.PRACTICESONGS,
  },
  { name: "favourite", title: "Yêu thích", screen: SCREENS.FAVOURITE },
  { name: "recent", title: "Đã phát gần đây", screen: SCREENS.RECENT },
  { name: "playlist", title: "Playlist", screen: SCREENS.PLAYLISTS },
  // { name: "portfolio", title: "Portfolio", screen: SCREENS.PORTFOLIO },
];

const Index = ({
  appName,
  active = false,
  current = "",
  onItemPressed = () => {},
  children,
}) => {
  const { navigate } = useNavigation();
  useAssets([require("../../assets/logo.png")]);
  const screenScale = useRef(new Animated.Value(1)).current;
  const screenLeft = useRef(new Animated.Value(0)).current;
  const screenRadius = useRef(new Animated.Value(0)).current;

  const anim = (anim, toValue) => {
    return Animated.timing(anim, {
      toValue,
      duration: 1000,
      useNativeDriver: true,
    });
  };

  useEffect(() => {
    anim(screenScale, active ? 0.8 : 1).start();
    anim(screenLeft, active ? Dimensions.get("screen").width * 0.6 : 0).start();
    anim(screenRadius, active ? 15 : 0).start();
  }, [active]);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Pháp luân đại pháp. Cài đặt: https://gather.town/app/YpxUwzYyhCCmWjwt/SOLAZU`,
        url: "https://gather.town/app/YpxUwzYyhCCmWjwt/SOLAZU",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <StatusBar style={active ? "light" : "dark"} />
      <LinearGradient
        style={styles.container}
        colors={["#293241", "#3d5a80", "#ffffff"]}
      >
        <View style={styles.menuContainer}>
          <Animatable.View
            style={styles.header}
            animation={active ? "slideInDown" : "slideOutUp"}
            duration={2000}
          >
            <Image
              style={styles.logo}
              source={require("../../../assets/images/logo1.png")}
            />
            <Text style={styles.appName}>{appName}</Text>
          </Animatable.View>
          <View style={styles.middle}>
            {menus.map((menu, key) => (
              <Animatable.View
                key={key}
                animation={active ? "zoomInDown" : "zoomOutDown"}
                duration={1000 + key * 400}
              >
                <TouchableOpacity
                  style={[
                    styles.item,
                    current.toLowerCase() === menu.name && styles.itemActive,
                  ]}
                  onPress={async () => {
                    onItemPressed();
                    const x = setTimeout(() => {
                      menu.screen && navigate(menu.screen);
                      menu.onPress && menu.onPress();
                      clearTimeout(x);
                    }, 850);
                  }}
                >
                  <Text
                    style={[
                      styles.itemTxt,
                      current.toLowerCase() === menu.name &&
                        styles.itemTxtActive,
                    ]}
                  >
                    {menu.title}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>

          <Animatable.View
            style={styles.bottom}
            animation={active ? "slideInUp" : "slideOutDown"}
            duration={2000}
          >
            <Animatable.View
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite"
            >
              <TouchableOpacity
                style={styles.bottomBtn}
                activeOpacity={0.68}
                onPress={onShare}
              >
                <Image
                  source={require("../../assets/Share2.png")}
                  resizeMode="contain"
                  style={{ width: "100%", height: 199, marginTop: -123 }}
                />
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>
        </View>

        <View style={styles.screenBackDrop} />
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.screen,
            {
              transform: [
                {
                  scale: screenScale,
                },
                {
                  translateX: screenLeft,
                },
              ],
              borderRadius: screenRadius,
            },
          ]}
        >
          {children}
        </Animated.View>
      </LinearGradient>
    </>
  );
};

const mapStateToProps = (state) => ({ appName: state?.app?.appName });
export default connect(mapStateToProps, null)(Index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    justifyContent: "space-between",
    width: Dimensions.get("screen").width * 0.6 - 35,
    paddingVertical: Constants.statusBarHeight,
    paddingLeft: 15,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 99,
    height: 99,
    marginBottom: 10,
  },
  appName: {
    color: "#f8f9fa",
    fontSize: 15.68,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  middle: {
    flex: 1,
    justifyContent: "center",
  },
  item: {
    justifyContent: "center",
    width: null,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemActive: {
    backgroundColor: "#f7fff7",
  },
  modeTxt: {
    fontSize: 16,
    letterSpacing: 0.68,
  },
  itemTxt: {
    color: "#e9ecef",
    fontSize: 16,
    textTransform: "uppercase",
  },
  itemTxtActive: {
    color: "#2f3e46",
  },
  bottom: {},
  bottomBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  bottomBtnTxt: {
    color: "#f8f9fa",
    fontSize: 15,
    textTransform: "uppercase",
    letterSpacing: 0.36,
  },
  screen: {
    flex: 1,
    position: "absolute",
    backgroundColor: "#FFF",
    zIndex: 9999,
  },
  screenBackDrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, .15)",
    transform: [
      {
        scale: 0.7,
      },
      {
        translateX: Dimensions.get("screen").width * 0.58,
      },
    ],
    borderRadius: 15,
  },
});
