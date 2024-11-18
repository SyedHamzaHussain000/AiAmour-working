import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Container from '../../components/Container';
import {FONTS, SIZES} from '../../theme/Size';
import {fontFamily} from '../../theme/fontFamily';
import Toast from 'react-native-toast-message';

import TrackPlayer, {Event} from 'react-native-track-player';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {
  getGreetings,
  getGreetingsMale,
  updateCallDuration,
  uploadAudio,
} from '../../services/config/API';
import {useSelector} from 'react-redux';
import {selectAuthToken} from '../../store/authToken';
import {color} from '../../theme/color';
import Timer from '../../components/Timer';
import SoundPlayer from 'react-native-sound-player';

export default function Calling({navigation, route}) {
  const {name, gender, chatId, profile, callDuration} = route?.params;
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const [voiceRecorder, setVoiceRecord] = useState('');
  const token = useSelector(selectAuthToken);
  const [shortTermMemory, setShortTermMemory] = useState('');
  const [longTermMemory, setLongTermMemory] = useState('');
  const [showDisabled, setShowDisabled] = useState(false);
  const [showWave, setShowWave] = useState(true);
  const [ringingStatus, setRingingStatus] = useState(true);

  const currentSecondsRef = useRef(callDuration);
  const longPressTimeout = useRef(null);

  const handleEndCall = async () => {
    await TrackPlayer.stop();
    await TrackPlayer.pause();
    const response = await updateCallDuration(token, currentSecondsRef.current);
    await TrackPlayer.stop();
    await TrackPlayer.pause();
    SoundPlayer.playSoundFile('hangup', 'mp3');
    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  useEffect(() => {
    TrackPlayer.setupPlayer().then(() => {
      TrackPlayer.addEventListener(Event.PlaybackState, ({state}) => {
        if (state === TrackPlayer.STATE_ENDED) {
        }
      });
    });
  }, []);

  useEffect(() => {
    if (ringingStatus) {
      handleRingSound();
    } else {
      handleRingStop();
    }
  }, [ringingStatus]);

  const handleRingSound = () => {
    SoundPlayer.playSoundFile('dial', 'mp3');
  };

  const handleRingStop = () => {
    SoundPlayer.stop();
  };
  useEffect(() => {
    askPermission();
  }, []);

  useEffect(() => {
    getGreetingMessage();
  }, []);

  const getGreetingMessage = async () => {
    try {
      let res = await (gender === 'female'
        ? getGreetings(token)
        : getGreetingsMale(token));
      let aiResponseUrl = res.data.aiResponse;

      aiResponseUrl = aiResponseUrl.replace(
        /(https:\/\/voicefy-models-lab\.s3\.amazonaws\.com)\/\//,
        '$1/',
      );

      console.log(aiResponseUrl);
      setVoiceRecord(aiResponseUrl);
      onStartPlay(aiResponseUrl);
      setRingingStatus(false);
    } catch (error) {
      console.log(error);
    }
  };

  const askPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external storage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  };

  const onStartRecord = async () => {
    handleRingStop();
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener(e => {
      console.log('e', e);

      return;
    });
    console.log(result);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    console.log(result, '=========>>>');

    try {
      handleAudio(result);
      console.log('File renamed to:', result);
    } catch (error) {
      console.log('Error renaming file:', error);
    }
  };

  const handleAudio = async path => {
    try {
      let res = await uploadAudio(
        token,
        chatId,
        path,
        shortTermMemory,
        longTermMemory,
      );
      let aiResponse = res?.aiResponse[0];
      handleMemorySave(aiResponse);
      let aiResponseUrl = res?.aiResponse[1];

      aiResponseUrl = aiResponseUrl.replace(
        /(https:\/\/voicefy-models-lab\.s3\.amazonaws\.com)\/\//,
        '$1/',
      );
      setVoiceRecord(aiResponseUrl);
      onStartPlay(aiResponseUrl);
      setShowWave(true);
    } catch (error) {
      console.log(error, '====err');
      setShowDisabled(false);
    }
  };

  const onLongPress = async () => {
    await TrackPlayer.stop();
    longPressTimeout.current = setTimeout(onStartRecord, 500);
  };

  const onRelease = () => {
    clearTimeout(longPressTimeout.current);
    onStopRecord();
  };

  const onStartPlay = async url => {
    console.log(url, '=============<>');

    await TrackPlayer.reset();
    await TrackPlayer.add({
      url: url,
    });
    await TrackPlayer.play();

    TrackPlayer.addEventListener('playback-state', state => {
      if (state.state === 'ended') {
        setShowWave(false);
        setShowDisabled(false);
      }
    });
  };

  const handleMemorySave = response => {
    const memoryType = response[0];
    const message = response[1];

    if (memoryType === 0) {
      setShortTermMemory(prev => [...prev, message]);
    } else if (memoryType === 1) {
      setLongTermMemory(prev => [...prev, message]);
      console.log('Saved to Long Term Memory:', message);
    }
  };

  const handleTick = seconds => {
    currentSecondsRef.current = seconds;
    if (seconds == 0) {
      TrackPlayer.stop();
      handleEndCall();
    } else if (seconds == 60000) {
      showToast();
    }
  };

  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: '1 Minute left',
      text2: 'The call will end in 1 minute',
    });
  };
  return (
    <Container>
      <ImageBackground
        style={styles.ImageContainer}
        source={require('../../assets/images/background.png')}>
        {!ringingStatus ? (
          <>
            <View style={styles.profileContainer}>
              <Image source={{uri: profile}} style={styles.userAvatar} />
              <Text style={styles.userName}>{name}</Text>
            </View>
            <Timer duration={callDuration} onTick={handleTick} />
            <View style={styles.soundwaveContainer}>
              {showWave ? (
                <Image
                  source={require('../../assets/images/musicalBeat.gif')}
                  style={styles.musicalBeatIcon}
                />
              ) : (
                <View style={{marginBottom: SIZES.height * 0.05}}></View>
              )}
            </View>
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                disabled={showDisabled ? true : false}
                style={styles.iconButton}
                onLongPress={onLongPress}
                onPressOut={() => {
                  onRelease();
                  setShowDisabled(true);
                }}
                delayLongPress={0}>
                <View
                  style={
                    showDisabled
                      ? styles.gradientButtonDisabled
                      : styles.gradientButton
                  }>
                  <Image
                    source={require('../../assets/images/microphone.png')}
                    style={styles.icon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.profileContainer}>
              <Text style={styles.userName}>{name}</Text>
              <Text style={styles.rigningText}>Ringing...</Text>
              <View
                style={{
                  marginBottom: SIZES.height * 0.325,
                  top: SIZES.height * 0.12,
                }}>
                <Image source={{uri: profile}} style={styles.userAvatar} />
              </View>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <LinearGradient
            colors={['#FF007F', '#FFB07F']}
            style={styles.endCallGradient}>
            <Text style={styles.endCallText}>End Call</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ImageBackground>
      <Toast />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  ImageContainer: {
    flexGrow: 1,
    resizeMode: 'stretch',
  },

  profileContainer: {
    alignItems: 'center',
    marginTop: SIZES.height * 0.05,
  },
  userAvatar: {
    width: SIZES.height * 0.2,
    height: SIZES.height * 0.2,
    borderRadius: SIZES.width * 0.5,
    borderWidth: 2,
    borderColor: '#FF4081',
  },
  userName: {
    fontSize: FONTS.font34,
    color: '#fff',
    marginTop: SIZES.height * 0.02,
    marginBottom: SIZES.height * 0.03,
    fontFamily: fontFamily.PoppinsRegular,
  },
  rigningText: {
    color: color.grey,
    marginTop: SIZES.height * 0.02,
    marginBottom: SIZES.height * 0.03,
    fontFamily: fontFamily.PoppinsRegular,
    bottom: SIZES.height * 0.05,
  },
  timerText: {
    fontSize: FONTS.font36,
    color: '#fff',
    fontFamily: fontFamily.PoppinsRegular,
    textAlign: 'center',
  },
  soundwaveContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  soundwave: {
    width: 150,
    height: 40,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    alignSelf: 'center',
    marginTop: SIZES.height * 0.15,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonDisabled: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF4949',
  },
  gradientButtonDisabled: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.grey,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: '#fff',
    resizeMode: 'contain',
  },

  endCallButton: {
    marginTop: SIZES.height * 0.06,
    alignSelf: 'center',
  },
  endCallGradient: {
    width: 160,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: fontFamily.PoppinsMedium,
  },
  waves: {
    height: SIZES.height * 0.05,
    width: SIZES.height * 0.2,
  },
  musicalBeatIcon: {
    height: SIZES.height * 0.05,
    width: SIZES.height * 0.21,
  },
});
