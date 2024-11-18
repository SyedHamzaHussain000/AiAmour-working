import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import {FONTS, SIZES} from '../../theme/Size';
import {fontFamily} from '../../theme/fontFamily';
import {color} from '../../theme/color';
import {useNavigation} from '@react-navigation/native';
import {removeAuthToken, selectAuthToken} from '../../store/authToken';
import {useDispatch, useSelector} from 'react-redux';
import {getUserDetails} from '../../services/config/API';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [personality, setPersonality] = useState('');
  const [face, setFace] = useState('');
  const [body, setBody] = useState('');
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const token = useSelector(selectAuthToken);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    setLoader(true);

    try {
      let reponse = await getUserDetails(token);
      setUsername(reponse?.data?.user?.username);
      setEmail(reponse?.data?.user?.email);
      setGender(reponse.data.user.preferences.gender);
      setPersonality(reponse.data.user.preferences.personality);
      setFace(reponse.data.user.preferences.facialFeatures);
      setBody(reponse.data.user.preferences.bodyDescription);
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  return (
    <Container>
      {loader ? (
        <View style={styles.loaderTop}>
          <ActivityIndicator size={SIZES.height * 0.05} color="#fff" />
        </View>
      ) : (
        <>
          <View style={styles.ProfileContainer}>
            <Image source={require('../../assets/images/userProfile.png')} />
            <Text style={styles.ProfileText}>{username}</Text>
            <Text style={styles.ProfileEmail}>{email}</Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate('SelectPreference')}
            style={styles.Buttons}>
            <Image
              style={styles.icon}
              source={require('../../assets/images/Preference.png')}
            />
            <Text style={styles.ButtonsText}>Preference</Text>
            <Image source={require('../../assets/images/right.png')} />
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Store')}
            style={styles.Buttons}>
            <Image
              style={styles.icon}
              source={require('../../assets/images/shop.png')}
            />
            <Text style={styles.ButtonsText}>Store</Text>
            <Image source={require('../../assets/images/right.png')} />
          </Pressable>

          <Pressable
            onPress={() => {
              dispatch(removeAuthToken());
            }}
            style={styles.Buttons}>
            <Image
              style={styles.icon}
              source={require('../../assets/images/logout.png')}
            />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </>
      )}
    </Container>
  );
};

export default Profile;

const styles = StyleSheet.create({
  ProfileContainer: {
    width: SIZES.width,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.height / 10,
  },
  ProfileText: {
    fontSize: FONTS.font20,
    fontFamily: fontFamily.OpenSansSemiBold,
    color: color.white,
  },
  ProfileEmail: {
    fontSize: FONTS.font12,
    fontFamily: fontFamily.OpenSansSemiBold,
    color: color.white,
  },
  Buttons: {
    width: SIZES.width * 0.9,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: FONTS.font16,
  },
  ButtonsText: {
    fontSize: FONTS.font16,
    fontFamily: fontFamily.MontserratBold,
    color: color.white,
    width: '80%',
  },
  logoutText: {
    fontSize: FONTS.font16,
    fontFamily: fontFamily.MontserratBold,
    color: color.white,
    width: '90%',
  },
  icon: {
    width: FONTS.font36,
    height: FONTS.font36,
    marginRight: FONTS.font16,
  },
  loaderTop: {
    marginTop: SIZES.height * 0.45,
  },
});
