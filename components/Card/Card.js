import React from 'react';
import { StyleSheet, View, Text, Dimensions, Animated } from 'react-native';
import { cardMargin } from '../../styles/styles.js';
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

export default class Card extends React.Component {
  state = {
    isCardFlipped: false,
    flipCard: new Animated.Value(0)
  };

  componentWillMount() {
    this.flipValue = new Animated.Value(0);
    this.frontAnimatedStyles = {
      transform: [
        {
          rotateY: this.flipValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
          })
        }
      ]
    };

    this.backAnimatedStyles = {
      transform: [
        {
          rotateY: this.flipValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['180deg', '360deg']
          })
        }
      ]
    };
  }

  flipToSideA = () => {
    Animated.timing(this.flipValue, {
      toValue: 1,
      duration: 300
    }).start();
  };

  flipToSideB = () => {
    Animated.timing(this.flipValue, {
      toValue: 0,
      duration: 300
    }).start();
  };
  render() {
    const {
      title,
      position,
      xOffset,
      width,
      style,
      children,
      flipToSideA,
      flipToSideB,
      onPress,
      SideB
    } = this.props;

    flipToSideA && this.flipToSideA();
    flipToSideB && this.flipToSideB();

    onPress && onPress();
    return (
      <View>
        <Animated.View
          style={[
            styles.card,
            xOffset && transitionAnimation(position, xOffset),
            width && { width },
            style && style,
            this.frontAnimatedStyles
          ]}
        >
          {children ? <View>{children}</View> : <Text>{title}</Text>}
        </Animated.View>
        <Animated.View
          style={[
            styles.card,
            xOffset && transitionAnimation(position, xOffset),
            width && { width },
            style && style,
            styles.back,
            this.backAnimatedStyles
          ]}
        >
          {SideB && <Text>{SideB}</Text>}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: SCREEN_WIDTH / 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    margin: cardMargin,
    backfaceVisibility: 'hidden',
    borderRadius: 20
  },
  back: {
    position: 'absolute',
    top: 0,
    backfaceVisibility: 'hidden'
  }
});
