import React, { memo, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { Card } from "../../../components";
import { DISPATCHES, SCREENS } from "../../../constants";
import { Storage } from "../../../helpers";
import * as Modal from "../../Modals";
import ModalExpo from "react-native-modal";

const Index = ({
  songs,
  dispatch,
  style = {},
  audios = [],
  indicator = true,
  useIndex = false,
}) => {
  const { navigate } = useNavigation();
  const [favs, setFavs] = useState([]);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [songIndex, setSongIndex] = useState(0);
  const [loadingPlay, setLoadingPlay] = useState(false);

  const setFavourites = async () => {
    const savedFavs = await Storage.get("favourites", true);
    if (savedFavs !== null) {
      setFavs(savedFavs);
    }

    dispatch({
      type: DISPATCHES.STORAGE,
      payload: {
        favourites: savedFavs,
      },
    });
  };

  const handleAddToFavourite = async (index) => {
    const savedFavs = await Storage.get("favourites", true);
    if (savedFavs === null) {
      await Storage.store("favourites", [index], true);
    } else {
      if (savedFavs.includes(index)) {
        const updatedFavs = savedFavs.filter((i) => i !== index);
        await Storage.store("favourites", updatedFavs, true);
      } else {
        savedFavs.unshift(index);
        await Storage.store("favourites", savedFavs, true);
      }
    }

    setFavourites();
  };

  const onPlayPress = async (song, index) => {
    setLoadingPlay(true);
    await setTimeout(() => {
      navigate(SCREENS.PLAYING, {
        forcePlay: true,
        song,
        index,
        loading: true,
      });
    }, 268);
  };

  useEffect(() => {
    if (loadingPlay) {
      setTimeout(() => {
        setLoadingPlay(false);
      }, 168);
    }
  }, [loadingPlay]);

  useEffect(() => {
    setFavourites();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        ...style,
        padding: 20,
      }}
      showsVerticalScrollIndicator={indicator}
    >
      {useIndex
        ? audios.map((index, key) => (
            <Card.MusicList
              key={key}
              imageURL={songs[index]?.img}
              title={songs[index]?.title}
              author={songs[index]?.author}
              duration={songs[index]?.durationMillis}
              onPlayPress={() => onPlayPress(songs[index], index)}
              moreOptions={[
                {
                  text: "Play",
                  onPress: () => onPlayPress(songs[index], index),
                },
                {
                  text: favs.includes(index)
                    ? "Remove from favorite"
                    : "Add to favorite",
                  onPress: () => handleAddToFavourite(index),
                },
                {
                  text: "Add to playlist",
                  onPress: () => {
                    setPlaylistModal(true);
                    setSongIndex(index);
                  },
                },
              ]}
            />
          ))
        : audios.map((song, key) => {
            const index = songs.findIndex((i) => i?.id === song?.id);

            return (
              <Card.MusicList
                key={key}
                imageURL={song?.img}
                title={song?.title}
                author={song?.author}
                duration={song?.durationMillis}
                onPlayPress={() => onPlayPress(song, index)}
                moreOptions={[
                  {
                    text: "Play",
                    onPress: () => onPlayPress(song, index),
                  },
                  {
                    text: favs.includes(index)
                      ? "Remove from favorite"
                      : "Add to favorite",
                    onPress: () => handleAddToFavourite(index),
                  },
                  {
                    text: "Add to playlist",
                    onPress: () => {
                      setPlaylistModal(true);
                      setSongIndex(index);
                    },
                  },
                ]}
              />
            );
          })}

      <ModalExpo
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
        isVisible={loadingPlay}
        backdropOpacity={0.79}
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
      <Modal.Playlist
        visible={playlistModal}
        onClose={setPlaylistModal}
        songIndex={songIndex}
      />
    </ScrollView>
  );
};

const mapStateToProps = (state) => ({ songs: state?.player?.songs });
const mapDispatchToProps = (dispatch) => ({ dispatch });
export default connect(mapStateToProps, mapDispatchToProps)(memo(Index));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
