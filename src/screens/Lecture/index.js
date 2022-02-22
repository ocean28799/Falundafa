import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAssets } from "expo-asset";
import { connect } from "react-redux";

import { Header, Section, Drawer } from "../../widgets";

const Index = ({ lectures }) => {
  const [assets] = useAssets([
    require("../../assets/icons/hamburger.png"),
    require("../../assets/icons/search.png"),
  ]);
  const [drawer, setDrawer] = useState(false);

  return (
    <Drawer
      active={drawer}
      current="lecture"
      onItemPressed={() => setDrawer(false)}
    >
      <SafeAreaView style={styles.container}>
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
            middle: {
              show: true,
              text: "9 Bài giảng",
            },
            right: {
              show: false,
            },
          }}
        />
        <View style={styles.sections}>
          <Section.MusicList
            audios={lectures}
            indicator={false}
          />
        </View>
      </SafeAreaView>
    </Drawer>
  );
};

const mapStateToProps = (state) => ({ lectures: state?.player?.lectures });
export default connect(mapStateToProps, null)(Index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sections: {
    flex: 1,
    marginTop: Dimensions.get("screen").height * 0.025,
  },
});
