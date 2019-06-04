import React from 'react';
import { Animated } from 'react-native';

export const onScroll = xOffset =>
  Animated.event([{ nativeEvent: { contentOffset: { x: xOffset } } }], {
    useNativeDriver: true
  });
