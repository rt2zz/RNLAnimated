import React, { Component } from "react";
import { Button, StyleSheet, View } from "react-native";

import Animated, { Easing } from "react-native-reanimated";

const {
  set,
  cond,
  eq,
  and,
  not,
  stopClock,
  startClock,
  clockRunning,
  block,
  timing,
  Value,
  Clock,
  interpolate,
} = Animated;

function runTiming(clock, start, end) {
  const state = {
    finished: new Value(1),
    position: new Value(start),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1500,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.linear),
  };

  const reset = [
    set(state.finished, 0),
    set(state.time, 0),
    set(state.frameTime, 0),
    set(state.position, start),
  ];

  return block([
    cond(and(state.finished, eq(state.position, start)), [...reset, set(config.toValue, end)]),
    cond(and(state.finished, eq(state.position, end)), [...reset]),
    cond(clockRunning(clock), 0, startClock(clock)),
    timing(clock, state, config),
    state.position,
  ]);
}

export default class LoadingThreeDot extends Component{
  _scales;
  constructor(props) {
    super(props);
    const clock = new Clock();
    const base = runTiming(clock, 0, 4);
    this._scales = [
      interpolate(base, {
        inputRange: [0, 1, 2, 4],
        outputRange: [1, 2, 1, 1],
      }),
      interpolate(base, {
        inputRange: [0, 1, 2, 3, 4],
        outputRange: [1, 1, 2, 1, 1],
      }),
      interpolate(base, {
        inputRange: [0, 2, 3, 4],
        outputRange: [1, 1, 2, 1],
      }),
    ];
  }

  render() {
    return (
      <View style={styles.loadingContainer}>
        {this._scales.map((scale, index) => (
          <Animated.View
            key={index}
            style={[
              styles.loadingDot,
              {
                transform: [{ scaleX: scale }, { scaleY: scale }],
              },
            ]}
          />
        ))}
        {/* <Button onPress={this.start} title="Start" />
        <Button onPress={this.stop} title="Stop" /> */}
      </View>
    );
  }
}

const DOT_SIZE = 30
const styles = StyleSheet.create({
  loadingDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE,
    margin: 15,
    backgroundColor: "red",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
