import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {FONTS, SIZES} from '../../theme/Size';
import {color} from '../../theme/color';
import {fontFamily} from '../../theme/fontFamily';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  getChatList,
  getUserDetails,
  searchChat,
} from '../../services/config/API';
import {selectAuthToken} from '../../store/authToken';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

const Chat = ({route}) => {
  const [Search, setSearch] = useState('');
  const navigation = useNavigation();
  const [face, setFace] = useState('');
  const [body, setBody] = useState('');
  const [rank, setRank] = useState('');
  const [chatList, setChatList] = useState([]);
  const [message, setMessage] = useState('');
  const [characterSubscription, setCharacterSubscription] = useState('');

  const [loader, setLoader] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

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
      setCharacterSubscription(reponse?.data?.user?.subscription?.characters);
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

  const handleAddChat = () => {
    if (characterSubscription == chatList.length) {
      setModalVisible(true);
    } else {
      navigation.navigate('Preference', {token: token});
    }
  };

  const handleSearch = async name => {
    setLoader(true);
    try {
      if (name.length > 1) {
        let response = await searchChat(token, name);
        if (response.status == 200) {
          setMessage('');
          setChatList(response.data.chats);
        } else {
          setChatList([]);
          setMessage(response.data.message);
        }
      } else {
        await getAllChats();
        setMessage('');
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ai Amour</Text>
      </View>

      <View style={styles.Search}>
        <Image
          style={styles.icon}
          source={require('../../assets/images/search.png')}
        />
        <TextInput
          value={Search}
          placeholder="Search"
          style={styles.SearchTextInput}
          onChangeText={text => {
            setSearch(text);
            handleSearch(text);
          }}
          placeholderTextColor={'#FFFFFFA8'}
        />
      </View>

      {loader ? (
        <View style={styles.loaderTop}>
          <ActivityIndicator size={SIZES.height * 0.05} color="#fff" />
        </View>
      ) : (
        <>
          {message ? (
            <Text
              style={[
                styles.loaderTop,
                {
                  fontSize: FONTS.font16,
                  color: '#FFFFFFA8',
                  textAlign: 'center',
                  fontFamily: fontFamily.PoppinsRegular,
                },
              ]}>
              {message}
            </Text>
          ) : (
            <ScrollView>
              {chatList?.map((item, index) => {
                const formatTime = timestamp => {
                  const date = new Date(timestamp);
                  return date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  });
                };

                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setSearch('');
                      navigation.navigate('Message', {
                        profile: item?.preferences?.profile,
                        name: item?.preferences?.name,
                        gender: item?.preferences?.gender,
                        personality: item?.preferences?.personality,
                        face: face,
                        body: body,
                        chatId: item._id,
                      });
                    }}
                    style={styles.chatContainer}>
                    <Image
                      style={styles.chatAvatar}
                      source={{uri: item?.preferences?.profile}}
                    />
                    <View style={styles.nameContainer}>
                      <Text style={styles.name}>{item?.preferences?.name}</Text>
                      <Text style={styles.time}>
                        {formatTime(item?.createdAt)}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
              <View style={{marginBottom: SIZES.height * 0.13}}></View>
              <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}>
                <LinearGradient
                  colors={[color.primary, color.secondary]}
                  style={{
                    borderRadius: 15,
                    width: SIZES.width * 0.6,
                    alignSelf: 'center',
                  }}>
                  <View style={styles.headerCard}>
                    <Image
                      source={require('../../assets/images/shopIcon.png')}
                      style={styles.headerImage}
                    />

                    <View style={styles.textContent}>
                      <Text style={styles.heading}>
                        You've reached your free character limit!
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.Button,
                          {
                            backgroundColor: color.primary,
                          },
                        ]}
                        onPress={() => {
                          setModalVisible(false);
                          navigation.navigate('Store');
                        }}>
                        <Text
                          style={[
                            styles.ButtonText,
                            {
                              color: color.white,
                            },
                          ]}>
                          Upgrade Limit
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
              </Modal>
            </ScrollView>
          )}

          <TouchableOpacity
            style={[
              Platform.OS === 'ios' ? styles.plusIconIOS : styles.plusIcon,
              styles.plusBtn,
            ]}
            onPress={handleAddChat}>
            <Image
              source={require('../../assets/images/plusIcon.png')}
              style={styles.plusIcon}
            />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black,
  },
  header: {
    padding: FONTS.font12,
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
    right: SIZES.width * 0.05,
    top: 0,
  },
  plusIcon: {
    height: SIZES.height * 0.05,
    width: SIZES.height * 0.05,
    position: 'absolute',
    bottom: -20,
    zIndex: 9999,
  },
  plusIconIOS: {
    height: SIZES.height * 0.05,
    width: SIZES.height * 0.05,
    position: 'absolute',
    zIndex: 9999,
    marginTop: SIZES.height * 0.05,
  },
  headerImage: {
    marginTop: SIZES.height * 0.01,
    tintColor: color.white,
    width: SIZES.width * 0.1,
    height: SIZES.height * 0.05,
    alignSelf: 'center',
  },
  heading: {
    color: color.white,
    fontFamily: fontFamily.PoppinsMedium,
    fontSize: FONTS.font18,
    textAlign: 'center',
  },
  Button: {
    top: SIZES.height * 0.01,
    width: FONTS.font30 * 4,
    paddingVertical: FONTS.font10,
    borderWidth: FONTS.font6 / 3,
    borderRadius: FONTS.font8,
    borderColor: color.primary,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.height * 0.03,
  },
  ButtonText: {
    fontFamily: fontFamily.OpenSansSemiBold,
    fontSize: FONTS.font14,
  },
});
