import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default class ProgressBar extends React.PureComponent {
  state = {
    percent: 0,
    progressAnimation: new Animated.Value(0),
    isAnimationInProgress: false
  };

  static getDerivedStateFromProps(props, state) {
    console.log({ props });
    console.log({ state });
    if (props.percent !== state.percent) {
      return {
        percent: state.percent
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    console.log({ prevProps });
    console.log(this.state.percent);
    if (prevs.percent !== this.state.percent) {
      this.onAnimate();
    }
  }

  componentDidMount() {
    this.progressAnimation = new Animated.Value(0);
  }
  onAnimate = () => {
    Animated.timing(this.progressAnimation, {
      toValue: 20,
      duration: 1000,
      useNativeDriver: true
    }).start();

    this.progressAnimation.addListener(({ value }) => {
      this.setState({
        percent: value
      });
    });
  };
  componentDidUpdate() {
    console.log();
  }
  render() {
    const { animateStart, isAnimationInProgress } = this.props;
    let percent = null;
    if (this.progressAnimation) {
      percent = this.progressAnimation._value;
      console.log({ percent });
    }
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.inner, { width: `${percent}%` }]} />
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
    borderRadius: 15
  }
});
