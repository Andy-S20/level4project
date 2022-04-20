/* eslint-disable radix */
/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import StepIndicator from 'react-native-step-indicator';
import {useAuthState} from 'react-firebase-hooks/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import {useIsFocused} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';

const fullWidth = Dimensions.get('screen').width;
const fullHeight = Dimensions.get('screen').height;

const stepIndicatorStyles = {
  stepIndicatorSize: 50,
  currentStepIndicatorSize: 60,
  separatorStrokeWidth: 20,
  currentStepStrokeWidth: 20,
  stepStrokeCurrentColor: '#14110F',
  separatorFinishedColor: '#14110F',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#14110F',
  stepIndicatorUnFinishedColor: '#aaaaaa',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 40,
  currentStepIndicatorLabelFontSize: 40,
  stepIndicatorLabelCurrentColor: '#000000',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
  labelColor: 'white',
  labelSize: 15,
  currentStepLabelColor: 'white',
};

const LeaderBoard = () => {
  const [currentPage] = useState(6);

  const [userData, setUserData] = useState([]);
  const [currentTeamSteps, setCurrentTeamSteps] = useState(0);

  const [noOfMembers, setNoOfMembers] = useState(0);

  const [userTeamGoal, setUserTeamGoal] = useState(0);

  const getStepIndicatorIconConfig = ({position, stepStatus}) => {
    const iconConfig = {
      name: '0K',
      color: stepStatus === 'finished' ? '#ffffff' : '#fe7013',
      size: 15,
    };
    switch (position) {
      case 0: {
        iconConfig.name = '5K';
        break;
      }
      case 1: {
        iconConfig.name = '4K';
        break;
      }
      case 2: {
        iconConfig.name = '3K';
        break;
      }
      case 3: {
        iconConfig.name = '2K';
        break;
      }
      case 4: {
        iconConfig.name = '1K';
        break;
      }
      case 5: {
        iconConfig.name = '0K';
        break;
      }
      default: {
        break;
      }
    }
    return iconConfig;
  };

  const renderStepIndicator = params => {
    return (
      <View key={Math.random()} style={{backgroundColor: '#14110F'}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontFamily: 'Poppins-SemiBold',
            color: 'white',
          }}>
          {getStepIndicatorIconConfig(params).name}
        </Text>
      </View>
    );
  };

  const isFocussed = useIsFocused();

  const renderLabel = ({position}) => {
    return (
      <View
        style={{
          justifyContent: 'flex-start',
          flexDirection: 'row',
        }}>
        {userData.map(item => {
          if (item.todaySteps > 5000) {
            if (position === 0) {
              return (
                <View
                  key={Math.random()}
                  style={{
                    borderRadius: 100,
                    alignItems: 'center',
                    backgroundColor: 'pink',
                    padding: 5,
                    width: 40,
                    height: 40,
                    margin: 5,
                  }}>
                  <Image
                    source={
                      item?.profilePicUrl
                        ? {uri: item?.profilePicUrl}
                        : require('../Assets/defaultLogo.png')
                    }
                    style={{height: 50, width: 50, borderRadius: 100}}
                  />
                </View>
              );
            }
            return;
          }
          if (item.todaySteps < 5000 && item.todaySteps > 4000) {
            if (position === 1) {
              return (
                <View
                  key={Math.random()}
                  style={{
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'pink',
                    padding: 5,
                    width: 40,
                    height: 40,
                    margin: 5,
                  }}>
                  <Image
                    source={
                      item?.profilePicUrl
                        ? {uri: item?.profilePicUrl}
                        : require('../Assets/defaultLogo.png')
                    }
                    style={{height: 50, width: 50, borderRadius: 100}}
                  />
                </View>
              );
            }
            return;
          }
          if (item.todaySteps < 4000 && item.todaySteps > 3000) {
            if (position === 2) {
              return (
                <View
                  key={Math.random()}
                  style={{
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'pink',
                    padding: 5,
                    width: 40,
                    height: 40,
                    margin: 5,
                  }}>
                  <Image
                    source={
                      item?.profilePicUrl
                        ? {uri: item?.profilePicUrl}
                        : require('../Assets/defaultLogo.png')
                    }
                    style={{height: 50, width: 50, borderRadius: 100}}
                  />
                </View>
              );
            }
            return;
          }
          if (item.todaySteps < 3000 && item.todaySteps > 2000) {
            if (position === 3) {
              return (
                <View
                  key={Math.random()}
                  style={{
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'pink',
                    padding: 5,
                    width: 40,
                    height: 40,
                    margin: 5,
                  }}>
                  <Image
                    source={
                      item?.profilePicUrl
                        ? {uri: item?.profilePicUrl}
                        : require('../Assets/defaultLogo.png')
                    }
                    style={{height: 50, width: 50, borderRadius: 100}}
                  />
                </View>
              );
            }
            return;
          }
          if (item.todaySteps < 2000 && item.todaySteps > 1000) {
            if (position === 4) {
              return (
                <View
                  key={Math.random()}
                  style={{
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'pink',
                    padding: 5,
                    width: 40,
                    height: 40,
                    margin: 5,
                  }}>
                  <Image
                    source={
                      item?.profilePicUrl
                        ? {uri: item?.profilePicUrl}
                        : require('../Assets/defaultLogo.png')
                    }
                    style={{height: 50, width: 50, borderRadius: 100}}
                  />
                </View>
              );
            }
            return;
          }
          if (
            (item.todaySteps < 1000 && item.todaySteps >= 0) ||
            item.todaySteps === undefined
          ) {
            if (position === 5) {
              return (
                <View
                  key={Math.random()}
                  style={{
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    margin: 2,
                  }}>
                  <Image
                    source={
                      item?.profilePicUrl
                        ? {uri: item?.profilePicUrl}
                        : require('../Assets/defaultLogo.png')
                    }
                    style={{height: 50, width: 50, borderRadius: 100}}
                  />
                </View>
              );
            }
          }
        })}
      </View>
    );
  };
  const [user] = useAuthState(firebase.auth());

  const getAllUserDetails = () => {
    let tempTeamCode = '';
    let tempTeamSteps = [];
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(querySnapshot => {
        tempTeamCode = querySnapshot.data().team;
        firestore()
          .collection('users')
          .get()
          .then(querySnapshots => {
            let tempUserData = [];

            querySnapshots.forEach(documentSnapshot => {
              if (documentSnapshot?.data().team === tempTeamCode) {
                let totalStepsValue =
                  documentSnapshot?.data()?.weeklySteps !== undefined
                    ? documentSnapshot
                        ?.data()
                        ?.weeklySteps.filter(
                          item =>
                            item.readableDate ===
                            dayjs(new Date()).format('DD/MM/YYYY'),
                        )
                        ?.reduce((partialSum, a) => partialSum + a.step, 0)
                    : 0;
                tempTeamSteps.push(totalStepsValue);

                tempUserData.push({
                  userName: documentSnapshot?.data().userName,
                  todaySteps: documentSnapshot?.data().todaySteps,
                  weeklySteps: documentSnapshot?.data().weeklySteps,
                  profilePicUrl: documentSnapshot?.data().profilePicUrl,
                });
              }
            });
            let step =
              tempTeamSteps.length > 0
                ? tempTeamSteps.reduce((x, y) => x + y)
                : 0;
            setCurrentTeamSteps(step);
            setUserData(tempUserData);
          });
      });
  };

  useEffect(() => {
    getAllUserDetails();
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(querySnapshot => {
        firestore()
          .collection('teams')
          .get()
          .then(querySnapshots => {
            querySnapshots.forEach(documentSnapshots => {
              if (
                documentSnapshots.data().teamCode === querySnapshot.data().team
              ) {
                setNoOfMembers(documentSnapshots?.data()?.members?.length);
                setUserTeamGoal(
                  documentSnapshots
                    .data()
                    .teamGoals.reduce(
                      (partialSum, a) => partialSum + parseInt(a.stepGoals),
                      0,
                    ),
                );
              }
            });
          });
      });

    // getToday();
  }, [isFocussed]);

  return (
    <SafeAreaView
      style={{flex: 1, position: 'relative', backgroundColor: '#101010'}}>
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ImageBackground
            source={require('../Assets/LeaderBoard.png')}
            style={{
              width: fullWidth - 50,
              height: fullHeight / 2,
              marginTop: 20,
            }}>
            <View
              style={{
                // position: 'absolute',
                // top: 10,
                left: -30,
                height: fullHeight / 2,
                marginLeft: 50,
              }}>
              <StepIndicator
                customStyles={stepIndicatorStyles}
                currentPosition={currentPage}
                renderStepIndicator={renderStepIndicator}
                direction="vertical"
                labels={['', '', '', '', '', '']}
                stepCount={6}
                renderLabel={renderLabel}
              />
            </View>
          </ImageBackground>
        </View>
        <View
          style={{
            width: fullWidth - 50,
            padding: 10,
            margin: 10,
            borderRadius: 20,
            // position: 'absolute',
            // bottom: 20,
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              margin: 10,
              padding: 10,
              marginVertical: 5,
            }}>
            <View>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  color: '#C80000',
                }}>
                Team Goal
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#161616',
                width: 140,
                borderRadius: 20,
                padding: 5,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  color: '#C80000',
                  textAlign: 'right',
                  marginRight: 10,
                }}>
                {parseInt(userTeamGoal)}
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              margin: 10,
              padding: 10,
              marginVertical: 5,
            }}>
            <View>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  color: '#C80000',
                }}>
                Team Total
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#161616',
                width: 140,
                borderRadius: 20,
                padding: 5,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  color: '#C80000',
                  textAlign: 'right',
                  marginRight: 10,
                }}>
                {currentTeamSteps}
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              margin: 10,
              padding: 10,
              marginVertical: 5,
            }}>
            <View>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  color: '#C80000',
                }}>
                Avg. Steps
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#161616',
                width: 140,
                borderRadius: 20,
                padding: 5,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  color: '#C80000',
                  textAlign: 'right',
                  marginRight: 10,
                }}>
                {parseInt(currentTeamSteps / noOfMembers)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaderBoard;
