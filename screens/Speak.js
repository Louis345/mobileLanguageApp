import * as React from "react";
import { View, StyleSheet, Button } from "react-native";
import * as Speech from "expo-speech";
import { Audio, Video } from "expo-av";

// Creates a client
// https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3

export default class App extends React.Component {
  // speak() {
  //   const thingToSay = "0";

  //   Speech.speak("Salut!", {
  //     language: "fr",
  //     voiceIOS: "Aurelie"
  //   });
  //   console.log(Speech.getAvailableVoicesAsync());
  // }
  // eslint-disable-next-line class-methods-use-this
  async speak() {
    try {
      const playbackObject = await Audio.Sound.createAsync(
        {
          uri: "http://ec2-3-89-189-253.compute-1.amazonaws.com/playSound"
        },
        { shouldPlay: true }
      );
      await playbackObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      console.log({ error });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title="Press to hear some words" onPress={() => this.speak()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 10,
    backgroundColor: "#ecf0f1",
    padding: 8
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  }
});
