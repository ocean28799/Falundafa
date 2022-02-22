import React from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import Container from "../Container";
import * as Card from "../../../components/Cards";
import { SCREENS } from "../../../constants";

const Index = ({ style = {} }) => {
  const { navigate } = useNavigation();

  return (
    <Container style={styles.container} title="Danh mục">
      <Card.Explore
        style={{ marginLeft: 20 }}
        title="Bài giảng"
        subtitle="Chân - Thiện - Nhẫn"
        onPress={() => navigate(SCREENS.LECTURE)}
      />
      <Card.Explore
        title="Nhạc đại pháp"
        subtitle="Chân - Thiện - Nhẫn"
        onPress={() => navigate(SCREENS.DAFASONGS)}
      />
      <Card.Explore
        title="Nhạc luyện công"
        subtitle="Chân - Thiện - Nhẫn"
        onPress={() => navigate(SCREENS.PRACTICESONGS)}
      />
      {/* <Card.Explore
        background={true}
        title="Nhạc âu mỹ"
        subtitle="Thưởng thức các bài hát Âu Mỹ"
        onPress={() => navigate(SCREENS.SONGS)}
      /> */}
    </Container>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
});
