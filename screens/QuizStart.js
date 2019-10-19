import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { Button } from "react-native-elements";
import Gradient from "react-native-css-gradient";
import withNavigationContextConsumer from "../context/with-navigation-context-consumer";

const GRADIENTS = {
  upset: "linear-gradient(to bottom, rgb(231, 97, 97), rgb(236, 49, 49))",
  sad: "linear-gradient(to bottom, rgb(247,152,48), rgb(231, 97, 97))",
  neutral: "linear-gradient(to bottom, rgb(243, 189, 67), rgb(203,96,32))",
  smile: "linear-gradient(to bottom, rgb(238,172,77), rgb(187, 230, 95))",
  excited: "linear-gradient(to bottom, rgb(95,230,118), rgb(46, 232, 78))"
};

const QuizStart = ({ navigation, selectedDeckLength }) => {
  const animationLottie = useRef(null);
  useEffect(() => {
    animationLottie.current.play();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationLottie}
        style={{
          width: 300,
          height: 300
        }}
        source={require("../assets/quiz.json")}
      />

      <Button
        title="Start Quiz"
        onPress={() => selectedDeckLength > 3 && navigation.navigate("Modal")}
      />
    </View>
  );
};

export default withNavigationContextConsumer(QuizStart);

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 30,
    flex: 1
  }
});
