/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  AppState,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
} from 'react-native';
import analytics from '@react-native-firebase/analytics';

import RNBootSplash from 'react-native-bootsplash';

import Login from './Components/Login';
import FindTeam from './Components/FindTeam';
import Activity from './Components/Activity';
import TodayDate from './Components/TodayDate';
import LeaderBoard from './Components/LeaderBoard';
import TeamActivity from './Components/TeamActivity';
import Challenge from './Components/Challenge';
import Timer from './Components/Timer';
import Register from './Components/Register';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProfileImage from './Components/ProfileImage';
import Profile from './Components/Profile';

import PastChallenges from './Components/PastChallenges';
import UserTimer from './Components/UserTimer';
import Forage from 'react-native-forage';
import IntroSlider from './Components/IntroSlider';
Forage.start('9c0b1776-bac2-4b28-9a93-a33553891fe9', AppState);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#9D0208',
        tabBarLabelStyle: {
          fontFamily: 'Poppins-SemiBold',
        },
        tabBarStyle: {
          backgroundColor: '#161616',
          borderTopColor: '#161616',
          padding: 5,
          // opacity: 0
        },
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Activity',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <Image
                  source={require('./Assets/InactiveRun.png')}
                  style={{resizeMode: 'contain', width: 30, height: 30}}
                />
              );
            } else {
              return (
                <Image
                  source={require('./Assets/ActiveRun.png')}
                  style={{resizeMode: 'contain', width: 30, height: 30}}
                />
              );
            }
          },
        }}
        name="User"
        component={ActivityStack}
      />
      <Tab.Screen
        name="Home"
        component={LeaderBoard}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <Image
                  source={require('./Assets/InactiveMap.png')}
                  style={{resizeMode: 'contain', width: 30, height: 30}}
                />
              );
            } else {
              return (
                <Image
                  source={require('./Assets/ActiveMap.png')}
                  style={{resizeMode: 'contain', width: 30, height: 30}}
                />
              );
            }
          },
        }}
      />
      <Tab.Screen
        name="Group"
        component={TeamActivity}
        options={{
          tabBarLabel: 'Team',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <Image
                  source={require('./Assets/InactiveTeam.png')}
                  style={{resizeMode: 'contain', width: 30, height: 30}}
                />
              );
            } else {
              return (
                <Image
                  source={require('./Assets/ActiveTeam.png')}
                  style={{resizeMode: 'contain', width: 30, height: 30}}
                />
              );
            }
          },
        }}
      />
      <Tab.Screen
        name="Challenge"
        component={ChallengeStack}
        options={{
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <Image
                  source={require('./Assets/ActiveChallenge.png')}
                  style={{resizeMode: 'contain', width: 30, height: 30}}
                />
              );
            } else {
              return (
                <Image
                  source={require('./Assets/InactiveChallenge.png')}
                  style={{resizeMode: 'contain', width: 30, height: 30}}
                />
              );
            }
          },
        }}
      />
    </Tab.Navigator>
  );
};

const ActivityStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserScreen"
        component={Activity}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserTimer"
        component={UserTimer}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const ChallengeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChallengeScreen"
        component={Challenge}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PastChallenges"
        component={PastChallenges}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Timer"
        component={Timer}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  const routeNameRef = useRef();
  const navigationRef = useRef();

  const [currentScreen, setCurrentUser] = useState('Your Activity');

  const hasLocationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version <= 28) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  useEffect(() => {
    setTimeout(() => {
      RNBootSplash.hide({fade: true});
    }, 2000);

    hasLocationPermission();

    // firestore()
    //   .collection('users')
    //   .doc(user?.uid)
    //   .get()
    //   .then(querySnapshot => {
    //     if (querySnapshot?.data()?.team === '') {
    //       // setIsTeamPresent(true);
    //     }
    //   });
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
          if (currentRouteName === 'UserScreen') {
            setCurrentUser('Your Activity');
          }
          if (currentRouteName === 'Home') {
            setCurrentUser('Survival Map');
          }
          if (currentRouteName === 'Group') {
            setCurrentUser('Team Activity');
          }
          if (currentRouteName === 'ChallengeScreen') {
            setCurrentUser('Challenge');
          }
          if (currentRouteName === 'UserTimer') {
            setCurrentUser('Activity Timer');
          }
          if (currentRouteName === 'ChallengeScreen') {
            setCurrentUser('Challenge Timer');
          }
        }
        // console.log(currentRouteName);

        Forage.trackScreen(currentRouteName);

        routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator>
        <Stack.Screen
          name="IntroSlider"
          component={IntroSlider}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FindTeam"
          component={FindTeam}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Activity"
          component={BottomTabs}
          options={({navigation}) => ({
            headerStyle: {
              backgroundColor: '#161616',
            },
            title: '',
            headerLeft: () => <TodayDate currentScreen={currentScreen} />,
            headerRight: () => <ProfileImage navigation={navigation} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

// teams --> {teamId:'1', members:[{id:1,email:'email'}]},{teamId:'2',members:[{}]}

// 3 Intro screens

// Activity Screen - > Show a button for the user to start recording on his own

// Google Fit Data to the user
