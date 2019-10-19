import React, { Component } from "react";
import axios from "axios";
import {
  Alert,
  Linking,
  Dimensions,
  LayoutAnimation,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Vibration
} from "react-native";
import * as Permissions from "expo-permissions";

import { BarCodeScanner } from "expo-barcode-scanner";
import CardFixture from "../components/Card/card-fixture";
export default class QRScanner extends Component {
  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
    hasError: false,
    isLoading: true
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  _handleBarCodeRead = result => {
    if (result) {
      LayoutAnimation.easeInEaseOut();
      this.setState({ lastScannedUrl: result.data }, () => {
        this.GetJSONFromGoogleSheet();
      });
    }
  };

  parseSheetId = () => {
    return this.state.lastScannedUrl.slice(
      this.state.lastScannedUrl.lastIndexOf("spreadsheets/d/") + 15,
      this.state.lastScannedUrl.lastIndexOf("/")
    );
  };

  GetJSONFromGoogleSheet = () => {
    axios
      .get(
        `https://spreadsheets.google.com/feeds/cells/` +
          this.parseSheetId() +
          `/1/public/full?alt=json`
      )
      .then(data => {
        let ArrayFromSheet = [];
        let Deck = { Title: "", flashcards: [] };
        data.data.feed.entry.map(i => ArrayFromSheet.push(i.gs$cell));
        Deck.Title = ArrayFromSheet[1].inputValue;
        console.log(data.data.feed);
        ArrayFromSheet.map((cell, index) => {
          if (cell.row >= 4 && cell.col == 1) {
            Deck.flashcards.push({
              front: cell && cell.inputValue ? cell.inputValue : null,
              back:
                ArrayFromSheet[index + 1] &&
                ArrayFromSheet[index + 1].inputValue &&
                ArrayFromSheet[index + 1].inputValue !== cell.inputValue
                  ? ArrayFromSheet[index + 1].inputValue
                  : null,
              isCardFlipped: false
            });
          }
        });

        this.props.navigation.navigate("CreateDeck", {
          flashcards: Deck.flashcards,
          title: Deck.Title,
          date: new Date()
        });
      });
  };

  render() {
    // this.props.navigation.navigate("CreateDeck", {
    //   flashcards: CardFixture[0].flashcards,
    //   title: "deckTest",
    //   date: new Date()
    // });
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : this.state.hasCameraPermission === false ? (
          <Text style={{ color: "#fff" }}>
            Camera permission is not granted
          </Text>
        ) : (
          <BarCodeScanner
            onBarCodeScanned={this._handleBarCodeRead}
            style={{
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width
            }}
          />
        )}
      </View>
    );
  }

  _handlePressUrl = () => {
    Alert.alert(
      "Open this URL?",
      this.state.lastScannedUrl,
      [
        {
          text: "Yes",
          onPress: () => Linking.openURL(this.state.lastScannedUrl)
        },
        { text: "No", onPress: () => {} }
      ],
      { cancellable: false }
    );
  };

  _handlePressCancel = () => {
    this.setState({ lastScannedUrl: null });
  };

  _maybeRenderUrl = () => {
    if (!this.state.lastScannedUrl) {
      return;
    }

    return (
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.url} onPress={this._handlePressUrl}>
          <Text numberOfLines={1} style={styles.urlText}>
            test
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={this._handlePressCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000"
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    flexDirection: "row"
  },
  url: {
    flex: 1
  },
  urlText: {
    color: "#fff",
    fontSize: 20
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  cancelButtonText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 18
  }
});
