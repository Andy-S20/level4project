/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect} from 'react';
import dayjs from 'dayjs';
const PastChallenges = ({navigation, route}) => {
  const {currentUser, userId} = route.params;
  useEffect(() => {
    console.log(currentUser.challenges);
  }, []);
  return (
    <ScrollView style={{backgroundColor: '#101010'}}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ChallengeScreen')}
        style={{margin: 10}}>
        <Text
          style={{
            color: 'white',
            fontFamily: 'Poppins-SemiBold',
            fontSize: 20,
          }}>
          Back
        </Text>
      </TouchableOpacity>

      {currentUser?.challenges === undefined ? (
        <View
          style={{
            margin: 10,
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Poppins-SemiBold',
              color: '#C80000',
              textAlign: 'center',
            }}>
            <Text> You have no past challenges.</Text>
            <Text> Send a request to a team member! </Text>
          </Text>
        </View>
      ) : (
        currentUser.challenges.map(item => {
          return (
            <View
              style={{
                padding: 20,
                margin: 10,
                borderRadius: 10,
                backgroundColor: '#161616',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'Poppins-SemiBold',
                      color: 'white',
                      fontSize: 18,
                    }}>
                    {item.challengerSteps === item.challengedSteps ||
                    item.challengerSteps === 0 ||
                    item.challengedSteps === 0
                      ? item.challengerSteps === 0 || item.challengedSteps === 0
                        ? 'Ongoing'
                        : 'Tie'
                      : userId === item.challengerId
                      ? item.challengedSteps > item.challengerSteps
                        ? 'Won'
                        : 'Lost'
                      : item.challengerSteps > item.challengedSteps
                      ? 'Won'
                      : 'Lost'}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: 'Poppins-SemiBold',
                      color: 'white',
                      fontSize: 18,
                    }}>
                    {dayjs(new Date()).format('DD/MM/YYYY')}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View>
                  <Text
                    style={{
                      color: '#C80000',
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 18,
                    }}>
                    {userId !== item.challengedId && item.challenged}
                    {userId !== item.challengerId && item.challenger}

                    {/* {item.challengedSteps < item.challengerSteps
                      ? item.challenged
                      : item.challenger} */}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: '#C80000',
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 18,
                    }}>
                    {/* {userId === item.challengedId
                      ? item.challengedSteps
                      : item.challengerSteps} */}

                    {/* {item.challengedSteps < item.challengerSteps
                      ? item.challengedSteps
                      : item.challengerSteps} */}

                    {userId === item.challengedId && item.challengedSteps}
                    {userId === item.challengerId && item.challengerSteps}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View>
                  <Text
                    style={{
                      color: '#C80000',
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 18,
                    }}>
                    {/* {userId === item.challengedId
                      ? item.challenged
                      : item.challenger} */}
                    {/* {item.challengedSteps > item.challengerSteps
                      ? item.challenged
                      : item.challenger} */}

                    {userId === item.challengedId && item.challenged}
                    {userId === item.challengerId && item.challenger}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: '#C80000',
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 18,
                    }}>
                    {/* {userId === item.challengedId
                      ? item.challengedSteps
                      : item.challengerSteps} */}
                    {/* {item.challengedSteps > item.challengerSteps
                      ? item.challengedSteps
                      : item.challengerSteps} */}

                    {userId !== item.challengedId && item.challengedSteps}
                    {userId !== item.challengerId && item.challengerSteps}
                  </Text>
                </View>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default PastChallenges;
