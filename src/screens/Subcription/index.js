import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {color} from '../../theme/color';
import {FONTS, SIZES} from '../../theme/Size';
import {fontFamily} from '../../theme/fontFamily';
// import TextGradient from '@furkankaya/react-native-linear-text-gradient';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Paginator from '../../components/Pagination';
import {
  getUserDetails,
  updateSubscriptionPlan,
} from '../../services/config/API';
import {selectAuthToken} from '../../store/authToken';
import {useSelector} from 'react-redux';

const Subcription = () => {
  const navigation = useNavigation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const scrollX = useRef(new Animated.Value(0))?.current;
  const slideRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const token = useSelector(selectAuthToken);

  const viewableItemsChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0]?.index);
  })?.current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50})?.current;

  const subscriptionArray = [
    {
      id: 1,
      title: 'Basic',
      image: require('../../assets/images/sub1.png'),
      price: '$0',
      prompts: 3,
      VoiceCall: 0,
      VideoCall: 0,
    },
    {
      id: 2,
      title: 'Standard',
      image: require('../../assets/images/sub2.png'),
      price: '$20',
      prompts: 3,
      VoiceCall: 3,
      VideoCall: 3,
    },
    {
      id: 3,
      title: 'Premium',
      image: require('../../assets/images/sub3.png'),
      price: '$30',
      prompts: 3,
      VoiceCall: 5,
      VideoCall: 5,
    },
  ];

  const handleChoosePlan = async plan => {
    setSelectedPlan(plan.title);
    try {
      setLoader(true);
      let response = await updateSubscriptionPlan(token, plan.title);
      setLoader(false);
    
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    setLoader(true);

    try {
      let reponse = await getUserDetails(token);
      setSelectedPlan(reponse.data.user.rank);
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        style={{width: SIZES.width, padding: FONTS.font12}}>
        <Image
          style={{width: FONTS.font12, height: FONTS.font12}}
          source={require('../../assets/images/cross.png')}
        />
      </Pressable>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {/* <TextGradient
          style={{
            fontFamily: fontFamily.OpenSansSemiBold,
            fontSize: FONTS.font32,
            marginBottom: FONTS.font20,
          }}
          colors={[color.primary, color.secondary]}
          text="Manage Your Subscription "
        /> */}
        <FlatList
          style={{flex: 1}}
          data={subscriptionArray}
          renderItem={({item}) => (
            <View
              style={{
                width: SIZES.width * 0.9,
                marginHorizontal: SIZES.width * 0.05,
                borderRadius: FONTS.font20,
                backgroundColor: color.primary,
                height: SIZES.width,
              }}>
              <Image
                style={{
                  width: '100%',
                  height: FONTS.font30 * 10,
                  borderRadius: FONTS.font12,
                }}
                source={item.image}
              />
              <LinearGradient
                colors={[color.primary, color.secondary]}
                style={{
                  borderBottomRightRadius: FONTS.font12,
                  borderBottomLeftRadius: FONTS.font12,
                  paddingVertical: FONTS.font10,
                }}>
                <View style={styles.headingContainer}>
                  <Text style={styles.heading}>{item.title}</Text>
                  <Text style={styles.heading}>{item.price}</Text>
                </View>
                <View style={styles.headingContainer}>
                  <Text style={styles.miniHeading}>Number of prompts</Text>
                  <Text style={styles.miniHeading}>{item.prompts}</Text>
                </View>

                <View style={styles.headingContainer}>
                  <Text style={styles.miniHeading}>Voice call</Text>
                  <Text style={styles.miniHeading}>{item.VoiceCall}</Text>
                </View>
                <View style={styles.headingContainer}>
                  <Text style={styles.miniHeading}>Video call</Text>
                  <Text style={styles.miniHeading}>{item.VideoCall}</Text>
                </View>

                {loader ? (
                  <View style={styles.Button}>
                    <ActivityIndicator size={22} color={color.primary} />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.Button,
                      {
                        backgroundColor:
                          selectedPlan === item.title
                            ? color.primary 
                            : color.secondary,
                      },
                    ]}
                    onPress={() => handleChoosePlan(item)}>
                    <Text
                      style={[
                        styles.ButtonText,
                        {
                          color:
                            selectedPlan === item.title
                              ? color.white
                              : color.primary,
                        },
                      ]}>
                      {selectedPlan === item.title
                        ? 'Subscribed'
                        : 'Choose Plan'}
                    </Text>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={item => item?.id.toString()}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slideRef}
        />

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Paginator data={subscriptionArray} scrollX={scrollX} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Subcription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black,
  },
  heading: {
    fontSize: FONTS.font32,
    fontFamily: fontFamily.poppinSemiBold,
    color: color.secondary,
  },
  miniHeading: {
    fontSize: FONTS.font16,
    fontFamily: fontFamily.PoppinsMedium,
    color: color.white,
  },
  headingContainer: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  Button: {
    width: FONTS.font30 * 4,
    paddingVertical: FONTS.font10,
    borderWidth: FONTS.font6 / 3,
    borderRadius: FONTS.font8,
    borderColor: color.primary,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    fontFamily: fontFamily.OpenSansSemiBold,
    fontSize: FONTS.font14,
  },
});
