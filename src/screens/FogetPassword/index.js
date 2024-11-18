import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Container from '../../components/Container';
// import TextGradient from '@furkankaya/react-native-linear-text-gradient';
import {fontFamily} from '../../theme/fontFamily';
import {FONTS, SIZES} from '../../theme/Size';
import {color} from '../../theme/color';
import Input from '../../components/Input';
import {useNavigation} from '@react-navigation/native';
const ForgetPassword = () => {
  const navigation = useNavigation();

  const [Email, setEmail] = useState('');

  return (
    <Container>
      <View style={styles.container}>
        {/* <TextGradient
          style={{
            fontFamily: fontFamily.poppinSemiBold,
            fontSize: FONTS.font32,
            marginBottom: FONTS.font20,
          }}
          colors={[color.primary, color.secondary]}
          text="Forgot Password"
        /> */}

        <Input
          value={Email}
          placeholder={'Email'}
          icon={
            <Image
              source={require('../../assets/images/email.png')}
              style={styles.images}
            />
          }
          secureTextEntry={false}
          onChange={setEmail}
        />

        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
          children={<Text style={styles.buttonText}>Forgot Password</Text>}
        />
      </View>
    </Container>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  images: {
    width: FONTS.font20,
    height: FONTS.font20,
    resizeMode: 'contain',
  },
  forgetPassword: {
    width: SIZES.width * 0.9,
    marginTop: FONTS.font20,
    alignSelf: 'center',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  forgetPasswordText: {
    color: color.white,
    fontSize: FONTS.font16,
    fontFamily: fontFamily.PoppinsRegular,
  },
  button: {
    width: SIZES.width * 0.8,
    alignSelf: 'center',
    borderRadius: FONTS.font22,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: FONTS.font14,
    marginTop: FONTS.font30,
  },
  buttonText: {
    fontSize: FONTS.font16,
    color: color.white,
  },
});
