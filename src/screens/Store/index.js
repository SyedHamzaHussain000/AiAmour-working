import {SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import {WebView} from 'react-native-webview';
import {selectAuthToken} from '../../store/authToken';
import {useSelector} from 'react-redux';
import { SIZES } from '../../theme/Size';

export default function Store() {
  const token = useSelector(selectAuthToken);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{height:SIZES.height,width:SIZES.width}}>
        <WebView source={{uri: `http://213.199.35.222:5173/Store/${token}`}} />
      </View>
    </SafeAreaView>
  );
}
