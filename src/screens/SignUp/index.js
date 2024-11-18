import {
  BackHandler,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import Container from '../../components/Container';
// import TextGradient from '@furkankaya/react-native-linear-text-gradient';
import {fontFamily} from '../../theme/fontFamily';
import {FONTS, SIZES} from '../../theme/Size';
import {color} from '../../theme/color';
import Input from '../../components/Input';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {signup} from '../../services/config/API';

const SignUp = () => {
  const navigation = useNavigation();
  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [Password, setPassword] = useState('');
  const [is18Plus, setis18Plus] = useState('pending');
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);

  const AcceptModal = () => {
    setis18Plus('accepted');
  };

  const rejectModal = () => {
    setis18Plus('rejected');
    ToastAndroid.show(
      `You can't signup in the app because you're 18+`,
      ToastAndroid.LONG,
    );
    BackHandler.exitApp();
  };

  const handleSignUp = async () => {
    try {
      setLoader(true);
      let response = await signup(Name, Email, Password);
      console.log("SDAASDAKJBDJKASB,.,.KJDBA",response)
      if (response?.status == 200) {
        setLoader(false);
        setError('');
        navigation.navigate('Preference', {token: response.data.token});
      } else {
        setError(response?.data?.message);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      setError(error?.message);
      console.log("error", error)
    }

  };
  return (
    <Container>
      <ScrollView>
        <View style={styles.container}>
          {/* <TextGradient
            style={{
              fontFamily: fontFamily.poppinSemiBold,
              fontSize: FONTS.font32,
              marginBottom: FONTS.font20,
            }}
            colors={[color.primary, color.secondary]}
            text="Sign Up Page"
          /> */}
          <Input
            value={Name}
            placeholder={'Enter your name'}
            icon={
              <Image
                source={require('../../assets/images/profile.png')}
                style={styles.images}
              />
            }
            onChange={setName}
          />

          <Input
            value={Email}
            placeholder={'Enter your email'}
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
              
              placeholder={'Enter your Password'}
              icon={
                <Image
                  source={require('../../assets/images/password.png')}
                  style={[styles.images,styles.passwordImg]}
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
            style={styles.forgetPassword}
            children={
              <Text
                style={styles.forgetPasswordText}
                children={'or Continue with '}
              />
            }
          />

          <View style={styles.secondContainer}>
            <Pressable
              children={
                <Image
                  style={{width: FONTS.font38, height: FONTS.font38}}
                  source={require('../../assets/images/facebook.png')}
                />
              }
            />
            <Pressable
              style={{marginLeft: FONTS.font12}}
              children={
                <Image
                  style={{width: FONTS.font38, height: FONTS.font38}}
                  source={require('../../assets/images/Google.png')}
                />
              }
            />
          </View>
          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={styles.forgetPassword}
            children={
              <Text style={styles.forgetPasswordText}>
                Already Have an Account?{' '}
                <Text
                  style={{
                    color: color.secondary,
                    fontFamily: fontFamily.MontserratBold,
                  }}>
                  SignIn
                </Text>
              </Text>
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
              onPress={handleSignUp}
              children={<Text style={styles.buttonText}>Sign Up</Text>}
            />
          )}
        </View>

        <Modal
          isVisible={is18Plus === 'pending'}
          animationIn={'tada'}
          animationInTiming={5000}>
          <View
            style={{
              backgroundColor: color.primary,
              padding: FONTS.font18,
              alignItems: 'center',
              borderRadius: FONTS.font18,
            }}>
            <Text
              style={{
                fontSize: FONTS.font24,
                color: color.secondary,
                fontWeight: '800',
              }}>
              Is your Age 18 or Above?
            </Text>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-around',
                width: '100%',
              }}>
              <Pressable
                style={styles.modalButton}
                onPress={rejectModal}
                children={<Text style={styles.modalButtonText}>No</Text>}
              />
              <Pressable
                style={styles.modalButton}
                onPress={AcceptModal}
                children={<Text style={styles.modalButtonText}>Yes</Text>}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </Container>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: SIZES.height,
  },
  images: {
    width: FONTS.font20,
    height: FONTS.font20,
    resizeMode: 'contain',
    left:SIZES.width*0.02
  },
  passwordImg:{
    marginLeft:SIZES.width*0.02,
  },
  forgetPassword: {
    width: SIZES.width * 0.9,
    marginTop: FONTS.font20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgetPasswordText: {
    color: color.white,
    fontSize: FONTS.font14,
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
  modalButton: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: FONTS.font6,
    backgroundColor: color.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: FONTS.font10,
    marginTop: FONTS.font20,
  },
  buttonText: {
    fontSize: FONTS.font16,
    color: color.white,
  },
  modalButtonText: {
    fontSize: FONTS.font12,
    color: color.black,
  },
  secondContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: FONTS.font18,
  },
  inputContainer: {
    marginTop: FONTS.font20,
  },
  TextInputContainer: {
    borderRadius: FONTS.font32,
    borderColor: color.secondary,
    borderWidth: FONTS.font6 / 3,
    width: SIZES.width * 0.9,
    padding: FONTS.font6,
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
