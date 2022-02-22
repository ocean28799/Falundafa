import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAssets } from "expo-asset";
import { useNavigation } from "@react-navigation/native";
import { Footer, Header, Section, Drawer } from "../../widgets";
import { Icon } from "../../components";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import { SCREENS } from "../../constants";

const Index = () => {
  const [assets] = useAssets([
    require("../../assets/icons/hamburger.png"),
    require("../../assets/icons/search.png"),
  ]);

  const { navigate } = useNavigation();

  const [drawer, setDrawer] = useState(false);

  const closeDrawer = () => {
    if (drawer) {
      setDrawer(false);
    }
  };

  const onSwipe = (gestureName, gestureState) => {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    switch (gestureName) {
      case SWIPE_UP:
        navigate(SCREENS.PLAYING);
        break;
      case SWIPE_DOWN:
        navigate(SCREENS.SEARCH);
        break;
      case SWIPE_LEFT:
        closeDrawer();
        break;
      case SWIPE_RIGHT:
        setDrawer(true);
        break;
    }
  };

  return (
    <Drawer
      active={drawer}
      current="home"
      onItemPressed={() => setDrawer(false)}
    >
      <SafeAreaView
        style={styles.container}
        onStartShouldSetResponder={closeDrawer}
      >
        <GestureRecognizer
          style={{ flex: 1, backgroundColor: "white" }}
          onSwipe={(direction, state) => onSwipe(direction, state)}
        >
          <Header
            options={{
              left: {
                children: drawer ? (
                  <Image
                    source={require("../../assets/icons/cancel.png")}
                    resizeMode="cover"
                    style={{ width: 22, height: 22 }}
                  />
                ) : (
                  <Image
                    source={require("../../assets/icons/menu.png")}
                    resizeMode="cover"
                    style={{ width: 39, height: 39 }}
                  />
                ),
                onPress: () => setDrawer(!drawer),
              },
            }}
          />
          <View style={styles.sections}>
            <Section.Explore />
            <Section.Recent style={{ marginTop: 30 }} />
            <Section.Playlist style={{ marginTop: 30 }} />
          </View>
          <Footer />
        </GestureRecognizer>
      </SafeAreaView>
    </Drawer>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f9",
  },
  sections: {
    flex: 1,
    marginTop: Dimensions.get("screen").height * 0.025,
  },
});
