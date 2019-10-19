import React from "react";
import { Audio, Video } from "expo-av";
import axios from "axios";
function speech(WrappedComponent) {
  // ...and returns another component...
  return class extends React.Component {
    state = {
      isSoundPlaying: null
    };

    createWord = word => {
      const response = axios
        .post("http://ec2-3-89-189-253.compute-1.amazonaws.com", {
          text: word
        })
        .then(response => {
          return response;
        })
        .catch(function(error) {
          console.log(error);
        });
      return response;
    };

    speak = async () => {
      try {
        const { sound: soundObject, status } = await Audio.Sound.createAsync(
          {
            uri: "http://ec2-3-89-189-253.compute-1.amazonaws.com/playSound"
          },
          { shouldPlay: true }
        );
        this.setState({
          isSoundPlaying: status
        });
        await soundObject.playAsync();
        // Your sound is playing!
        console.log("sound playing");
      } catch (error) {
        console.warn("Couldn't Play audio", error);
      }
    };

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return (
        <WrappedComponent
          speak={this.speak}
          {...this.props}
          isSoundPlaying={this.state.isSoundPlaying}
          createWord={this.createWord}
        />
      );
    }
  };
}

export default speech;
