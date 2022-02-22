import React, { memo, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import { Icon } from "../../components";
import { Header } from "../../widgets";
import { Audio } from "../../hooks";
import { DISPATCHES } from "../../constants";
import { millisToMin, Storage } from "../../helpers";
import GestureRecognizer from "react-native-swipe-gestures";
import ModalExpo from "react-native-modal";

const Index = ({
  song,
  songs,
  dispatch,
  route: { params },
  navigation: { goBack },
}) => {
  const stopBtnAnim = useRef(
    new Animated.Value(song?.soundObj?.isPlaying ? 1 : 0.3)
  ).current;
  const [isFav, setIsFav] = useState(false);
  const [actions, setActions] = useState({
    prev: false,
    play: false,
    stop: false,
    next: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [isLoop, setIsLoop] = useState(false);

  const verifyFav = async () => {
    const favs = await Storage.get("favourites", true);
    if (favs !== null) {
      const currentIndex = songs.findIndex((i) => i.id === song?.detail?.id);
      if (favs.includes(currentIndex)) {
        setIsFav(true);
      } else {
        setIsFav(false);
      }
    }

    dispatch({
      type: DISPATCHES.STORAGE,
      payload: {
        favourites: favs,
      },
    });
  };

  const handleFav = async () => {
    const currentIndex = songs.findIndex((i) => i.id === song?.detail?.id);
    const favs = await Storage.get("favourites", true);

    if (favs === null) {
      await Storage.store("favourites", [currentIndex], true);
    } else {
      if (favs.includes(currentIndex)) {
        const updatedFavs = favs.filter((i) => i !== currentIndex);
        await Storage.store("favourites", updatedFavs, true);
      } else {
        favs.unshift(currentIndex);
        await Storage.store("favourites", favs, true);
      }
    }

    verifyFav();
  };

  const _e = (arg = {}) => {
    setActions({
      ...actions,
      ...arg,
    });
  };

  const addToRecentlyPlayed = async (index) => {
    const recents = await Storage.get("recents", true);
    if (recents === null) {
      await Storage.store("recents", [index], true);
    } else {
      const filtered = recents
        .filter((i) => i !== index)
        .filter((i) => recents.indexOf(i) < 9);
      filtered.unshift(index);
      await Storage.store("recents", filtered, true);
    }

    dispatch({
      type: DISPATCHES.STORAGE,
      payload: {
        recents: await Storage.get("recents", true),
      },
    });
  };

  const onPlaybackStatusUpdate = (playbackStatus) => {
    dispatch({
      type: DISPATCHES.SET_CURRENT_SONG,
      payload: {
        playbackStatus,
      },
    });

    if (playbackStatus?.didJustFinish) {
      handleNext();
    }
  };

  const configAndPlay = (shouldPlay = false) => {
    if (!song?.soundObj?.isLoaded) {
      return Audio.configAndPlay(
        song?.detail?.uri,
        shouldPlay
      )((playback, soundObj) => {
        dispatch({
          type: DISPATCHES.SET_CURRENT_SONG,
          payload: {
            playback,
            soundObj,
          },
        });

        addToRecentlyPlayed(songs.findIndex((i) => i.id === song?.detail?.id));
      })(onPlaybackStatusUpdate);
    }
  };

  const handlePlayAndPause = async () => {
    _e({ play: true });

    if (!song?.soundObj?.isLoaded) {
      configAndPlay(true);
      _e({ play: true });
    }

    if (song?.soundObj?.isLoaded && song?.soundObj?.isPlaying) {
      return Audio.pause(song?.playback)((soundObj) => {
        dispatch({
          type: DISPATCHES.SET_CURRENT_SONG,
          payload: {
            soundObj,
          },
        });

        _e({ play: false });
      });
    }

    if (song?.soundObj?.isLoaded && !song?.soundObj?.isPlaying) {
      return Audio.resume(song?.playback)((soundObj) => {
        dispatch({
          type: DISPATCHES.SET_CURRENT_SONG,
          payload: {
            soundObj,
          },
        });

        _e({ play: false });
      });
    }
  };

  const handleStop = async (after = () => {}) => {
    _e({ stop: true });

    if (song?.soundObj?.isLoaded) {
      return Audio.stop(song?.playback)(() => {
        dispatch({
          type: DISPATCHES.SET_CURRENT_SONG,
          payload: {
            soundObj: {},
          },
        });

        after();
        _e({ stop: false });
      });
    }

    after();
    _e({ stop: false });
  };

  const handlePrev = async () => {
    _e({ prev: true });

    const currentIndex = songs.findIndex((i) => i.id === song?.detail?.id);
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    const prevSong = songs[prevIndex];

    return handleStop(() => {
      Audio.play(
        song?.playback,
        prevSong?.uri
      )((soundObj) => {
        dispatch({
          type: DISPATCHES.SET_CURRENT_SONG,
          payload: {
            soundObj,
            detail: prevSong,
          },
        });

        addToRecentlyPlayed(prevIndex);
        _e({ prev: false });
      })(onPlaybackStatusUpdate);
    });
  };

  async function handleNext() {
    _e({ next: true });

    const currentIndex = songs.findIndex((i) => i.id === song?.detail?.id);
    const nextIndex = currentIndex === songs.length - 1 ? 0 : currentIndex + 1;
    const nextSong = songs[nextIndex];

    return handleStop(() => {
      Audio.play(
        song?.playback,
        nextSong?.uri
      )((soundObj) => {
        dispatch({
          type: DISPATCHES.SET_CURRENT_SONG,
          payload: {
            soundObj,
            detail: nextSong,
          },
        });

        addToRecentlyPlayed(nextIndex);
        _e({ next: false });
      })(onPlaybackStatusUpdate);
    });
  }

  const handleSeek = (millis) => {
    return Audio.seek(
      song?.playback,
      Math.floor(millis)
    )((soundObj) => {
      dispatch({
        type: DISPATCHES.SET_CURRENT_SONG,
        payload: {
          soundObj,
        },
      });
    })(onPlaybackStatusUpdate);
  };

  useEffect(() => {
    if (song?.soundObj?.isPlaying) {
      Animated.timing(stopBtnAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(stopBtnAnim, {
        toValue: 0.3,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [song]);

  useEffect(() => {
    (async () => {
      await Audio.init();
      configAndPlay();
    })();
  }, []);

  useEffect(() => {
    verifyFav();
  }, [song?.detail?.id]);

  useEffect(() => {
    if (params?.forcePlay && params?.song?.uri !== song?.detail?.uri) {
      handleStop(() => {
        Audio.play(
          song?.playback,
          params?.song?.uri
        )((soundObj) => {
          dispatch({
            type: DISPATCHES.SET_CURRENT_SONG,
            payload: {
              soundObj,
              detail: params?.song,
            },
          });

          addToRecentlyPlayed(params?.index);
        })(onPlaybackStatusUpdate);
      });
    }
  }, [params?.forcePlay, params?.song, params?.index]);

  useEffect(() => {
    if (params?.loading === true) {
      setIsLoading(true);
    }
  }, [params?.loading]);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1468);
    }
  }, [isLoading]);

  return (
    <>
      <StatusBar style="dark" />
      <ImageBackground
        style={styles.container}
        source={{ uri: song?.detail?.img }}
        blurRadius={9}
        resizeMode="cover"
      >
        <GestureRecognizer style={{ flex: 1 }} onSwipeDown={() => goBack()}>
          <View style={[StyleSheet.absoluteFill, styles.overlay]} />
          <Header
            options={{
              left: {
                children: <Icon name="chevron-down" color="#FFF" />,
                onPress: goBack,
              },
              right: {
                children: (
                  <Icon name="heart" color={isFav ? "#C07037" : "#FFF"} />
                ),
                onPress: handleFav,
              },
            }}
          />
          <View style={styles.frame}>
            <View>
              <Image
                style={styles.clipart}
                source={{ uri: song?.detail?.img }}
                resizeMode="cover"
                borderRadius={20}
              />
            </View>
            <View style={styles.details}>
              <View style={{ marginBottom: 25 }}>
                <Text style={styles.songTitle}>{song?.detail?.title}</Text>
                <Text style={styles.artistName}>{song?.detail?.author}</Text>
              </View>
              <View style={styles.tracker}>
                <Slider
                  minimumValue={0}
                  maximumValue={song?.detail?.durationMillis}
                  minimumTrackTintColor="#FFFFFF"
                  thumbTintColor="#FFFFFF"
                  maximumTrackTintColor="transparent"
                  value={song?.playbackStatus?.positionMillis || 0}
                  onSlidingComplete={handleSeek}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 9,
                }}
              >
                <Text style={styles.minMin}>
                  {millisToMin(song?.playbackStatus?.positionMillis || 0)}
                </Text>
                <Text style={styles.maxMin}>
                  {millisToMin(song?.detail?.durationMillis)}
                </Text>
              </View>
            </View>
            <View style={[styles.actionsContainer, { paddingHorizontal: 24 }]}>
              <TouchableOpacity onPress={() => setIsRandom(!isRandom)}>
                <Icon
                  name="random"
                  color={isRandom ? "#C07037" : "#C4C4C4"}
                  family="FontAwesome"
                  size={17}
                />
              </TouchableOpacity>
              <View style={[styles.actionsContainer, { width: 200 }]}>
                <TouchableOpacity onPress={handlePrev}>
                  <Icon name="skip-back" color="#C4C4C4" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePlayAndPause}>
                  <LinearGradient
                    start={[0, 1]}
                    end={[1, 0]}
                    style={[
                      styles.playAndPauseBtn,
                      !song?.soundObj?.isPlaying && { paddingLeft: 4 },
                    ]}
                    colors={[
                      "#c9e4ca",
                      "#87bba2",
                      "#55828b",
                      "#3b6064",
                      "#364958",
                    ]}
                  >
                    <Icon
                      name={song?.soundObj?.isPlaying ? `pause` : `play`}
                      color="#f8f7ff"
                      family="Ionicons"
                    />
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() =>
                    song?.soundObj?.isPlaying ? handleStop(() => {}) : () => {}
                  }
                  disabled={actions?.stop}
                >
                  <Animated.View style={{ opacity: stopBtnAnim }}>
                    <Icon
                      family="Ionicons"
                      name="stop-outline"
                      color="#C4C4C4"
                    />
                  </Animated.View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNext}>
                  <Icon name="skip-forward" color="#C4C4C4" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setIsLoop(!isLoop)}>
                <Icon
                  family="Feather"
                  name="repeat"
                  color={isLoop ? "#C07037" : "#C4C4C4"}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ModalExpo
            animationIn={"fadeIn"}
            animationOut={"zoomOut"}
            isVisible={isLoading}
            backdropOpacity={0.68}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 22,
                  borderRadius: 48,
                }}
              >
                <ActivityIndicator color="green" size="large" />
              </View>
            </View>
          </ModalExpo>
        </GestureRecognizer>
      </ImageBackground>
    </>
  );
};

const mapStateToProps = (state) => ({
  song: state?.player?.currentSong,
  songs: state?.player?.songs,
});
const mapDispatchToProps = (dispatch) => ({ dispatch });
export default connect(mapStateToProps, mapDispatchToProps)(memo(Index));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, .5)",
  },
  frame: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  clipart: {
    width: 250,
    height: 250,
  },
  details: {
    width: "85%",
  },
  songTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  artistName: {
    color: "rgba(255, 255, 255, .6)",
  },
  tracker: {
    backgroundColor: "rgba(255, 255, 255, .2)",
    borderRadius: 100,
    padding: 9,
    borderWidth: 0.68,
    borderColor: "#faf9f9",
  },
  minMin: {
    color: "#FFF",
    fontSize: 12,
  },
  maxMin: {
    color: "#FFF",
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  playAndPauseBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 100,
    borderWidth: 1.2,
    borderColor: "#bfd8bd",
  },
});
