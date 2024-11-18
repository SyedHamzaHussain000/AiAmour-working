// Timer.js
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Button} from 'react-native';
import {color} from '../theme/color';
import {fontFamily} from '../theme/fontFamily';
import {FONTS} from '../theme/Size';

const Timer = ({duration, onTick}) => {
  const [seconds, setSeconds] = useState(Math.floor(duration / 1000));
  const intervalRef = useRef(null);

  // console.log(duration);
  useEffect(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 0) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (onTick) {
      onTick(seconds * 1000);
    }
  }, [seconds, onTick]);

  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View>
      <Text
        style={{
          fontSize: FONTS.font36,
          color: '#fff',
          fontFamily: fontFamily.PoppinsRegular,
          textAlign: 'center',
        }}>
        {formatTime(seconds)}
      </Text>
    </View>
  );
};

export default Timer;
