import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import { connect } from "react-redux";
import GifImage from "@lowkey/react-native-gif";

import { Header, Section, Drawer } from "../../widgets";

const Index = () => {
  const [drawer, setDrawer] = useState(false);

  const data = [
    {
      title: "Beautiful and dramatic Antelope Canyon",
      subtitle: "Lorem ipsum dolor sit amet et nuncat mergitur",
      illustration:
        "https://images.unsplash.com/photo-1592355591823-2657dbc25ce0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ym9vayUyMGFlc3RoZXRpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      title: "White Pocket Sunset",
      subtitle: "Lorem ipsum dolor sit amet et nuncat ",
      illustration:
        "https://images.unsplash.com/photo-1544716278-e513176f20b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Ym9va3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      title: "Earlier this morning, NYC",
      subtitle: "Lorem ipsum dolor sit amet",
      illustration:
        "https://images.unsplash.com/photo-1633544861852-fca2121467c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTB8fGJvb2slMjBhZXN0aGV0aWN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    },
    {
      title: "Acrocorinth, Greece",
      subtitle: "Lorem ipsum dolor sit amet et nuncat mergitur",
      illustration:
        "https://images.unsplash.com/photo-1596802186605-f669500e7e2b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjJ8fGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    },
    {
      title: "The lone tree, majestic landscape of New Zealand",
      subtitle: "Lorem ipsum dolor sit amet",
      illustration:
        "https://images.unsplash.com/photo-1571258126466-de842f523326?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    },
  ];

  const _renderItem = ({ item, index }, parallaxProps) => {
    return (
      <View
        style={{
          width: "100%",
          height: Dimensions.get("screen").height * 0.68,
          position: "relative",
        }}
      >
        <ParallaxImage
          source={{ uri: item.illustration }}
          spinnerColor="#5f0f40"
          showSpinner={true}
          containerStyle={{
            flex: 1,
            backgroundColor: "#ffd166",
            borderTopLeftRadius: 9,
            borderTopRightRadius: 9,
            borderWidth: 4,
            borderColor: "#fdf0d5",
            borderBottomWidth: 0,
            opacity: 0.9,
          }}
          style={{ resizeMode: "cover" }}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: 79,
            backgroundColor: "#001d3d",
            borderColor: "#fdf0d5",
            borderBottomLeftRadius: 9,
            borderBottomRightRadius: 9,
            borderWidth: 4,
            borderTopWidth: 0,
          }}
        >
          <Text style={{ color: "#f2cc8f" }}>{item.title}</Text>
        </View>
      </View>
    );
  };

  return (
    <Drawer
      active={drawer}
      current="portfolio"
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
              show: false,
              text: "Porfolio",
            },
            right: {
              show: false,
            },
          }}
        />
        <View style={styles.sections}>
          {/* <GifImage
            source={require('../../assets/loading.gif')}
            style={{
              width: 100,
              height: 100,
            }}
            resizeMode={"contain"}
          />  */}
          <Carousel
            data={data}
            renderItem={_renderItem}
            sliderWidth={Dimensions.get("screen").width}
            itemWidth={Dimensions.get("screen").width * 0.79}
            layout={"stack"}
            layoutCardOffset={`36`}
            // loop={true}
            loopClonesPerSide={4}
            // autoplay={true}
            // autoplayInterval={999}
            // autoplayDuration={3000}
            activeSlideAlignment="center"
            hasParallaxImages={true}
          />
        </View>
      </SafeAreaView>
    </Drawer>
  );
};

const mapStateToProps = (state) => ({ dafaSongs: state?.player?.dafaSongs });
export default connect(mapStateToProps, null)(Index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sections: {
    flex: 1,
    marginTop: Dimensions.get("screen").height * 0.08,
  },
});
