import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionSpecs,
  HeaderStyleInterpolators,
} from "@react-navigation/stack";

import {
  Loading,
  Search,
  Playing,
  Home,
  Songs,
  Favourite,
  Recent,
  Playlists,
  Playlist,
  Lecture,
  DafaSongs,
  PracticeSongs,
  Portfolio
} from "./screens";
import { SCREENS } from "../constants";

const Stack = createStackNavigator();
const StackNavigation = () => {
  const SlideFromLeftAni = {
    gestureDirection: "vertical",
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
    headerStyleInterpolator: HeaderStyleInterpolators.forSlideUp,
    cardStyleInterpolator: ({ current, next, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateY: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.height, 0],
              }),
            },
            // {
            //   scale: next
            //     ? next.progress.interpolate({
            //         inputRange: [0, 1],
            //         outputRange: [1, 0.9],
            //       })
            //     : 1,
            // },
          ],
        },
        overlayStyle: {
          opacity: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
          }),
        },
      };
    },
  };

  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={SCREENS.LOADING}
      screenOptions={{ ...SlideFromLeftAni }}
    >
      <Stack.Screen name={SCREENS.LOADING} component={Loading} />
      <Stack.Screen name={SCREENS.SEARCH} component={Search} />
      <Stack.Screen name={SCREENS.PLAYING} component={Playing} />
      <Stack.Screen name={SCREENS.HOME} component={Home} />
      <Stack.Screen name={SCREENS.SONGS} component={Songs} />
      <Stack.Screen name={SCREENS.FAVOURITE} component={Favourite} />
      <Stack.Screen name={SCREENS.RECENT} component={Recent} />
      <Stack.Screen name={SCREENS.PLAYLISTS} component={Playlists} />
      <Stack.Screen name={SCREENS.PLAYLIST} component={Playlist} />
      <Stack.Screen name={SCREENS.LECTURE} component={Lecture} />
      <Stack.Screen name={SCREENS.DAFASONGS} component={DafaSongs} />
      <Stack.Screen name={SCREENS.PRACTICESONGS} component={PracticeSongs} />
      <Stack.Screen name={SCREENS.PORTFOLIO} component={Portfolio} />
    </Stack.Navigator>
  );
};

const Index = () => {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
};

export default Index;
