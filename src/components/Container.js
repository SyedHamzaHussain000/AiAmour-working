import {StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {color} from '../theme/color';

const Container = ({children}) => {
  return (
    <SafeAreaView style={styles.container}>{children}</SafeAreaView>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black,
  },
});
