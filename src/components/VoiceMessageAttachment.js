import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';


export const VoiceMessageAttachment = ({
  audio_length,
  asset_url,
  type,
  onCrossPress,
}) => {
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [duration, setDuration] = useState(audio_length);
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const onPausePlay = async () => {
    setPaused(true);
    await audioRecorderPlayer.pausePlayer();
  };

  const onStopPlay = async () => {
    setPaused(false);
    setCurrentPositionSec(0);
    setPlayTime(0);
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  const onStartPlay = async () => {
    setPaused(false);
    setLoadingAudio(true);
    audioRecorderPlayer
      .startPlayer(asset_url)
      .then(() => {
        setLoadingAudio(false);
        audioRecorderPlayer.addPlayBackListener(e => {
          if (e.currentPosition < 0) {
            return;
          }

          setCurrentPositionSec(e.currentPosition);
          setCurrentDurationSec(e.duration);
          setPlayTime(
            audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
          );
          setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));

          if (e.currentPosition === e.duration) {
            onStopPlay();
          }
          return;
        });
      })
      .catch(error => {
        setLoadingAudio(false);
        onStopPlay()
      });
  };


  if (type !== 'voice-message') {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onCrossPress} style={styles.crossIcon} >
      {/* <Entypo
        name="circle-with-cross"
        color={'black'}
        size={20}
      /> */}
      </TouchableOpacity>
      
      <View style={styles.audioPlayerContainer}>
        {loadingAudio ? (
          <View style={styles.loadingIndicatorContainer}>
            <ActivityIndicator size="large" color={'white'} />
          </View>
        ) : currentPositionSec > 0 && !paused ? (
          <TouchableOpacity style={styles.playpause} onPress={onPausePlay}>
            <Text style={{color:"white",fontSize:22}}>Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.playpause} onPress={onStartPlay}>
            <Text style={{color:"white",fontSize:22}}>Play</Text>

          </TouchableOpacity>
        )}

        <View style={styles.progressIndicatorContainer}>
          <View
            style={[
              styles.progressLine,
              {
                width: `${(currentPositionSec / currentDurationSec) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.progressDetailsContainer}>
        <Text style={styles.progressDetailsText}>{playTime}</Text>
        <Text style={styles.progressDetailsText}>{duration}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingIndicatorContainer: {
    padding: 7,
  },
  container: {
    paddingTop: 20,
    padding: 10,
    width: "88%",
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
    marginTop: 15,
  },
  audioPlayerContainer: {flexDirection: 'row', alignItems: 'center'},
  progressDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  progressDetailsText: {
    paddingHorizontal: 5,
    color: 'white',
    fontSize: 20,
  },
  progressIndicatorContainer: {
    flex: 1,
    backgroundColor: '#e2e2e2',
  },
  progressLine: {
    borderWidth: 1,
    borderColor: 'black',
  },
  playpause: {
    backgroundColor: 'black',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 500,
    marginRight: 10,
  },
  crossIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 30,
    backgroundColor: 'white',
    padding: 1,
    borderRadius: 30,
  },
});
