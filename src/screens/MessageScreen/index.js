import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {FONTS, SIZES} from '../../theme/Size';
import {color} from '../../theme/color';
import Container from '../../components/Container';
import {fontFamily} from '../../theme/fontFamily';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  getConversation,
  getUserDetails,
  sendFreeChat,
  sendFreeChatMale,
  sendPremiumChat,
  sendPremiumChatMale,
  sendStandardChat,
  sendStandardChatMale,
} from '../../services/config/API';
import {selectAuthToken} from '../../store/authToken';
import {useSelector} from 'react-redux';
import Spinner from 'react-native-spinkit';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import ImageView from 'react-native-image-viewing';

const {width} = SIZES;

const MessageScreen = ({route}) => {
  const navigation = useNavigation();
  const [newMessage, setNewMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const [chat, setChat] = useState([]);
  const [chatLoader, setChatLoader] = useState(false);
  const scrollViewRef = useRef();
  const [imgError, setImgError] = useState('');
  const [rank, setRank] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [imgPreview, setImgPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [callDuration, setCallDuration] = useState();
  const [purchasedPictures, setPurchasedPictures] = useState();
  const [showImage, setShowImage] = useState(false);

  const {name, gender, personality, face, body, chatId, profile} =
    route?.params;
  const token = useSelector(selectAuthToken);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          await getChat();
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
    setLoader(true);
    try {
      let reponse = await getUserDetails(token);
      console.log(reponse.data, '=====>>>');
      setPurchasedPictures(reponse?.data?.user?.subscription?.pictures);
      setCallDuration(reponse?.data?.user?.subscription?.callDuration);
      setRank(reponse?.data?.user?.rank);
      console.log(reponse?.data?.user?.rank);

      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const scrollToBottom = () => {
    scrollViewRef?.current?.scrollToEnd({animated: true});
  };
  const getChat = async () => {
    setLoader(true);
    try {
      let response = await getConversation(token, chatId);
      setChat(response?.data?.chat);
      setLoader(false);
      scrollViewRef.current?.scrollToEnd({animated: true});
    } catch (error) {
      setLoader(false);
    }
  };

  const handleSend = async () => {
    if (newMessage) {
      setChatLoader(true);

      if (!newMessage.trim()) {
        return;
      }

      const newMessageObject = {
        userInput: newMessage,
        aiResponse: null,
        image: null,
        isLongTerm: false,
        _id: new Date().toISOString(),
        timestamp: new Date().toISOString(),
      };

      setChat(prevChat => [...(prevChat || []), newMessageObject]);

      try {
        setChatLoader(true);
        setNewMessage('');

        let response;
        const genderLowerCase = gender.toLowerCase();
        const rankLowerCase = rank.toLowerCase();
        if (genderLowerCase === 'female' && rankLowerCase === 'standard') {
          response = await sendStandardChat(token, newMessage, chatId);
        } else if (
          genderLowerCase === 'female' &&
          rankLowerCase === 'premium'
        ) {
          response = await sendPremiumChat(token, newMessage, chatId);
        } else if (genderLowerCase === 'female' && rankLowerCase === 'basic') {
          response = await sendFreeChat(token, newMessage, chatId);
        } else if (genderLowerCase === 'male' && rankLowerCase === 'basic') {
          response = await sendFreeChatMale(token, newMessage, chatId);
        } else if (genderLowerCase === 'male' && rankLowerCase === 'standard') {
          response = await sendStandardChatMale(token, newMessage, chatId);
        } else if (genderLowerCase === 'male' && rankLowerCase === 'premium') {
          response = await sendPremiumChatMale(token, newMessage, chatId);
        }

        if (response && response.data) {
          if (response?.data?.image) {
            setTimeout(() => {
              setChat(prevChat =>
                prevChat.map(msg =>
                  msg._id === newMessageObject._id
                    ? {
                        ...msg,
                        aiResponse: response.data.message,
                        image: response.data.image || null,
                      }
                    : msg,
                ),
              );
              setChatLoader(false);
            }, 5000);
          } else {
            setChat(prevChat =>
              prevChat.map(msg =>
                msg._id === newMessageObject._id
                  ? {
                      ...msg,
                      aiResponse: response.data.message,
                      image: response.data.image || null,
                    }
                  : msg,
              ),
            );
            setChatLoader(false);
          }
        } else {
          console.error('Unexpected API response:', response);
        }
      } catch (error) {
        console.error('Error sending message:', error);

        setChatLoader(false);
      }
    }
  };

  const handleCall = () => {
    const rankLowerCase = rank.toLowerCase();
    if (!callDuration > 0) {
      setModalVisible(true);
    } else if (callDuration == 0) {
      setModalVisible(true);
    } else {
      navigation.navigate('Calling', {
        name,
        gender: gender.toLowerCase(),
        chatId,
        profile,
        callDuration,
      });
    }
  };

  const handleImagePress = async item => {
    setSelectedImage(item.image);
    setImgPreview(true);
    // console.log(item.viewImage);
    // if (item?.viewImage === true) {
    //   setSelectedImage(item.image);
    //   setImgPreview(true);
    // } else {
    //   try {
    //     let response = await updateViewPictureStatus(token, chatId, item.image);
    //     console.log(response.status, '=====>>>response');
    //     if (response.status == 200) {
    //       setShowImage(true);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  };

  return (

    <Container>
      <ImageBackground
        style={styles.ImageContainer}
        source={require('../../assets/images/background.png')}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/images/right.png')}
                style={{
                  transform: [{rotate: '180deg'}],
                  right: SIZES.width * 0.01,
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: width * 0.9,
                justifyContent: 'space-between',
              }}>
              <View style={styles?.user}>
                <Image source={{uri: profile}} style={styles?.userAvatar} />
                <Text style={styles.userName}>{name}</Text>
              </View>
              <TouchableOpacity onPress={handleCall}>
                <Image
                  source={require('../../assets/images/callIcon.png')}
                  style={styles.callIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {loader ? (
            <View style={styles.loaderTop}>
              <ActivityIndicator size={SIZES.height * 0.05} color="#fff" />
            </View>
          ) : (
            <ScrollView
              ref={scrollViewRef}
              style={{
                paddingHorizontal: FONTS.font16,
                flex: 1,
                marginTop: FONTS.font12,
              }}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({animated: true})
              }
              showsVerticalScrollIndicator={false}>
              {chat?.map(item => {
                return (
                  <Fragment key={item._id}>
                    {!item.call && (
                      <View key={item._id} style={styles.ChatMessageContainer}>
                        {item.userInput && (
                          <View style={styles.messageContainer}>
                            <Text style={styles.messageText}>
                              {item.userInput}
                            </Text>
                          </View>
                        )}
                        {item.aiResponse &&
                          !['~Sends Image~.', '~Sends Image~'].includes(
                            item.aiResponse,
                          ) && (
                            <View style={styles.messageStartContainer}>
                              <Text style={styles.messageText}>
                                {item.aiResponse}
                              </Text>
                            </View>
                          )}
                        {item.image && (
                          <View style={styles.imageContainer}>
                            <TouchableOpacity
                              onPress={() => {
                                handleImagePress(item);
                              }}>
                              <Image
                                key={
                                  imgError
                                    ? `${item.image}?error=${imgError}`
                                    : item.image
                                }
                                source={{
                                  uri: item.image,
                                }}
                                style={styles.aiImage}
                                // blurRadius={item?.viewImage === true || showImage ? 0 : 25}
                                resizeMode="cover"
                                onError={e => {
                                  setImgError(e.nativeEvent.error);
                                }}
                              />
                            </TouchableOpacity>

                            <ImageView
                              images={[{uri: selectedImage}]}
                              imageIndex={0}
                              visible={imgPreview}
                              onRequestClose={() => setImgPreview(false)}
                            />
                          </View>
                        )}
                      </View>
                    )}
                  </Fragment>
                );
              })}
            </ScrollView>
          )}
          {chatLoader && (
            <View style={styles.chatLoader}>
              <Spinner
                isVisible={true}
                size={50}
                type="ThreeBounce"
                color={color.grey}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              textAlignVertical="center"
              style={styles.input}
              placeholder="Write Message"
              value={newMessage}
              multiline={true}
              placeholderTextColor={'#ffff'}
              onChangeText={text => setNewMessage(text)}
            />
            <Pressable style={styles?.sendBtn} onPress={handleSend}>
              <Image
                source={require('../../assets/images/send.png')}
                style={{width: FONTS.font18, height: FONTS.font18}}
              />
            </Pressable>
          </View>
        </View>

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
                source={require('../../assets/images/callRinging.png')}
                style={styles.headerImage}
              />

              <View style={styles.textContent}>
                <Text style={styles.heading}>
                  Upgrade your plan to make calls!
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
                    Upgrade now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Modal>
      </ImageBackground>
    </Container>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ImageContainer: {
    flexGrow: 1,
    resizeMode: 'stretch',
  },
  header: {
    height: FONTS.font38 * 2,
    backgroundColor: '#171717',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: FONTS.font12,
    elevation: FONTS.font10,
    shadowColor: '#000',
    paddingTop: FONTS.font12,
  },

  headersBtnText: {
    color: '#fff',
    fontSize: FONTS.font16,
    fontWeight: 'bold',
  },
  messageStartContainer: {
    maxWidth: '80%',
    marginVertical: FONTS.font10,
    backgroundColor: color.lightGrey,
    padding: FONTS.font10,
    alignSelf: 'flex-start',
    borderRadius: FONTS.font20,
    marginBottom: FONTS.font10,
  },

  messageContainer: {
    maxWidth: '80%',
    marginVertical: FONTS.font10,
    backgroundColor: color.darkGrey,
    padding: FONTS.font10,
    borderRadius: FONTS.font20,
    alignSelf: 'flex-end',
    marginBottom: FONTS.font10,
  },

  imageContainer: {
    maxWidth: '80%',
    marginVertical: FONTS.font10,
    padding: FONTS.font10,
    borderRadius: FONTS.font20,
    alignSelf: 'flex-start',
    marginBottom: FONTS.font10,
  },
  chatLoader: {
    alignSelf: 'flex-start',
    left: SIZES.width * 0.06,
    marginBottom: SIZES.height * 0.02,
  },

  messageText: {
    fontSize: FONTS.font14,
    color: '#fff',
    fontFamily: fontFamily.PoppinsRegular,
  },
  messageCreatedOnText: {
    fontSize: FONTS.font10,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'KiaRegular',
    textAlign: 'right',
    marginTop: FONTS.font10,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: FONTS.font6 / 2,
    backgroundColor: '#000000b0',
    alignSelf: 'center',
    elevation: 0,
    width: SIZES.width * 0.9,
    borderRadius: FONTS.font10,
    marginBottom: FONTS.font14,
  },
  input: {
    flex: 1,
    maxHeight: FONTS.font24 * 2,
    marginHorizontal: FONTS.font10,
    paddingHorizontal: FONTS.font12,
    color: color.white,
    fontFamily: fontFamily.PoppinsRegular,
    fontSize: FONTS.font16,
  },
  sendBtn: {
    padding: FONTS.font6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: FONTS.font10,
    backgroundColor: color.secondary,
    width: FONTS.font24 * 2,
    height: FONTS.font20 * 2,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: FONTS.font10,
  },
  userAvatar: {
    width: FONTS.font28 * 2,
    height: FONTS.font28 * 2,
    borderRadius: FONTS.font30 * 3,
    marginHorizontal: FONTS.font10 / 2,
  },
  callIcon: {
    width: FONTS.font12 * 2,
    height: FONTS.font12 * 2,
  },
  userName: {
    color: color.white,
    fontSize: FONTS.font24,
    fontFamily: fontFamily.PoppinsRegular,
    textAlign: 'left',
  },
  ChatMessageContainer: {
    width: '100%',
  },

  image: {
    width: FONTS.font34,
    height: FONTS.font34,
    borderRadius: FONTS.font34,
    marginRight: FONTS.font12,
  },
  loaderTop: {
    marginTop: SIZES.height * 0.35,
    marginBottom: SIZES.height * 0.38,
  },
  aiImage: {
    width: SIZES.width * 0.6,
    height: SIZES.height * 0.5,
    borderRadius: SIZES.width * 0.02,
  },

  headerImage: {
    tintColor: color.white,
    width: SIZES.width * 0.2,
    height: SIZES.height * 0.1,
    alignSelf: 'center',
  },
  heading: {
    color: color.white,
    fontFamily: fontFamily.PoppinsMedium,
    fontSize: FONTS.font18,
    textAlign: 'center',
  },
  ButtonText: {
    fontFamily: fontFamily.OpenSansSemiBold,
    fontSize: FONTS.font14,
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
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
