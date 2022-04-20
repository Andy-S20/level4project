/* eslint-disable radix */
/* eslint-disable no-alert */
/* eslint-disable no-bitwise */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {LineChart} from 'react-native-chart-kit';
import {useAuthState} from 'react-firebase-hooks/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import SurvivalLogModal from './SurvivalLogModal';
import LoaderModal from './LoaderModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width + 200;

const Activity = ({navigation, route}) => {
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        color: (opacity = 1) => '#C80000',
        strokeWidth: 2,
      },
    ],
  });

  const [totalSteps, setTotalSteps] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const [user, loading] = useAuthState(firebase.auth());

  const [userName, setUserName] = useState('');

  const [userTeamCode, setUserTeamCode] = useState('');

  const [userSurvivedDays, setUserSurvivedDays] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);

  const [isRip, setIsRip] = useState(false);

  const userStepWeeklyData = (weeklySteps, weeklyPoints) => {
    const userReference = firestore().collection('users').doc(user.uid);

    // userReference.update({
    //   weeklySteps,
    //   weeklyPoints,
    // });
  };

  const userStepTodayData = todaySteps => {
    const userReference = firestore().collection('users').doc(user.uid);

    // userReference.update({
    //   todaySteps,
    // });
  };

  // const getStepsNew = () => {
  //   firestore()
  //     .collection('users')
  //     .doc(user.uid)
  //     .get()
  //     .then(querySnapshot => {
  //       console.log(querySnapshot?.data());
  //     });
  // };

  const listenToChange = async () => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(snapshot => {
        if (snapshot?.data()?.weeklySteps) {
          let holders = {};
          snapshot?.data()?.weeklySteps?.forEach(function (item) {
            if (holders.hasOwnProperty(item.readableDate)) {
              holders[item.readableDate] =
                holders[item.readableDate] + parseFloat(item.step);
            } else {
              holders[item.readableDate] = parseFloat(item.step);
            }
          });

          const totalStepsPoints = snapshot
            ?.data()
            ?.weeklySteps?.reduce((partialSum, a) => partialSum + a.step, 0);

          const totalStepsValue = snapshot
            ?.data()
            ?.weeklySteps.filter(
              item =>
                item.readableDate === dayjs(new Date()).format('DD/MM/YYYY'),
            )
            ?.reduce((partialSum, a) => partialSum + a.step, 0);

          setTotalSteps(totalStepsValue);

          setTotalPoints(totalStepsPoints);

          setBarChartData({
            labels: Object.keys(holders),
            datasets: [
              {
                data: Object.values(holders),
                color: (opacity = 1) => '#C80000',
                strokeWidth: 2,
              },
            ],
          });
        }
      });
  };

  const updateTeam = async tempTeamCode => {
    let ids = [];
    let survivedDays = [];

    console.log('updated');

    firestore()
      .collection('teams')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data()?.teamCode === tempTeamCode) {
            let id = documentSnapshot.id;
            ids.push(id);
            survivedDays.push(documentSnapshot.data()?.survivedDays);
            firestore()
              .collection('teams')
              .doc(id)
              .update({
                lastLoginAt: dayjs(new Date()).format('DD/MM/YYYY'),
                survivedDays: documentSnapshot?.data()?.survivedDays + 1,
              });
            console.log('check');

            setUserSurvivedDays(documentSnapshot?.data()?.survivedDays + 1);
            setIsLoaderOpen(false);
            setIsModalOpen(true);
          }
        });
      });
  };
  const checkTeamSteps = () => {
    // console.log('team');
    let tempTeamCode = '';
    let tempTeamSteps = [];
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(querySnapshot => {
        // console.log('team1');

        tempTeamCode = querySnapshot?.data()?.team;
        firestore()
          .collection('users')
          .get()
          .then(querySnapshots => {
            // console.log('team2');

            querySnapshots.forEach(documentSnapshot => {
              if (documentSnapshot?.data()?.team === tempTeamCode) {
                if (documentSnapshot?.data()?.todaySteps) {
                  tempTeamSteps.push(documentSnapshot?.data().todaySteps);
                }
              }
            });
            let checkSteps =
              tempTeamSteps.length > 0
                ? tempTeamSteps.reduce((x, y) => x + y)
                : 0;
            // console.log('team3');

            checkLogSurvivalDate(checkSteps, tempTeamCode);
          });
      });
  };

  //  4 -  6000
  //  4 -  4500

  // Removed

  // 4 -  6000
  //  4 -  6500

  // updating

  // 0 -- > 1

  const checkLogSurvivalDate = (checkSteps, tempTeamCode) => {
    firestore()
      .collection('teams')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot?.data()?.teamCode === tempTeamCode) {
            if (
              documentSnapshot?.data()?.lastLoginAt !==
              dayjs(new Date()).format('DD/MM/YYYY')
            ) {
              // if(team has finished challenge) -- > update survival Date
              // else {remove team}

              // 1000 < 0 -->false
              if (
                documentSnapshot
                  .data()
                  .teamGoals.reduce(
                    (partialSum, a) => partialSum + parseInt(a.stepGoals),
                    0,
                  ) < checkSteps
              ) {
                // setIsModalOpen(true);
                setIsLoaderOpen(true);

                setIsRip(false);
                setTimeout(() => {
                  // setIsModalOpen(false);
                  updateTeam(tempTeamCode);
                }, 3000);

                // console.log(documentSnapshot?.data(), '1');
              } else {
                setIsModalOpen(true);
                setIsRip(true);

                setTimeout(() => {
                  setIsModalOpen(false);
                  setIsRip(false);

                  removeTeam(
                    documentSnapshot?.id,
                    documentSnapshot?.data()?.teamGoals,
                  );
                }, 3000);

                // console.log(documentSnapshot?.data(), '2');
              }
            }
          }
        });
      });
  };

  const removeTeam = (id, teamGoals) => {
    // teamGoals.map(item => {
    //   firestore().collection('users').doc(item.id).update({team: ''});
    // });
    firestore().collection('users').doc(user.uid).update({team: ''});
    // firestore().collection('teams').doc(id).delete();
    console.log('Removed');
    signOut();
  };

  const signOut = () => {
    // setIsLoaderOpen(true);
    setIsModalOpen(false);
    navigation.navigate('FindTeam');
    // auth()
    //   .signOut()
    //   .then(() => {
    //     // setIsLoaderOpen(false);
    //     setIsModalOpen(false);
    //     navigation.navigate('IntroSlider');
    //   });
  };

  useEffect(() => {
    if (user) {
      checkTeamSteps();
    }
    getData();
    // console.log(loading, user, route);
  }, [loading]);

  const getData = async () => {
    const value = await AsyncStorage.getItem('isNewUser');

    if (value !== null) {
      setIsModalOpen(true);
    }
    removeValue();
  };

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('isNewUser');
    } catch (e) {
      // remove error
    }

    // console.log('Done.');
  };

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(querySnapshot => {
        setUserName(querySnapshot?.data()?.userName);
        setUserTeamCode(querySnapshot?.data()?.team);
        if (querySnapshot?.data()?.team === '') {
          navigation.navigate('FindTeam');
          return;
        }
      });
    listenToChange();
  }, []);

  return (
    <ScrollView style={{backgroundColor: '#101010'}}>
      <StatusBar backgroundColor="#161616" />

      <View style={{margin: 10, padding: 10}}>
        <Text
          style={{
            fontSize: 22,
            color: 'white',
            fontFamily: 'Poppins-SemiBold',
          }}>
          Hey {userName}!
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 10,
          padding: 10,
        }}>
        <View>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 20,
              color: '#C80000',
            }}>
            Total Points
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#161616',
            width: 170,
            borderRadius: 20,
            padding: 10,
          }}>
          <Text
            style={{
              textAlign: 'right',
              color: '#C80000',
              fontSize: 18,
              fontFamily: 'Poppins-SemiBold',
            }}>
            {totalPoints} XP{' '}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 10,
          padding: 10,
        }}>
        <View>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 20,
              color: '#C80000',
            }}>
            Daily Steps
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#161616',
            width: 170,
            borderRadius: 20,
            padding: 10,
          }}>
          <Text
            style={{
              textAlign: 'right',
              color: '#C80000',
              fontSize: 18,

              fontFamily: 'Poppins-SemiBold',
            }}>
            {totalSteps}/10000
          </Text>
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
            padding: 15,
          }}
          onPress={() => navigation.navigate('UserTimer', {currentUser: user})}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 20,
              color: 'white',
            }}>
            {' '}
            Start Walking
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          margin: 10,
          padding: 10,
        }}>
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            fontSize: 24,
            color: 'white',
          }}>
          Weekly Steps
        </Text>
      </View>
      {barChartData.datasets[0].data.length === 0 ? (
        <View style={{margin: 10, padding: 10, marginTop: -5}}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 20,
              color: '#C80000',
              textAlign: 'center',
            }}>
            You don't have any steps right now, start walking to view your
            summary.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{marginHorizontal: 10, padding: 10}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          <LineChart
            data={barChartData}
            width={screenWidth / 1.65}
            height={500}
            verticalLabelRotation={70}
            withInnerLines={false}
            chartConfig={{
              backgroundGradientFrom: 0,
              backgroundGradientFromOpacity: 0,
              backgroundGradientTo: 0,
              backgroundGradientToOpacity: 0,
              color: (opacity = 1) => '#C80000',
              labelColor: (opacity = 1) => 'white',
              propsForLabels: {fontFamily: 'Poppins-SemiBold', fontSize: 13},
            }}
            bezier
          />
        </ScrollView>
      )}
      <SurvivalLogModal
        isModalOpen={isModalOpen}
        isRip={isRip}
        setIsModalOpen={setIsModalOpen}
        setIsRip={setIsRip}
        userSurvivedDays={userSurvivedDays}
      />
      <LoaderModal
        isLoaderOpen={isLoaderOpen}
        setIsLoaderOpen={setIsLoaderOpen}
      />
    </ScrollView>
  );
};

export default Activity;

// const getSteps = async () => {
//   var today = new Date();
//   var todayDate = new Date(
//     today.getFullYear(),
//     today.getMonth(),
//     today.getDate(),
//   );
//   var tomorrow = new Date(
//     today.getFullYear(),
//     today.getMonth(),
//     today.getDate() + 1,
//   );
//   var lastWeekDate = new Date(
//     today.getFullYear(),
//     today.getMonth(),
//     today.getDate() - 7,
//   );
//   const opt = {
//     startDate: lastWeekDate.toISOString(),
//     endDate: todayDate.toISOString(),
//     configs: {
//       bucketTime: 15,
//       bucketUnit: 'MINUTE' | 'HOUR' | 'SECOND' | 'DAY', // must all CAPITALIZE
//     },
//   };

//   const optionForToday = {
//     startDate: todayDate.toISOString(),
//     endDate: tomorrow.toISOString(),
//     configs: {
//       bucketTime: 15,
//       bucketUnit: 'MINUTE' | 'HOUR' | 'SECOND' | 'DAY', // must all CAPITALIZE
//     },
//   };

//   const response = await GoogleFit.getDailyStepCountSamples(optionForToday);
//   if (response.length !== 0) {
//     for (var i = 0; i < response.length; i++) {
//       if (response[i].source === 'com.google.android.gms:estimated_steps') {
//         console.log(response[i].steps, '123456', response);

//         let barChartLabels = response[i].steps.map(item => item.date);

//         let barChartValues = response[i].steps.map(item => item.value);

//         const totalStepsValue = barChartValues.reduce(
//           (partialSum, a) => partialSum + a,
//           0,
//         );

//         setTotalSteps(totalStepsValue);

//         // setTotalPoints(totalStepsValue * 10);

//         userStepTodayData(totalStepsValue);

//         // setBarChartData({
//         //   labels: barChartLabels,
//         //   datasets: [{data: barChartValues}],
//         // });
//       }
//     }
//   } else {
//     console.log('Not Found');
//   }

//   const res = await GoogleFit.getDailyStepCountSamples(opt);
//   if (res.length !== 0) {
//     for (var i = 0; i < res.length; i++) {
//       if (res[i].source === 'com.google.android.gms:estimated_steps') {
//         let barChartLabels = res[i].steps.map(item => item.date);

//         let barChartValues = res[i].steps.map(item => item.value);

//         const totalStepsValue = barChartValues.reduce(
//           (partialSum, a) => partialSum + a,
//           0,
//         );
//         // userStepWeeklyData(totalStepsValue, totalStepsValue / 10);
//         // setTotalPoints(totalStepsValue / 10);
//         setBarChartData({
//           labels: barChartLabels,
//           datasets: [{data: barChartValues}],
//         });
//       }
//     }
//   } else {
//     console.log('Not Found');
//   }
// };
