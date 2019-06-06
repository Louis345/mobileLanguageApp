import React from 'react';
import { StyleSheet, View, Text, Dimensions, Animated } from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;

const transitionAnimation = (index, xOffset) => {
  const previousPosition = ((index - 1) * SCREEN_WIDTH) / 2;
  const currentPosition = (index * SCREEN_WIDTH) / 2;
  const nextPosition = (index + 1) * SCREEN_WIDTH;

  return {
    transform: [
      { perspective: 800 },
      {
        scale: xOffset.interpolate({
          inputRange: [previousPosition, currentPosition, nextPosition],
          outputRange: [1, 1.3, 1],
          extrapolate: 'clamp'
        })
      }
    ]
  };
};

const Card = ({ title, position, xOffset, width }) => {
  return (
    <Animated.View
      style={[
        styles.card,
        xOffset && transitionAnimation(position, xOffset),
        width && { width }
      ]}
    >
      <Text>{title}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    width: SCREEN_WIDTH / 2,
    backfaceVisibility: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    margin: 30
  }
});

export default Card;
