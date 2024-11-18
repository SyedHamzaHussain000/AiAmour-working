import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Container from '../../components/Container';
// import TextGradient from '@furkankaya/react-native-linear-text-gradient';
import {fontFamily} from '../../theme/fontFamily';
import {FONTS, SIZES} from '../../theme/Size';
import {color} from '../../theme/color';
import Input from '../../components/Input';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {signin} from '../../services/config/API';
import { setAuthToken } from '../../store/authToken';

const Login = () => {
  const navigation = useNavigation();

  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loader, setLoader] = useState('');

  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      setLoader(true);
      let response = await signin(Email, Password);
      if (response?.status == 200) {
        setLoader(false);
        setError('');
        dispatch(setAuthToken(response.data.token));
      } else {
        setError(response?.data?.message);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      setError(error?.message);
    }
  };

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
          text="Sign In Page"
        />
        */}

        <Input
          value={Email}
          placeholder={'Email'}
          icon={
            <Image
              source={require('../../assets/images/email.png')}
              style={styles.images}
            />
          }
          onChange={setEmail}
        />

        <Input
          value={Password}
          placeholder={'Password'}
          icon={
            <Image
              source={require('../../assets/images/password.png')}
              style={styles.images}
            />
          }
          secureTextEntry={true}
          onChange={setPassword}
        />
        {error && (
          <View style={styles.errorView}>
            <Text style={styles.errorText}>*{error}</Text>
          </View>
        )}
        <Pressable
          onPress={() => navigation.navigate('ForgetPassword')}
          style={styles.forgetPassword}
          children={
            <Text
              style={styles.forgetPasswordText}
              children={'Forgot password? '}
            />
          }
        />

        {loader ? (
          <Pressable
            style={styles.button}
            children={<ActivityIndicator size={24} color="#fff" />}
          />
        ) : (
          <Pressable
            style={styles.button}
            onPress={handleSignIn}
            children={<Text style={styles.buttonText}>Sign In</Text>}
          />
        )}
      </View>
    </Container>
  );
};

export default Login;

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
    left:SIZES.width*0.02

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
  errorView: {
    marginTop: SIZES.height * 0.015,
    alignSelf: 'flex-start',
    marginLeft: SIZES.width * 0.1,
  },
  errorText: {
    color: color.red,
    fontSize: FONTS.font14,
    fontFamily: fontFamily.PoppinsRegular,
  },
});
