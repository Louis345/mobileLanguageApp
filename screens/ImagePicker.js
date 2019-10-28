import * as React from "react";
import {
  Button,
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from "react-native";
import * as ExpoImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import FormData from "form-data";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

export default class ImagePicker extends React.Component {
  componentDidMount() {
    this.getPermissionAsync();
    const {
      navigation: {
        state: {
          params: { useSavedPhoto }
        }
      }
    } = this.props;
    this.setState({ useSavedPhoto });
  }

  componentWillMount() {
    console.log("test");
  }
  state = {
    image: null,
    useSavedPhoto: false,
    isLoading: false
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

    return data;
  };

  handleUploadPhoto = () => {
    this.setState(
      {
        isLoading: true
      },
      () => {
        fetch("http://ec2-3-89-189-253.compute-1.amazonaws.com/Images", {
          method: "POST",
          body: this.createFormData(this.state.image, { userId: "123" })
        })
          .then(response => response.json())
          .then(response => {
            alert("Upload success!");
            this.setState({
              image: null,
              response,
              isLoading: false
            });
          })
          .catch(error => {
            console.log("upload error", error);
            alert("Upload failed!");
          });
      }
    );
  };

  renderCamera = () => {
    const { response } = this.state;
    response && this.handleResponse();
    return (
      <Camera
        style={{ flex: 1 }}
        type={this.state.type}
        ref={ref => {
          this.camera = ref;
        }}
        type={this.state.type}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: "flex-end",
              alignItems: "center"
            }}
            onPress={() => {
              this.snapPhoto();
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
              Snaps
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    );
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
      const response = await this.camera
        .takePictureAsync(options)
        .then(photo => {
          photo.exif.Orientation = 1;
          console.log(photo.uri);
          console.log(photo);
          console.log("in async");
          this.setState({ image: photo.uri });
        });
    }
  }

  handleResponse = () => {
    let parsedResponse = null;
    const { response } = this.state;
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
    this.setState({
      image: null,
      response: null
    });
    parsedResponse &&
      this.props.navigation.navigate("CreateDeck", {
        flashcards: parsedResponse,
        title: "Needs A Title",
        date: new Date()
      });
  };
  renderUpLoadImageControls = () => {
    let { image, response } = this.state;
    response && this.handleResponse();
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {!response && (
          <Button
            title="Pick an image from camera roll"
            onPress={this._pickImage}
          />
        )}
      </View>
    );
  };

  renderLoadingScreen = () => {
    alert("renderLoading Screen");
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  render() {
    const { useSavedPhoto, image, isLoading } = this.state;

    if (!isLoading && image) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
          <Button
            title="Upload Image To Server"
            onPress={this.handleUploadPhoto}
          />
        </View>
      );
    }
    return useSavedPhoto
      ? this.renderUpLoadImageControls()
      : isLoading
      ? this.renderLoadingScreen()
      : this.renderCamera();
  }
}
