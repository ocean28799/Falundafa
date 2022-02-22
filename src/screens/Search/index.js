import React, { memo, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { connect } from "react-redux";
import GestureRecognizer from "react-native-swipe-gestures";
import { Section } from "../../widgets";
import { Icon } from "../../components";

const Index = ({ songs }) => {
  const { goBack } = useNavigation();

  const [searchState, setSearchState] = useState({
    searchValue: "",
    newData: [],
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (songs.length && !data.length) {
      let reformattedArray = songs.map((obj, index) => {
        let rObj = { ...obj, value: "", key: "" };
        rObj.value = obj.title;
        rObj.key = `song-item-${index}`;
        return rObj;
      });

      setData(reformattedArray);
      setSearchState({ searchValue: "", newData: reformattedArray });
    }
  }, [songs, data]);

  function removeAccents(str) {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  const fetchSearching = async (search) => {
    try {
      setLoading(true);
      let newData = await data.filter((item) => {
        const itemData = removeAccents(item?.value?.toLowerCase() || "");
        const itemAuthor = removeAccents(item?.author?.toLowerCase() || "");
        const searchData = removeAccents(search?.toLowerCase() || "");

        if (itemData?.indexOf(searchData) > -1) {
          return itemData?.indexOf(searchData) > -1;
        } else {
          return itemAuthor?.indexOf(searchData) > -1;
        }
      });

      if (!search) newData = data;

      setSearchState({ searchValue: search, newData: newData });
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.container}>
          <GestureRecognizer style={{ flex: 1 }} onSwipeDown={() => goBack()}>
            <View style={styles.header}>
              <View style={styles.input}>
                <Icon name="search" color="#355070" />
                <TextInput
                  style={styles.textInput}
                  onChangeText={(search) => fetchSearching(search)}
                  value={searchState.searchValue}
                  returnKeyType="search"
                  placeholder="Nhập tên bài hát hoặc tên tác giả..."
                />
              </View>
              <TouchableOpacity style={styles.btn} onPress={() => goBack()}>
                <Text style={styles.btnTxt}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.result}>
              {loading ? (
                <ActivityIndicator size="large" color="#002855" />
              ) : (
                <Section.MusicList audios={searchState.newData} />
              )}
            </View>
          </GestureRecognizer>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
};

const mapStateToProps = (state) => ({ songs: state?.player?.songs });
export default connect(mapStateToProps, null)(memo(Index));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#E6E6E6",
    borderRadius: 6,
  },
  textInput: {
    flex: 1,
    color: "rgba(0, 0, 0, .5)",
    marginLeft: 10,
  },
  btn: {
    flexBasis: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTxt: {
    color: "#0f4c5c",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.36,
    backgroundColor: "#cfdbd5",
    padding: 9,
    borderRadius: 4,
  },
  result: {
    flex: 1,
  },
});
