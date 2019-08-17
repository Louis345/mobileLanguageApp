import React from 'react';
import {
  Animated,
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions
} from 'react-native';
const screenHeight = Dimensions.get('window').height;
export default class ActionSheet extends React.Component {
  state = {
    animation: new Animated.Value(0)
  };

  componentDidUpdate() {
    const {
      input,
      input: { FirstInput },
      animatePanel,
      resetInput
    } = this.props;

    animatePanel && input ? FirstInput.focus() : FirstInput.blur();
    resetInput && FirstInput.clear();
  }

  openPanel = () => {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true
    }).start();
  };

  closePanel = () => {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true
    }).start();
  };

  render() {
    const { height, animatePanel } = this.props;
    animatePanel ? this.openPanel() : this.closePanel();
    const animatedStyles = {
      transform: [
        {
          translateY: this.state.animation.interpolate({
            inputRange: [0.01, 1],
            outputRange: [0, -1 * screenHeight],
            extrapolate: 'clamp'
          })
        }
      ]
    };
    return (
      <SafeAreaView style={[styles.sheet, height && height]}>
        <Animated.View style={[styles.popup, animatedStyles]}>
          <View style={{ flex: 1 }}>{this.props.children}</View>
        </Animated.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 30
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: Dimensions.get('window').height,
    flex: 1
  },
  popup: {
    marginHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    height: screenHeight,
    backgroundColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  }
});
