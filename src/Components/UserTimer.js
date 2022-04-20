/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {startCounter, stopCounter} from 'react-native-accurate-step-counter';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import {useAuthState} from 'react-firebase-hooks/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import BackgroundTimer from 'react-native-background-timer';
import LottieView from 'lottie-react-native';
import StepcounterIosAndroid from 'react-native-stepcounter-ios-android';

import AnimatedMarkers from './Map';

const fullWidth = Dimensions.get('screen').width;

var isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

const UserTimer = ({navigation}) => {

  const [steps, setSteps] = useState(0);

  const [stepsDummy, setStepsDummy] = useState(0);

  const [user] = useAuthState(firebase.auth());

  const [secondsLeft, setSecondsLeft] = useState(1);
  const [timerOn, setTimerOn] = useState(false);

  const [mapData, setMapData] = useState({});

  useEffect(() => {
    hasLocationPermission();
  }, []);

  useEffect(() => {
    if (timerOn) {
      startTimer();
    } else {
      BackgroundTimer.stopBackgroundTimer();
    }
    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [timerOn]);

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
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    }
    return false;
  };

  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setSecondsLeft(secs => {
        if (secs > 0) {
          return secs + 1;
        } else {
          return 0;
        }
      });
    }, 1000);
  };
  const clockify = () => {
    let hours = Math.floor(secondsLeft / 60 / 60);
    let mins = Math.floor((secondsLeft / 60) % 60);
    let seconds = Math.floor(secondsLeft % 60);
    let displayHours = hours < 10 ? `0${hours}` : hours;
    let displayMins = mins < 10 ? `0${mins}` : mins;
    let displaySecs = seconds < 10 ? `0${seconds}` : seconds;
    return {
      displayHours,
      displayMins,
      displaySecs,
    };
  };

  const finishChallenge = async () => {
    setTimerOn(false);
    const userReference = firestore().collection('users').doc(user?.uid);
    const snapShot = await userReference.get();

    let tempWeeklySteps = (await snapShot?.data()?.weeklySteps) || [];

    let totalTodaySteps = [];

    totalTodaySteps.push(steps);

    tempWeeklySteps.map(item => {
      if (item.readableDate === dayjs(new Date()).format('DD/MM/YYYY')) {
        totalTodaySteps.push(item.step);
      }
    });

    tempWeeklySteps?.push({
      step: steps,
      date: new Date(),
      readableDate: dayjs(new Date()).format('DD/MM/YYYY'),
      // mapData: mapData,
      personal: true,
    });

    userReference.update({
      todaySteps: totalTodaySteps.reduce((x, y) => x + y),
      weeklySteps: tempWeeklySteps,
    });

    navigation.navigate('UserScreen');
  };

  useEffect(() => {
    setTimerOn(true);
    if (Platform.OS === 'android') {
      const config = {
        default_threshold: 15.0,
        default_delay: 150000000,
        onStepCountChange: stepCount => {
          setSteps(stepCount);
        },
      };
      startCounter(config);
      return () => {
        stopCounter();
      };
    }
  }, []);

{/*  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      StepcounterIosAndroid.isSupported()
        .then(result => {
          if (result) {
            console.log('Sensor TYPE_STEP_COUNTER is supported on this device');

            const myModuleEvt = new NativeEventEmitter(
              NativeModules.StepcounterIosAndroid,
            );
            myModuleEvt.addListener('StepCounter', data => {
              console.log('STEPS', data.steps, data);
              setStepsDummy(data.steps);
            });

            StepcounterIosAndroid.startStepCounter();
          } else {
            console.log(
              'Sensor TYPE_STEP_COUNTER is not supported on this device',
            );
          }
        })
        .catch(err => console.log(err));

      return () => StepcounterIosAndroid.stopStepCounter();
    }
  }, []);
*/}

  return (
    <SafeAreaView style={{backgroundColor: '#101010', flex: 1, height: 600}}>
      <ScrollView>
        {/* <TouchableOpacity onPress={() => navigation.navigate('UserScreen')}>
          <Text style={{color: 'white', fontFamily: 'Poppins-SemiBold'}}>
            back
          </Text>
        </TouchableOpacity> */}
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 24,
            }}>
            Keep going!
          </Text>
        </View>
        <View
          style={{
            height: 250,
            width: fullWidth,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
          }}>
          <LottieView source={require('../Assets/fire.json')} autoPlay loop />
        </View>
        <View style={styles.screen}>
          <View
            style={{
              backgroundColor: '#161616',
              margin: 10,
              borderRadius: 20,
              width: fullWidth - 50,
              alignItems: 'center',
              padding: 5,
            }}>
            <View style={{marginVertical: 10}}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Poppins-Bold',
                  fontSize: 40,
                }}>
                {clockify().displayMins} : {clockify().displaySecs}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#9D0208',
                  fontFamily: 'Poppins-Bold',
                  fontSize: 16,
                }}>
                {' '}
                Active Time
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#161616',
              margin: 10,
              borderRadius: 20,
              width: fullWidth - 50,
              alignItems: 'center',
              padding: 5,
            }}>
            <View>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Poppins-Bold',
                  fontSize: 30,
                }}>
                {Platform.OS === 'ios' ? stepsDummy : steps}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#9D0208',
                  fontFamily: 'Poppins-Bold',
                  fontSize: 16,
                }}>
                {' '}
                Steps
              </Text>
            </View>
          </View>
        </View>
        <View style={{width: fullWidth, height: 525}}>
          <AnimatedMarkers
            secondsLeft={secondsLeft}
            setMapData={setMapData}
            timerOn={timerOn}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'white',
              width: 250,
              borderRadius: 20,
              padding: 10,
              marginBottom: 20,
            }}
            onPress={() => finishChallenge()}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 20,
                color: 'white',
              }}>
              {' '}
              Stop
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    // height: '100%',
    alignItems: 'center',
  },
  step: {
    fontSize: 40,
    marginVertical: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default UserTimer;
