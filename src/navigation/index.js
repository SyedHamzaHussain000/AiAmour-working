import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WalkThrough from '../screens/WalkThrough';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Preference from '../screens/Preference';
import Chat from '../screens/Chat';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Profile from '../screens/Profile';
import {Image, Platform, Text, View} from 'react-native';
import {FONTS} from '../theme/Size';
import {color} from '../theme/color';
import Subcription from '../screens/Subcription';
import MessageScreen from '../screens/MessageScreen';
import ForgetPassword from '../screens/FogetPassword';
import {useSelector} from 'react-redux';
import {selectAuthToken} from '../store/authToken';
import Store from '../screens/Store';
// import Calling from '../screens/Calling';
import SelectPreference from '../screens/SelectPreference';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const BottomTabs = ({route}) => {
  const {bots} = route.params || {};
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: FONTS.font30 * 2,
          position: 'absolute',
          alignSelf: 'center',
          bottom: FONTS.font24,
          borderColor: color.primary,
          borderRadius: FONTS.font32,
          backgroundColor: color.primary,
          left: FONTS.font24,
          right: FONTS.font24,
          elevation: 0,
          zIndex:0
        },


        tabBarIcon: ({focused}) => {
          if (route.name === 'Chat') {
            return (
              <Image
                source={
                  focused
                    ? require('../assets/images/chatActive.png')
                    : require('../assets/images/chatInActive.png')
                }
                resizeMode="contain"
                style={{
                  marginTop: Platform.OS === 'android' ? 0 : FONTS.font20,
                  width: FONTS.font34,
                  height: FONTS.font34,
                }}
              />
            );
          } else if (route.name === 'Profile') {
            return (
              <Image
                source={
                  focused
                    ? require('../assets/images/profileActive.png')
                    : require('../assets/images/profileInActive.png')
                }
                resizeMode="contain"
                style={{
                  marginTop: Platform.OS === 'android' ? 0 : FONTS.font20,

                  width: FONTS.font34,
                  height: FONTS.font34,
                }}
              />
            );
          }
        },
      })}>
      <Tab.Screen name="Chat" component={Chat} initialParams={{bots}} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default function Navigation() {
  const token = useSelector(selectAuthToken);


  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="WalkThrough"
      >
        {!token ? (
          <>

            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="WalkThrough" component={WalkThrough} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="Preference" component={Preference} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={BottomTabs} />
            <Stack.Screen name="UpdatePreference" component={Preference} />
            <Stack.Screen name="Preference" component={Preference} />

            <Stack.Screen name="Subcription" component={Subcription} />
            <Stack.Screen name="Message" component={MessageScreen} />
            <Stack.Screen name="Store" component={Store} />
            <Stack.Screen name="Calling" component={Calling} />
            <Stack.Screen name="SelectPreference" component={SelectPreference} />
            
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
