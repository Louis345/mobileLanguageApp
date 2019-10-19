import * as React from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ExpoImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import FormData from "form-data";

export default class ImagePicker extends React.Component {
  componentDidMount() {
    this.getPermissionAsync();
    const {
      navigation: {
        state: {
          params: { scrollToCard }
        }
      }
    } = this.props;
  }

  state = {
    image: null,
    useSavedPhoto: false
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  _pickImage = async () => {
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  createFormData = (photo, body) => {
    const data = new FormData();
    console.log(this.state.image);
    data.append("photo", {
      name: this.state.image,
      type: "jpg",
      uri:
        Platform.OS === "android"
          ? this.state.image
          : this.state.image.replace("file://", "")
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    console.log({ data });
    return data;
  };

  handleUploadPhoto = () => {
    fetch("http://ec2-3-89-189-253.compute-1.amazonaws.com/Images", {
      method: "POST",
      body: this.createFormData(this.state.image, { userId: "123" })
    })
      .then(response => response.json())
      .then(response => {
        console.log("upload succes", response);
        alert("Upload success!");
        this.setState({
          image: null,
          response
        });
      })
      .catch(error => {
        console.log("upload error", error);
        alert("Upload failed!");
      });
  };

  async snapPhoto() {
    console.log("Button Pressed");
    if (this.camera) {
      console.log("Taking photo");
      const options = {
        quality: 1,
        base64: true,
        fixOrientation: true,
        exif: true
      };
      await this.camera.takePictureAsync(options).then(photo => {
        photo.exif.Orientation = 1;
        console.log(photo);
      });
    }
  }

  render() {
    let { image, response } = this.state;
    let parsedResponse = null;
    if (response) {
      parsedResponse = response[0].fullTextAnnotation.text
        .split(/(\r\n|\n|\r)/gm)
        .filter(word => word.trim())
        .map(word => {
          return {
            front: word,
            back: "Needs Definition"
          };
        });
    }
    parsedResponse &&
      this.props.navigation.navigate("CreateDeck", {
        flashcards: parsedResponse,
        title: "Needs A Title",
        date: new Date()
      });
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {!response && (
          <Button
            title="Pick an image from camera roll"
            onPress={this._pickImage}
          />
        )}
        {image && !response && (
          <View>
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
            <Button
              title="Upload Image To Server"
              onPress={this.handleUploadPhoto}
            />
          </View>
        )}
      </View>
    );
  }
}
