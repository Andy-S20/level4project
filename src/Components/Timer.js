/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useRef} from 'react';
import {startCounter, stopCounter} from 'react-native-accurate-step-counter';
import StepcounterIosAndroid from 'react-native-stepcounter-ios-android';

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
  Image,
  ScrollView,
} from 'react-native';
import {useAuthState} from 'react-firebase-hooks/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import BackgroundTimer from 'react-native-background-timer';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import AnimatedMarkers from './Map';

const fullWidth = Dimensions.get('screen').width;

var isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

const Timer = ({navigation, route}) => {
  const {currentUser, isSentByMe} = route.params;
  const [steps, setSteps] = useState(0);
  // const [steps, setSteps] = useState(
  //   parseInt((Math.random() * 1000).toFixed(0)),
  // );

  const [stepsDummy, setStepsDummy] = useState(0);

  const [secondsLeft, setSecondsLeft] = useState(600);
  const [timerOn, setTimerOn] = useState(false);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const [mapData, setMapData] = useState({});

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

  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setSecondsLeft(secs => {
        if (secs > 0) {
          return secs - 1;
        } else {
          return 0;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    if (secondsLeft === 0) {
      BackgroundTimer.stopBackgroundTimer();
      setIsRequestModalOpen(true);

      setTimeout(() => {
        finishChallenge();
        navigation.navigate('ChallengeScreen', {isTimerFinished: true});
      }, 2000);
    }
  }, [secondsLeft]);

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
    const userReference = firestore().collection('users').doc(currentUser?.uid);
    const snapShot = await userReference.get();

    const challengedUserReference = firestore()
      .collection('users')
      .doc(route.params.requestData?.uid);

    const challengedSnapShot = await challengedUserReference.get();

    let tempChallenges = snapShot.data().challenges;

    let tempChallengedChallenges = challengedSnapShot?.data()?.challenges;

    let updatedChallengesCurrentUser = [];

    let updatedChallengesChallengedUser = [];

    if (isSentByMe) {
      let filteredChallengesofCurrentUsers = tempChallenges.map(item => {
        if (item.uniqueId === route.params.requestData?.uniqueId) {
          return {...item, challengedSteps: steps};
        } else return item;
      });
      let filteredChallengesofChallengedUsers = tempChallengedChallenges.map(
        item => {
          if (item.uniqueId === route.params.requestData?.uniqueId) {
            return {...item, challengedSteps: steps};
          } else return item;
        },
      );
      updatedChallengesCurrentUser.push(filteredChallengesofCurrentUsers);
      updatedChallengesChallengedUser.push(filteredChallengesofChallengedUsers);
    }

    if (!isSentByMe) {
      let filteredChallengesofCurrentUsers = tempChallenges.map(item => {
        if (item.uniqueId === route.params.requestData?.uniqueId) {
          return {...item, challengerSteps: steps};
        } else return item;
      });
      let filteredChallengesofChallengedUsers = tempChallengedChallenges.map(
        item => {
          if (item.uniqueId === route.params.requestData?.uniqueId) {
            return {...item, challengerSteps: steps};
          } else return item;
        },
      );
      updatedChallengesCurrentUser.push(filteredChallengesofCurrentUsers);
      updatedChallengesChallengedUser.push(filteredChallengesofChallengedUsers);
    }

    let tempRequests = snapShot
      ?.data()
      ?.requests.filter(
        item => item.uniqueId !== route.params.requestData?.uniqueId,
      );

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
      personal: false,
    });

    userReference.update({
      requests: tempRequests,
      todaySteps: totalTodaySteps.reduce((x, y) => x + y),
      weeklySteps: tempWeeklySteps,
      challenges: updatedChallengesCurrentUser[0],
    });

    challengedUserReference.update({
      challenges: updatedChallengesChallengedUser[0],
    });
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

  React.useEffect(() => {
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

  const stopChallenge = () => {
    BackgroundTimer.stopBackgroundTimer();
    setIsRequestModalOpen(true);

    setTimeout(() => {
      finishChallenge();
      navigation.navigate('ChallengeScreen', {isTimerFinished: true});
    }, 2000);
  };

  return (
    <SafeAreaView style={{backgroundColor: '#101010', flex: 1}}>
      <ScrollView>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('ChallengeScreen')}>
          <Text style={{color: 'white', fontFamily: 'Poppins-SemiBold'}}>
            back
          </Text>
        </TouchableOpacity> */}
        <View style={{alignItems: 'center'}}>
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
                Time
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
          <View style={{width: fullWidth, height: 525}}>
            <AnimatedMarkers
              secondsLeft={secondsLeft}
              setMapData={setMapData}
            />
          </View>
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
            onPress={() => stopChallenge()}>
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
      <Modal
        isVisible={isRequestModalOpen}
        onBackdropPress={() => setIsRequestModalOpen(false)}
        onBackButtonPress={() => setIsRequestModalOpen(false)}>
        <View
          style={{
            backgroundColor: '#161616',
            borderColor: '#8E8888',
            borderWidth: 6,
            height: 275,
            borderRadius: 10,
          }}>
          <View style={{margin: 5, marginTop: 30}}>
            <Image
              source={require('../Assets/Sword.png')}
              style={{width: '100%', height: 100}}
            />
          </View>
          <View style={{marginVertical: 10}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Poppins-SemiBold',
                marginVertical: 20,
                color: 'white',
                textAlign: 'center',
              }}>
              Time’s up! {'\n'}
              Challenge is over
            </Text>
          </View>
        </View>
      </Modal>
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

export default Timer;
