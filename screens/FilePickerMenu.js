import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

const FilePickerMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Upload Image"
        style={{ padding: 5 }}
        onPress={() =>
          navigation.navigate("ImagePicker", {
            useSavedPhoto: true
          })
        }
      />
      <Button
        title="Scan QR Code"
        style={{ padding: 5 }}
        onPress={() => navigation.navigate("QRScanner")}
      />
      <Button
        title="Take Picture"
        onPress={() =>
          navigation.navigate("Camera", {
            useSavedPhoto: false
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: 5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da"
  }
});

export default FilePickerMenu;
