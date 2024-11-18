import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {color} from '../../theme/color';
import Container from '../../components/Container';
import {FONTS, SIZES} from '../../theme/Size';
// import TextGradient from '@furkankaya/react-native-linear-text-gradient';
import {fontFamily} from '../../theme/fontFamily';
import {useNavigation} from '@react-navigation/native';

const WalkThrough = () => {
  const navigation = useNavigation();
  const flatListRef = useRef();

  const flatListArray = [
    require('../../assets/images/image1.png'),
    require('../../assets/images/image2.png'),
    require('../../assets/images/image3.png'),
    require('../../assets/images/image4.png'),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollDelay = 2000; 

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: currentIndex,
          animated:
            (currentIndex + 1) % flatListArray.length === 1 ? false : true,
        });
        setCurrentIndex(prevIndex => (prevIndex + 1) % flatListArray.length);
      }
    }, scrollDelay);

    return () => clearInterval(scrollInterval);
  }, [currentIndex]);

  return (
    <Container>
      <FlatList
      showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        data={flatListArray}
        keyExtractor={(item, i) => i.toString()}
        horizontal
        renderItem={({item}) => (
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            source={item}
            style={styles.imageStyle}
          />
        )}
      />

      <View style={styles.secondContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={{width: FONTS.font38 * 4, height: FONTS.font38 * 4}}
          resizeMode="contain"
        />

        {/* <TextGradient
          style={{fontFamily: fontFamily.sacramento, fontSize: FONTS.font38}}
          locations={[0, 1]}
          colors={[color.primary, color.secondary]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          text="Ai Amour"
        /> */}
      </View>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </Container>
  );
};

export default WalkThrough;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  imageStyle: {
    width: SIZES.width,
    height: SIZES.height,
  },
  secondContainer: {
    position: 'absolute',
    backgroundColor: '#1a1a1a73',
    width: SIZES.width,
    height: SIZES.height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: FONTS.font38,
  },
  button: {
    width: SIZES.width * 0.8,
    alignSelf: 'center',
    borderRadius: FONTS.font22,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: FONTS.font14,
    position: 'absolute',
    bottom: FONTS.font24,
  },
  buttonText: {
    fontSize: FONTS.font16,
    color: color.white,
  },
});
