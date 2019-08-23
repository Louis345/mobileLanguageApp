import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default class ProgressBar extends React.PureComponent {
  state = {
    percent: null,
    progressAnimation: new Animated.Value(0),
    isAnimationInProgress: false
  };

  static getDerivedStateFromProps(props, state) {
    if (props.percent !== state.percent) {
      return {
        percent: props.percent
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.percent !== prevProps.percent) {
      this.onAnimate();
    }
  }

  componentDidMount() {
    this.progressAnimation = new Animated.Value(0);
  }
  onAnimate = () => {
    Animated.timing(this.progressAnimation, {
      toValue: this.props.percent,
      duration: 1000,
      useNativeDriver: true
    }).start();

    this.progressAnimation.addListener(({ value }) => {
      this.setState({
        percent: value,
        animationValue: value
      });
    });
  };

  render() {
    const { animationValue } = this.state;

    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.inner, { width: `${animationValue}%` }]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 15,
    padding: 3,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    borderRadius: 15
  },
  inner: {
    width: '100%',
    backgroundColor: '#ffd600',
    height: 14,
    borderRadius: 15,
    overflow: 'hidden'
  }
});
