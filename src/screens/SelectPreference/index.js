import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {FONTS, SIZES} from '../../theme/Size';
import {color} from '../../theme/color';
import {fontFamily} from '../../theme/fontFamily';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getChatList, getUserDetails} from '../../services/config/API';
import {selectAuthToken} from '../../store/authToken';
import {useSelector} from 'react-redux';
// import TextGradient from '@furkankaya/react-native-linear-text-gradient';

export default function SelectPreference({route}) {
  const navigation = useNavigation();

  const [rank, setRank] = useState('');
  const [chatList, setChatList] = useState([]);

  const [loader, setLoader] = useState(false);

  const token = useSelector(selectAuthToken);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          await getAllChats();
          await getDetails();
        } catch (error) {
          setLoader(false);
        } finally {
          setLoader(false);
        }
      };

      loadData();
    }, []),
  );

  const getDetails = async () => {
    try {
      let reponse = await getUserDetails(token);
      setRank(reponse?.data?.user?.rank);
      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  const getAllChats = async () => {
    setLoader(true);
    try {
      let reponse = await getChatList(token);
      setChatList(reponse.data.chats);
      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{right: SIZES.width * 0.13}}>
          <Image
            source={require('../../assets/images/right.png')}
            style={{
              transform: [{rotate: '180deg'}],
              right: SIZES.width * 0.01,
            }}
          />
        </TouchableOpacity>

        {/* <TextGradient
          style={{
            fontFamily: fontFamily.poppinSemiBold,
            fontSize: FONTS.font20,
          }}
          colors={[color.primary, color.secondary]}
          text="Manage Preferences"
        /> */}
      </View>

      {loader ? (
        <View style={styles.loaderTop}>
          <ActivityIndicator size={SIZES.height * 0.05} color="#fff" />
        </View>
      ) : (
        <>
          <ScrollView>
            {chatList?.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  onPress={() =>
                    navigation.navigate('Preference', {
                      token,
                      update: true,
                      profile: item?.preferences?.profile,
                      name: item?.preferences?.name,
                      genderPrev: item?.preferences?.gender,
                      personalityPrev: item?.preferences?.personality,
                      face: item?.preferences?.facialFeatures,
                      body: item?.preferences?.bodyDescription,
                      chatId: item._id,
                    })
                  }
                  style={styles.chatContainer}>
                  <Image
                    style={styles.chatAvatar}
                    source={{uri: item?.preferences?.profile}}
                  />
                  <View style={styles.nameContainer}>
                    <Text style={styles.name}>{item?.preferences?.name}</Text>
                  </View>
                </Pressable>
              );
            })}
            <View style={{marginBottom: SIZES.height * 0.13}}></View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black,
  },
  header: {
    flexDirection: 'row',
    padding: FONTS.font16,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 2,
    width: SIZES.width,
    backgroundColor: color.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: color.white,
    fontSize: FONTS.font36,
    fontFamily: fontFamily.sacramento,
  },
  Search: {
    backgroundColor: color.grey,
    width: SIZES.width * 0.9,
    alignSelf: 'center',
    padding: FONTS.font6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: FONTS.font6,
    marginTop: Platform.OS === 'android' ? 0 : FONTS.font20,
  },
  SearchTextInput: {
    width: '80%',
    paddingHorizontal: FONTS.font10,
    paddingVertical: Platform.OS === 'android' ? 0 : FONTS.font10,

    color: color.white,
    fontSize: FONTS.font16,
  },
  icon: {
    width: FONTS.font24,
    height: FONTS.font24,
  },
  chatContainer: {
    flexDirection: 'row',
    marginVertical: FONTS.font14,
    width: SIZES.width * 0.9,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatAvatar: {
    width: FONTS.font28 * 2,
    height: FONTS.font28 * 2,
    borderRadius: FONTS.font28 * 2,
  },
  nameContainer: {
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  name: {
    fontSize: FONTS.font24,
    fontFamily: fontFamily.PoppinsRegular,
    color: color.white,
  },
  time: {
    fontSize: FONTS.font12,
    fontFamily: fontFamily.OpenSansSemiBold,
    color: '#ACB3BF',
  },
  loaderTop: {
    marginTop: SIZES.height * 0.3,
  },
  plusBtn: {
    alignSelf: 'flex-end',
    right: SIZES.width * 0.04,
    bottom: SIZES.height * 0.2,
    position: 'absolute',
  },
  plusIcon: {
    height: SIZES.height * 0.06,
    width: SIZES.height * 0.06,
  },
});
