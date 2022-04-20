/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';

const fullWidth = Dimensions.get('screen').width;

const TeamActivity = () => {
  const [user] = useAuthState(firebase.auth());

  const [userData, setUserData] = useState([]);

  const [teamCode, setTeamCode] = useState('');

  const isFocused = useIsFocused();

  const getAllUserDetails = () => {
    let tempTeamCode = '';

    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(querySnapshot => {
        tempTeamCode = querySnapshot.data().team;
        setTeamCode(tempTeamCode);
        firestore()
          .collection('users')
          .get()
          .then(querySnapshots => {
            let tempUserData = [];
            let tempWeeklyPoints = [];

            querySnapshots.forEach(documentSnapshot => {
              if (documentSnapshot?.data()?.team === tempTeamCode) {
                tempUserData?.push({
                  ...documentSnapshot?.data(),
                  points: documentSnapshot?.data()?.weeklySteps
                    ? documentSnapshot
                        ?.data()
                        ?.weeklySteps?.map(item => item.step)
                        .reduce((x, y) => x + y)
                    : 0,
                });

                tempWeeklyPoints?.push(
                  documentSnapshot?.data()?.weeklySteps?.map(item => item.step),
                );
              }
            });

            setUserData(tempUserData);

            // console.log(tempUserData[0].weeklySteps);
          });
      });
  };
  useEffect(() => {
    getAllUserDetails();
  }, [isFocused]);

  return (
    <View
      style={{
        backgroundColor: '#101010',
        flex: 1,
      }}>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            margin: 10,
          }}>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Poppins-SemiBold',
                color: 'white',
              }}>
              Team Code
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Poppins-SemiBold',
                color: '#C80000',
              }}>
              {teamCode}
            </Text>
          </View>
        </View>
        <View>
          <Image
            source={require('../Assets/Forest.png')}
            style={{
              width: fullWidth / 1.1,
              height: 180,
              margin: 15,
              borderRadius: 10,
            }}
          />
        </View>
        <View>
          {userData
            ?.sort((a, b) => (a.points > b.points ? -1 : 1))
            ?.map(item => {
              return (
                <View
                  key={Math.random()}
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#161616',
                    padding: 5,
                    margin: 15,
                  }}>
                  <View style={{margin: 10, padding: 2, marginVertical: 2}}>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 22,
                      }}>
                      {item?.userName}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      margin: 10,
                      marginVertical: 2,
                      padding: 2,
                    }}>
                    <Text
                      style={{
                        color: '#C80000',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 18,
                      }}>
                      Weekly Points
                    </Text>
                    <Text
                      style={{
                        color: '#9D0208',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 18,
                      }}>
                      {' '}
                      {item.points} XP
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      margin: 10,
                      padding: 2,

                      marginVertical: 2,
                    }}>
                    <Text
                      style={{
                        color: '#C80000',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 18,
                      }}>
                      Daily Steps
                    </Text>
                    <Text
                      style={{
                        color: '#9D0208',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 18,
                      }}>
                      {item?.todaySteps ? item?.todaySteps : 0}/10000
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};

export default TeamActivity;

const styles = StyleSheet.create({});
