import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

const LessonsMenu = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Lessons Menu</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default LessonsMenu;
