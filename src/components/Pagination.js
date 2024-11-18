/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
import React from 'react';
import {StyleSheet, View, Animated, Dimensions} from 'react-native';
import {FONTS} from '../theme/Size';
import {color} from '../theme/color';

const width = Dimensions.get('screen').width;

const Paginator = ({data, scrollX}) => {
  return (
    <View style={{flexDirection: 'row', height: 20}}>
      {data?.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [FONTS.font6, FONTS.font20, FONTS.font6],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.5, 1, 0.5],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={[styles?.dot, {width: dotWidth, opacity}]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};

export default Paginator;

const styles = StyleSheet.create({
  dot: {
    backgroundColor: color.primary,
    borderRadius: 10,
    height: FONTS.font6,
    marginHorizontal: FONTS.font10,
  },
});
