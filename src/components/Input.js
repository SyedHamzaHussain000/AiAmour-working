import {Image, Platform, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import {color} from '../theme/color';
import {FONTS, SIZES} from '../theme/Size';
import {fontFamily} from '../theme/fontFamily';
import eyeOpen from '../assets/images/eyeOpen.png';
import eyeClose from '../assets/images/eyeClose.png';
const Input = ({
  icon,
  placeholder,
  value,
  onChange,
  secureTextEntry = false,
  editable = true,
}) => {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.TextInputContainer}>
        {icon && icon}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={'#FFFFFFA8'}
          style={secureTextEntry ? styles.TextInputPass: styles.TextInput}
          value={value}
          onChangeText={onChange}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={false}
          textAlignVertical="bottom"
          editable={editable}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={{right:SIZES.width*0.01}}>
            <Image
              source={
                isPasswordVisible
                  ? eyeOpen
                  : eyeClose
              }
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: FONTS.font20,
  },
  TextInputContainer: {
    borderRadius: FONTS.font32,
    borderColor: color.secondary,
    borderWidth: FONTS.font6 / 3,
    width: SIZES.width * 0.9,
    padding: FONTS.font6,
    // paddingVertical: FONTS.font6 / 4,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  TextInput: {
    fontSize: FONTS.font16,
    padding: FONTS.font10,
    color: color.white,
    fontFamily: fontFamily.PoppinsLight,
    width: '86%',
  },
  TextInputPass:{
    fontSize: FONTS.font16,
    padding: FONTS.font10,
    color: color.white,
    fontFamily: fontFamily.PoppinsLight,
    width: '78%',
    left:SIZES.width*0.01
  },
  eyeIcon: {
    width: FONTS.font20,
    height: FONTS.font20,
    tintColor: color.white,
  },
});
