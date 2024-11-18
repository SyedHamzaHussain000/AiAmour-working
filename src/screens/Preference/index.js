import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import {color} from '../../theme/color';
import {FONTS, SIZES} from '../../theme/Size';
import {fontFamily} from '../../theme/fontFamily';
// import TextGradient from '@furkankaya/react-native-linear-text-gradient';
import {useNavigation} from '@react-navigation/native';
import {
  adjustPreferences,
  getBodyDescription,
  getBodyDescriptionMale,
  getFacialFeatures,
  getFacialFeaturesMale,
  getFemalePicture,
  getMalePicture,
  getPersonality,
  getPersonalityMale,
  updatePreferences,
} from '../../services/config/API';
import {setAuthToken} from '../../store/authToken';
import {useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

const Preference = ({route}) => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [personality, setPersonality] = useState('');
  const [facialFeatures, setFacialFeatures] = useState('');
  const [bodyDescription, setBodyDescription] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [previewImg, setPreviewImg] = useState('');

  const dispatch = useDispatch();

  const {token, update, genderPrev, personalityPrev, face, body, chatId} =
    route.params || {};

  useEffect(() => {
    if (route?.params) {
      setGender(genderPrev);
      setPersonality(personalityPrev);
      setFacialFeatures(face);
      setBodyDescription(body);
    }
  }, []);
  const handleStart = async () => {
    try {
      setLoader(true);
      let personalityResponse = await (gender.toLowerCase() === 'female'
        ? getPersonality(personality)
        : getPersonalityMale(personality));
      const personalityDesc = personalityResponse?.data;
      setPersonality(personalityDesc);

      let facialResponse = await (gender.toLowerCase() === 'female'
        ? getFacialFeatures(facialFeatures)
        : getFacialFeaturesMale(facialFeatures));
      const facialDesc = facialResponse?.data;
      setFacialFeatures(facialDesc);
      let bodyResponse = await (gender.toLowerCase() === 'female'
        ? getBodyDescription(bodyDescription)
        : getBodyDescriptionMale(bodyDescription));
      const bodyDesc = bodyResponse?.data;

      setBodyDescription(bodyDesc);
      let previewRes = await (gender.toLowerCase() === 'female'
        ? getFemalePicture(facialDesc, bodyDesc)
        : getMalePicture(facialDesc, bodyDesc));
      setLoader(false);

      setPreviewImg(previewRes?.data);
      setTimeout(() => {
        setImgModal(true);
      }, 500);
    } catch (error) {
      setLoader(false);
      setError(error?.message);
    }
  };

  const createChatRoom = async () => {
    try {
      let response = await updatePreferences(
        token,
        personality,
        facialFeatures,
        bodyDescription,
        gender,
        previewImg,
      );

      if (response?.status == 200) {
        setImgModal(false);
        dispatch(setAuthToken(token));
        setPersonality('');
        setFacialFeatures('');
        setBodyDescription('');
        navigation.navigate('Home');
        setLoader(false);
        setError('');
      } else {
        setError(response?.data?.message);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      setError(error?.message);
    }
  };
  const handleUpdate = async () => {
    try {
      setLoader(true);

      let personalityResponse = await (gender === 'female'
        ? getPersonality(personality)
        : getPersonalityMale(personality));
      const personalityDesc = personalityResponse?.data;

      let facialResponse = await (gender === 'female'
        ? getFacialFeatures(facialFeatures)
        : getFacialFeaturesMale(facialFeatures));
      const facialDesc = facialResponse?.data;

      let bodyResponse = await (gender === 'female'
        ? getBodyDescription(bodyDescription)
        : getBodyDescriptionMale(bodyDescription));
      const bodyDesc = bodyResponse?.data;

      let previewRes = await (gender.toLowerCase() === 'female'
        ? getFemalePicture(facialDesc, bodyDesc)
        : getMalePicture(facialDesc, bodyDesc));
      setLoader(false);

      setPreviewImg(previewRes?.data);
      setTimeout(() => {
        setImgModal(true);
      }, 500);
    } catch (error) {
      setLoader(false);
      setError(error?.message);
    }
  };

  const handleAdjustPreference = async () => {
    let response = await adjustPreferences(
      token,
      chatId,
      personality,
      facialFeatures,
      bodyDescription,
      gender,
      previewImg,
    );
    if (response?.status == 200) {
      setLoader(false);
      setError('');
      navigation.navigate('Home');
    } else {
      setError(response?.data?.message);
      setLoader(false);
    }
  };
  return (
    <Container>
      <ScrollView>
        <View style={styles.container}>
          {/* <TextGradient
            style={{
              fontFamily: fontFamily.poppinSemiBold,
              fontSize: FONTS.font20,
              marginBottom: FONTS.font20,
              marginTop: SIZES.height / 8,
            }}
            colors={[color.primary, color.secondary]}
            text="Choose Your Preferences"
          /> */}

          <View style={styles.TextInputContainer}>
            <Text style={styles.PreferenceText}>Enter your prompt:</Text>
            <TextInput
              style={styles.PreferenceTextInput}
              value={personality}
              onChangeText={setPersonality}
              placeholder="Enter Personality here....."
              placeholderTextColor={'#FFFFFFA8'}
            />

            <TextInput
              style={styles.PreferenceTextInput}
              value={facialFeatures}
              onChangeText={setFacialFeatures}
              placeholder="Enter Facial Features....."
              placeholderTextColor={'#FFFFFFA8'}
            />

            <TextInput
              style={styles.PreferenceTextInput}
              value={bodyDescription}
              onChangeText={setBodyDescription}
              placeholder="Enter Body Description ....."
              placeholderTextColor={'#FFFFFFA8'}
            />
            <TouchableOpacity
              style={styles.PreferenceTextInput}
              disabled={update}
              onPress={() => setModalVisible(true)}>
              {gender ? (
                <Text style={styles.genderText}>{gender}</Text>
              ) : (
                <Text style={styles.selectText}>Select Gender</Text>
              )}
            </TouchableOpacity>
          </View>
          {error && (
            <View style={styles.errorView}>
              <Text style={styles.errorText}>*{error}</Text>
            </View>
          )}

          {loader ? (
            <Pressable
              style={styles.button}
              children={<ActivityIndicator size={24} color="#fff" />}
            />
          ) : update ? (
            <Pressable
              style={styles.button}
              onPress={handleUpdate}
              children={
                <Text style={styles.buttonText}>Update Preferences</Text>
              }
            />
          ) : (
            <Pressable
              style={styles.button}
              onPress={handleStart}
              children={<Text style={styles.buttonText}>Let's Start</Text>}
            />
          )}
        </View>

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            <TouchableOpacity
              style={styles.genderButton}
              onPress={() => {
                setGender('Male');
                setModalVisible(false);
              }}>
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genderButton}
              onPress={() => {
                setGender('Female');
                setModalVisible(false);
              }}>
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={imgModal} onBackdropPress={() => setImgModal(false)}>
          <LinearGradient
            colors={[color.secondary, color.primary]}
            style={{
              borderRadius: 15,
              width: SIZES.width * 0.9,
              alignSelf: 'center',
            }}>
            <View style={styles.headerCard}>
              <Text style={styles.modalHeading}>Image Preview</Text>
              <Image
                source={{
                  uri: previewImg,
                }}
                style={styles.aiImage}
              />

              <View style={styles.buttonView}>
                <TouchableOpacity
                  style={[
                    styles.Button,
                    {
                      borderColor: color.secondary,
                    },
                  ]}
                  onPress={() => {
                    setImgModal(false);
                  }}>
                  <Text
                    style={[
                      styles.ButtonText,
                      {
                        color: color.secondary,
                      },
                    ]}>
                    Try Again
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.Button,
                    {
                      backgroundColor: color.secondary,
                    },
                  ]}
                  onPress={update ? handleAdjustPreference : createChatRoom}>
                  <Text
                    style={[
                      styles.ButtonText,
                      {
                        color: color.primary,
                      },
                    ]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Modal>
      </ScrollView>
    </Container>
  );
};

export default Preference;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  PreferenceContainer: {
    width: SIZES.width * 0.9,
    padding: FONTS.font10,
    borderWidth: FONTS.font6 / 3,
    borderColor: color.secondary,
    borderRadius: FONTS.font12,
    marginBottom: FONTS.font30,
  },
  PreferenceText: {
    color: color.white,
    fontFamily: fontFamily.PoppinsRegular,
    fontSize: FONTS.font14,
    marginBottom: FONTS.font8,
  },
  TextInputContainer: {
    width: SIZES.width * 0.9,
    alignSelf: 'center',
  },
  PreferenceTextInput: {
    borderRadius: FONTS.font12,
    borderColor: color.secondary,
    borderWidth: FONTS.font6 / 3,
    width: '100%',
    paddingHorizontal: FONTS.font10,
    paddingVertical: FONTS.font12,
    color: color.white,
    fontSize: FONTS.font16,
    marginBottom: FONTS.font16,
  },

  genderText: {
    fontSize: FONTS.font16,
    color: '#FFFFFFA8',
  },
  button: {
    width: SIZES.width * 0.8,
    alignSelf: 'center',
    borderRadius: FONTS.font22,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: FONTS.font14,
    marginTop: SIZES.height / 6,
  },
  buttonText: {
    fontSize: FONTS.font16,
    color: color.white,
  },
  genderPicker: {
    borderRadius: FONTS.font14,
    borderColor: '#fff',
    borderWidth: 1,
    width: '100%',
    fontSize: FONTS.font16,
    marginBottom: FONTS.font16,
  },

  errorView: {
    alignSelf: 'flex-start',
    marginLeft: SIZES.width * 0.1,
  },
  errorText: {
    color: color.red,
    fontSize: FONTS.font14,
    fontFamily: fontFamily.PoppinsRegular,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: SIZES.height * 0.01,
    fontFamily: fontFamily.PoppinsMedium,
  },
  genderButton: {
    borderRadius: FONTS.font12,
    borderColor: color.secondary,
    borderWidth: FONTS.font6 / 3,
    paddingVertical: SIZES.height * 0.01,
    marginVertical: SIZES.height * 0.01,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  genderText: {
    fontSize: 18,
    color: 'white',
    fontFamily: fontFamily.PoppinsRegular,
  },
  selectText: {
    fontSize: FONTS.font16,
    color: '#FFFFFFA8',
  },
  ButtonText: {
    fontFamily: fontFamily.OpenSansSemiBold,
    fontSize: FONTS.font16,
  },
  Button: {
    top: SIZES.height * 0.02,
    width: FONTS.font30 * 3,
    paddingVertical: FONTS.font10,
    borderWidth: FONTS.font6 / 3,
    borderRadius: FONTS.font8,
    borderColor: color.primary,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.height * 0.04,
    marginHorizontal: SIZES.width * 0.02,
  },
  aiImage: {
    height: SIZES.height * 0.4,
    width: SIZES.width * 0.8,
    alignSelf: 'center',
    borderRadius: 15,
    resizeMode: 'contain',
  },
  modalHeading: {
    padding: SIZES.height * 0.02,
    textAlign: 'center',
    fontFamily: fontFamily.poppinSemiBold,
    fontSize: FONTS.font22,
    color: color.primary,
  },
  buttonView: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});
